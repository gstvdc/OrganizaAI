import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { AiChat } from '../components/AiChat';
import { ActionPlanChecklist } from '../components/ActionPlanChecklist';
import { Button } from '../components/Button';
import { formatCurrency } from '../utils/formatters';
import { generateFinancialDiagnosis } from '../services/gemini';
import { exportDiagnosisPdf } from '../utils/exportPdf';
import { MOCK_DIAGNOSIS } from '../data/mockDiagnosis';
import type { DiagnosisResponse, SimulationDetails } from '../types';

export const Result: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [simulation] = useState<SimulationDetails | null>(() => {
    if (!id) return null;
    const raw = localStorage.getItem(`simulation_${id}`);
    return raw ? JSON.parse(raw) : null;
  });

  const [diagnosis, setDiagnosis] = useState<DiagnosisResponse | null>(() => {
    if (!id) return null;
    const raw = localStorage.getItem(`diagnosis_${id}`);
    return raw ? JSON.parse(raw) : null;
  });

  const [loading, setLoading] = useState(() => !!id && !localStorage.getItem(`diagnosis_${id}`));
  const [isExporting, setIsExporting] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    if (!simulation || diagnosis) return;
    const controller = new AbortController();
    const { signal } = controller;
    generateFinancialDiagnosis(simulation, signal)
      .then((result) => {
        if (signal.aborted) return;
        setDiagnosis(result);
        setIsDemoMode(false);
        localStorage.setItem(`diagnosis_${simulation.id}`, JSON.stringify(result));
      })
      .catch((err) => {
        if (signal.aborted) return;
        console.error(err);
        setDiagnosis(MOCK_DIAGNOSIS);
        setIsDemoMode(true);
        localStorage.setItem(`diagnosis_${simulation.id}`, JSON.stringify(MOCK_DIAGNOSIS));
      })
      .finally(() => {
        if (!signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [simulation]);

  if (!simulation) {
    return (
      <div className="animate-fadeIn mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-white">Simulação não encontrada</h2>
        <p className="mt-2 text-slate-400">
          O identificador fornecido não corresponde a nenhuma simulação ativa.
        </p>
        <Link to="/" className="mt-6 inline-block">
          <Button>Voltar ao Início</Button>
        </Link>
      </div>
    );
  }

  const { profile, finances } = simulation;

  const getScoreColorClass = (score: number) => {
    if (score < 50)
      return 'text-rose-400 border-rose-500/20 bg-rose-500/5 shadow-[0_0_20px_rgba(244,63,94,0.15)]';
    if (score < 75)
      return 'text-amber-400 border-amber-500/20 bg-amber-500/5 shadow-[0_0_20px_rgba(245,158,11,0.15)]';
    return 'text-accent-lime border-accent-lime/20 bg-accent-lime/5 shadow-[0_0_25px_rgba(197,255,34,0.2)]';
  };

  return (
    <div className="animate-fadeIn mx-auto max-w-5xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">

      {/* 1. Header Card */}
      <div className="glass-panel rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 h-[150px] w-[150px] rounded-full bg-violet-600/10 blur-[45px]" />

        <div className="flex flex-col items-start justify-between gap-4 border-b border-white/5 pb-6 md:flex-row md:items-center">
          <div>
            <span className="text-[10px] font-bold tracking-wider text-accent-lime uppercase">
              Simulação Realizada em {simulation.date}
            </span>
            <h2 className="mt-1 text-3xl font-extrabold text-white">Olá, {profile.name}!</h2>
            <p className="mt-1 text-sm text-slate-400">
              {profile.occupation ? `${profile.occupation}, ` : ''}
              {profile.age} anos • Objetivo:{' '}
              <span className="font-semibold text-accent-lime">{profile.mainGoal}</span>
            </p>
          </div>
          <div className="text-left md:text-right">
            <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wide">
              ID da Simulação
            </span>
            <code className="rounded bg-white/5 border border-white/10 px-2.5 py-1.5 font-mono text-xs text-slate-300">
              {simulation.id}
            </code>
          </div>
        </div>

        {/* Financial Balance Summary */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-6 hover:border-white/10 transition-colors">
            <span className="mb-1 block text-xs font-semibold text-slate-400">Receitas Totais</span>
            <span className="font-mono text-2xl font-bold text-emerald-400">
              {formatCurrency(finances.income.total)}
            </span>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-6 hover:border-white/10 transition-colors">
            <span className="mb-1 block text-xs font-semibold text-slate-400">Gastos Totais</span>
            <span className="font-mono text-2xl font-bold text-rose-400">
              {formatCurrency(finances.totalExpenses)}
            </span>
          </div>

          <div
            className={`rounded-2xl border p-6 ${
              finances.netBalance >= 0
                ? 'border-accent-lime/20 bg-accent-lime/5'
                : 'border-rose-500/20 bg-rose-500/5'
            }`}
          >
            <span
              className={`mb-1 block text-xs font-semibold ${
                finances.netBalance >= 0 ? 'text-accent-lime' : 'text-rose-400'
              }`}
            >
              Saldo Mensal Restante
            </span>
            <span
              className={`font-mono text-2xl font-bold ${
                finances.netBalance >= 0 ? 'text-accent-lime' : 'text-rose-400'
              }`}
            >
              {formatCurrency(finances.netBalance)}
            </span>
          </div>
        </div>

        {/* Specific savings goal */}
        {finances.targetGoal && finances.targetGoal.name && (
          <div className="mt-8 border-t border-white/5 pt-8">
            <h4 className="text-base font-bold text-white mb-4">
              Objetivo Específico: {finances.targetGoal.name}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-2.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Valor necessário:</span>
                  <span className="font-bold text-white font-mono">
                    {formatCurrency(finances.targetGoal.value)}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Prazo estipulado:</span>
                  <span className="font-semibold text-white">
                    {finances.targetGoal.months} meses
                  </span>
                </div>
                <div className="flex justify-between text-xs border-t border-white/5 pt-2.5">
                  <span className="text-slate-400 font-semibold">
                    Quanto precisa poupar por mês:
                  </span>
                  <span className="font-extrabold text-accent-lime font-mono">
                    {formatCurrency(finances.targetGoal.monthlyTarget)}
                  </span>
                </div>
              </div>

              <div
                className={`p-4 rounded-xl border flex flex-col justify-center ${
                  finances.netBalance >= finances.targetGoal.monthlyTarget
                    ? 'border-emerald-500/20 bg-emerald-500/5'
                    : 'border-amber-500/20 bg-amber-500/5'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${
                      finances.netBalance >= finances.targetGoal.monthlyTarget
                        ? 'text-emerald-400'
                        : 'text-amber-400'
                    }`}
                  >
                    {finances.netBalance >= finances.targetGoal.monthlyTarget
                      ? 'Viabilidade Positiva!'
                      : 'Requer Ajustes'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {finances.netBalance >= finances.targetGoal.monthlyTarget
                    ? `Parabéns! Sua sobra atual de ${formatCurrency(finances.netBalance)}/mês cobre os ${formatCurrency(finances.targetGoal.monthlyTarget)}/mês necessários para este objetivo.`
                    : `Sua sobra de ${formatCurrency(finances.netBalance)}/mês é menor do que a meta necessária. Para alcançar, você precisará economizar mais ${formatCurrency(finances.targetGoal.monthlyTarget - finances.netBalance)}/mês ou adiar o prazo para ${Math.ceil(finances.targetGoal.value / Math.max(1, finances.netBalance))} meses.`}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Diagnosis section */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white">
          Diagnóstico e Recomendações OrganizAI
        </h3>

        {isDemoMode && (
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-xs text-amber-400">
            Diagnóstico de demonstração — o serviço de IA não está disponível no momento. Os dados exibidos são ilustrativos.
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="animate-pulse space-y-6 rounded-3xl border border-white/5 bg-white/[0.01] p-6 shadow-2xl">
            <div className="flex flex-col items-center gap-6 md:flex-row">
              <div className="h-24 w-24 flex-shrink-0 rounded-full bg-white/5 border border-white/10" />
              <div className="w-full flex-1 space-y-3">
                <div className="h-4 w-2/3 rounded bg-white/5" />
                <div className="h-3 w-full rounded bg-white/5" />
                <div className="h-3 w-5/6 rounded bg-white/5" />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 border-t border-white/5 pt-6 md:grid-cols-2">
              <div className="h-28 rounded-xl bg-white/5" />
              <div className="h-28 rounded-xl bg-white/5" />
            </div>
          </div>
        )}

        {/* Results */}
        {diagnosis && !loading && (
          <div className="space-y-8">
            {/* Score & General Diagnostic */}
            <div className="flex flex-col items-center gap-8 rounded-3xl border border-white/5 bg-white/[0.01] p-6 shadow-2xl md:flex-row">
              <div className="flex-shrink-0 text-center">
                <div
                  className={`flex h-28 w-28 flex-col items-center justify-center rounded-full border-2 ${getScoreColorClass(diagnosis.saudeFinanceiraScore)}`}
                >
                  <span className="font-mono text-3xl font-extrabold">
                    {diagnosis.saudeFinanceiraScore}
                  </span>
                  <span className="text-[9px] font-bold tracking-wider uppercase opacity-85">
                    Saúde
                  </span>
                </div>
              </div>
              <div className="flex-1 space-y-3">
                <h4 className="text-lg font-bold text-white">Análise Financeira Geral</h4>
                <div className="space-y-2">
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => (
                        <p className="mb-3 text-sm leading-relaxed text-slate-300 last:mb-0">
                          {children}
                        </p>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-bold text-white">{children}</strong>
                      ),
                      ul: ({ children }) => (
                        <ul className="mt-2 list-inside list-disc space-y-1 text-slate-400">
                          {children}
                        </ul>
                      ),
                      li: ({ children }) => (
                        <li className="text-sm leading-relaxed">{children}</li>
                      ),
                    }}
                  >
                    {diagnosis.diagnosticoGeral}
                  </ReactMarkdown>
                </div>
              </div>
            </div>

            {/* Pros and Cons */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/5 p-6 text-emerald-400">
                <h4 className="mb-4 text-sm font-bold">
                  Pontos Fortes Financeiros
                </h4>
                <ul className="space-y-3">
                  {diagnosis.pontosFortes.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs leading-relaxed text-slate-300">
                      <span className="text-emerald-400">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-amber-500/15 bg-amber-500/5 p-6 text-amber-400">
                <h4 className="mb-4 text-sm font-bold">
                  Oportunidades de Melhoria
                </h4>
                <ul className="space-y-3">
                  {diagnosis.oportunidadesMelhoria.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs leading-relaxed text-slate-300">
                      <span className="text-amber-400">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Plan Checklist */}
            {diagnosis.planoAcao.length > 0 && (
              <ActionPlanChecklist
                simulationId={simulation.id}
                steps={diagnosis.planoAcao}
              />
            )}
          </div>
        )}
      </div>

      {/* 3. AI Chat — only after diagnosis is ready */}
      {diagnosis && !loading && (
        <div>
          <h3 className="mb-4 text-xl font-bold text-white">Converse com a OrganizAI</h3>
          <AiChat simulation={simulation} diagnosis={diagnosis} isDemoMode={isDemoMode} />
        </div>
      )}

      {/* 4. Footer actions */}
      <div className="flex flex-wrap justify-end gap-4 border-t border-white/5 pt-6">
        {diagnosis && !loading && (
          <Button
            variant="outline"
            onClick={async () => {
              setIsExporting(true);
              await exportDiagnosisPdf(simulation, diagnosis);
              setIsExporting(false);
            }}
            className="gap-2"
            disabled={isExporting}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {isExporting ? 'Gerando...' : 'Exportar PDF'}
          </Button>
        )}
        <Link to="/historico">
          <Button variant="outline">Ver Histórico</Button>
        </Link>
        <Link to="/simulacao">
          <Button variant="outline">Nova Simulação</Button>
        </Link>
        <Link to="/">
          <Button>Ir para o Início</Button>
        </Link>
      </div>
    </div>
  );
};
