'use client';

import { useEffect, useRef } from 'react';

interface SponsoredTrackerProps {
  articleId: string;
  campaignId?: string | null;
  sponsorId?: string | null;
}

export function SponsoredTracker({
  articleId,
  campaignId,
  sponsorId,
}: SponsoredTrackerProps) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current || !articleId) return;
    tracked.current = true;

    try {
      fetch('/api/sponsored-articles/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          article_id: articleId,
          event_type: 'SPONSORED_VIEW',
          campaign_id: campaignId || null,
          sponsor_id: sponsorId || null,
        }),
      }).catch((err) => console.error('Tracking view failed:', err));
    } catch {
      // Ignore network failures for non-critical analytics
    }
  }, [articleId, campaignId, sponsorId]);

  return null;
}
