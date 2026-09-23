import { requireAdmin } from '@/lib/auth/session';
import { sql } from '@/lib/db';
import { PaymentSettingsClient } from './PaymentSettingsClient';

export const dynamic = 'force-dynamic';

export default async function AdminPaymentSettingsPage() {
  await requireAdmin();

  let settings = {
    razorpay_enabled: false,
    upi_qr_enabled: true,
    business_upi_id: 'manishmadhava91@okicici',
    razorpay_key_id: '',
    razorpay_key_secret: '',
    gst_rate: 18,
  };

  try {
    const rows = await sql`
      SELECT *
      FROM payment_settings
      WHERE id = 'default'
      LIMIT 1
    `;

    if (rows.length > 0) {
      settings = {
        razorpay_enabled: Boolean(rows[0].razorpay_enabled),
        upi_qr_enabled: Boolean(rows[0].upi_qr_enabled),
        business_upi_id: rows[0].business_upi_id || 'manishmadhava91@okicici',
        razorpay_key_id: rows[0].razorpay_key_id || '',
        razorpay_key_secret: rows[0].razorpay_key_secret || '',
        gst_rate: Number(rows[0].gst_rate || 18),
      };
    }
  } catch (err) {
    console.error('Error loading payment settings page:', err);
  }

  return (
    <div className="w-full py-2">
      <PaymentSettingsClient initialSettings={settings} />
    </div>
  );
}
