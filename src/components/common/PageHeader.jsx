import React from 'react'

export default function PageHeader({
  title,
  subtitle,
  badgeText = 'AICTE Sentinel Statutory Oversight',
  badgeColor = 'navy', // 'navy' | 'royal' | 'purple' | 'green'
  breadcrumbs = [],
  actions
}) {
  return (
    <div className="bg-gradient-to-r from-[#102A56] via-[#102A56] to-[#1769E0] text-white rounded-2xl p-6 shadow-md relative overflow-hidden mb-6">
      {/* Decorative gradient glow */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div>
          {badgeText && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/90 text-xs font-semibold mb-2">
              <span className="w-2 h-2 rounded-full bg-[#159B68] animate-pulse" />
              <span>{badgeText}</span>
            </div>
          )}

          {breadcrumbs.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-white/70 mb-1">
              {breadcrumbs.map((b, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <span>/</span>}
                  <span>{b}</span>
                </React.Fragment>
              ))}
            </div>
          )}

          <h1 className="text-2xl font-black tracking-tight text-white">{title}</h1>
          {subtitle && (
            <p className="text-white/80 text-xs sm:text-sm mt-1 max-w-2xl font-normal leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-2.5 shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}

