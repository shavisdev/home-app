#!/usr/bin/env python3
"""CLI for managing home-app packages backed by Supabase."""

import argparse
import json
import os
import sys
from datetime import datetime, timezone, timedelta


SCHEMA_FIELDS = {
    "id", "retailer", "title", "order_number", "order_date",
    "email_account", "tracking_number", "carrier", "tracking_url",
    "status", "pickup_location", "pickup_code", "concierge_ref",
    "picked_up_at", "live_status", "live_status_checked_at",
    "flags", "notes", "created_at", "updated_at",
}

REMOVED_FIELDS = {
    "picked_up", "link_confidence", "archived_reason",
    "retailer_delivered_at", "concierge_notified_at",
}


def _load_env_local():
    """Load .env.local from the project root (parent of cli/) if present."""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    env_file = os.path.join(script_dir, "..", ".env.local")
    if not os.path.exists(env_file):
        return
    with open(env_file) as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, _, value = line.partition("=")
            key = key.strip()
            value = value.strip().strip('"').strip("'")
            os.environ[key] = value


def get_client():
    _load_env_local()
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_KEY")
    if not url:
        print("ERROR: SUPABASE_URL environment variable is not set")
        sys.exit(1)
    if not key:
        print("ERROR: SUPABASE_SERVICE_KEY environment variable is not set")
        sys.exit(1)
    from supabase import create_client
    return create_client(url, key)


def now_utc():
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def cmd_upsert(args):
    if args.data == "-":
        raw = sys.stdin.read()
    else:
        raw = args.data

    try:
        record = json.loads(raw)
    except json.JSONDecodeError as e:
        print(f"ERROR: invalid JSON: {e}")
        sys.exit(1)

    # Backwards compat: map description → title
    if "title" not in record and "description" in record:
        record["title"] = record.pop("description")
    elif "description" in record:
        del record["description"]

    # Strip unknown/removed fields
    for field in list(record.keys()):
        if field not in SCHEMA_FIELDS:
            del record[field]

    pkg_id = record.get("id")
    if not pkg_id:
        print("ERROR: record must have an 'id' field")
        sys.exit(1)

    try:
        client = get_client()
        client.table("packages").upsert(record, on_conflict="id").execute()
        print(f"OK {pkg_id}")
    except Exception as e:
        print(f"ERROR: {e}")
        sys.exit(1)


def cmd_pickup(args):
    pkg_id = args.id
    try:
        client = get_client()
        # Check package exists
        result = client.table("packages").select("id,title").eq("id", pkg_id).execute()
        if not result.data:
            print(f"ERROR: package {pkg_id} not found")
            sys.exit(1)
        title = result.data[0].get("title", "")
        update_result = client.table("packages").update({
            "picked_up_at": now_utc(),
            "status": "picked_up",
        }).eq("id", pkg_id).execute()
        if not update_result.data:
            print(f"ERROR: failed to update package {pkg_id}")
            sys.exit(1)
        print(f"OK picked up: {pkg_id} — {title}")
    except SystemExit:
        raise
    except Exception as e:
        print(f"ERROR: {e}")
        sys.exit(1)


def cmd_list(args):
    state = args.state
    as_json = args.json

    try:
        client = get_client()
        query = client.table("packages").select("*")

        if state == "pending":
            query = query.is_("picked_up_at", "null")
        elif state == "recent":
            # picked up in last 24h
            cutoff = (datetime.now(timezone.utc) - timedelta(hours=24)).strftime("%Y-%m-%dT%H:%M:%SZ")
            query = query.not_.is_("picked_up_at", "null").gte("picked_up_at", cutoff)
        elif state == "archived":
            cutoff = (datetime.now(timezone.utc) - timedelta(hours=24)).strftime("%Y-%m-%dT%H:%M:%SZ")
            query = query.not_.is_("picked_up_at", "null").lt("picked_up_at", cutoff)
        # "all": no filter

        result = query.order("created_at", desc=True).limit(500).execute()
        packages = result.data

        if as_json:
            print(json.dumps(packages, indent=2, default=str))
        else:
            for pkg in packages:
                pkg_id = pkg.get("id", "")
                title = pkg.get("title", "")
                carrier = pkg.get("carrier", "")
                status = pkg.get("status", "")
                picked_up_at = pkg.get("picked_up_at")

                if picked_up_at:
                    try:
                        # Parse picked_up_at
                        picked_dt = datetime.fromisoformat(picked_up_at.replace("Z", "+00:00"))
                        cutoff = datetime.now(timezone.utc) - timedelta(hours=24)
                        display_state = "recent" if picked_dt >= cutoff else "archived"
                    except Exception:
                        display_state = "archived"
                else:
                    display_state = "pending"

                details = ", ".join(filter(None, [carrier, status]))
                print(f"[{display_state}] {pkg_id} — {title} ({details})")
    except Exception as e:
        print(f"ERROR: {e}")
        sys.exit(1)


def cmd_get_scan_state(args):
    account = args.account
    try:
        client = get_client()
        query = client.table("scan_state").select("account,last_scanned_at")
        if account:
            query = query.eq("account", account)
        result = query.execute()

        rows = {row["account"]: row.get("last_scanned_at") for row in result.data}

        if account:
            accounts = [account]
        else:
            accounts = sorted(set(rows.keys()) | {"official", "personal"})

        for acc in accounts:
            ts = rows.get(acc)
            print(f"{acc}: {ts if ts else 'never'}")
    except Exception as e:
        print(f"ERROR: {e}")
        sys.exit(1)


def cmd_set_scan_state(args):
    account = args.account
    timestamp = args.timestamp if args.timestamp else now_utc()

    try:
        client = get_client()
        client.table("scan_state").upsert(
            {"account": account, "last_scanned_at": timestamp},
            on_conflict="account"
        ).execute()
        print(f"OK scan-state updated: {account} → {timestamp}")
    except Exception as e:
        print(f"ERROR: {e}")
        sys.exit(1)


def main():
    parser = argparse.ArgumentParser(
        prog="packages.py",
        description="Manage home-app packages in Supabase",
    )
    subparsers = parser.add_subparsers(dest="command", metavar="command")

    # upsert
    p_upsert = subparsers.add_parser("upsert", help="Upsert a package record")
    p_upsert.add_argument(
        "data",
        help="JSON string of package fields, or '-' to read from stdin",
    )

    # pickup
    p_pickup = subparsers.add_parser("pickup", help="Mark a package as picked up")
    p_pickup.add_argument("id", help="Package ID")

    # list
    p_list = subparsers.add_parser("list", help="List packages")
    p_list.add_argument(
        "--state",
        default="pending",
        choices=["pending", "recent", "archived", "all"],
        help="Filter by state (default: pending)",
    )
    p_list.add_argument(
        "--json",
        action="store_true",
        help="Output as JSON array",
    )

    # get-scan-state
    p_gss = subparsers.add_parser("get-scan-state", help="Get last scan timestamps")
    p_gss.add_argument("--account", help="Account name (e.g. official, personal)")

    # set-scan-state
    p_sss = subparsers.add_parser("set-scan-state", help="Update scan timestamp for an account")
    p_sss.add_argument("--account", required=True, help="Account name (e.g. official, personal)")
    p_sss.add_argument("--timestamp", help="ISO timestamp (default: current UTC time)")

    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        sys.exit(1)

    dispatch = {
        "upsert": cmd_upsert,
        "pickup": cmd_pickup,
        "list": cmd_list,
        "get-scan-state": cmd_get_scan_state,
        "set-scan-state": cmd_set_scan_state,
    }

    fn = dispatch.get(args.command)
    if fn is None:
        print(f"ERROR: unknown command '{args.command}'")
        parser.print_help()
        sys.exit(1)

    fn(args)


if __name__ == "__main__":
    main()
