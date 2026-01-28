'use client'

import React from 'react'

type Props = {
  title: React.ReactNode
  score: number | string
  detail?: React.ReactNode
  icon?: React.ReactNode
  onClick: () => void
}

export default function ScoreLink({ title, score, detail, icon, onClick }: Props) {
  const n = typeof score === 'number' ? score : Number(score)
  const colorClass = Number.isFinite(n)
    ? n >= 80
      ? 'text-emerald-400'
      : n >= 60
        ? 'text-yellow-400'
        : 'text-red-400'
    : 'text-[#94a3b8]'

  const barColor = Number.isFinite(n)
    ? n >= 80
      ? '#10b981'
      : n >= 60
        ? '#f59e0b'
        : '#ef4444'
    : '#64748b'

  const width = Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : 0

  return (
    <button
      type="button"
      onClick={onClick}
      className="p-4 bg-[#1a2235] rounded-xl text-left hover:bg-[#232938] transition focus:outline-none focus:ring-2 focus:ring-blue-500/30"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon ? <span className="text-lg">{icon}</span> : null}
          <span className="font-medium">{title}</span>
        </div>
        <span className={`font-bold ${colorClass}`}>{score}</span>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${width}%`, backgroundColor: barColor }} />
      </div>

      {detail ? <p className="text-xs text-[#64748b] mt-2">{detail}</p> : null}
    </button>
  )
}
