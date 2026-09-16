const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not defined');
}

const sql = neon(process.env.DATABASE_URL);

async function main() {
  console.log('--- Initializing HealthGhuru News Portal Tables ---');

  // 1. Doctors table
  await sql.query(`
    CREATE TABLE IF NOT EXISTS doctors (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      specialization VARCHAR(255) NOT NULL,
      hospital_name VARCHAR(255),
      hospital_id UUID,
      qualifications VARCHAR(255),
      experience_years INTEGER DEFAULT 12,
      bio TEXT,
      photo_url TEXT,
      is_verified BOOLEAN DEFAULT TRUE,
      is_sponsored BOOLEAN DEFAULT FALSE,
      city VARCHAR(100) DEFAULT 'New Delhi',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('✓ doctors table ready');

  // 2. Hospitals table
  await sql.query(`
    CREATE TABLE IF NOT EXISTS hospitals (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      city VARCHAR(100) NOT NULL,
      state VARCHAR(100),
      specializations TEXT[],
      facilities TEXT[],
      about TEXT,
      logo_url TEXT,
      cover_url TEXT,
      is_verified BOOLEAN DEFAULT TRUE,
      is_sponsored BOOLEAN DEFAULT FALSE,
      phone VARCHAR(50),
      website_url TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('✓ hospitals table ready');

  // 3. Doctor Interviews table
  await sql.query(`
    CREATE TABLE IF NOT EXISTS doctor_interviews (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
      hospital_id UUID REFERENCES hospitals(id) ON DELETE SET NULL,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      summary TEXT,
      key_points TEXT[],
      transcript TEXT,
      video_url TEXT,
      youtube_video_id VARCHAR(50),
      cover_image_url TEXT,
      category VARCHAR(100) DEFAULT 'Cardiology',
      published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      is_featured BOOLEAN DEFAULT FALSE,
      is_sponsored BOOLEAN DEFAULT FALSE
    );
  `);
  console.log('✓ doctor_interviews table ready');

  // 4. Polls & Poll Options
  await sql.query(`
    CREATE TABLE IF NOT EXISTS health_polls (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      question TEXT NOT NULL,
      category VARCHAR(100) DEFAULT 'General Health',
      is_active BOOLEAN DEFAULT TRUE,
      start_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      end_date TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('✓ health_polls table ready');

  await sql.query(`
    CREATE TABLE IF NOT EXISTS health_poll_options (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      poll_id UUID REFERENCES health_polls(id) ON DELETE CASCADE,
      option_text VARCHAR(255) NOT NULL,
      votes_count INTEGER DEFAULT 0,
      display_order INTEGER DEFAULT 0
    );
  `);
  console.log('✓ health_poll_options table ready');

  // 5. Ensure Advertisements table has all necessary columns
  await sql.query(`
    ALTER TABLE advertisements 
    ADD COLUMN IF NOT EXISTS sponsor_type VARCHAR(50) DEFAULT 'hospital',
    ADD COLUMN IF NOT EXISTS is_sponsored_editorial BOOLEAN DEFAULT FALSE;
  `);
  console.log('✓ advertisements table verified');

  // 6. Ensure content_items has is_editor_pick
  await sql.query(`
    ALTER TABLE content_items 
    ADD COLUMN IF NOT EXISTS is_editor_pick BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS medical_reviewer_id UUID,
    ADD COLUMN IF NOT EXISTS medical_reviewer_name VARCHAR(255),
    ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE;
  `);
  console.log('✓ content_items columns verified');

  // 7. Seed Initial Hospitals if empty
  const hospitalCount = await sql.query('SELECT count(*) FROM hospitals');
  if (parseInt(hospitalCount[0].count, 10) === 0) {
    console.log('Seeding premier healthcare institutions...');
    await sql.query(`
      INSERT INTO hospitals (name, slug, city, state, specializations, facilities, about, logo_url, cover_url, is_verified, is_sponsored, phone, website_url)
      VALUES 
      (
        'Apex Heart & Vascular Institute',
        'apex-heart-vascular-institute',
        'New Delhi',
        'Delhi NCR',
        ARRAY['Cardiology', 'Cardiothoracic Surgery', 'Vascular Medicine', 'Preventive Cardiology'],
        ARRAY['24/7 Cardiac Emergency', 'Advanced Cath Lab', 'Robotic Heart Surgery', 'Cardiac Rehabilitation'],
        'Apex Heart & Vascular Institute is a nationally accredited tertiary cardiac centre pioneering minimally invasive valve replacements and cardiovascular genetics.',
        'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=200&q=80',
        'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80',
        TRUE,
        TRUE,
        '+91 11 4050 8000',
        'https://apexheart.example.com'
      ),
      (
        'National Cancer Research & Care Centre',
        'national-cancer-research-care-centre',
        'Bengaluru',
        'Karnataka',
        ARRAY['Medical Oncology', 'Surgical Oncology', 'Radiation Oncology', 'Immunotherapy', 'Pediatric Oncology'],
        ARRAY['Proton Beam Therapy', 'Bone Marrow Transplant Unit', 'Genomic Tumor Board', 'Palliative Care Pavilion'],
        'A premier comprehensive cancer centre dedicated to translational oncology, precision targeted therapies, and patient-centric cancer survivorship.',
        'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=200&q=80',
        'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
        TRUE,
        FALSE,
        '+91 80 2699 5000',
        'https://ncrc.example.org'
      ),
      (
        'St. Jude Children''s Medical Pavilion',
        'st-jude-childrens-medical-pavilion',
        'Mumbai',
        'Maharashtra',
        ARRAY['Pediatric Cardiology', 'Neonatology', 'Pediatric Surgery', 'Child Development'],
        ARRAY['Level IV NICU', 'Pediatric Intensive Care', 'Child Life Play Therapy', 'Family Accommodation Wing'],
        'Recognized internationally for world-class pediatric interventions, neonatal critical care, and developmental pediatric wellness.',
        'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=200&q=80',
        'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80',
        TRUE,
        TRUE,
        '+91 22 6177 3000',
        'https://stjude-pavilion.example.com'
      );
    `);
    console.log('✓ Seeded hospitals');
  }

  // 8. Seed Doctors if empty
  const docCount = await sql.query('SELECT count(*) FROM doctors');
  if (parseInt(docCount[0].count, 10) === 0) {
    console.log('Seeding verified medical specialists...');
    const hospitals = await sql.query('SELECT id, name FROM hospitals LIMIT 3');
    const h1 = hospitals[0] ? `'${hospitals[0].id}'` : 'NULL';
    const h2 = hospitals[1] ? `'${hospitals[1].id}'` : 'NULL';
    const h3 = hospitals[2] ? `'${hospitals[2].id}'` : 'NULL';

    await sql.query(`
      INSERT INTO doctors (name, slug, specialization, hospital_name, hospital_id, qualifications, experience_years, bio, photo_url, is_verified, is_sponsored, city)
      VALUES 
      (
        'Dr. Arvind Deshmukh',
        'dr-arvind-deshmukh',
        'Cardiologist & Electrophysiologist',
        'Apex Heart & Vascular Institute',
        ${h1},
        'MD, DM (Cardiology), FACC (USA)',
        18,
        'Dr. Arvind Deshmukh is a senior interventional cardiologist with over 18 years of clinical experience specializing in complex coronary interventions, arrhythmia management, and heart failure prevention.',
        'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
        TRUE,
        FALSE,
        'New Delhi'
      ),
      (
        'Dr. Rohini Ramanathan',
        'dr-rohini-ramanathan',
        'Consultant Medical Oncologist',
        'National Cancer Research & Care Centre',
        ${h2},
        'MBBS, MD, DNB (Medical Oncology), ESMO Certified',
        14,
        'Dr. Rohini Ramanathan leads the precision oncology task force, focusing on early breast cancer diagnostics, biomarker targeted therapies, and immune checkpoint inhibitors.',
        'https://images.unsplash.com/photo-1594824813580-0a75f0f3531b?auto=format&fit=crop&w=400&q=80',
        TRUE,
        TRUE,
        'Bengaluru'
      ),
      (
        'Dr. Vikramaditya Sen',
        'dr-vikramaditya-sen',
        'Chief Pediatrician & Neonatologist',
        'St. Jude Children''s Medical Pavilion',
        ${h3},
        'MD (Pediatrics), Fellowship in Neonatal Intensive Care',
        16,
        'Dr. Vikramaditya Sen specializes in pediatric developmental milestones, newborn respiratory distress syndrome, and evidence-based pediatric nutrition.',
        'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
        TRUE,
        FALSE,
        'Mumbai'
      ),
      (
        'Dr. Meera Nambiar',
        'dr-meera-nambiar',
        'Endocrinologist & Diabetologist',
        'Apex Heart & Vascular Institute',
        ${h1},
        'MD, DM (Endocrinology), FRCP (Edin)',
        15,
        'Dr. Meera Nambiar is a renowned diabetologist championing early metabolic screening, continuous glucose monitoring (CGM) systems, and dietary reversal protocols for Type 2 diabetes.',
        'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
        TRUE,
        FALSE,
        'New Delhi'
      );
    `);
    console.log('✓ Seeded doctors');
  }

  // 9. Seed Doctor Interviews if empty
  const intCount = await sql.query('SELECT count(*) FROM doctor_interviews');
  if (parseInt(intCount[0].count, 10) === 0) {
    console.log('Seeding doctor interviews...');
    const doctors = await sql.query('SELECT id, name, specialization, hospital_name, hospital_id FROM doctors');
    if (doctors.length > 0) {
      const d1 = doctors[0];
      const d2 = doctors[1];
      const d3 = doctors[2] || doctors[0];

      await sql.query(`
        INSERT INTO doctor_interviews (doctor_id, hospital_id, title, slug, summary, key_points, transcript, youtube_video_id, cover_image_url, category, is_featured, is_sponsored)
        VALUES 
        (
          '${d1.id}',
          ${d1.hospital_id ? `'${d1.hospital_id}'` : 'NULL'},
          'Understanding Early Warning Signs of Heart Disease in Your 30s and 40s',
          'understanding-early-signs-heart-disease-dr-arvind',
          'Dr. Arvind Deshmukh breaks down the subtle cardiovascular symptoms that young adults routinely dismiss, from sudden exertional fatigue to atypical angina, and explains how early calcium scoring saves lives.',
          ARRAY[
            'Atypical angina frequently presents as jaw, neck, or left shoulder tightness without overt chest squeezing.',
            'High-sensitivity C-reactive protein (hs-CRP) and ApoB are critical baseline tests alongside standard lipid panels.',
            '30 minutes of moderate aerobic exertion 5 days a week reduces sudden cardiac events by up to 48%.',
            'Family history warrants cardiac screening beginning at age 25 rather than age 40.'
          ],
          'Full transcript: Exertional shortness of breath, unexplained indigestion after stairs, and cold sweats during mild exertion are hallmark warning signs that necessitate urgent electrocardiographic and echocardiographic evaluation...',
          '5acabfc8-69dc-4202-88c9-46be8df765c8',
          'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
          'Heart Health',
          TRUE,
          FALSE
        ),
        (
          '${d2.id}',
          ${d2.hospital_id ? `'${d2.hospital_id}'` : 'NULL'},
          'The Revolution in Early Cancer Detection: Liquid Biopsy & Biomarker Screening',
          'early-cancer-detection-liquid-biopsy-dr-rohini',
          'Dr. Rohini Ramanathan discusses breakthroughs in circulating tumor DNA (ctDNA) technology, genomic risk stratification, and why early detection converts terminal prognoses into treatable scenarios.',
          ARRAY[
            'Liquid biopsies can detect cancer DNA fragments in peripheral blood months before radiological evidence appears.',
            'Targeted immunotherapies are replacing traditional chemotherapeutic toxicities in triple-negative cases.',
            'Routine screening protocols (Mammography, Pap smears, Colonoscopies) remain the bedrock of early survival.'
          ],
          'Full transcript: The shift from late-stage systemic therapy to molecular interception before clinical metastasis is the biggest victory in oncology over the past decade...',
          '275673c7-89ad-478e-8b32-2ef8b8e3cbcf',
          'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80',
          'Cancer',
          TRUE,
          TRUE
        ),
        (
          '${d3.id}',
          ${d3.hospital_id ? `'${d3.hospital_id}'` : 'NULL'},
          'Pediatric Immune Resilience: Seasonal Allergies vs Early Infections in Children',
          'pediatric-immune-resilience-dr-sen',
          'Dr. Vikramaditya Sen provides practical guidance for parents on distinguishing upper respiratory infections, allergic rhinitis, and the critical role of gut microbiome diversity in early childhood immunity.',
          ARRAY[
            'Avoid immediate antibiotic usage for self-limiting viral fevers during the first 72 hours.',
            'Diverse whole-food dietary fiber establishes protective gut bifidobacteria by age 3.',
            'Warning flags for pediatric dehydration include dry mucosa, tearless crying, and lethargy.'
          ],
          'Full transcript: Many childhood respiratory illnesses are natural immunological training sessions, provided hydration and breathing dynamics are continuously monitored...',
          '5acabfc8-69dc-4202-88c9-46be8df765c8',
          'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
          'Pediatrics',
          FALSE,
          FALSE
        );
      `);
      console.log('✓ Seeded doctor interviews');
    }
  }

  // 10. Seed Health Poll if empty
  const pollCount = await sql.query('SELECT count(*) FROM health_polls');
  if (parseInt(pollCount[0].count, 10) === 0) {
    console.log('Seeding interactive health poll...');
    const newPoll = await sql.query(`
      INSERT INTO health_polls (question, category, is_active)
      VALUES ('On average, how many hours of restorative sleep do you get each night?', 'Sleep & Recovery', TRUE)
      RETURNING id;
    `);
    const pollId = newPoll[0].id;
    await sql.query(`
      INSERT INTO health_poll_options (poll_id, option_text, votes_count, display_order)
      VALUES 
      ('${pollId}', 'Less than 5 hours (Chronic sleep deficit)', 142, 1),
      ('${pollId}', '5 to 6 hours (Mildly sub-optimal)', 389, 2),
      ('${pollId}', '7 to 8 hours (Recommended restorative)', 814, 3),
      ('${pollId}', 'More than 8 hours (Extended recovery)', 198, 4);
    `);
    console.log('✓ Seeded health poll and options');
  }

  // 11. Seed Core Health News
  console.log('Verifying core health news items...');
  const sampleNews = [
    {
      title: 'New Research Offers Fresh Insights Into Early Cancer Detection via MicroRNA Blood Panels',
      slug: 'new-research-early-cancer-detection-microrna',
      category: 'Cancer',
      subcategory: 'Oncology Research',
      content_type: 'news',
      excerpt: 'A multi-centre clinical trial spanning 12,000 participants shows an 89% sensitivity rate in pinpointing stage-1 malignancies through specialized circulating microRNA signatures.',
      description: 'Researchers have validated an innovative liquid biopsy assay capable of identifying trace tumor biomarkers up to 18 months prior to radiographic visibility on standard CT or MRI screenings.',
      author_name: 'Dr. Rohini Ramanathan',
      source_name: 'National Cancer Institute Journal',
      image_url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80',
      is_breaking: true,
      is_featured: true,
      is_trending: true,
      is_editor_pick: true,
      quality_score: 9.8
    },
    {
      title: 'Large-Scale Cardiovascular Study Explores Novel Biomarkers for Premature Coronary Plaque',
      slug: 'cardiovascular-study-explores-novel-biomarkers-plaque',
      category: 'Heart',
      subcategory: 'Cardiology',
      content_type: 'news',
      excerpt: 'European Heart Journal findings demonstrate that combining ApoB testing with coronary artery calcium scanning provides twice the predictive accuracy of conventional LDL cholesterol metrics.',
      description: 'The landmark 10-year observational study tracked over 25,000 asymptomatic individuals aged 35 to 55, confirming that subclinical vascular inflammation accelerates plaque calcification years before overt symptoms emerge.',
      author_name: 'Dr. Arvind Deshmukh',
      source_name: 'European Heart Journal',
      image_url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80',
      is_breaking: true,
      is_featured: true,
      is_trending: true,
      is_editor_pick: true,
      quality_score: 9.6
    },
    {
      title: 'Continuous Glucose Monitoring In Non-Diabetics Reveals Metabolic Spikes From Refined Carbohydrates',
      slug: 'continuous-glucose-monitoring-non-diabetics-metabolic-spikes',
      category: 'Diabetes',
      subcategory: 'Metabolic Health',
      content_type: 'news',
      excerpt: 'Clinical data published in Cell Metabolism indicates that postprandial glucose volatility in healthy adults is significantly more pervasive than previously captured by fasting insulin tests alone.',
      description: 'Metabolic specialists advocate for personalized chrononutrition and post-meal ambulatory walks, which cut blood glucose excursions by upwards of 34% across monitored cohort groups.',
      author_name: 'Dr. Meera Nambiar',
      source_name: 'Cell Metabolism',
      image_url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
      is_breaking: false,
      is_featured: true,
      is_trending: true,
      is_editor_pick: true,
      quality_score: 9.4
    },
    {
      title: 'WHO Releases Global Guidance on Maternal Iron Deficiency and Postpartum Mental Wellness',
      slug: 'who-releases-global-guidance-maternal-iron-postpartum',
      category: 'Women\'s Health',
      subcategory: 'Maternal Wellness',
      content_type: 'news',
      excerpt: 'The World Health Organization emphasizes updated ferritin thresholds and comprehensive psychological screening throughout the fourth trimester to combat postpartum depression.',
      description: 'The advisory links chronic antenatal iron depletion with neurochemical fatigue and heightened susceptibility to perinatal mood disorders, highlighting proactive micronutrient optimization.',
      author_name: 'Editorial Staff',
      source_name: 'World Health Organization (WHO)',
      image_url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80',
      is_breaking: true,
      is_featured: true,
      is_trending: true,
      is_editor_pick: false,
      quality_score: 9.5
    },
    {
      title: 'Pediatric Screen Time Thresholds Correlated With Deep Sleep Latency and Cognitive Attention',
      slug: 'pediatric-screen-time-thresholds-deep-sleep-latency',
      category: 'Pediatrics',
      subcategory: 'Child Development',
      content_type: 'news',
      excerpt: 'American Academy of Pediatrics study shows that interactive blue-light exposure within 90 minutes of bedtime delays melatonin onset in school-age children by an average of 42 minutes.',
      description: 'Pediatricians recommend establishing digital-free bedtime routines and morning natural light exposure to synchronize circadian rhythms and enhance classroom attention spans.',
      author_name: 'Dr. Vikramaditya Sen',
      source_name: 'Pediatrics Journal',
      image_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
      is_breaking: false,
      is_featured: true,
      is_trending: false,
      is_editor_pick: true,
      quality_score: 9.1
    },
    {
      title: 'Neuroimaging Confirms Mindful Breathwork and Vagal Nerve Stimulation Reduce Cortisol By 38%',
      slug: 'neuroimaging-confirms-mindful-breathwork-cortisol-reduction',
      category: 'Mental Health',
      subcategory: 'Neuroscience',
      content_type: 'news',
      excerpt: 'Functional MRI scans conducted at Harvard Medical School reveal immediate dampening of amygdala hyperactivity during cyclical physiological sigh breathwork protocols.',
      description: 'Neuroscientists demonstrate that conscious extension of the exhalation phase stimulates parasympathetic vagal tone, triggering rapid reduction in systemic inflammatory markers.',
      author_name: 'HealthGhuru Medical Advisory',
      source_name: 'Harvard Health Publishing',
      image_url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
      is_breaking: false,
      is_featured: true,
      is_trending: true,
      is_editor_pick: true,
      quality_score: 9.3
    },
    {
      title: 'Zone-2 Aerobic Conditioning Proven To Maximize Mitochondrial Density and Insulin Sensitivity',
      slug: 'zone-2-aerobic-conditioning-mitochondrial-density',
      category: 'Fitness',
      subcategory: 'Exercise Physiology',
      content_type: 'news',
      excerpt: 'New exercise physiology trials highlight that low-to-moderate steady-state endurance training is the single most potent stimulus for cellular lactate clearance and lipid oxidation.',
      description: 'Athletic medicine specialists recommend dedicating 70-80% of weekly training volume to Zone-2 intensity, which protects cardiac microvasculature while minimizing chronic joint wear.',
      author_name: 'Sports Medicine Review',
      source_name: 'British Journal of Sports Medicine',
      image_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
      is_breaking: false,
      is_featured: true,
      is_trending: false,
      is_editor_pick: false,
      quality_score: 8.9
    },
    {
      title: 'Fermented Foods vs Synthetic Probiotics: Microbiome Diversity Study Shows Surprising Results',
      slug: 'fermented-foods-vs-synthetic-probiotics-microbiome-study',
      category: 'Nutrition',
      subcategory: 'Gastroenterology',
      content_type: 'news',
      excerpt: 'Stanford clinical trial compares daily intake of kefir, kimchi, and fermented vegetables against concentrated multi-strain probiotic capsules over a 16-week intervention.',
      description: 'Participants consuming whole fermented foods demonstrated sustained colonization of 19 beneficial bacterial strains and marked reduction in 16 circulating inflammatory cytokines.',
      author_name: 'Clinical Nutrition Group',
      source_name: 'Cell Reports',
      image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80',
      is_breaking: false,
      is_featured: true,
      is_trending: true,
      is_editor_pick: true,
      quality_score: 9.5
    }
  ];

  for (const item of sampleNews) {
    const existing = await sql.query(`SELECT id FROM content_items WHERE slug = '${item.slug}'`);
    if (existing.length === 0) {
      await sql.query(`
        INSERT INTO content_items (
          title, slug, category, subcategory, content_type, excerpt, description,
          author_name, image_url, is_breaking, is_featured, is_trending, is_editor_pick,
          quality_score, status, published_at, view_count, click_count, share_count
        ) VALUES (
          '${item.title.replace(/'/g, "''")}',
          '${item.slug}',
          '${item.category.replace(/'/g, "''")}',
          '${item.subcategory.replace(/'/g, "''")}',
          '${item.content_type}',
          '${item.excerpt.replace(/'/g, "''")}',
          '${item.description.replace(/'/g, "''")}',
          '${item.author_name.replace(/'/g, "''")}',
          '${item.image_url}',
          ${item.is_breaking},
          ${item.is_featured},
          ${item.is_trending},
          ${item.is_editor_pick},
          ${item.quality_score},
          'published',
          NOW(),
          1420,
          310,
          84
        );
      `);
      console.log('✓ Added core news story:', item.slug);
    } else {
      await sql.query(`
        UPDATE content_items 
        SET is_breaking = ${item.is_breaking}, 
            is_featured = ${item.is_featured}, 
            is_trending = ${item.is_trending},
            is_editor_pick = ${item.is_editor_pick},
            status = 'published'
        WHERE slug = '${item.slug}';
      `);
      console.log('✓ Updated core news story:', item.slug);
    }
  }

  // 12. Ensure Advertisement Banners
  const adBanners = [
    {
      title: 'Apex Hospital Cardiac Screening Package',
      placement: 'top_banner',
      headline: 'Apex Heart & Vascular Institute — Comprehensive 64-Slice Cardiac CT & Lipid Panel',
      description: 'Early coronary screening saves lives. Book an advanced preventive cardiac consultation today.',
      cta_text: 'Book Consultation',
      target_url: '/hospitals/apex-heart-vascular-institute',
      image_url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80',
      category: 'Heart',
      is_active: true
    },
    {
      title: 'National Cancer Research Early Screening',
      placement: 'header_banner',
      headline: 'National Cancer Institute — Molecular Biomarker & Genomic Risk Consultation',
      description: 'Accredited multi-specialty oncology panels with leading clinical researchers.',
      cta_text: 'Schedule Evaluation',
      target_url: '/hospitals/national-cancer-research-care-centre',
      image_url: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=728&q=80',
      category: 'Cancer',
      is_active: true
    }
  ];

  for (const ad of adBanners) {
    const existing = await sql.query(`SELECT id FROM advertisements WHERE title = '${ad.title.replace(/'/g, "''")}'`);
    if (existing.length === 0) {
      await sql.query(`
        INSERT INTO advertisements (title, placement, headline, description, cta_text, target_url, image_url, category, is_active, impressions_count, clicks_count)
        VALUES (
          '${ad.title.replace(/'/g, "''")}',
          '${ad.placement}',
          '${ad.headline.replace(/'/g, "''")}',
          '${ad.description.replace(/'/g, "''")}',
          '${ad.cta_text}',
          '${ad.target_url}',
          '${ad.image_url}',
          '${ad.category}',
          ${ad.is_active},
          3200,
          184
        );
      `);
      console.log('✓ Added advertisement banner:', ad.placement);
    }
  }

  console.log('--- HealthGhuru News Portal DB Setup Complete! ---');
  process.exit(0);
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
