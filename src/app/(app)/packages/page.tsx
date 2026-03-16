import fs from 'fs';
import path from 'path';
import PackagesClient from '@/components/PackagesClient';
import { Package } from '@/lib/types';

export const dynamic = 'force-dynamic';

function readPackages(filename: string): Package[] {
  try {
    const filePath = path.join(process.cwd(), 'data', filename);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    return data.packages ?? [];
  } catch {
    return [];
  }
}

export default function PackagesPage() {
  const active = readPackages('packages.json');
  const archived = readPackages('packages-archive.json');

  return <PackagesClient active={active} archived={archived} />;
}
