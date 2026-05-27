import { useState, useCallback } from 'react';

type ChecklistState = Record<number, boolean>;

export const getChecklistProgress = (
  simulationId: string,
  totalSteps: number,
): { completedCount: number; totalSteps: number } => {
  try {
    const raw = localStorage.getItem(`checklist_${simulationId}`);
    if (!raw || totalSteps === 0) return { completedCount: 0, totalSteps };
    const state: ChecklistState = JSON.parse(raw);
    const completedCount = Object.values(state).filter(Boolean).length;
    return { completedCount, totalSteps };
  } catch {
    return { completedCount: 0, totalSteps };
  }
};

export const useChecklist = (simulationId: string, totalSteps: number) => {
  const [state, setState] = useState<ChecklistState>(() => {
    try {
      const raw = localStorage.getItem(`checklist_${simulationId}`);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const toggle = useCallback(
    (index: number) => {
      setState((prev) => {
        const next = { ...prev, [index]: !prev[index] };
        localStorage.setItem(`checklist_${simulationId}`, JSON.stringify(next));
        return next;
      });
    },
    [simulationId],
  );

  const completedCount = Object.values(state).filter(Boolean).length;
  const isAllDone = totalSteps > 0 && completedCount === totalSteps;

  return { state, toggle, completedCount, isAllDone };
};
