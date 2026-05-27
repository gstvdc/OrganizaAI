import React from 'react';
import { useChecklist } from '../hooks/useChecklist';

interface ActionPlanChecklistProps {
  simulationId: string;
  steps: { titulo: string; descricao: string }[];
}

const getProgressColor = (pct: number): string => {
  if (pct === 100) return 'bg-accent-lime';
  if (pct >= 60) return 'bg-lime-500';
  if (pct >= 30) return 'bg-amber-500';
  return 'bg-violet-500';
};

export const ActionPlanChecklist: React.FC<ActionPlanChecklistProps> = ({ simulationId, steps }) => {
  const { state, toggle, completedCount, isAllDone } = useChecklist(simulationId, steps.length);
  const progressPct = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0;

  return (
    <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-6 shadow-2xl animate-fadeIn">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-lg font-bold text-white">Seu Plano de Ação Passo a Passo</h4>
          <span className="text-xs font-semibold text-slate-400">
            {completedCount}/{steps.length} ações
          </span>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getProgressColor(progressPct)}`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {isAllDone && (
        <div className="mb-6 rounded-2xl border border-accent-lime/20 bg-accent-lime/5 p-4 text-center animate-fadeIn">
          <p className="text-sm font-bold text-accent-lime">
            Parabéns! Você concluiu todas as ações do plano.
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Continue assim para alcançar seus objetivos financeiros!
          </p>
        </div>
      )}

      <div className="relative space-y-4 before:absolute before:inset-y-1 before:left-3.5 before:w-0.5 before:bg-violet-600/30">
        {steps.map((step, idx) => {
          const done = !!state[idx];
          return (
            <button
              key={idx}
              type="button"
              onClick={() => toggle(idx)}
              className="animate-fadeIn relative flex w-full gap-4 text-left"
            >
              <div
                className={`z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                  done
                    ? 'bg-accent-lime text-space-950 shadow-[0_0_10px_rgba(197,255,34,0.4)]'
                    : 'bg-violet-600/20 text-slate-400 border border-violet-600/30'
                }`}
              >
                {done ? '✓' : idx + 1}
              </div>
              <div
                className={`flex-1 rounded-xl border p-4 transition-all duration-300 ${
                  done
                    ? 'border-accent-lime/15 bg-accent-lime/5'
                    : 'border-white/5 bg-white/[0.02] hover:border-white/10'
                }`}
              >
                <h5
                  className={`text-sm font-bold transition-colors ${done ? 'text-accent-lime line-through' : 'text-white'}`}
                >
                  {step.titulo}
                </h5>
                <p
                  className={`mt-1.5 text-xs leading-relaxed transition-colors ${done ? 'text-slate-500 line-through' : 'text-slate-400'}`}
                >
                  {step.descricao}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
