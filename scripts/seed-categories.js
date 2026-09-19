const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const sql = neon(process.env.DATABASE_URL);

const defaultCategories = [
  { name: 'Cancer', slug: 'cancer', description: 'Oncology, clinical trials, and cancer prevention research', icon: 'Activity', order: 1 },
  { name: 'Heart Health', slug: 'heart', description: 'Cardiovascular wellness, cardiology, and arterial health', icon: 'Heart', order: 2 },
  { name: 'Diabetes', slug: 'diabetes', description: 'Blood sugar regulation, insulin sensitivity, and endocrinology', icon: 'Droplets', order: 3 },
  { name: "Women's Health", slug: 'womens-health', description: 'Hormonal balance, fertility, maternal care, and wellness', icon: 'User', order: 4 },
  { name: 'Pediatrics', slug: 'pediatrics', description: 'Child health, developmental milestones, and pediatric care', icon: 'Baby', order: 5 },
  { name: 'Mental Health', slug: 'mental-health', description: 'Mindfulness, anxiety reduction, stress management, and psychiatry', icon: 'Brain', order: 6 },
  { name: 'Fitness', slug: 'fitness', description: 'Strength training, cardio, mobility, and functional workouts', icon: 'Dumbbell', order: 7 },
  { name: 'Nutrition', slug: 'nutrition', description: 'Dietetics, superfoods, gut microbiome, and meal plans', icon: 'Apple', order: 8 },
  { name: 'Ayurveda', slug: 'ayurveda', description: 'Traditional holistic healing, doshas, herbs, and natural therapies', icon: 'Leaf', order: 9 },
  { name: 'Sleep', slug: 'sleep', description: 'Circadian rhythm, recovery, sleep hygiene, and insomnia management', icon: 'Moon', order: 10 },
  { name: 'Medical Research', slug: 'medical-research', description: 'Clinical breakthroughs, peer-reviewed findings, and drug discovery', icon: 'Microscope', order: 11 },
  { name: 'Preventive Care', slug: 'preventive-care', description: 'Screenings, early diagnostics, vaccines, and longevity habits', icon: 'ShieldCheck', order: 12 },
  { name: 'Gut Health', slug: 'gut-health', description: 'Microbiome diversity, probiotics, digestive wellness', icon: 'Activity', order: 13 },
  { name: 'Immunity', slug: 'immunity', description: 'Immune defense, antioxidants, and disease resilience', icon: 'Sparkles', order: 14 },
  { name: 'Healthy Aging', slug: 'healthy-aging', description: 'Longevity science, cellular vitality, and cognitive health', icon: 'Clock', order: 15 },
  { name: 'Weight Management', slug: 'weight-management', description: 'Metabolism optimization and sustainable body composition', icon: 'Scale', order: 16 },
  { name: 'Men\'s Health', slug: 'mens-health', description: 'Vitality, testosterone health, and men\'s preventative care', icon: 'UserCheck', order: 17 },
  { name: 'Diseases & Conditions', slug: 'diseases-conditions', description: 'Chronic illness management, symptom guides, and treatments', icon: 'AlertCircle', order: 18 },
  { name: 'Wellness', slug: 'wellness', description: 'Holistic lifestyle, hydration, meditation, and healthy habits', icon: 'Leaf', order: 19 }
];

async function seed() {
  for (const cat of defaultCategories) {
    await sql`
      INSERT INTO content_categories (id, name, slug, description, icon_name, display_order, is_enabled)
      VALUES (gen_random_uuid(), ${cat.name}, ${cat.slug}, ${cat.description}, ${cat.icon}, ${cat.order}, true)
      ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        display_order = EXCLUDED.display_order;
    `;
  }
  const all = await sql`SELECT name, slug, display_order FROM content_categories ORDER BY display_order ASC, name ASC`;
  console.log('Categories synced total:', all.length);
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
