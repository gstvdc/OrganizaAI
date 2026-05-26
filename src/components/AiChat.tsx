import React, { useEffect, useRef, useState } from 'react';
import { Button } from './Button';
import { IconSparkles, IconArrowRight, IconLock } from './icons';
import { sendChatMessage } from '../services/gemini';
import { useApiKey } from '../hooks/useApiKey';
import type { SimulationDetails, DiagnosisResponse } from '../types';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const SUGGESTED_QUESTIONS = [
  'Como devo começar a investir com minha sobra mensal?',
  'O que fazer primeiro: quitar dívidas ou criar reserva?',
  'Como posso reduzir meus gastos variáveis?',
  'Minha meta financeira é viável?',
];

interface AiChatProps {
  simulation: SimulationDetails;
  diagnosis: DiagnosisResponse;
}

export const AiChat: React.FC<AiChatProps> = ({ simulation, diagnosis }) => {
  const { apiKey, hasApiKey } = useApiKey();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMessage: Message = { role: 'user', text: trimmed };
    const nextHistory = [...messages, userMessage];
    setMessages(nextHistory);
    setInput('');
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
    setError(null);
    setLoading(true);

    try {
      const response = await sendChatMessage(
        messages,
        trimmed,
        simulation,
        diagnosis,
        apiKey,
      );
      setMessages([...nextHistory, { role: 'model', text: response }]);
    } catch {
      setError('Não foi possível obter resposta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  if (!hasApiKey) {
    return (
      <div className="glass-panel rounded-3xl p-8 flex flex-col items-center justify-center gap-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-slate-500 border border-white/10">
          <IconLock className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-300">Chat indisponível</p>
          <p className="mt-1 text-xs text-slate-500 max-w-xs">
            Configure sua API Key do Gemini na seção de diagnóstico para usar o chat.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-3xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-white/5 px-6 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/30 to-accent-lime/20 text-accent-lime border border-white/10">
          <IconSparkles className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">Chat com OrganizAI</h3>
          <p className="text-[10px] text-slate-500">
            Tire dúvidas sobre sua situação financeira
          </p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-lime animate-pulse" />
          <span className="text-[10px] font-semibold text-accent-lime">Online</span>
        </div>
      </div>

      {/* Message area */}
      <div className="flex h-72 flex-col gap-4 overflow-y-auto px-6 py-4 scroll-smooth">
        {messages.length === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center text-center py-4">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-slate-500">
              <IconSparkles className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-slate-300">
              Olá, {simulation.profile.name.split(' ')[0]}!
            </p>
            <p className="mt-1 text-xs text-slate-500 max-w-xs">
              Tenho acesso ao seu diagnóstico completo. Pergunte o que quiser sobre sua vida financeira.
            </p>

            {/* Suggested questions */}
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-slate-400 transition-all hover:border-accent-lime/30 hover:bg-accent-lime/5 hover:text-accent-lime"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'model' && (
              <div className="mr-2 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/30 to-accent-lime/20 text-accent-lime border border-white/10">
                <IconSparkles className="h-3 w-3" />
              </div>
            )}
            <div
              className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'rounded-br-sm bg-accent-lime/15 text-white border border-accent-lime/20'
                  : 'rounded-bl-sm bg-white/[0.04] text-slate-300 border border-white/5'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="mr-2 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/30 to-accent-lime/20 text-accent-lime border border-white/10">
              <IconSparkles className="h-3 w-3" />
            </div>
            <div className="rounded-2xl rounded-bl-sm bg-white/[0.04] border border-white/5 px-4 py-3">
              <div className="flex gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-500 animate-bounce [animation-delay:0ms]" />
                <span className="h-1.5 w-1.5 rounded-full bg-slate-500 animate-bounce [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 rounded-full bg-slate-500 animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        {error && (
          <p className="text-center text-xs text-rose-400">{error}</p>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-white/5 px-4 py-3">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              const el = e.target;
              el.style.height = 'auto';
              el.style.height = `${Math.min(el.scrollHeight, 96)}px`;
            }}
            onKeyDown={handleKeyDown}
            placeholder="Pergunte sobre sua situação financeira… (Enter para enviar)"
            rows={1}
            className="flex-1 resize-none rounded-xl glass-input py-2.5 text-xs leading-relaxed focus:ring-1 focus:ring-accent-lime/30"
            style={{ maxHeight: '96px' }}
          />
          <Button
            size="sm"
            onClick={() => send(input)}
            disabled={!input.trim() || loading}
            className="shrink-0 gap-1"
          >
            <IconArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
        <p className="mt-1.5 text-[10px] text-slate-600">
          Shift+Enter para nova linha · Enter para enviar
        </p>
      </div>
    </div>
  );
};
