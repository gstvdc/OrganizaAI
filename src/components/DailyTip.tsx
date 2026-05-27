import React, { useEffect, useState } from 'react';
import { getDailyTip, getFallbackTip, clearDailyTipCache } from '../services/dailyTip';
import type { SimulationDetails } from '../types';

const IconBulb: React.FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
    />
  </svg>
);

const loadLastSimulation = (): SimulationDetails | null => {
  try {
    const raw = localStorage.getItem('simulations');
    if (!raw) return null;
    const list: SimulationDetails[] = JSON.parse(raw);
    const last = list.at(-1);
    if (!last) return null;
    const simRaw = localStorage.getItem(`simulation_${last.id}`);
    return simRaw ? JSON.parse(simRaw) : null;
  } catch {
    return null;
  }
};

export const DailyTip: React.FC = () => {
  const [tip, setTip] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const lastSimulation = loadLastSimulation();

  const fetchTip = async (force = false) => {
    if (!lastSimulation) return;
    if (force) clearDailyTipCache();
    setLoading(true);
    try {
      const result = await getDailyTip(lastSimulation.profile);
      setTip(result);
    } catch {
      setTip(getFallbackTip());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!lastSimulation) {
      setLoading(false);
      return;
    }
    fetchTip();
  }, []);

  if (!lastSimulation) return null;

  return (
    <div className="glass-panel rounded-3xl p-5 border border-white/5 shadow-2xl animate-fadeIn relative overflow-hidden">
      <div className="absolute top-0 right-0 -z-10 h-[100px] w-[100px] rounded-full bg-accent-lime/5 blur-[40px]" />

      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent-lime/20 bg-accent-lime/10 text-accent-lime">
          <IconBulb className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
              Dica do dia
            </span>
            {!loading && (
              <button
                onClick={() => fetchTip(true)}
                className="text-[10px] text-slate-500 hover:text-slate-300 cursor-pointer transition-colors"
              >
                ↻ Nova dica
              </button>
            )}
          </div>

          {loading ? (
            <div className="space-y-2 animate-pulse">
              <div className="h-3 w-full rounded bg-white/5" />
              <div className="h-3 w-3/4 rounded bg-white/5" />
            </div>
          ) : (
            <p className="text-sm leading-relaxed text-slate-300">{tip}</p>
          )}
        </div>
      </div>
    </div>
  );
};
