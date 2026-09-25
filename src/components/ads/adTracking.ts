const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function trackAdEvent(adId: string, type: 'impression' | 'click') {
  try {
    if (!adId || !UUID_REGEX.test(adId)) return;
    // Fire and forget beacon or fetch
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify({ adId, type })], { type: 'application/json' });
      navigator.sendBeacon('/api/ads/track', blob);
    } else {
      fetch('/api/ads/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adId, type }),
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // Suppress background metric failures
  }
}
