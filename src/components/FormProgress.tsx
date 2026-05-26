import React from 'react';

interface FormProgressProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export const FormProgress: React.FC<FormProgressProps> = ({
  currentStep,
  totalSteps,
  stepLabels,
}) => {
  const percentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between">
        <span className="inline-block rounded-full bg-accent-lime/10 border border-accent-lime/20 px-3 py-1 text-xs font-semibold text-accent-lime uppercase">
          Passo {currentStep} de {totalSteps}
        </span>
        <span className="inline-block text-xs font-semibold text-accent-lime">
          {percentage}% Completo
        </span>
      </div>

      {/* Progress Bar Container */}
      <div className="mb-6 flex h-2.5 overflow-hidden rounded-full bg-white/5 text-xs">
        <div
          style={{ width: `${percentage}%` }}
          className="flex flex-col justify-center bg-gradient-to-r from-violet-600 via-pink-500 to-accent-lime text-center whitespace-nowrap text-white shadow-[0_0_15px_rgba(197,255,34,0.3)] transition-all duration-500 ease-out"
        />
      </div>

      {/* Steps labels (Desktop only, elegant indicators) */}
      <div className="mb-6 hidden gap-2 text-center text-[10px] font-bold text-slate-400 sm:grid sm:grid-cols-6">
        {stepLabels.map((label, idx) => {
          const isCompleted = idx + 1 < currentStep;
          const isActive = idx + 1 === currentStep;

          return (
            <div
              key={idx}
              className={`border-t-2 pt-2 transition-all duration-300 ${
                isActive
                  ? 'border-accent-lime text-accent-lime font-extrabold'
                  : isCompleted
                    ? 'border-violet-500/50 text-slate-300'
                    : 'border-white/5 text-slate-600'
              }`}
            >
              {label}
            </div>
          );
        })}
      </div>
    </div>
  );
};
