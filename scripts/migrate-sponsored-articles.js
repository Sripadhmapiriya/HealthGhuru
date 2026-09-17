const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

if (!process.env.DATABASE_URL) {
  console.error('Missing DATABASE_URL in environment');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function runMigration() {
  console.log('--- STARTING SPONSORED ARTICLES MIGRATION ---');

  // 1. Advertisers table
  console.log('[1/6] Creating advertisers table...');
  await sql`
    CREATE TABLE IF NOT EXISTS advertisers (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      organization_name VARCHAR(255) NOT NULL,
      organization_type VARCHAR(100) NOT NULL DEFAULT 'hospital',
      logo_url TEXT,
      contact_person VARCHAR(255),
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      website TEXT,
      address TEXT,
      description TEXT,
      status VARCHAR(50) NOT NULL DEFAULT 'active',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  // 2. Sponsors table
  console.log('[2/6] Creating sponsors table...');
  await sql`
    CREATE TABLE IF NOT EXISTS sponsors (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      advertiser_id UUID REFERENCES advertisers(id) ON DELETE SET NULL,
      name VARCHAR(255) NOT NULL,
      type VARCHAR(100) NOT NULL DEFAULT 'HOSPITAL',
      logo_url TEXT,
      cover_image_url TEXT,
      description TEXT,
      website TEXT,
      email VARCHAR(255),
      phone VARCHAR(50),
      address TEXT,
      city VARCHAR(100),
      state VARCHAR(100),
      country VARCHAR(100) DEFAULT 'India',
      specializations TEXT[] DEFAULT '{}',
      verified BOOLEAN NOT NULL DEFAULT TRUE,
      status VARCHAR(50) NOT NULL DEFAULT 'active',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  // 3. Campaigns table
  console.log('[3/6] Creating campaigns table...');
  await sql`
    CREATE TABLE IF NOT EXISTS campaigns (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      advertiser_id UUID REFERENCES advertisers(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      end_date TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '30 days',
      budget NUMERIC(12, 2) DEFAULT 0.00,
      status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
      objective VARCHAR(255),
      on_expiry VARCHAR(50) NOT NULL DEFAULT 'unpublish',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  // 4. Upgrade or Create sponsored_articles table
  console.log('[4/6] Creating/upgrading sponsored_articles table...');
  await sql`
    CREATE TABLE IF NOT EXISTS sponsored_articles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title VARCHAR(500) NOT NULL,
      slug VARCHAR(500) UNIQUE NOT NULL,
      excerpt TEXT,
      content TEXT,
      featured_image TEXT,
      sponsor_id UUID REFERENCES sponsors(id) ON DELETE SET NULL,
      advertiser_id UUID REFERENCES advertisers(id) ON DELETE SET NULL,
      campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
      category VARCHAR(100) NOT NULL DEFAULT 'General Health',
      tags TEXT[] DEFAULT '{}',
      author_name VARCHAR(255) DEFAULT 'HealthGhuru Partner Content Team',
      author_title VARCHAR(255),
      author_avatar TEXT,
      medical_reviewer_name VARCHAR(255),
      medical_reviewer_credentials VARCHAR(255),
      medical_reviewer_avatar TEXT,
      reviewed_at TIMESTAMPTZ,
      requires_medical_review BOOLEAN NOT NULL DEFAULT TRUE,
      medical_claim_flags TEXT[] DEFAULT '{}',
      status VARCHAR(50) NOT NULL DEFAULT 'published',
      review_status VARCHAR(50) NOT NULL DEFAULT 'approved',
      is_featured BOOLEAN NOT NULL DEFAULT FALSE,
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      sponsored_label VARCHAR(100) NOT NULL DEFAULT 'SPONSORED',
      content_type VARCHAR(100) NOT NULL DEFAULT 'sponsored_article',
      cta_text VARCHAR(100) DEFAULT 'Read Article →',
      cta_url TEXT,
      published_at TIMESTAMPTZ DEFAULT NOW(),
      scheduled_at TIMESTAMPTZ,
      expires_at TIMESTAMPTZ,
      views INTEGER NOT NULL DEFAULT 0,
      clicks INTEGER NOT NULL DEFAULT 0,
      cta_clicks INTEGER NOT NULL DEFAULT 0,
      shares INTEGER NOT NULL DEFAULT 0,
      reading_time INTEGER NOT NULL DEFAULT 5,
      seo_title VARCHAR(500),
      seo_description TEXT,
      canonical_url TEXT,
      og_image TEXT,
      rights_confirmed VARCHAR(50) NOT NULL DEFAULT 'CONFIRMED',
      version INTEGER NOT NULL DEFAULT 1,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  // Ensure all columns exist on sponsored_articles in case it was created previously with fewer columns
  const alterQueries = [
    `ALTER TABLE sponsored_articles ALTER COLUMN article_id DROP NOT NULL`,
    `ALTER TABLE sponsored_articles ALTER COLUMN article_title DROP NOT NULL`,
    `ALTER TABLE sponsored_articles ALTER COLUMN article_slug DROP NOT NULL`,
    `ALTER TABLE sponsored_articles ALTER COLUMN advertiser_name DROP NOT NULL`,
    `ALTER TABLE sponsored_articles ALTER COLUMN sponsor_label DROP NOT NULL`,
    `ALTER TABLE sponsored_articles ADD COLUMN IF NOT EXISTS title VARCHAR(500)`,
    `ALTER TABLE sponsored_articles ADD COLUMN IF NOT EXISTS slug VARCHAR(500)`,
    `ALTER TABLE sponsored_articles ADD COLUMN IF NOT EXISTS excerpt TEXT`,
    `ALTER TABLE sponsored_articles ADD COLUMN IF NOT EXISTS content TEXT`,
    `ALTER TABLE sponsored_articles ADD COLUMN IF NOT EXISTS featured_image TEXT`,
    `ALTER TABLE sponsored_articles ADD COLUMN IF NOT EXISTS sponsor_id UUID REFERENCES sponsors(id) ON DELETE SET NULL`,
    `ALTER TABLE sponsored_articles ADD COLUMN IF NOT EXISTS advertiser_id UUID REFERENCES advertisers(id) ON DELETE SET NULL`,
    `ALTER TABLE sponsored_articles ADD COLUMN IF NOT EXISTS campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL`,
    `ALTER TABLE sponsored_articles ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'General Health'`,
    `ALTER TABLE sponsored_articles ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}'`,
    `ALTER TABLE sponsored_articles ADD COLUMN IF NOT EXISTS author_name VARCHAR(255) DEFAULT 'HealthGhuru Partner Content Team'`,
    `ALTER TABLE sponsored_articles ADD COLUMN IF NOT EXISTS author_title VARCHAR(255)`,
    `ALTER TABLE sponsored_articles ADD COLUMN IF NOT EXISTS author_avatar TEXT`,
    `ALTER TABLE sponsored_articles ADD COLUMN IF NOT EXISTS medical_reviewer_name VARCHAR(255)`,
    `ALTER TABLE sponsored_articles ADD COLUMN IF NOT EXISTS medical_reviewer_credentials VARCHAR(255)`,
    `ALTER TABLE sponsored_articles ADD COLUMN IF NOT EXISTS medical_reviewer_avatar TEXT`,
    `ALTER TABLE sponsored_articles ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ`,
    `ALTER TABLE sponsored_articles ADD COLUMN IF NOT EXISTS requires_medical_review BOOLEAN DEFAULT TRUE`,
    `ALTER TABLE sponsored_articles ADD COLUMN IF NOT EXISTS medical_claim_flags TEXT[] DEFAULT '{}'`,
    `ALTER TABLE sponsored_articles ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'published'`,
    `ALTER TABLE sponsored_articles ADD COLUMN IF NOT EXISTS review_status VARCHAR(50) DEFAULT 'approved'`,
    `ALTER TABLE sponsored_articles ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE`,
    `ALTER TABLE sponsored_articles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE`,
    `ALTER TABLE sponsored_articles ADD COLUMN IF NOT EXISTS sponsored_label VARCHAR(100) DEFAULT 'SPONSORED'`,
    `ALTER TABLE sponsored_articles ADD COLUMN IF NOT EXISTS content_type VARCHAR(100) DEFAULT 'sponsored_article'`,
    `ALTER TABLE sponsored_articles ADD COLUMN IF NOT EXISTS cta_text VARCHAR(100) DEFAULT 'Read Article →'`,
    `ALTER TABLE sponsored_articles ADD COLUMN IF NOT EXISTS cta_url TEXT`,
    `ALTER TABLE sponsored_articles ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ DEFAULT NOW()`,
    `ALTER TABLE sponsored_articles ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMPTZ`,
    `ALTER TABLE sponsored_articles ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ`,
    `ALTER TABLE sponsored_articles ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0`,
    `ALTER TABLE sponsored_articles ADD COLUMN IF NOT EXISTS clicks INTEGER DEFAULT 0`,
    `ALTER TABLE sponsored_articles ADD COLUMN IF NOT EXISTS cta_clicks INTEGER DEFAULT 0`,
    `ALTER TABLE sponsored_articles ADD COLUMN IF NOT EXISTS shares INTEGER DEFAULT 0`,
    `ALTER TABLE sponsored_articles ADD COLUMN IF NOT EXISTS reading_time INTEGER DEFAULT 5`,
    `ALTER TABLE sponsored_articles ADD COLUMN IF NOT EXISTS seo_title VARCHAR(500)`,
    `ALTER TABLE sponsored_articles ADD COLUMN IF NOT EXISTS seo_description TEXT`,
    `ALTER TABLE sponsored_articles ADD COLUMN IF NOT EXISTS canonical_url TEXT`,
    `ALTER TABLE sponsored_articles ADD COLUMN IF NOT EXISTS og_image TEXT`,
    `ALTER TABLE sponsored_articles ADD COLUMN IF NOT EXISTS rights_confirmed VARCHAR(50) DEFAULT 'CONFIRMED'`,
    `ALTER TABLE sponsored_articles ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1`
  ];

  for (const q of alterQueries) {
    try {
      await sql.query(q);
    } catch (e) {
      // Column might already exist, continue
    }
  }

  // 5. Sponsored Article Analytics
  console.log('[5/6] Creating sponsored_article_analytics table...');
  await sql`
    CREATE TABLE IF NOT EXISTS sponsored_article_analytics (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      article_id UUID REFERENCES sponsored_articles(id) ON DELETE CASCADE,
      campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
      sponsor_id UUID REFERENCES sponsors(id) ON DELETE SET NULL,
      event_type VARCHAR(50) NOT NULL,
      user_session VARCHAR(100),
      destination TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  // 6. Audit Logs
  console.log('[6/6] Creating sponsored_article_audit_logs table...');
  await sql`
    CREATE TABLE IF NOT EXISTS sponsored_article_audit_logs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      article_id UUID REFERENCES sponsored_articles(id) ON DELETE CASCADE,
      user_id VARCHAR(100),
      action VARCHAR(100) NOT NULL,
      entity VARCHAR(100) NOT NULL DEFAULT 'sponsored_article',
      entity_id VARCHAR(100),
      old_value JSONB,
      new_value JSONB,
      timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  // Indexes
  console.log('Ensuring indexes...');
  try {
    await sql`CREATE INDEX IF NOT EXISTS idx_sa_slug ON sponsored_articles(slug);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_sa_status ON sponsored_articles(status);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_sa_category ON sponsored_articles(category);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_sa_sponsor ON sponsored_articles(sponsor_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_sa_featured ON sponsored_articles(is_featured);`;
  } catch (e) {
    console.log('Indexes check error (ignorable):', e.message);
  }

  console.log('--- MIGRATIONS COMPLETED SUCCESSFULLY ---');

  // Check if we need to seed
  const existingArticles = await sql`SELECT count(*)::int as count FROM sponsored_articles`;
  if (existingArticles[0].count > 0) {
    console.log(`Database already has ${existingArticles[0].count} sponsored articles. Skipping seed.`);
    return;
  }

  console.log('--- SEEDING HEALTHGHURU SPONSORED CONTENT ---');

  // Insert Advertisers
  const [apolloAdv] = await sql`
    INSERT INTO advertisers (organization_name, organization_type, contact_person, email, phone, website, address, status)
    VALUES (
      'Apollo Hospitals Enterprise Ltd',
      'hospital',
      'Dr. K. Hariharan (Director Partner Initiatives)',
      'partnerships@apollohospitals.com',
      '+91 44 2829 0200',
      'https://www.apollohospitals.com',
      '21 Greams Lane, Off Greams Road, Thousand Lights, Chennai, Tamil Nadu 600006',
      'active'
    ) RETURNING id;
  `;

  const [fortisAdv] = await sql`
    INSERT INTO advertisers (organization_name, organization_type, contact_person, email, phone, website, address, status)
    VALUES (
      'Fortis Healthcare Limited',
      'hospital',
      'Pooja Sen (Medical Outreach Lead)',
      'oncology.campaigns@fortishealthcare.com',
      '+91 80 6621 4444',
      'https://www.fortishealthcare.com',
      'Bannerghatta Road, Opposite IIMB, Bengaluru, Karnataka 560076',
      'active'
    ) RETURNING id;
  `;

  const [drArunaAdv] = await sql`
    INSERT INTO advertisers (organization_name, organization_type, contact_person, email, phone, website, address, status)
    VALUES (
      'Dr. Aruna Vasudevan Cardiology Associates',
      'doctor',
      'Dr. Aruna Vasudevan, MD, DM',
      'clinic@drarunavasudevan.com',
      '+91 40 2335 1200',
      'https://drarunavasudevan.com',
      'Road No. 12, Banjara Hills, Hyderabad, Telangana 500034',
      'active'
    ) RETURNING id;
  `;

  const [metropolisAdv] = await sql`
    INSERT INTO advertisers (organization_name, organization_type, contact_person, email, phone, website, address, status)
    VALUES (
      'Metropolis Healthcare Ltd',
      'diagnostic_centre',
      'Ramanathan Iyer (VP Clinical Diagnostics)',
      'wellness@metropolisindia.com',
      '+91 22 6656 5555',
      'https://www.metropolisindia.com',
      'Kohinoor City Mall, Commercial Building E, Kurla West, Mumbai 400070',
      'active'
    ) RETURNING id;
  `;

  const [rainbowAdv] = await sql`
    INSERT INTO advertisers (organization_name, organization_type, contact_person, email, phone, website, address, status)
    VALUES (
      'Rainbow Children’s Medicare Ltd',
      'hospital',
      'Sunil Verma (Pediatric Outreach)',
      'care@rainbowhospitals.in',
      '+91 40 4466 5555',
      'https://www.rainbowhospitals.in',
      'Road No. 2, Banjara Hills, Hyderabad 500034',
      'active'
    ) RETURNING id;
  `;

  const [himalayaAdv] = await sql`
    INSERT INTO advertisers (organization_name, organization_type, contact_person, email, phone, website, address, status)
    VALUES (
      'Himalaya Wellness Company',
      'wellness_brand',
      'Ananya Deshmukh (Head of Research Communication)',
      'research@himalayawellness.com',
      '+91 80 6754 9999',
      'https://himalayawellness.in',
      'Makali, Bengaluru, Karnataka 562162',
      'active'
    ) RETURNING id;
  `;

  // Insert Sponsors
  const [apolloSponsor] = await sql`
    INSERT INTO sponsors (
      advertiser_id, name, type, logo_url, cover_image_url, description,
      website, email, phone, city, state, country, specializations, verified
    ) VALUES (
      ${apolloAdv.id},
      'Apollo Multispeciality Hospitals',
      'HOSPITAL',
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=200&h=200&q=80',
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80',
      'Apollo Multispeciality Hospitals is one of Asia’s foremost integrated healthcare providers, internationally recognized for advanced clinical outcomes in interventional cardiology, robotic surgery, and organ transplantation.',
      'https://www.apollohospitals.com',
      'info@apollohospitals.com',
      '+91 44 2829 0200',
      'Chennai',
      'Tamil Nadu',
      'India',
      ARRAY['Cardiology', 'Oncology', 'Robotic Surgery', 'Organ Transplantation', 'Emergency Medicine'],
      TRUE
    ) RETURNING id;
  `;

  const [fortisSponsor] = await sql`
    INSERT INTO sponsors (
      advertiser_id, name, type, logo_url, cover_image_url, description,
      website, email, phone, city, state, country, specializations, verified
    ) VALUES (
      ${fortisAdv.id},
      'Fortis Cancer Institute',
      'HOSPITAL',
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=200&h=200&q=80',
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80',
      'Fortis Cancer Institute delivers multidisciplinary precision oncology, integrating cutting-edge genomics, dual-checkpoint immunotherapy, and minimally invasive surgical oncology.',
      'https://www.fortishealthcare.com',
      'cancer.info@fortishealthcare.com',
      '+91 80 6621 4444',
      'Bengaluru',
      'Karnataka',
      'India',
      ARRAY['Precision Oncology', 'Immunotherapy', 'Stereotactic Radiosurgery', 'Genomic Profiling'],
      TRUE
    ) RETURNING id;
  `;

  const [drArunaSponsor] = await sql`
    INSERT INTO sponsors (
      advertiser_id, name, type, logo_url, cover_image_url, description,
      website, email, phone, city, state, country, specializations, verified
    ) VALUES (
      ${drArunaAdv.id},
      'Dr. Aruna Vasudevan, MD, DM',
      'DOCTOR',
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&h=200&q=80',
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
      'Dr. Aruna Vasudevan is a senior consultant cardiologist with over 18 years of clinical expertise specializing in preventative cardiology, resistant hypertension, and heart failure risk mitigation.',
      'https://drarunavasudevan.com',
      'consult@drarunavasudevan.com',
      '+91 40 2335 1200',
      'Hyderabad',
      'Telangana',
      'India',
      ARRAY['Preventative Cardiology', 'Hypertension', 'Lipidology', 'Cardiac Echocardiography'],
      TRUE
    ) RETURNING id;
  `;

  const [metropolisSponsor] = await sql`
    INSERT INTO sponsors (
      advertiser_id, name, type, logo_url, cover_image_url, description,
      website, email, phone, city, state, country, specializations, verified
    ) VALUES (
      ${metropolisAdv.id},
      'Metropolis Healthcare Diagnostic Centre',
      'DIAGNOSTIC_CENTRE',
      'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=200&h=200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      'Metropolis Healthcare is a leading international pathology specialist offering over 4,000 diagnostic tests, automated biomarker profiling, and preventative whole-body wellness screenings.',
      'https://www.metropolisindia.com',
      'support@metropolisindia.com',
      '+91 22 6656 5555',
      'Mumbai',
      'Maharashtra',
      'India',
      ARRAY['Preventative Pathology', 'Endocrine Profiling', 'Molecular Diagnostics', 'HbA1c & Lipids'],
      TRUE
    ) RETURNING id;
  `;

  const [rainbowSponsor] = await sql`
    INSERT INTO sponsors (
      advertiser_id, name, type, logo_url, cover_image_url, description,
      website, email, phone, city, state, country, specializations, verified
    ) VALUES (
      ${rainbowAdv.id},
      'Rainbow Children’s Medical Pavilion',
      'CLINIC',
      'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?auto=format&fit=crop&w=200&h=200&q=80',
      'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
      'Rainbow Children’s Hospital is India’s premier pediatric and perinatal care institution, offering specialized care across pediatric cardiology, pulmonology, neonatology, and adolescent health.',
      'https://www.rainbowhospitals.in',
      'info@rainbowhospitals.in',
      '+91 40 4466 5555',
      'Hyderabad',
      'Telangana',
      'India',
      ARRAY['Pediatric Pulmonology', 'Neonatology', 'Child Allergies', 'Pediatric Growth & Nutrition'],
      TRUE
    ) RETURNING id;
  `;

  const [himalayaSponsor] = await sql`
    INSERT INTO sponsors (
      advertiser_id, name, type, logo_url, cover_image_url, description,
      website, email, phone, city, state, country, specializations, verified
    ) VALUES (
      ${himalayaAdv.id},
      'Himalaya Wellness Research Foundation',
      'WELLNESS_BRAND',
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=200&h=200&q=80',
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
      'Backed by nearly a century of research, Himalaya Wellness combines traditional Ayurvedic botanical insights with rigorous modern clinical safety trials.',
      'https://himalayawellness.in',
      'contact@himalayawellness.com',
      '+91 80 6754 9999',
      'Bengaluru',
      'Karnataka',
      'India',
      ARRAY['Botanical Science', 'Adaptogenic Nutrition', 'Circadian Biology', 'Holistic Wellness'],
      TRUE
    ) RETURNING id;
  `;

  // Insert Campaigns
  const [apolloCamp] = await sql`
    INSERT INTO campaigns (advertiser_id, name, description, start_date, end_date, budget, status, objective, on_expiry)
    VALUES (
      ${apolloAdv.id},
      'Cardiovascular Health Awareness 2026',
      'National awareness campaign focusing on early detection of coronary artery disease and heart failure risk mitigation.',
      NOW() - INTERVAL '5 days',
      NOW() + INTERVAL '25 days',
      150000.00,
      'ACTIVE',
      'Educate adults aged 35+ on early cardiovascular screening and symptoms.',
      'keep_published'
    ) RETURNING id;
  `;

  const [fortisCamp] = await sql`
    INSERT INTO campaigns (advertiser_id, name, description, start_date, end_date, budget, status, objective, on_expiry)
    VALUES (
      ${fortisAdv.id},
      'Precision Cancer Care Education Drive',
      'Clinical education initiative highlighting targeted biomarker therapies in solid tumor management.',
      NOW() - INTERVAL '7 days',
      NOW() + INTERVAL '23 days',
      120000.00,
      'ACTIVE',
      'Patient literacy on genomic sequencing and immunotherapy.',
      'unpublish'
    ) RETURNING id;
  `;

  const [drArunaCamp] = await sql`
    INSERT INTO campaigns (advertiser_id, name, description, start_date, end_date, budget, status, objective, on_expiry)
    VALUES (
      ${drArunaAdv.id},
      'Hypertension & Lifestyle Medicine 2026',
      'Community heart disease prevention initiative focusing on diet, sodium control, and regular ambulatory BP monitoring.',
      NOW() - INTERVAL '3 days',
      NOW() + INTERVAL '27 days',
      50000.00,
      'ACTIVE',
      'Empower hypertensive patients with actionable, evidence-based lifestyle changes.',
      'keep_published'
    ) RETURNING id;
  `;

  const [metropolisCamp] = await sql`
    INSERT INTO campaigns (advertiser_id, name, description, start_date, end_date, budget, status, objective, on_expiry)
    VALUES (
      ${metropolisAdv.id},
      'Pre-Diabetes Screening Initiative',
      'Promoting early HbA1c and fasting insulin screenings for adults at elevated metabolic risk.',
      NOW() - INTERVAL '10 days',
      NOW() + INTERVAL '20 days',
      90000.00,
      'ACTIVE',
      'Drive preventive laboratory checkups to halt progression to Type 2 diabetes.',
      'keep_published'
    ) RETURNING id;
  `;

  const [rainbowCamp] = await sql`
    INSERT INTO campaigns (advertiser_id, name, description, start_date, end_date, budget, status, objective, on_expiry)
    VALUES (
      ${rainbowAdv.id},
      'Pediatric Respiratory Health Months',
      'Seasonal allergy and childhood asthma guidance for parents and educators.',
      NOW() - INTERVAL '2 days',
      NOW() + INTERVAL '28 days',
      80000.00,
      'ACTIVE',
      'Improve recognition of childhood wheezing, inhaler technique, and trigger avoidance.',
      'keep_published'
    ) RETURNING id;
  `;

  const [himalayaCamp] = await sql`
    INSERT INTO campaigns (advertiser_id, name, description, start_date, end_date, budget, status, objective, on_expiry)
    VALUES (
      ${himalayaAdv.id},
      'Urban Stress & Circadian Wellness',
      'Science-backed lifestyle and adaptogen education for restorative sleep cycles.',
      NOW() - INTERVAL '4 days',
      NOW() + INTERVAL '26 days',
      60000.00,
      'ACTIVE',
      'Promote sleep hygiene and natural stress management.',
      'keep_published'
    ) RETURNING id;
  `;

  // Insert Sponsored Articles
  console.log('Seeding 6 published sponsored articles and 1 review draft...');

  // Article 1: Featured Heart Health
  await sql`
    INSERT INTO sponsored_articles (
      title, slug, excerpt, content, featured_image,
      sponsor_id, advertiser_id, campaign_id, category, tags,
      author_name, author_title,
      medical_reviewer_name, medical_reviewer_credentials, reviewed_at,
      requires_medical_review, status, review_status, is_featured, is_active,
      sponsored_label, content_type, cta_text, cta_url,
      published_at, views, clicks, cta_clicks, shares, reading_time,
      seo_title, seo_description
    ) VALUES (
      'Understanding the Early Warning Signs of Heart Disease: What Every Adult Should Know',
      'understanding-early-warning-signs-heart-disease',
      'Cardiovascular disorders remain the leading cause of preventable mortality worldwide. Recognizing subtle clinical warning signs early can save lives.',
      '## The Silent Progression of Cardiovascular Disease

Cardiovascular diseases develop quietly over years before manifesting as an acute medical event. According to clinical data from Apollo Hospitals, subtle symptoms like unexplained fatigue, shortness of breath on exertion, and atypical chest pressure often appear months before a myocardial infarction.

### Recognizing Non-Obvious Warning Signs

While crushing substernal chest pain is the classic depiction of a cardiac emergency, many individuals—especially women and older adults—experience atypical presentations:

* **Exertional Dyspnea:** Uncharacteristic breathlessness while walking on level ground or climbing one flight of stairs.
* **Jaw, Neck, or Back Radiation:** Discomfort that radiates into the lower mandible or between the shoulder blades during physical exertion.
* **Persistent Indigestion or Epigastric Burning:** Often misdiagnosed as acid reflux or gastrointestinal upset.
* **Orthopnea:** Inability to lie flat without experiencing nocturnal cough or breathlessness.

> "Early intervention in coronary disease transforms clinical outcomes. A high-sensitivity troponin screening, lipid fractionation, and stress echocardiogram can detect ischemia years before arterial occlusion causes irreversible damage."
> — *Dr. Sengottuvelu G., Senior Consultant Interventional Cardiologist*

### Diagnostic Evaluation and When to Consult a Specialist

If you experience recurrent episodes of exertional discomfort or have multiple risk factors (such as a family history of premature CAD, dyslipidemia, or diabetes mellitus), immediate medical consultation is advised.

Preventive evaluations typically begin with a baseline 12-lead ECG, comprehensive lipid profile, high-sensitivity C-reactive protein (hs-CRP), and coronary calcium CT scoring when indicated.

### Actionable Steps for Heart Health

1. **Monitor Blood Pressure Regularly:** Strive for systolic pressure below 120 mmHg and diastolic below 80 mmHg.
2. **Prioritize Aerobic Conditioning:** Target a minimum of 150 minutes of moderate-intensity cardiovascular exercise per week.
3. **Adopt Dietary Strategies:** Incorporate heart-healthy monounsaturated fats, soluble fiber from whole grains, and lean proteins while reducing sodium consumption.',
      'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80',
      ${apolloSponsor.id}, ${apolloAdv.id}, ${apolloCamp.id}, 'Heart', ARRAY['Cardiology', 'Heart Disease', 'Preventive Health', 'Apollo Hospitals'],
      'HealthGhuru Clinical Editorial Team', 'Healthcare Editorial Lead',
      'Dr. Sengottuvelu G.', 'MD, DM, FSCAI · Senior Interventional Cardiologist', NOW() - INTERVAL '5 days',
      TRUE, 'published', 'approved', TRUE, TRUE,
      'SPONSORED', 'sponsored_article', 'Schedule Cardiac Assessment →', 'https://www.apollohospitals.com/departments/heart',
      NOW() - INTERVAL '5 days', 14280, 892, 534, 128, 6,
      'Early Warning Signs of Heart Disease | Apollo Hospitals & HealthGhuru',
      'Learn how to identify subtle symptoms of cardiovascular disease and when to seek early clinical consultation from Apollo Hospitals.'
    );
  `;

  // Article 2: Cancer Care
  await sql`
    INSERT INTO sponsored_articles (
      title, slug, excerpt, content, featured_image,
      sponsor_id, advertiser_id, campaign_id, category, tags,
      author_name, author_title,
      medical_reviewer_name, medical_reviewer_credentials, reviewed_at,
      requires_medical_review, status, review_status, is_featured, is_active,
      sponsored_label, content_type, cta_text, cta_url,
      published_at, views, clicks, cta_clicks, shares, reading_time,
      seo_title, seo_description
    ) VALUES (
      'Modern Breakthroughs in Targeted Oncology and Precision Cancer Therapy',
      'modern-breakthroughs-targeted-oncology-precision-cancer-therapy',
      'How comprehensive genomic profiling and immune checkpoint therapies are altering the treatment paradigm for complex solid tumors.',
      '## A Paradigm Shift from Chemotherapy to Precision Medicine

Oncology care has evolved dramatically over the past decade. Where conventional chemotherapy often acted non-specifically across dividing cells, modern targeted oncology zeroes in on the specific genetic mutations driving cancer cell proliferation.

At the Fortis Cancer Institute, precision oncology relies on Next-Generation Sequencing (NGS) to examine hundreds of cancer-associated genes simultaneously from a single tissue biopsy or circulating cell-free DNA (liquid biopsy).

### Core Modalities in Precision Cancer Care

* **Tyrosine Kinase Inhibitors (TKIs):** Small molecules engineered to block enzymatic pathways crucial for cancer proliferation (such as EGFR, ALK, and ROS1 in non-small cell lung cancer).
* **Dual-Checkpoint Immunotherapy:** Monoclonal antibodies targeting PD-1/PD-L1 and CTLA-4 receptors, releasing the natural brakes on cytotoxic T lymphocytes so they can recognize and destroy malignant cells.
* **Targeted Monoclonal Antibodies:** Engineered antibodies conjugated with cytotoxic payloads, delivering lethal medication directly into cancer cells with minimal systemic toxicity.

> "Precision medicine is not just about newer drugs; it is about choosing the exact therapeutic protocol tailored to an individual patient’s tumor biology, sparing unnecessary toxicity and maximizing survival."
> — *Dr. Nitesh Rohatgi, Director of Oncology*

### The Role of Multidisciplinary Tumor Boards

Effective cancer management requires collaboration. At Fortis, medical oncologists, surgical oncologists, radiation physicists, and molecular pathologists review complex diagnostic profiles jointly to design coordinated patient care pathways.',
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80',
      ${fortisSponsor.id}, ${fortisAdv.id}, ${fortisCamp.id}, 'Cancer', ARRAY['Oncology', 'Immunotherapy', 'Genomics', 'Fortis Hospitals'],
      'HealthGhuru Oncology Desk', 'Medical Science Contributor',
      'Dr. Nitesh Rohatgi', 'MBBS, MD, DNB (Oncology) · Director Medical Oncology', NOW() - INTERVAL '6 days',
      TRUE, 'published', 'approved', FALSE, TRUE,
      'SPONSORED', 'sponsored_article', 'Consult Oncology Team →', 'https://www.fortishealthcare.com/speciality/oncology',
      NOW() - INTERVAL '6 days', 9840, 612, 388, 94, 7,
      'Precision Cancer Therapy & Targeted Oncology | Fortis Cancer Institute',
      'Discover how genomic profiling and immunotherapy are revolutionizing clinical cancer treatment at Fortis Cancer Institute.'
    );
  `;

  // Article 3: Doctor Sponsored - Hypertension
  await sql`
    INSERT INTO sponsored_articles (
      title, slug, excerpt, content, featured_image,
      sponsor_id, advertiser_id, campaign_id, category, tags,
      author_name, author_title,
      medical_reviewer_name, medical_reviewer_credentials, reviewed_at,
      requires_medical_review, status, review_status, is_featured, is_active,
      sponsored_label, content_type, cta_text, cta_url,
      published_at, views, clicks, cta_clicks, shares, reading_time,
      seo_title, seo_description
    ) VALUES (
      'Hypertension: The Silent Risk Factor and How Lifestyle Interventions Save Lives',
      'hypertension-silent-risk-factor-lifestyle-interventions',
      'High blood pressure rarely presents overt symptoms until target organ damage occurs. Dr. Aruna Vasudevan explains proven medical and lifestyle safeguards.',
      '## The Silent Nature of Chronic Hypertension

Hypertension earned its moniker as the "silent killer" for a stark clinical reason: the vast majority of individuals with arterial pressures exceeding 140/90 mmHg feel entirely normal. Yet, unmanaged vascular shear stress silently injures the endothelial lining of arteries, accelerates atherosclerosis, and places strain on the heart, kidneys, and brain.

### Why Ambulatory Monitoring is Critical

A single clinical measurement in a doctor’s office can be affected by the "white coat effect" (stress-induced elevation) or "masked hypertension" (normal in-clinic readings despite elevated ambulatory pressures).

As a preventative cardiologist, I routinely recommend 24-hour ambulatory blood pressure monitoring (ABPM) or standardized home BP logs taken twice daily (morning and evening) under restful conditions.

### Five Clinically Proven Non-Pharmacological Strategies

1. **Sodium Reduction:** Limiting dietary sodium to under 2,000 mg per day can reduce systolic pressure by 5 to 6 mmHg in hypertensive patients.
2. **Potassium Enrichment:** Diets rich in potassium (spinach, bananas, avocados, lentils) promote renal sodium excretion and vascular relaxation.
3. **Structured Physical Activity:** Combining 30 minutes of aerobic training (brisk walking, cycling) with isometric resistance training demonstrates significant vascular benefits.
4. **Sleep Apnea Screening:** Obstructive sleep apnea is one of the most frequent secondary drivers of resistant hypertension.
5. **Stress Physiology Management:** Diaphragmatic breathing and mindfulness mitigate sustained sympathetic overdrive.',
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
      ${drArunaSponsor.id}, ${drArunaAdv.id}, ${drArunaCamp.id}, 'Heart', ARRAY['Hypertension', 'Cardiology', 'Preventative Medicine', 'Dr. Aruna Vasudevan'],
      'Dr. Aruna Vasudevan', 'Consultant Preventative Cardiologist',
      'Dr. Aruna Vasudevan', 'MD, DM (Cardiology) · Senior Consultant', NOW() - INTERVAL '3 days',
      TRUE, 'published', 'approved', FALSE, TRUE,
      'SPONSORED', 'doctor_interview', 'Book Doctor Consultation →', 'https://drarunavasudevan.com/book',
      NOW() - INTERVAL '3 days', 8120, 540, 310, 86, 5,
      'Hypertension: The Silent Risk Factor | Dr. Aruna Vasudevan',
      'Learn how to measure, manage, and prevent hypertension complications through evidence-based lifestyle changes and clinical guidance.'
    );
  `;

  // Article 4: Diagnostic Centre - Diabetes Early Detection
  await sql`
    INSERT INTO sponsored_articles (
      title, slug, excerpt, content, featured_image,
      sponsor_id, advertiser_id, campaign_id, category, tags,
      author_name, author_title,
      medical_reviewer_name, medical_reviewer_credentials, reviewed_at,
      requires_medical_review, status, review_status, is_featured, is_active,
      sponsored_label, content_type, cta_text, cta_url,
      published_at, views, clicks, cta_clicks, shares, reading_time,
      seo_title, seo_description
    ) VALUES (
      'The Importance of Routine Blood Glucose Profiling in Preventing Type 2 Diabetes',
      'routine-blood-glucose-profiling-preventing-type-2-diabetes',
      'Prediabetes often goes undetected for up to a decade. Understand the differences between Fasting Blood Sugar, Oral Glucose Tolerance, and Glycated Hemoglobin (HbA1c).',
      '## The Escalating Burden of Prediabetes

Type 2 diabetes does not develop overnight. It is preceded by a protracted phase of insulin resistance known as prediabetes, where pancreatic beta cells hypersecrete insulin to overcome peripheral cellular resistance.

Clinical diagnostics play an irreplaceable role: by the time clinical hyperglycemia manifests, up to 50% of beta cell functional mass may already be impaired.

### Comparing Key Diagnostic Tests

* **Fasting Plasma Glucose (FPG):** Measures circulating glucose after an 8 to 12 hour fast. A level between 100 and 125 mg/dL indicates impaired fasting glucose.
* **HbA1c (Glycated Hemoglobin):** Reflects average blood sugar exposure over the 90-day lifespan of red blood cells. Levels between 5.7% and 6.4% signify prediabetes; 6.5% and above warrants clinical diagnosis of diabetes.
* **Fasting Insulin & HOMA-IR:** Calculates homeostatic insulin resistance before overt blood sugar elevation occurs.

### Who Should Get Screened?

Routine screening should commence by age 30 for individuals with sedentary desk jobs, high waist-to-hip ratio, family history of Type 2 diabetes, or a history of gestational diabetes.',
      'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80',
      ${metropolisSponsor.id}, ${metropolisAdv.id}, ${metropolisCamp.id}, 'Diabetes', ARRAY['Diabetes', 'Pathology', 'HbA1c', 'Metropolis Healthcare'],
      'HealthGhuru Diagnostics Desk', 'Laboratory Medicine Contributor',
      'Dr. Nilesh Shah', 'MD (Pathology) · Chief of Clinical Diagnostics', NOW() - INTERVAL '8 days',
      TRUE, 'published', 'approved', FALSE, TRUE,
      'SPONSORED', 'sponsored_article', 'Book Diabetes Screening Package →', 'https://www.metropolisindia.com/diabetes-check',
      NOW() - INTERVAL '8 days', 11340, 720, 445, 112, 5,
      'Blood Glucose Profiling & Diabetes Prevention | Metropolis Healthcare',
      'Understand how routine HbA1c and metabolic panels help detect prediabetes early and guide effective lifestyle reversal.'
    );
  `;

  // Article 5: Clinic / Hospital - Pediatric Asthma
  await sql`
    INSERT INTO sponsored_articles (
      title, slug, excerpt, content, featured_image,
      sponsor_id, advertiser_id, campaign_id, category, tags,
      author_name, author_title,
      medical_reviewer_name, medical_reviewer_credentials, reviewed_at,
      requires_medical_review, status, review_status, is_featured, is_active,
      sponsored_label, content_type, cta_text, cta_url,
      published_at, views, clicks, cta_clicks, shares, reading_time,
      seo_title, seo_description
    ) VALUES (
      'Childhood Asthma and Seasonal Allergies: A Parent’s Comprehensive Guide',
      'childhood-asthma-seasonal-allergies-parents-guide',
      'Recognizing early pediatric wheeze, avoiding common indoor environmental triggers, and safely adhering to prescribed maintenance inhalers.',
      '## Navigating Pediatric Respiratory Challenges

Childhood asthma is among the most frequent chronic pediatric conditions, yet its initial signs are often brushed aside as recurring viral colds or typical seasonal coughs.

At Rainbow Children’s Hospital, pediatric pulmonologists stress that persistent nocturnal coughing—especially coughing that awakens a child between 2:00 AM and 4:00 AM or limits recess playtime—is a prime indicator of airway hyperreactivity.

### Distinguishing Bronchial Spasm from Common Colds

* **Nocturnal Cough:** Dry, hacking cough without significant rhinorrhea.
* **Exertional Limitations:** Catching breath or coughing after short sprints on the playground.
* **Intercostal Retractions:** Skin pulling tight between the ribs or at the base of the throat during inspiration.

### Demystifying Pediatric Inhaler Therapy

Many parents express apprehension regarding inhaled corticosteroids (ICS). It is crucial to understand that inhaled medications are administered in microgram quantities acting directly on airway mucosal lining, with minimal systemic absorption compared to oral syrups.

Using an age-appropriate spacer device with a well-fitted mask ensures optimal medication deposition into the distal bronchioles.',
      'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?auto=format&fit=crop&w=1200&q=80',
      ${rainbowSponsor.id}, ${rainbowAdv.id}, ${rainbowCamp.id}, 'Pediatrics', ARRAY['Pediatrics', 'Asthma', 'Child Health', 'Rainbow Childrens Hospital'],
      'HealthGhuru Family Health Desk', 'Pediatric Contributor',
      'Dr. Pradeep Sharma', 'MD, DCH · Senior Consultant Pediatric Pulmonologist', NOW() - INTERVAL '2 days',
      TRUE, 'published', 'approved', FALSE, TRUE,
      'SPONSORED', 'sponsored_article', 'Explore Pediatric Services →', 'https://www.rainbowhospitals.in/pediatric-pulmonology',
      NOW() - INTERVAL '2 days', 7640, 480, 290, 78, 6,
      'Childhood Asthma & Seasonal Allergies Guide | Rainbow Children’s Hospital',
      'A practical guide for parents on recognizing pediatric asthma, optimizing inhaler use, and mitigating indoor allergens.'
    );
  `;

  // Article 6: Wellness Brand - Sleep Hygiene
  await sql`
    INSERT INTO sponsored_articles (
      title, slug, excerpt, content, featured_image,
      sponsor_id, advertiser_id, campaign_id, category, tags,
      author_name, author_title,
      medical_reviewer_name, medical_reviewer_credentials, reviewed_at,
      requires_medical_review, status, review_status, is_featured, is_active,
      sponsored_label, content_type, cta_text, cta_url,
      published_at, views, clicks, cta_clicks, shares, reading_time,
      seo_title, seo_description
    ) VALUES (
      'The Science of Sleep Hygiene and Stress Modulation in Modern Urban Lifestyles',
      'science-sleep-hygiene-stress-modulation-urban-lifestyle',
      'Understanding circadian biology, cortisol regulation, and evidence-supported botanical adaptogens that encourage deep, restorative REM and slow-wave sleep.',
      '## The Cellular Cost of Chronic Sleep Deficits

Sleep is not a passive state of physical inactivity. It is a highly metabolic and active neurobiological process during which the brain’s glymphatic system flushes out cellular metabolic debris, memories are consolidated, and immune cells regenerate.

In urban environments characterized by prolonged blue-spectrum screen exposure and erratic work hours, chronic disruption of the master circadian pacemaker (the suprachiasmatic nucleus) leads to blunted melatonin secretion and elevated evening cortisol levels.

### The Role of Circadian Resetting

* **Morning Phototherapy:** Exposure to natural sunlight within 30 minutes of waking sets the master circadian clock and suppresses residual melatonin.
* **Caffeine Curfews:** Adenosine receptor antagonism from caffeine has a half-life of 5 to 7 hours; discontinue caffeine consumption at least 8 hours before bed.
* **Thermal Regulation:** A bedroom temperature between 18°C and 20°C facilitates the biological core temperature drop necessary to initiate slow-wave sleep.

### Evidence-Based Adaptogenic Support

Botanicals such as *Withania somnifera* (Ashwagandha) and *Bacopa monnieri* have undergone double-blind, placebo-controlled clinical trials demonstrating their ability to modulate HPA-axis activation and maintain balanced serum cortisol levels without creating habit-forming sedation.',
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80',
      ${himalayaSponsor.id}, ${himalayaAdv.id}, ${himalayaCamp.id}, 'Mental Health', ARRAY['Sleep', 'Stress', 'Ayurveda', 'Wellness', 'Himalaya Wellness'],
      'HealthGhuru Wellness Team', 'Integrative Health Contributor',
      'Dr. Shruthi Hegde', 'BAMS, MD (Ayurveda) · Clinical Research Specialist', NOW() - INTERVAL '4 days',
      TRUE, 'published', 'approved', FALSE, TRUE,
      'SPONSORED', 'sponsored_article', 'Explore Wellness Research →', 'https://himalayawellness.in/research',
      NOW() - INTERVAL '4 days', 9150, 610, 360, 105, 5,
      'Science of Sleep Hygiene & Stress Modulation | Himalaya Wellness',
      'Learn how circadian synchronization, sleep architecture, and natural adaptogens support neurological recovery and daytime energy.'
    );
  `;

  // Article 7: Draft / In Medical Review for Testing Admin Workflows
  await sql`
    INSERT INTO sponsored_articles (
      title, slug, excerpt, content, featured_image,
      sponsor_id, advertiser_id, campaign_id, category, tags,
      author_name, author_title,
      medical_reviewer_name, medical_reviewer_credentials, reviewed_at,
      requires_medical_review, status, review_status, is_featured, is_active,
      sponsored_label, content_type, cta_text, cta_url,
      published_at, views, clicks, cta_clicks, shares, reading_time,
      seo_title, seo_description
    ) VALUES (
      'Navigating Post-Menopausal Bone Density: Early DEXA Scans and Calcium Absorption',
      'navigating-post-menopausal-bone-density-dexa-scans',
      'Osteoporosis affects millions of post-menopausal women silently. Early dual-energy X-ray absorptiometry and targeted dietary absorption strategies.',
      '## Understanding Silent Bone Resorption

Following menopause, the natural decline in circulating estradiol levels significantly accelerates osteoclastic bone resorption. Because osteopenia and osteoporosis are painless until a low-impact fragility fracture occurs, proactive screening is critical.

This clinical review examines when women should schedule their baseline DEXA scan, how T-scores guide treatment decisions, and the essential synergy between Calcium, Vitamin D3, and Vitamin K2 for optimal bone mineralization.',
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80',
      ${apolloSponsor.id}, ${apolloAdv.id}, ${apolloCamp.id}, 'Women’s Health', ARRAY['Womens Health', 'Bone Density', 'Osteoporosis', 'Apollo Hospitals'],
      'Apollo Women’s Health Department', 'Clinical Contributor',
      'Dr. Malathi Prasad', 'MD, FRCOG · Consultant Gynecologist', NULL,
      TRUE, 'medical_review', 'pending', FALSE, FALSE,
      'SPONSORED', 'sponsored_article', 'Learn More About Bone Health →', 'https://www.apollohospitals.com/departments/gynecology',
      NULL, 0, 0, 0, 0, 4,
      'Post-Menopausal Bone Density & DEXA Scans | Apollo Hospitals',
      'A medical guide on osteopenia screening and bone preservation for post-menopausal women.'
    );
  `;

  console.log('--- ALL SEED DATA INSERTED SUCCESSFULLY ---');
}

runMigration()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
