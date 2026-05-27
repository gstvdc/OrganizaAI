import React from 'react';
import { getChecklistProgress } from '../hooks/useChecklist';

interface ChecklistProgressBadgeProps {
  simulationId: string;
  totalSteps: number;
}

export const ChecklistProgressBadge: React.FC<ChecklistProgressBadgeProps> = ({
  simulationId,
  totalSteps,
}) => {
  const { completedCount } = getChecklistProgress(simulationId, totalSteps);

  if (totalSteps === 0) return null;

  const pct = Math.round((completedCount / totalSteps) * 100);
  const isDone = completedCount === totalSteps;

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex items-center justify-between">
        {isDone ? (
          <span className="text-[10px] font-bold text-accent-lime">✓ Plano concluído</span>
        ) : completedCount === 0 ? (
          <span className="text-[10px] text-slate-500">Plano de ação não iniciado</span>
        ) : (
          <span className="text-[10px] font-semibold text-slate-400">
            {completedCount}/{totalSteps} ações concluídas
          </span>
        )}
        {!isDone && completedCount > 0 && (
          <span className="text-[10px] text-slate-500">{pct}%</span>
        )}
      </div>
      {completedCount > 0 && (
        <div className="h-1 w-full overflow-hidden rounded-full bg-white/5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${isDone ? 'bg-accent-lime' : 'bg-violet-500'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </div>
  );
};
