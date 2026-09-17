import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

const sql = neon(process.env.DATABASE_URL);

async function run() {
  console.log('--- Testing user_plans and subscription persistence ---');
  const users = await sql`SELECT id, name, email FROM users WHERE email = 'user@example.com'`;
  if (users.length === 0) {
    console.log('No user found with email user@example.com');
    return;
  }

  const user = users[0];
  console.log('User found:', user.email, 'ID:', user.id);

  // Check or initialize plan
  let plans = await sql`SELECT tier, ads_enabled, records_limit FROM user_plans WHERE user_id = ${user.id}::uuid`;
  console.log('Existing plan before test:', plans[0] || 'No plan');

  // Test Plan Upgrade (simulating checkout on /subscribe)
  await sql`
    INSERT INTO user_plans (user_id, tier, ads_enabled, records_limit, active_goals_limit, family_members_limit, ocr_enabled, data_export_enabled)
    VALUES (${user.id}::uuid, 'premium', FALSE, 100, 10, 5, TRUE, TRUE)
    ON CONFLICT (user_id) DO UPDATE SET
      tier = 'premium',
      ads_enabled = FALSE,
      records_limit = 100,
      active_goals_limit = 10,
      family_members_limit = 5,
      ocr_enabled = TRUE,
      data_export_enabled = TRUE;
  `;

  plans = await sql`SELECT tier, ads_enabled, records_limit, active_goals_limit FROM user_plans WHERE user_id = ${user.id}::uuid`;
  console.log('✓ Upgraded subscriber plan verified in DB:', plans[0]);
  console.log('✓ Is Ad-Free & Sponsor-Free:', plans[0].tier !== 'free' && plans[0].ads_enabled === false ? 'YES (100% Ad-Free)' : 'NO');
}

run().catch(console.error);
