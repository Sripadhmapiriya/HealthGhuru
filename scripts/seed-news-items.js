const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not defined');
}

const sql = neon(process.env.DATABASE_URL);

async function main() {
  console.log('--- Seeding core news items and ad banners ---');

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
    const canonical = `https://healthghuru.com/article/${item.slug}`;
    const existing = await sql.query(`SELECT id FROM content_items WHERE slug = '${item.slug}'`);
    if (existing.length === 0) {
      await sql.query(`
        INSERT INTO content_items (
          title, slug, category, subcategory, content_type, excerpt, description,
          author_name, canonical_url, image_url, is_breaking, is_featured, is_trending, is_editor_pick,
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
          '${canonical}',
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

  // Ensure Advertisement Banners
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

  console.log('--- Seeding Completed! ---');
  process.exit(0);
}

main().catch((err) => {
  console.error('Seeding error:', err);
  process.exit(1);
});
