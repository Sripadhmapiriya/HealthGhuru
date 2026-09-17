import { redirect } from 'next/navigation';

export default function LegacyAdminSponsoredPage() {
  redirect('/admin/sponsored-articles');
}
