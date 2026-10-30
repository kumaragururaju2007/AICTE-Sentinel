import React from 'react';
import { ShieldCheck, Info, CheckCircle2, AlertTriangle } from 'lucide-react';
import { complianceFactors } from '../../data/institutionMockData';
import { useInstitution } from '../../portals/institution/context/InstitutionContext';

export default function ComplianceHealthCard() {
  const { stats } = useInstitution();
  const score = stats.complianceScore || 89;

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Compliance Health Score
            </h3>
            <p className="text-xs text-slate-500">
              Multi-factor regulatory readiness index
            </p>
          </div>
        </div>
        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
          Rank: Band A+
        </span>
      </div>

      {/* Score Circular Metric */}
      <div className="flex flex-col sm:flex-row items-center gap-6 py-2">
        <div className="relative flex h-32 w-32 flex-shrink-0 items-center justify-center">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
            <circle
              className="text-slate-100"
              strokeWidth="9"
              stroke="currentColor"
              fill="transparent"
              r="45"
              cx="50"
              cy="50"
            />
            <circle
              className="text-emerald-500 transition-all duration-1000 ease-out"
              strokeWidth="9"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="45"
              cx="50"
              cy="50"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-extrabold tracking-tight text-[#123B70]">
              {score}
            </span>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              / 100 PTS
            </span>
          </div>
        </div>

        <div className="flex-1 space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-3.5 w-3.5" /> High Compliance Standing
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Your institution satisfies 89% of prescribed regulatory metrics for Academic Year 2025-26. Resolving pending laboratory equipment calibration and lease documents will boost your score to 96%.
          </p>
          <div className="text-[11px] text-slate-400 italic">
            * Prototype indicator only; does not replace official statutory council orders.
          </div>
        </div>
      </div>

      {/* Factor Breakdown */}
      <div className="mt-5 border-t border-slate-100 pt-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Score Contributing Factor Breakdown
        </h4>
        <div className="space-y-2.5">
          {complianceFactors.map((factor, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700">{factor.name}</span>
                <span className="font-bold text-slate-900 font-mono">
                  {factor.score}% ({factor.status})
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    factor.score >= 90
                      ? 'bg-emerald-500'
                      : factor.score >= 80
                      ? 'bg-blue-500'
                      : factor.score >= 70
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${factor.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
