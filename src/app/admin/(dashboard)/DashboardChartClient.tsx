'use client';

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function DashboardChartClient({ data }: { data: { date: string; value: number }[] }) {
  return (
    <div className="w-full h-full">
      <h3 className="font-semibold text-dark mb-4">Records Uploaded (Last 30 Days)</h3>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#2E7D32" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(46,125,50,0.1)" />
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#78909C' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#78909C' }} allowDecimals={false} />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: '1px solid rgba(46,125,50,0.1)', boxShadow: '0 4px 12px rgba(46,125,50,0.08)' }}
              labelStyle={{ color: '#1A2E1A', fontWeight: 600, marginBottom: '4px' }}
              itemStyle={{ color: '#2E7D32' }}
            />
            <Area type="monotone" dataKey="value" name="Records" stroke="#2E7D32" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
