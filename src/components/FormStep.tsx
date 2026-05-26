import React from 'react';

interface FormStepProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const FormStep: React.FC<FormStepProps> = ({
  title,
  subtitle,
  children,
}) => {
  return (
    <div className="animate-fadeIn space-y-6">
      <div className="border-b border-white/5 pb-4 text-left">
        <h3 className="text-xl font-extrabold text-white sm:text-2xl">
          {title}
        </h3>
        {subtitle && (
          <p className="mt-1.5 text-sm text-slate-400">
            {subtitle}
          </p>
        )}
      </div>

      <div className="py-2">{children}</div>
    </div>
  );
};
