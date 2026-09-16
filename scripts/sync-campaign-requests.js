// scripts/sync-campaign-requests.js
const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });
const sql = neon(process.env.DATABASE_URL);

async function sync() {
  console.log('🔄 Syncing campaign_requests into advertisements table...');

  const requests = await sql`SELECT * FROM campaign_requests`;

  for (const req of requests) {
    const existing = await sql`
      SELECT id FROM advertisements WHERE title = ${req.campaign_title}
    `;

    const contactSummary = `${req.contact_name} (${req.contact_email}${req.contact_phone ? ' / ' + req.contact_phone : ''})`;
    const isActive = req.status === 'active' || req.status === 'approved';

    if (existing.length === 0) {
      await sql`
        INSERT INTO advertisements (
          title,
          placement,
          image_url,
          target_url,
          headline,
          cta_text,
          category,
          is_active,
          advertiser_name,
          advertiser_contact,
          advertiser_type,
          budget,
          start_date,
          end_date,
          status,
          payment_status,
          payment_method,
          priority
        ) VALUES (
          ${req.campaign_title},
          ${req.placement},
          ${req.banner_image_url || null},
          ${req.target_url},
          ${req.campaign_title},
          'Book Appointment',
          'All',
          ${isActive},
          ${req.advertiser_name},
          ${contactSummary},
          ${req.advertiser_type || 'hospital'},
          ${req.total_amount || 0},
          ${req.start_date},
          ${req.end_date},
          ${req.status || 'pending'},
          ${req.payment_status || 'pending'},
          ${req.payment_method || 'upi'},
          'Medium'
        )
      `;
      console.log(`✅ Synced new campaign "${req.campaign_title}" into advertisements table!`);
    } else {
      await sql`
        UPDATE advertisements
        SET 
          placement = ${req.placement},
          image_url = ${req.banner_image_url || null},
          target_url = ${req.target_url},
          is_active = ${isActive},
          advertiser_name = ${req.advertiser_name},
          advertiser_contact = ${contactSummary},
          advertiser_type = ${req.advertiser_type || 'hospital'},
          budget = ${req.total_amount || 0},
          status = ${req.status || 'pending'},
          payment_status = ${req.payment_status || 'pending'},
          payment_method = ${req.payment_method || 'upi'}
        WHERE title = ${req.campaign_title}
      `;
      console.log(`✅ Updated existing campaign "${req.campaign_title}" in advertisements table!`);
    }
  }

  console.log('🎉 Sync completed successfully!');
}

sync().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
