'use client'

import React from 'react'
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'

export default function ViolationsYearlyBarChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={(data || [])}>
        <XAxis dataKey="year" stroke="#4a5568" fontSize={11} />
        <YAxis stroke="#4a5568" fontSize={11} />
        <Tooltip contentStyle={{ backgroundColor: '#151c2c', border: '1px solid #2a3441', borderRadius: '8px' }} />
        <Bar dataKey="hpdViolations" fill="#3b82f6" name="HPD" radius={[4, 4, 0, 0]} />
        <Bar dataKey="dobViolations" fill="#f97316" name="DOB" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
