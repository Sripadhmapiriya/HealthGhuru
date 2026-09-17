import { requireAdmin } from '@/lib/auth/session';
import { AddNewsClient } from './AddNewsClient';

export const metadata = {
  title: 'Direct Admin Publish - Add News | HealthGhuru CMS',
};

export default async function AddNewsPage() {
  await requireAdmin();

  return (
    <div className="py-2">
      <AddNewsClient />
    </div>
  );
}
