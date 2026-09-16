/* eslint-disable @typescript-eslint/no-explicit-any */
import { sql } from '@/lib/db';
import { BreakingNewsTicker } from '@/components/media/BreakingNewsTicker';
import { TopStoriesGrid } from '@/components/home/TopStoriesGrid';
import { LatestNewsFeed } from '@/components/home/LatestNewsFeed';
import { CategorySectionBlock } from '@/components/home/CategorySectionBlock';
import { VisualStoriesSection } from '@/components/home/VisualStoriesSection';
import { DoctorInterviewsSection } from '@/components/home/DoctorInterviewsSection';
import { HealthVideosShortsSection } from '@/components/home/HealthVideosShortsSection';
import { MedicalResearchSection } from '@/components/home/MedicalResearchSection';
import { EditorsPicksMostRead } from '@/components/home/EditorsPicksMostRead';
import { HealthPollWidget } from '@/components/home/HealthPollWidget';
import { HealthMagazinesSection } from '@/components/home/HealthMagazinesSection';
import { SponsoredEditorialSection } from '@/components/home/SponsoredEditorialSection';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  // Execute database queries in parallel for instant server-rendering performance
  const [
    breakingNews,
    topItems,
    trendingItems,
    latestNews,
    cancerNews,
    heartNews,
    diabetesNews,
    womensHealthNews,
    pediatricsNews,
    mentalHealthNews,
    fitnessNews,
    nutritionNews,
    researchNews,
    doctorInterviews,
    videoItems,
    shortItems,
    editorPicks,
    mostReadItems,
    pollRes,
    pollOptionsRes,
    magazines
  ] = await Promise.all([
    // 1. Breaking News
    sql`
      SELECT id, title, slug, category, canonical_url, is_external,
             (SELECT name FROM content_sources WHERE id = content_items.source_id) as source_name
      FROM content_items
      WHERE is_breaking = TRUE AND status = 'published' AND deleted_at IS NULL
      ORDER BY published_at DESC
      LIMIT 6
    `,

    // 2. Top Stories (Hero & middle column)
    sql`
      SELECT i.*, s.name as source_name
      FROM content_items i
      LEFT JOIN content_sources s ON i.source_id = s.id
      WHERE i.status = 'published' AND i.deleted_at IS NULL
      ORDER BY (i.is_featured::int * 10 + i.quality_score) DESC, i.published_at DESC
      LIMIT 6
    `,

    // 3. Trending 01-05
    sql`
      SELECT i.*, s.name as source_name
      FROM content_items i
      LEFT JOIN content_sources s ON i.source_id = s.id
      WHERE i.status = 'published' AND i.deleted_at IS NULL
      ORDER BY (i.is_trending::int * 5 + i.click_count + i.view_count) DESC, i.published_at DESC
      LIMIT 6
    `,

    // 4. Latest News Feed
    sql`
      SELECT i.*, s.name as source_name
      FROM content_items i
      LEFT JOIN content_sources s ON i.source_id = s.id
      WHERE i.status = 'published' AND i.deleted_at IS NULL
      ORDER BY i.published_at DESC
      LIMIT 20
    `,

    // 5. Cancer
    sql`
      SELECT i.*, s.name as source_name
      FROM content_items i
      LEFT JOIN content_sources s ON i.source_id = s.id
      WHERE LOWER(i.category) LIKE '%cancer%' AND i.status = 'published' AND i.deleted_at IS NULL
      ORDER BY i.published_at DESC
      LIMIT 4
    `,

    // 6. Heart Health
    sql`
      SELECT i.*, s.name as source_name
      FROM content_items i
      LEFT JOIN content_sources s ON i.source_id = s.id
      WHERE LOWER(i.category) LIKE '%heart%' AND i.status = 'published' AND i.deleted_at IS NULL
      ORDER BY i.published_at DESC
      LIMIT 4
    `,

    // 7. Diabetes
    sql`
      SELECT i.*, s.name as source_name
      FROM content_items i
      LEFT JOIN content_sources s ON i.source_id = s.id
      WHERE LOWER(i.category) LIKE '%diabet%' AND i.status = 'published' AND i.deleted_at IS NULL
      ORDER BY i.published_at DESC
      LIMIT 4
    `,

    // 8. Women's Health
    sql`
      SELECT i.*, s.name as source_name
      FROM content_items i
      LEFT JOIN content_sources s ON i.source_id = s.id
      WHERE (LOWER(i.category) LIKE '%women%' OR LOWER(i.category) LIKE '%maternal%') AND i.status = 'published' AND i.deleted_at IS NULL
      ORDER BY i.published_at DESC
      LIMIT 4
    `,

    // 9. Pediatrics
    sql`
      SELECT i.*, s.name as source_name
      FROM content_items i
      LEFT JOIN content_sources s ON i.source_id = s.id
      WHERE (LOWER(i.category) LIKE '%pediatric%' OR LOWER(i.category) LIKE '%child%') AND i.status = 'published' AND i.deleted_at IS NULL
      ORDER BY i.published_at DESC
      LIMIT 4
    `,

    // 10. Mental Health
    sql`
      SELECT i.*, s.name as source_name
      FROM content_items i
      LEFT JOIN content_sources s ON i.source_id = s.id
      WHERE LOWER(i.category) LIKE '%mental%' AND i.status = 'published' AND i.deleted_at IS NULL
      ORDER BY i.published_at DESC
      LIMIT 4
    `,

    // 11. Fitness & Yoga
    sql`
      SELECT i.*, s.name as source_name
      FROM content_items i
      LEFT JOIN content_sources s ON i.source_id = s.id
      WHERE (LOWER(i.category) LIKE '%fitness%' OR LOWER(i.category) LIKE '%yoga%') AND i.status = 'published' AND i.deleted_at IS NULL
      ORDER BY i.published_at DESC
      LIMIT 4
    `,

    // 12. Nutrition
    sql`
      SELECT i.*, s.name as source_name
      FROM content_items i
      LEFT JOIN content_sources s ON i.source_id = s.id
      WHERE LOWER(i.category) LIKE '%nutrition%' AND i.status = 'published' AND i.deleted_at IS NULL
      ORDER BY i.published_at DESC
      LIMIT 4
    `,

    // 13. Medical Research
    sql`
      SELECT i.*, s.name as source_name
      FROM content_items i
      LEFT JOIN content_sources s ON i.source_id = s.id
      WHERE (LOWER(i.category) LIKE '%research%' OR i.subcategory = 'Oncology Research' OR i.source_id IS NOT NULL)
        AND i.status = 'published' AND i.deleted_at IS NULL
      ORDER BY i.quality_score DESC, i.published_at DESC
      LIMIT 6
    `,

    // 14. Doctor Interviews
    sql`
      SELECT di.*, d.name as doctor_name, d.specialization as doctor_specialization, d.photo_url as doctor_photo, h.name as hospital_name
      FROM doctor_interviews di
      LEFT JOIN doctors d ON di.doctor_id = d.id
      LEFT JOIN hospitals h ON di.hospital_id = h.id
      ORDER BY di.published_at DESC
      LIMIT 3
    `,

    // 15. Videos (Full Length)
    sql`
      SELECT i.*, s.name as source_name
      FROM content_items i
      LEFT JOIN content_sources s ON i.source_id = s.id
      WHERE i.content_type = 'video' AND (i.subcategory = 'video' OR i.subcategory IS NULL) AND i.status = 'published' AND i.deleted_at IS NULL
      ORDER BY i.published_at DESC
      LIMIT 4
    `,

    // 16. Shorts
    sql`
      SELECT i.*, s.name as source_name
      FROM content_items i
      LEFT JOIN content_sources s ON i.source_id = s.id
      WHERE i.content_type = 'video' AND i.subcategory = 'short' AND i.status = 'published' AND i.deleted_at IS NULL
      ORDER BY i.published_at DESC
      LIMIT 6
    `,

    // 17. Editor's Picks
    sql`
      SELECT i.*, s.name as source_name
      FROM content_items i
      LEFT JOIN content_sources s ON i.source_id = s.id
      WHERE (i.is_editor_pick = TRUE OR i.is_featured = TRUE) AND i.status = 'published' AND i.deleted_at IS NULL
      ORDER BY i.published_at DESC
      LIMIT 4
    `,

    // 18. Most Read
    sql`
      SELECT i.*, s.name as source_name
      FROM content_items i
      LEFT JOIN content_sources s ON i.source_id = s.id
      WHERE i.status = 'published' AND i.deleted_at IS NULL
      ORDER BY i.view_count DESC, i.published_at DESC
      LIMIT 5
    `,

    // 19. Health Poll
    sql`
      SELECT * FROM health_polls WHERE is_active = TRUE ORDER BY created_at DESC LIMIT 1
    `,

    // 20. Health Poll Options
    sql`
      SELECT * FROM health_poll_options ORDER BY display_order ASC
    `,

    // 21. Magazines
    sql`
      SELECT * FROM content_items WHERE content_type = 'magazine' AND status = 'published' LIMIT 4
    `
  ]);

  // Construct Poll Data
  const pollData = pollRes.length > 0 ? {
    id: pollRes[0].id,
    question: pollRes[0].question,
    options: pollOptionsRes.filter((o: any) => o.poll_id === pollRes[0].id)
  } : undefined;

  // Hero Story split
  const featuredStory = topItems[0] || latestNews[0];
  const topStoriesList = topItems.slice(1, 5);

  return (
    <div className="w-full min-h-screen bg-surface flex flex-col">
      {/* 1. Breaking News Ticker */}
      <BreakingNewsTicker items={breakingNews.length > 0 ? breakingNews : topItems} />

      {/* 2. Homepage Hero: 3-Column Top Stories Grid (Featured + List + Trending 01-05) */}
      <TopStoriesGrid
        featuredStory={featuredStory}
        topStories={topStoriesList}
        trendingStories={trendingItems}
      />

      {/* 4. Latest Health News Feed with Category Filters & Sorting */}
      <LatestNewsFeed initialItems={latestNews} />

      {/* 5. Editorial Category Blocks */}
      <main className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-4">
        {/* CANCER */}
        <CategorySectionBlock
          title="Cancer & Oncology News"
          categorySlug="cancer"
          description="Early detection markers, genomic oncology, precision immunotherapies, and clinical patient outcomes."
          items={cancerNews.length > 0 ? cancerNews : latestNews.slice(0, 4)}
        />

        {/* HEART HEALTH */}
        <CategorySectionBlock
          title="Heart & Cardiovascular Health"
          categorySlug="heart"
          description="Preventive cardiology, coronary calcium scoring, arterial flexibility, and sudden cardiac risk prevention."
          items={heartNews.length > 0 ? heartNews : latestNews.slice(2, 6)}
        />

        {/* DIABETES */}
        <CategorySectionBlock
          title="Diabetes & Metabolic Health"
          categorySlug="diabetes"
          description="Continuous glucose monitoring, insulin sensitivity protocols, dietary reversal, and endocrinology research."
          items={diabetesNews.length > 0 ? diabetesNews : latestNews.slice(4, 8)}
        />

        {/* WOMEN'S HEALTH */}
        <CategorySectionBlock
          title="Women's Health & Maternal Wellness"
          categorySlug="womens-health"
          description="Maternal nutrition, perinatal mental health, hormonal balance, bone density, and preventative oncology."
          items={womensHealthNews.length > 0 ? womensHealthNews : latestNews.slice(1, 5)}
        />

        {/* PEDIATRICS */}
        <CategorySectionBlock
          title="Pediatrics & Child Health"
          categorySlug="pediatrics"
          description="Childhood immunity, developmental milestones, pediatric nutrition, and blue-light screen latency guidelines."
          items={pediatricsNews.length > 0 ? pediatricsNews : latestNews.slice(3, 7)}
        />

        {/* MENTAL HEALTH */}
        <CategorySectionBlock
          title="Mental Health & Neuroscience"
          categorySlug="mental-health"
          description="Neuroimaging insights, cortisol regulation, vagal nerve stimulation, and evidence-based stress therapeutics."
          items={mentalHealthNews.length > 0 ? mentalHealthNews : latestNews.slice(0, 4)}
        />

        {/* FITNESS & YOGA */}
        <CategorySectionBlock
          title="Fitness & Exercise Physiology"
          categorySlug="fitness"
          description="Zone-2 endurance conditioning, hypertrophy science, mobility routines, and therapeutic yoga breathwork."
          items={fitnessNews.length > 0 ? fitnessNews : latestNews.slice(2, 6)}
        />

        {/* NUTRITION */}
        <CategorySectionBlock
          title="Clinical Nutrition & Dietetics"
          categorySlug="nutrition"
          description="Gut microbiome diversity, fermented foods, anti-inflammatory dietary strategies, and nutrient timing."
          items={nutritionNews.length > 0 ? nutritionNews : latestNews.slice(1, 5)}
        />
      </main>

      {/* 6. Visual Stories / Health Infographics Carousel */}
      <VisualStoriesSection />

      {/* 7. Medical Research & Clinical Discoveries */}
      <MedicalResearchSection researchItems={researchNews} />

      {/* 8. Doctor Interviews Section */}
      <DoctorInterviewsSection interviews={doctorInterviews} />

      {/* 9. Health Videos & Health Shorts */}
      <HealthVideosShortsSection videos={videoItems} shorts={shortItems} />

      {/* 10. Editor's Picks & Most Read */}
      <EditorsPicksMostRead
        editorPicks={editorPicks.length > 0 ? editorPicks : latestNews.slice(0, 4)}
        mostRead={mostReadItems.length > 0 ? mostReadItems : trendingItems}
      />

      {/* 11. Health Poll & Digital Magazines Dual Container */}
      <section className="w-full py-8 bg-surface">
        <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5">
            <HealthPollWidget pollData={pollData as any} />
          </div>
          <div className="lg:col-span-7">
            <HealthMagazinesSection magazines={magazines} />
          </div>
        </div>
      </section>

      {/* 12. Sponsored Healthcare Content */}
      <SponsoredEditorialSection />
    </div>
  );
}
