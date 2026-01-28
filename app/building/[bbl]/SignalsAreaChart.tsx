'use client'

import React from 'react'
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts'

export default function SignalsAreaChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data || []} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
        <defs>
          <linearGradient id="heatG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.28} />
            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="pestsG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.22} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="noiseG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.22} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="otherG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#64748b" stopOpacity={0.18} />
            <stop offset="95%" stopColor="#64748b" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="label" stroke="#4a5568" fontSize={10} tickLine={false} interval="preserveStartEnd" minTickGap={16} />
        <YAxis stroke="#4a5568" fontSize={10} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={{ backgroundColor: '#151c2c', border: '1px solid #2a3441', borderRadius: '10px', fontSize: '12px' }} />
        <Legend />
        <Area type="monotone" dataKey="heat" name="Heat" stroke="#f59e0b" strokeWidth={2} fill="url(#heatG)" stackId="1" />
        <Area type="monotone" dataKey="pests" name="Pests" stroke="#10b981" strokeWidth={2} fill="url(#pestsG)" stackId="1" />
        <Area type="monotone" dataKey="noise" name="Noise" stroke="#3b82f6" strokeWidth={2} fill="url(#noiseG)" stackId="1" />
        <Area type="monotone" dataKey="other" name="Other" stroke="#64748b" strokeWidth={2} fill="url(#otherG)" stackId="1" />
      </AreaChart>
    </ResponsiveContainer>
  )
}
