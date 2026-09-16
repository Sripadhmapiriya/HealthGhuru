'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import {
  Megaphone, Eye, MousePointerClick, Percent, CheckCircle2,
  TrendingUp, Hospital, Layout, Layers, Smartphone, Sparkles,
  Sidebar as SidebarIcon, BarChart2,
} from 'lucide-react';
import { Advertisement } from '@/lib/types/advertisement';

const PLACEMENT_COLORS: Record<string, string> = {
  top_banner:      'bg-blue-50 text-blue-700 border-blue-200',
  hero_banner:     'bg-purple-50 text-purple-700 border-purple-200',
  sidebar:         'bg-emerald-50 text-emerald-700 border-emerald-200',
  floating_footer: 'bg-amber-50 text-amber-700 border-amber-200',
  popup:           'bg-rose-50 text-rose-700 border-rose-200',
};

const PLACEMENT_ICONS: Record<string, any> = {
  top_banner: Layout,
  hero_banner: Layers,
  sidebar: SidebarIcon,
  floating_footer: Smartphone,
  popup: Sparkles,
};

const PLACEMENT_LABELS: Record<string, string> = {
  top_banner: 'Top Banner',
  hero_banner: 'Hero Banner',
  sidebar: 'Sidebar',
  floating_footer: 'Floating Footer',
  popup: 'Popup Modal',
};

export function AdsDashboardClient({ initialAds }: { initialAds: Advertisement[] }) {
  const [ads] = useState<Advertisement[]>(initialAds);

  const totalAds = ads.length;
  const activeAds = ads.filter((a) => a.is_active).length;
  const totalImpressions = ads.reduce((acc, a) => acc + (a.impressions_count || 0), 0);
  const totalClicks = ads.reduce((acc, a) => acc + (a.clicks_count || 0), 0);
  const averageCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00';

  // Revenue summary (budget sum)
  const totalBudget = ads.reduce((acc, a) => acc + (Number(a.budget) || 0), 0);

  // Unique advertisers
  const uniqueAdvertisers = Array.from(new Set(ads.filter((a) => !!a.advertiser_name).map((a) => a.advertiser_name as string)));

  // Per-placement breakdown
  const placements = ['top_banner', 'hero_banner', 'sidebar', 'floating_footer', 'popup'];
  const placementStats = placements.map((p) => {
    const pAds = ads.filter((a) => a.placement === p);
    const pImpressions = pAds.reduce((acc, a) => acc + (a.impressions_count || 0), 0);
    const pClicks = pAds.reduce((acc, a) => acc + (a.clicks_count || 0), 0);
    const pCtr = pImpressions > 0 ? ((pClicks / pImpressions) * 100).toFixed(2) : '0.00';
    return { placement: p, count: pAds.length, active: pAds.filter((a) => a.is_active).length, impressions: pImpressions, clicks: pClicks, ctr: pCtr };
  });

  // Top performing ads
  const topAds = [...ads]
    .sort((a, b) => (b.clicks_count || 0) - (a.clicks_count || 0))
    .slice(0, 5);

  // Top advertisers by impressions
  const advertiserMap: Record<string, { impressions: number; clicks: number; count: number; type?: string | null }> = {};
  ads.forEach((a) => {
    if (!a.advertiser_name) return;
    if (!advertiserMap[a.advertiser_name]) {
      advertiserMap[a.advertiser_name] = { impressions: 0, clicks: 0, count: 0, type: a.advertiser_type };
    }
    advertiserMap[a.advertiser_name].impressions += a.impressions_count || 0;
    advertiserMap[a.advertiser_name].clicks += a.clicks_count || 0;
    advertiserMap[a.advertiser_name].count += 1;
  });
  const topAdvertisers = Object.entries(advertiserMap)
    .sort(([, a], [, b]) => b.impressions - a.impressions)
    .slice(0, 5);

  const kpis = [
    { label: 'Total Campaigns', value: totalAds, sub: `${activeAds} active`, icon: Megaphone, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Total Impressions', value: totalImpressions.toLocaleString(), sub: 'Views recorded', icon: Eye, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Clicks', value: totalClicks.toLocaleString(), sub: 'Outbound clicks', icon: MousePointerClick, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Average CTR', value: `${averageCtr}%`, sub: 'Click-through rate', icon: Percent, color: 'text-accent', bg: 'bg-accent/10' },
    { label: 'Active Ads', value: activeAds, sub: 'Live in ad slots', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Total Budget', value: `₹${totalBudget.toLocaleString()}`, sub: `${uniqueAdvertisers.length} advertisers`, icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div key={i} className="bg-white rounded-xl p-4 border border-border shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-heading font-medium text-text-secondary">{kpi.label}</span>
                <div className={`w-7 h-7 rounded-full ${kpi.bg} ${kpi.color} flex items-center justify-center shrink-0`}>
                  <Icon size={13} />
                </div>
              </div>
              <div className={`text-xl font-bold font-heading ${kpi.color}`}>{kpi.value}</div>
              <div className="text-[10px] text-text-muted mt-1">{kpi.sub}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Placement Breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <BarChart2 size={18} className="text-primary" />
            <h3 className="font-heading font-bold text-base text-dark">Placement Performance</h3>
          </div>
          <div className="space-y-3">
            {placementStats.map((stat) => {
              const Icon = PLACEMENT_ICONS[stat.placement] || Megaphone;
              const colorClass = PLACEMENT_COLORS[stat.placement] || 'bg-gray-50 text-gray-700';
              const maxImpressions = Math.max(...placementStats.map((s) => s.impressions), 1);
              const pct = Math.round((stat.impressions / maxImpressions) * 100);
              return (
                <div key={stat.placement}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${colorClass}`}>
                        <Icon size={10} />
                        {PLACEMENT_LABELS[stat.placement]}
                      </span>
                      <span className="text-[11px] text-text-secondary">{stat.active}/{stat.count} active</span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px]">
                      <span className="text-text-secondary">{stat.impressions.toLocaleString()} views</span>
                      <span className="font-semibold text-primary">{stat.ctr}% CTR</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Hospital Advertisers */}
        <div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <Hospital size={18} className="text-blue-600" />
            <h3 className="font-heading font-bold text-base text-dark">Top Hospital Advertisers</h3>
          </div>
          {topAdvertisers.length === 0 ? (
            <div className="text-center py-8 text-text-muted text-sm">No advertisers yet</div>
          ) : (
            <div className="space-y-3">
              {topAdvertisers.map(([name, data], i) => {
                const ctr = data.impressions > 0 ? ((data.clicks / data.impressions) * 100).toFixed(1) : '0.0';
                return (
                  <div key={name} className="flex items-center gap-3 p-3 bg-surface/40 rounded-xl border border-border/50">
                    <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-heading font-semibold text-xs text-dark truncate">{name}</div>
                      <div className="text-[10px] text-text-secondary capitalize">{data.type || 'hospital'} · {data.count} ad{data.count !== 1 ? 's' : ''}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-semibold text-dark">{data.impressions.toLocaleString()}</div>
                      <div className="text-[10px] text-primary">{ctr}% CTR</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Top Performing Ads */}
      <div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp size={18} className="text-emerald-600" />
          <h3 className="font-heading font-bold text-base text-dark">Top Performing Campaigns</h3>
        </div>
        {topAds.length === 0 ? (
          <div className="text-center py-8 text-text-muted text-sm">No campaigns yet — create your first ad</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-border text-[11px] font-heading font-semibold text-text-secondary uppercase tracking-wider">
                  <th className="py-2 px-3 text-left">Campaign</th>
                  <th className="py-2 px-3 text-left">Hospital / Doctor</th>
                  <th className="py-2 px-3 text-left">Placement</th>
                  <th className="py-2 px-3 text-right">Impressions</th>
                  <th className="py-2 px-3 text-right">Clicks</th>
                  <th className="py-2 px-3 text-right">CTR</th>
                  <th className="py-2 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {topAds.map((ad) => {
                  const ctr = ad.impressions_count > 0
                    ? ((ad.clicks_count / ad.impressions_count) * 100).toFixed(2)
                    : '0.00';
                  const colorClass = PLACEMENT_COLORS[ad.placement] || 'bg-gray-100 text-gray-700';
                  return (
                    <tr key={ad.id} className="hover:bg-surface/30 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-heading font-semibold text-dark line-clamp-1">{ad.title}</div>
                        {ad.headline && <div className="text-text-secondary text-[10px] line-clamp-1">{ad.headline}</div>}
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-dark font-medium line-clamp-1">{ad.advertiser_name || '—'}</div>
                        {ad.advertiser_type && <div className="text-[10px] text-text-secondary capitalize">{ad.advertiser_type}</div>}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium border ${colorClass}`}>
                          {PLACEMENT_LABELS[ad.placement] || ad.placement}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right text-text-secondary">{(ad.impressions_count || 0).toLocaleString()}</td>
                      <td className="py-3 px-3 text-right font-medium text-dark">{(ad.clicks_count || 0).toLocaleString()}</td>
                      <td className="py-3 px-3 text-right font-semibold text-primary">{ctr}%</td>
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          ad.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${ad.is_active ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                          {ad.is_active ? 'Active' : 'Paused'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
