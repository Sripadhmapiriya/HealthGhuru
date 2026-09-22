const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

async function syncRequests() {
  const sql = neon(process.env.DATABASE_URL);

  const requests = await sql.query(`
    SELECT * FROM campaign_requests ORDER BY created_at DESC
  `);

  console.log(`Found ${requests.length} campaign requests. Syncing to sponsored_articles...`);

  for (const r of requests) {
    const existing = await sql.query(
      `SELECT id FROM sponsored_articles WHERE title ILIKE $1 OR excerpt ILIKE $2 LIMIT 1`,
      [`%${r.advertiser_name}%`, `%${r.advertiser_name}%`]
    );

    if (existing.length === 0) {
      const slug = `${r.advertiser_name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-6)}`;
      const price = r.total_amount ? `₹${Number(r.total_amount).toLocaleString('en-IN')}` : '₹20,000';
      await sql.query(`
        INSERT INTO sponsored_articles (
          title, slug, excerpt, content, featured_image,
          company_name, package_name, package_price, placement, assigned_reporter,
          category, author_name,
          status, review_status,
          requires_medical_review,
          sponsored_label, content_type,
          cta_text, cta_url,
          rights_confirmed,
          created_at, published_at
        ) VALUES (
          $1, $2, $3, $4, $5,
          $6, $7, $8, $9, $10,
          $11, $12,
          $13, $14,
          TRUE,
          'SPONSORED', 'sponsored_article',
          'Visit Website →', $15,
          'CONFIRMED',
          $16, $16
        )
      `, [
        `${r.campaign_title || 'Partner Article'} - ${r.advertiser_name}`,
        slug,
        `Partner article submission pending editorial review from ${r.advertiser_name}.`,
        `Submitted by ${r.contact_name || r.advertiser_name} (${r.contact_email || ''}, ${r.contact_phone || ''})`,
        r.banner_image_url || '/images/nutrition_pillar.png',
        r.advertiser_name,
        r.campaign_title || 'Brand Story',
        price,
        'homepage_sponsored',
        'Unassigned',
        'General Health',
        r.contact_name || r.advertiser_name,
        'submitted',
        'pending',
        r.target_url || null,
        r.created_at || new Date()
      ]);
      console.log(`Synced ${r.advertiser_name} (${r.campaign_title}) to sponsored_articles.`);
    } else {
      console.log(`Already exists: ${r.advertiser_name}`);
    }
  }

  console.log('Sync complete.');
}

syncRequests().catch(console.error);
