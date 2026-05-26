import React, { useState } from 'react';
import { Button } from './Button';
import { IconLock, IconArrowRight, IconSparkles } from './icons';

const STEPS = [
  'Acesse o Google AI Studio',
  'Faça login com sua conta Google',
  'Clique em "Get API Key" e crie um projeto',
  'Copie a chave gerada e cole abaixo',
];

interface ApiKeySetupProps {
  onSave: (key: string) => void;
  error?: string | null;
}

export const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ onSave, error }) => {
  const [value, setValue] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSave = () => {
    const trimmed = value.trim();
    if (!trimmed) {
      setValidationError('Cole sua API Key antes de continuar.');
      return;
    }
    if (!trimmed.startsWith('AI')) {
      setValidationError('Chave inválida. A API Key do Gemini começa com "AI".');
      return;
    }
    setValidationError('');
    onSave(trimmed);
  };

  return (
    <div className="glass-panel rounded-3xl p-8 relative overflow-hidden">
      {/* Decorative blurs */}
      <div className="absolute top-0 right-0 -z-10 h-[180px] w-[180px] rounded-full bg-violet-600/8 blur-[60px]" />
      <div className="absolute bottom-0 left-0 -z-10 h-[120px] w-[120px] rounded-full bg-accent-lime/5 blur-[50px]" />

      {/* Icon + heading */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-accent-lime/10 border border-white/10 text-accent-lime">
          <IconSparkles className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white">Configure sua API Key do Gemini</h3>
          <p className="text-xs text-slate-400">Necessária para gerar o diagnóstico com IA real</p>
        </div>
      </div>

      {/* Steps */}
      <ol className="mb-6 space-y-2">
        {STEPS.map((step, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-lime/10 text-[10px] font-bold text-accent-lime border border-accent-lime/20">
              {idx + 1}
            </span>
            <span className="text-xs text-slate-300 leading-relaxed">{step}</span>
          </li>
        ))}
      </ol>

      {/* AI Studio link */}
      <a
        href="https://aistudio.google.com/app/apikey"
        target="_blank"
        rel="noopener noreferrer"
        className="mb-6 inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-300 transition-all hover:border-accent-lime/30 hover:bg-accent-lime/5 hover:text-accent-lime"
      >
        <IconArrowRight className="h-3.5 w-3.5" />
        Abrir Google AI Studio →
      </a>

      {/* Input */}
      <div className="space-y-2">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
            <IconLock className="h-4 w-4" />
          </span>
          <input
            type="password"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setValidationError('');
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            placeholder="Cole sua API Key aqui (AIza...)"
            className="w-full glass-input pl-10 font-mono text-sm tracking-wider"
          />
        </div>
        {(validationError || error) && (
          <p className="text-xs font-medium text-rose-400">{validationError || error}</p>
        )}
      </div>

      {/* Action */}
      <div className="mt-5 flex items-center gap-3">
        <Button onClick={handleSave} className="gap-2">
          <IconSparkles className="h-4 w-4" />
          Salvar e Gerar Diagnóstico
        </Button>
        <p className="text-[10px] text-slate-600">
          A chave fica salva localmente no seu navegador.
        </p>
      </div>
    </div>
  );
};
