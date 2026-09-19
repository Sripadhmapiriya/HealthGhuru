const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const sql = neon(process.env.DATABASE_URL);

const INITIAL_PAGES = [
  {
    slug: 'about-us',
    title: 'About Us',
    subtitle: 'Manage and publish information about HealthGhuru',
    meta_description: 'HealthGhuru is an evidence-based digital health intelligence platform providing verified medical news, doctor directories, and clinical wellness guides.',
    content: `<h2>About HealthGhuru</h2>
<p><strong>HealthGhuru</strong> is a premier evidence-based digital healthcare news and wellness intelligence platform. In an era saturated with confusing wellness trends and unverified medical claims, HealthGhuru provides a reliable, clinically verified sanctuary of actionable health information for patients, healthcare professionals, and wellness enthusiasts.</p>

<h3>Our Core Mission</h3>
<p>Our primary mission is to empower individuals worldwide to make informed, proactive decisions about their health and longevity. We bridge the gap between complex medical research and everyday lifestyle management across six clinical pillars: <em>Cardiology, Oncology, Metabolic Health (Diabetes), Women's & Maternal Health, Pediatrics, and Mental Wellness</em>.</p>

<h3>Medical Review & Editorial Principles</h3>
<ul>
  <li><strong>Evidence-First Journalism:</strong> Every article and research summary is grounded in peer-reviewed clinical studies published in accredited journals such as <em>The Lancet, NEJM, JAMA, and PubMed</em>.</li>
  <li><strong>Certified Medical Review Board:</strong> Our content undergoes thorough multi-stage clinical review by practicing physicians, licensed dietitians, and accredited specialists.</li>
  <li><strong>Uncompromising Independence:</strong> Editorial decisions are strictly firewalled from commercial sponsorships and advertiser interests. Sponsored articles are always prominently marked with transparent disclosures.</li>
  <li><strong>Clinical Accuracy & Regular Updates:</strong> Medical guidelines evolve rapidly. We continuously audit our clinical archives to ensure advice reflects current clinical protocols.</li>
</ul>

<h3>Our Vision for Modern Healthcare</h3>
<p>We envision a future where high-quality preventive health guidance is accessible to everyone, regardless of geography. By combining empathetic storytelling, interactive health calculators, verified doctor directories, and real-time medical breakthroughs, HealthGhuru empowers millions to live healthier, stronger, and more resilient lives every day.</p>`
  },
  {
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    subtitle: 'Manage and publish HealthGhuru data privacy and protection guidelines',
    meta_description: 'HealthGhuru Privacy Policy detailing our patient-grade data security, zero data monetization promise, and GDPR/CCPA compliance.',
    content: `<h2>HealthGhuru Privacy & Data Ethics Policy</h2>
<p>At <strong>HealthGhuru</strong>, we treat your personal health and wellness data with the highest degree of confidentiality and respect. We firmly believe that your personal health records, wellness logs, and research interests belong solely to you.</p>

<h3>1. Our Core Privacy Commitments</h3>
<ul>
  <li><strong>Zero Data Monetization:</strong> We NEVER sell, lease, or rent your personal health data, reading habits, or contact information to data brokers, pharmaceutical advertisers, or third-party marketers.</li>
  <li><strong>Patient-Grade Security:</strong> All user communications, subscription records, and profile details are encrypted in transit using modern TLS 1.3 encryption and stored with robust database safeguards.</li>
  <li><strong>User Autonomy & Control:</strong> You maintain complete ownership of your account data. You can request a full data export or permanent deletion of your account at any time.</li>
</ul>

<h3>2. Information We Collect & How We Use It</h3>
<p>We collect limited information necessary to deliver and improve our digital health media services:</p>
<ul>
  <li><strong>Account & Subscription Data:</strong> Your name, verified email address, and encrypted credentials when registering for HealthGhuru memberships or ad-free access.</li>
  <li><strong>Inquiries & Correspondence:</strong> Communications submitted via our Contact Us form, editorial feedback channels, or advertising inquiry portals.</li>
  <li><strong>Diagnostic Analytics:</strong> Anonymized server logs and aggregated readership metrics to optimize site performance, prevent malicious activity, and ensure reliable delivery.</li>
</ul>

<h3>3. Your Legal Privacy Rights (GDPR & CCPA Compliant)</h3>
<p>Under international data protection regulations, you have the right to access, rectify, port, or request the irreversible erasure of your personal data. For privacy inquiries or data requests, contact our Data Protection Officer at <a href="mailto:privacy@healthghuru.com">privacy@healthghuru.com</a>.</p>`
  },
  {
    slug: 'terms-and-conditions',
    title: 'Terms & Conditions',
    subtitle: 'Manage and publish terms of service and platform agreements',
    meta_description: 'Official Terms of Service and user agreement for HealthGhuru platform usage, subscriptions, and intellectual property policies.',
    content: `<h2>HealthGhuru Terms of Service & User Agreement</h2>
<p>Welcome to <strong>HealthGhuru</strong>. By accessing, browsing, or registering an account on our platform, you acknowledge that you have read, understood, and agreed to be bound by the following Terms and Conditions.</p>

<h3>1. Educational Purpose & Medical Disclaimers</h3>
<p>All content published on HealthGhuru—including medical research digests, wellness articles, calculators, editorial opinions, and videos—is provided solely for <strong>informational and educational purposes</strong>. Content on this platform does not constitute personalized medical advice, clinical diagnosis, or treatment recommendations. Always consult a qualified healthcare provider regarding any personal medical condition.</p>

<h3>2. User Conduct & Responsible Usage</h3>
<p>When interacting with HealthGhuru, users agree not to:</p>
<ul>
  <li>Distribute unverified medical misinformation or fraudulent health remedies.</li>
  <li>Attempt unauthorized automated scraping, reverse engineering, or data extraction without express written permission.</li>
  <li>Impersonate healthcare professionals, licensed physicians, or HealthGhuru staff members.</li>
  <li>Circumvent or tamper with platform security, subscriber access controls, or advertising systems.</li>
</ul>

<h3>3. Intellectual Property & Syndication Rights</h3>
<p>All original editorial text, graphics, proprietary layouts, and branding on HealthGhuru are the protected intellectual property of HealthGhuru. Accredited syndication summaries from partner institutions (such as Mayo Clinic, Harvard Health, PubMed) are cited with proper attribution.</p>

<h3>4. Subscriptions & Billing</h3>
<p>VIP Memberships and ad-free access tiers are billed in advance according to the selected billing cycle. Subscribers may cancel recurring plans at any time via their Account Settings with benefits remaining active through the current paid term.</p>`
  },
  {
    slug: 'disclaimer',
    title: 'Disclaimer',
    subtitle: 'Manage and publish medical and clinical advice disclaimers',
    meta_description: 'Essential Medical Disclaimer regarding HealthGhuru clinical content, educational nature, and emergency healthcare contacts.',
    content: `<h2>Medical & Clinical Advice Disclaimer</h2>
<p class="highlight"><strong>IMPORTANT NOTICE:</strong> HealthGhuru is an educational digital media portal. The content provided on this website is NOT intended to be a substitute for professional medical advice, clinical diagnosis, or medical treatment.</p>

<h3>1. No Doctor-Patient Relationship</h3>
<p>Viewing articles, utilizing health calculators, reading clinical summaries, or contacting HealthGhuru staff does not establish a doctor-patient relationship. Always seek the direct guidance of your physician, licensed specialist, or qualified health practitioner with any questions you may have regarding symptoms, medications, or therapeutic regimens.</p>

<h3>2. Do Not Delay Seeking Care</h3>
<p>Never disregard professional medical advice or delay seeking clinical attention because of something you have read, watched, or calculated on HealthGhuru.</p>

<h3>3. Immediate Medical Emergencies</h3>
<p>If you believe you or someone in your care may be experiencing a medical emergency (such as severe chest pain, acute shortness of breath, signs of stroke, severe allergic reaction, or sudden trauma):</p>
<ul>
  <li><strong>Immediately call your local emergency medical services (112 / 911 / 108).</strong></li>
  <li>Proceed immediately to the nearest hospital emergency department or urgent care facility.</li>
  <li>Do not rely on digital media or wait for online responses in acute health emergencies.</li>
</ul>

<h3>4. Third-Party Products & Advertising</h3>
<p>Advertisements, sponsored partner articles, and directory listings featured on HealthGhuru do not constitute an endorsement, warranty, or clinical guarantee of any third-party medical product, pharmaceutical, device, or facility.</p>`
  },
  {
    slug: 'contact-us',
    title: 'Contact Us',
    subtitle: 'Manage and publish official contact details, editorial channels, and response guidelines',
    meta_description: 'Official contact information, editorial department emails, and corporate headquarters for HealthGhuru.',
    content: `<h2>Contact HealthGhuru</h2>
<p>We welcome questions, editorial feedback, syndication inquiries, and clinical partnership proposals from readers, healthcare providers, and media organizations worldwide.</p>

<h3>Corporate & Editorial Headquarters</h3>
<ul>
  <li><strong>Organization:</strong> HealthGhuru Media Network</li>
  <li><strong>Email (General & Editorial):</strong> <a href="mailto:info@healthghuru.in">info@healthghuru.in</a></li>
  <li><strong>Email (Sponsorships & Ads):</strong> <a href="mailto:advertise@healthghuru.com">advertise@healthghuru.com</a></li>
  <li><strong>Email (Privacy & Legal):</strong> <a href="mailto:legal@healthghuru.com">legal@healthghuru.com</a></li>
  <li><strong>Headquarters Address:</strong> Chennai, Tamil Nadu, India</li>
  <li><strong>Standard Response Time:</strong> Within 24–48 Business Hours</li>
</ul>

<h3>Editorial Corrections & Clinical Fact-Checking</h3>
<p>If you identify an outdated citation, factual inaccuracy, or typographical error in any published health article, please notify our editorial board at <a href="mailto:editorial@healthghuru.com">editorial@healthghuru.com</a> with the article URL and verified source citation. Our medical team audits and updates flagged stories promptly.</p>`
  },
  {
    slug: 'advertise-with-us',
    title: 'Advertise With Us',
    subtitle: 'Manage and publish advertiser media kit, guidelines, and hospital partner info',
    meta_description: 'Partner with HealthGhuru to connect with high-intent health-conscious audiences, healthcare professionals, and wellness decision-makers.',
    content: `<h2>Partner & Advertise with HealthGhuru</h2>
<p>HealthGhuru connects ethical healthcare organizations, accredited hospitals, diagnostic laboratories, wellness innovators, and medical technology leaders with an engaged, high-intent audience seeking verified health intelligence.</p>

<h3>Why Partner with HealthGhuru?</h3>
<ul>
  <li><strong>High-Intent Demographic:</strong> Reach readers actively researching cardiology breakthroughs, diabetes management, oncology therapies, nutrition, and preventive wellness.</li>
  <li><strong>Brand Safety & Clinical Credibility:</strong> Your organization is showcased in a clinically vetted, premium editorial environment free from low-quality clickbait.</li>
  <li><strong>Multi-Format Campaign Options:</strong> High-impact Leaderboard Banners (728x90), Sidebar Sticky Units (300x250 / 300x600), Sponsored Editorial Features, and Featured Doctor/Hospital Directory Listings.</li>
  <li><strong>Transparent Performance Analytics:</strong> Real-time impression tracking, verified click-through analytics, and dedicated campaign management portals.</li>
</ul>

<h3>Advertising Standards & Ethical Guidelines</h3>
<p>To preserve reader trust, all advertising campaigns must adhere strictly to HealthGhuru's Advertising Acceptance Guidelines. We strictly prohibit misleading claims, unverified dietary supplements, predatory medical loans, or deceptive practices. To launch or request a custom campaign proposal, visit our <a href="/advertise">Advertiser Partner Portal</a> or contact our sponsorships team at <a href="mailto:advertise@healthghuru.com">advertise@healthghuru.com</a>.</p>`
  }
];

async function migrate() {
  console.log('Creating website_pages table...');
  await sql`
    CREATE TABLE IF NOT EXISTS website_pages (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      slug VARCHAR(100) UNIQUE NOT NULL,
      title VARCHAR(255) NOT NULL,
      subtitle TEXT,
      content TEXT NOT NULL,
      meta_description TEXT,
      published_by VARCHAR(255) DEFAULT 'Super Admin',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_website_pages_slug ON website_pages(slug);
  `;

  console.log('Seeding / updating initial website pages...');
  for (const page of INITIAL_PAGES) {
    await sql`
      INSERT INTO website_pages (slug, title, subtitle, content, meta_description, published_by, updated_at, published_at)
      VALUES (
        ${page.slug},
        ${page.title},
        ${page.subtitle},
        ${page.content},
        ${page.meta_description},
        'Super Admin',
        NOW(),
        NOW()
      )
      ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title,
        subtitle = EXCLUDED.subtitle,
        content = EXCLUDED.content,
        meta_description = EXCLUDED.meta_description,
        updated_at = NOW();
    `;
    console.log(`✓ Seeded page: ${page.slug} (${page.title})`);
  }

  console.log('website_pages migration and seeding completed successfully!');
}

migrate().catch(err => {
  console.error('Migration error:', err);
  process.exit(1);
});
