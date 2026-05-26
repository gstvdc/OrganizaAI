import React from 'react';

interface CurrencyInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({ label, value, onChange, hint }) => (
  <div className="flex flex-col group">
    <label className="mb-2 text-sm font-semibold text-slate-300 group-focus-within:text-white transition-colors">
      {label}
    </label>
    <div className="relative">
      <span className="absolute inset-y-0 left-0 flex items-center pl-4 font-mono text-xs font-bold text-slate-500 group-focus-within:text-accent-lime/70 transition-colors">
        R$
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full glass-input pr-4 pl-11 font-mono tracking-wide"
      />
    </div>
    {hint && <span className="mt-1.5 text-[10px] text-slate-500">{hint}</span>}
  </div>
);
