import React from 'react';
import { Filter, ChevronDown } from 'lucide-react';

export default function FilterDropdown({
  label,
  value,
  onChange,
  options = [],
  icon: Icon = Filter,
  className = '',
}) {
  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <div className="relative w-full">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-8 pr-8 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 cursor-pointer"
        >
          {options.map((opt) => {
            const val = typeof opt === 'object' ? opt.value : opt;
            const text = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={val} value={val}>
                {label && val === 'all' ? `${label}: All` : text}
              </option>
            );
          })}
        </select>
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5 text-slate-400">
          <Icon className="h-3.5 w-3.5" />
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-slate-400">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}
