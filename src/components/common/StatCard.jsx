import React from 'react'
import { ArrowUpRight, TrendingUp } from 'lucide-react'

export default function StatCard({
  title,
  label,
  value,
  subtitle,
  subtext,
  icon: Icon,
  trend,
  color = 'royal', // 'navy' | 'royal' | 'blue' | 'purple' | 'green' | 'amber' | 'rose'
  onClick
}) {
  const cardTitle = title || label || ''
  const cardSubtext = subtitle || subtext || ''

  // Normalize color alias
  let effectiveColor = color
  if (color === 'blue') effectiveColor = 'royal'

  const colorMap = {
    navy: {
      bg: 'bg-[#102A56]/10 text-[#102A56]',
      border: 'border-slate-200 hover:border-[#102A56]/40',
      badge: 'bg-[#102A56]/10 text-[#102A56]',
      highlight: 'text-[#102A56]',
    },
    royal: {
      bg: 'bg-[#1769E0]/10 text-[#1769E0]',
      border: 'border-slate-200 hover:border-[#1769E0]/40',
      badge: 'bg-[#1769E0]/10 text-[#1769E0]',
      highlight: 'text-[#1769E0]',
    },
    purple: {
      bg: 'bg-[#7738E8]/10 text-[#7738E8]',
      border: 'border-slate-200 hover:border-[#7738E8]/40',
      badge: 'bg-[#7738E8]/10 text-[#7738E8]',
      highlight: 'text-[#7738E8]',
    },
    green: {
      bg: 'bg-[#159B68]/10 text-[#159B68]',
      border: 'border-slate-200 hover:border-[#159B68]/40',
      badge: 'bg-[#159B68]/10 text-[#159B68]',
      highlight: 'text-[#159B68]',
    },
    amber: {
      bg: 'bg-amber-500/10 text-amber-600',
      border: 'border-slate-200 hover:border-amber-400',
      badge: 'bg-amber-100 text-amber-800',
      highlight: 'text-amber-800',
    },
    rose: {
      bg: 'bg-rose-500/10 text-rose-600',
      border: 'border-slate-200 hover:border-rose-400',
      badge: 'bg-rose-100 text-rose-800',
      highlight: 'text-rose-800',
    }
  }

  const currentTheme = colorMap[effectiveColor] || colorMap.royal

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-5 border ${currentTheme.border} shadow-xs hover:shadow-md transition-all duration-200 relative overflow-hidden ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {cardTitle}
          </p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {value}
          </p>
          {cardSubtext && (
            <p className="text-xs text-slate-500 flex items-center gap-1">
              {cardSubtext}
            </p>
          )}
        </div>

        {Icon && (
          <div className={`p-3 rounded-xl ${currentTheme.bg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500">{trend.label || 'vs last cycle'}</span>
          <span
            className={`font-semibold flex items-center gap-0.5 px-2 py-0.5 rounded-full ${
              trend.direction === 'up'
                ? 'bg-emerald-50 text-emerald-700'
                : trend.direction === 'down'
                ? 'bg-rose-50 text-rose-700'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            {trend.direction === 'up' && '↑'}
            {trend.direction === 'down' && '↓'}
            {trend.value}
          </span>
        </div>
      )}
    </div>
  )
}
