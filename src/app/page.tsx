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
import { HomepageBuilderConfig, DEFAULT_HOMEPAGE_SECTIONS } from '@/lib/types/homepage-builder';

// Enable ISR caching (30s) so the homepage serves instantaneously without running 22 transatlantic queries on every hit
export const revalidate = 30;

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
    magazines,
    builderConfigRes
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
      ORDER BY (i.is_breaking::int * 1000 + i.is_featured::int * 50) DESC, i.published_at DESC
      LIMIT 12
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
      LIMIT 10
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
    `,

    // 22. Homepage Builder Configuration from site_settings
    sql`
      SELECT value FROM site_settings WHERE key = 'homepage_builder_config' LIMIT 1
    `.catch(() => [])
  ]);

  // Construct Poll Data
  const pollData = pollRes.length > 0 ? {
    id: pollRes[0].id,
    question: pollRes[0].question,
    options: pollOptionsRes.filter((o: any) => o.poll_id === pollRes[0].id)
  } : undefined;

  // Parse Builder Configuration
  let builderConfig: HomepageBuilderConfig | null = null;
  if (builderConfigRes && builderConfigRes.length > 0 && builderConfigRes[0]?.value) {
    try {
      builderConfig = JSON.parse(builderConfigRes[0].value);
    } catch {
      builderConfig = null;
    }
  }

  // 1. Hero Story Resolution (Dynamic pin or fallback)
  let featuredStory = topItems[0] || latestNews[0];
  if (builderConfig?.heroStoryId) {
    const heroMatch = [...topItems, ...latestNews, ...editorPicks].find(
      (item: any) => item.id === builderConfig!.heroStoryId
    );
    if (heroMatch) {
      featuredStory = heroMatch;
    } else {
      try {
        const specificHero = await sql`
          SELECT i.*, s.name as source_name
          FROM content_items i
          LEFT JOIN content_sources s ON i.source_id = s.id
          WHERE i.id = ${builderConfig.heroStoryId} AND i.status = 'published' AND i.deleted_at IS NULL
          LIMIT 1
        `;
        if (specificHero.length > 0) {
          featuredStory = specificHero[0];
        }
      } catch (e) {
        console.error('Error fetching pinned hero:', e);
      }
    }
  }
  const remainingTopStories = topItems.filter((i: any) => i.id !== featuredStory?.id);
  const topStoriesPool = [
    ...remainingTopStories,
    ...latestNews.filter((i: any) => i.id !== featuredStory?.id && !remainingTopStories.some((r: any) => r.id === i.id))
  ];
  const heroSubStories = topStoriesPool.slice(0, 2);
  const topStoriesList = topStoriesPool.slice(2, 7);

  // 2. Trending Stories Resolution (Pinned list 01-05 in exact order or fallback)
  let finalTrendingStories = trendingItems.slice(0, 5);
  if (builderConfig?.pinnedTrending && builderConfig.pinnedTrending.length > 0) {
    try {
      const pinnedIds = builderConfig.pinnedTrending.map((p) => p.id);
      const pinnedPool = [...trendingItems, ...topItems, ...latestNews].filter((item: any) =>
        pinnedIds.includes(item.id)
      );
      const missingIds = pinnedIds.filter(
        (id) => !pinnedPool.some((item: any) => item.id === id)
      );
      let additionalPinned: any[] = [];
      if (missingIds.length > 0) {
        additionalPinned = await sql`
          SELECT i.*, s.name as source_name
          FROM content_items i
          LEFT JOIN content_sources s ON i.source_id = s.id
          WHERE i.id = ANY(${missingIds}) AND i.status = 'published' AND i.deleted_at IS NULL
        `;
      }
      const combinedPool = [...pinnedPool, ...additionalPinned];
      const ordered = builderConfig.pinnedTrending
        .map((p) => combinedPool.find((item: any) => item.id === p.id))
        .filter(Boolean);

      if (ordered.length > 0) {
        const remaining = trendingItems.filter(
          (t: any) => !pinnedIds.includes(t.id)
        );
        finalTrendingStories = [...ordered, ...remaining].slice(0, 5);
      }
    } catch (e) {
      console.error('Error resolving pinned trending:', e);
    }
  }

  // 3. Editor's Picks Resolution (Pinned or fallback)
  let finalEditorPicks = editorPicks.length > 0 ? editorPicks : latestNews.slice(0, 4);
  if (builderConfig?.editorPickIds && builderConfig.editorPickIds.length > 0) {
    try {
      const epIds = builderConfig.editorPickIds;
      const epPool = [...editorPicks, ...latestNews, ...topItems].filter((i: any) =>
        epIds.includes(i.id)
      );
      const missingEp = epIds.filter(
        (id) => !epPool.some((item: any) => item.id === id)
      );
      let additionalEp: any[] = [];
      if (missingEp.length > 0) {
        additionalEp = await sql`
          SELECT i.*, s.name as source_name
          FROM content_items i
          LEFT JOIN content_sources s ON i.source_id = s.id
          WHERE i.id = ANY(${missingEp}) AND i.status = 'published' AND i.deleted_at IS NULL
        `;
      }
      const combinedEp = [...epPool, ...additionalEp];
      const orderedEp = epIds
        .map((id) => combinedEp.find((item: any) => item.id === id))
        .filter(Boolean);
      if (orderedEp.length > 0) {
        finalEditorPicks = orderedEp.slice(0, 4);
      }
    } catch (e) {
      console.error('Error resolving editor picks:', e);
    }
  }

  // 4. Featured Shorts Resolution
  let finalShorts = shortItems;
  if (builderConfig?.featuredShortIds && builderConfig.featuredShortIds.length > 0) {
    try {
      const fsIds = builderConfig.featuredShortIds;
      const fsPool = shortItems.filter((s: any) => fsIds.includes(s.id));
      const missingFs = fsIds.filter(
        (id) => !fsPool.some((s: any) => s.id === id)
      );
      let additionalFs: any[] = [];
      if (missingFs.length > 0) {
        additionalFs = await sql`
          SELECT i.*, s.name as source_name
          FROM content_items i
          LEFT JOIN content_sources s ON i.source_id = s.id
          WHERE i.id = ANY(${missingFs}) AND i.status = 'published' AND i.deleted_at IS NULL
        `;
      }
      const combinedFs = [...fsPool, ...additionalFs];
      const orderedFs = fsIds
        .map((id) => combinedFs.find((s: any) => s.id === id))
        .filter(Boolean);
      if (orderedFs.length > 0) {
        finalShorts = orderedFs.slice(0, 6);
      }
    } catch (e) {
      console.error('Error resolving featured shorts:', e);
    }
  }

  // 5. Most Read Settings Application
  let finalMostRead = mostReadItems.length > 0 ? mostReadItems : trendingItems;
  if (builderConfig?.mostReadSettings) {
    const { articlesCountLimit, minViewsThreshold } = builderConfig.mostReadSettings;
    if (minViewsThreshold > 0) {
      finalMostRead = finalMostRead.filter((item: any) => (item.view_count || 0) >= minViewsThreshold);
    }
    if (articlesCountLimit > 0) {
      finalMostRead = finalMostRead.slice(0, articlesCountLimit);
    }
  } else {
    finalMostRead = finalMostRead.slice(0, 5);
  }

  // 6. Active Sections Ordered by Configuration
  const sectionsToRender = (builderConfig?.sections || DEFAULT_HOMEPAGE_SECTIONS)
    .filter((s) => s.enabled)
    .sort((a, b) => a.order - b.order);

  // Helper to render individual sections
  const renderSectionBlock = (section: (typeof sectionsToRender)[0]) => {
    const id = section.id || section.blockId;
    const title = section.title || section.englishTitle || section.primaryTitle;

    switch (id) {
      case 'breaking':
        return (
          <BreakingNewsTicker
            key={section.id}
            items={breakingNews.length > 0 ? breakingNews : topItems}
          />
        );

      case 'hero':
        return (
          <TopStoriesGrid
            key={section.id}
            featuredStory={featuredStory}
            heroSubStories={heroSubStories}
            topStories={topStoriesList}
            trendingStories={finalTrendingStories}
            title={title}
          />
        );

      case 'latest':
        return (
          <LatestNewsFeed
            key={section.id}
            initialItems={latestNews}
          />
        );

      case 'cancer':
        return (
          <div key={section.id} className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <CategorySectionBlock
              title={title || "Cancer & Oncology News"}
              categorySlug="cancer"
              description="Early detection markers, genomic oncology, precision immunotherapies, and clinical patient outcomes."
              items={cancerNews.length > 0 ? cancerNews : latestNews.slice(0, 4)}
            />
          </div>
        );

      case 'heart':
        return (
          <div key={section.id} className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <CategorySectionBlock
              title={title || "Heart & Cardiovascular Health"}
              categorySlug="heart"
              description="Preventive cardiology, coronary calcium scoring, arterial flexibility, and sudden cardiac risk prevention."
              items={heartNews.length > 0 ? heartNews : latestNews.slice(2, 6)}
            />
          </div>
        );

      case 'diabetes':
        return (
          <div key={section.id} className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <CategorySectionBlock
              title={title || "Diabetes & Metabolic Health"}
              categorySlug="diabetes"
              description="Continuous glucose monitoring, insulin sensitivity protocols, dietary reversal, and endocrinology research."
              items={diabetesNews.length > 0 ? diabetesNews : latestNews.slice(4, 8)}
            />
          </div>
        );

      case 'womens-health':
        return (
          <div key={section.id} className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <CategorySectionBlock
              title={title || "Women's Health & Maternal Wellness"}
              categorySlug="womens-health"
              description="Maternal nutrition, perinatal mental health, hormonal balance, bone density, and preventative oncology."
              items={womensHealthNews.length > 0 ? womensHealthNews : latestNews.slice(1, 5)}
            />
          </div>
        );

      case 'pediatrics':
        return (
          <div key={section.id} className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <CategorySectionBlock
              title={title || "Pediatrics & Child Health"}
              categorySlug="pediatrics"
              description="Childhood immunity, developmental milestones, pediatric nutrition, and blue-light screen latency guidelines."
              items={pediatricsNews.length > 0 ? pediatricsNews : latestNews.slice(3, 7)}
            />
          </div>
        );

      case 'mental-health':
        return (
          <div key={section.id} className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <CategorySectionBlock
              title={title || "Mental Health & Neuroscience"}
              categorySlug="mental-health"
              description="Neuroimaging insights, cortisol regulation, vagal nerve stimulation, and evidence-based stress therapeutics."
              items={mentalHealthNews.length > 0 ? mentalHealthNews : latestNews.slice(0, 4)}
            />
          </div>
        );

      case 'fitness':
        return (
          <div key={section.id} className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <CategorySectionBlock
              title={title || "Fitness & Exercise Physiology"}
              categorySlug="fitness"
              description="Zone-2 endurance conditioning, hypertrophy science, mobility routines, and therapeutic yoga breathwork."
              items={fitnessNews.length > 0 ? fitnessNews : latestNews.slice(2, 6)}
            />
          </div>
        );

      case 'nutrition':
        return (
          <div key={section.id} className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <CategorySectionBlock
              title={title || "Clinical Nutrition & Dietetics"}
              categorySlug="nutrition"
              description="Gut microbiome diversity, fermented foods, anti-inflammatory dietary strategies, and nutrient timing."
              items={nutritionNews.length > 0 ? nutritionNews : latestNews.slice(1, 5)}
            />
          </div>
        );

      case 'visual-stories':
      case 'photos':
        return <VisualStoriesSection key={section.id} />;

      case 'research':
        return (
          <div key={section.id} className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <MedicalResearchSection researchItems={researchNews} />
          </div>
        );

      case 'doctor-interviews':
      case 'interviews':
        return (
          <div key={section.id} className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <DoctorInterviewsSection interviews={doctorInterviews} />
          </div>
        );

      case 'shorts':
        return <HealthVideosShortsSection key={section.id} videos={videoItems} shorts={finalShorts} />;

      case 'editors':
        return (
          <EditorsPicksMostRead
            key={section.id}
            editorPicks={finalEditorPicks}
            mostRead={finalMostRead}
            title={title}
            displayViewsBadge={builderConfig?.mostReadSettings?.displayViewsBadge}
          />
        );

      case 'polls-magazines':
        return (
          <section key={section.id} className="w-full py-8 bg-surface">
            <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5">
                <HealthPollWidget pollData={pollData as any} />
              </div>
              <div className="lg:col-span-7">
                <HealthMagazinesSection magazines={magazines} />
              </div>
            </div>
          </section>
        );

      case 'sponsored':
        return <SponsoredEditorialSection key={section.id} />;

      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen bg-surface flex flex-col">
      {sectionsToRender.map((section) => renderSectionBlock(section))}
    </div>
  );
}
