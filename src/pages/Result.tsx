import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { formatCurrency } from '../utils/formatters';
import { generateFinancialDiagnosis } from '../services/gemini';
import type { DiagnosisResponse, SimulationDetails } from '../services/gemini';

export const Result: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Initialize simulation state lazily from localStorage to avoid calling setSimulation in useEffect
  const [simulation] = useState<SimulationDetails | null>(() => {
    if (!id) return null;
    const savedSim = localStorage.getItem(`simulation_${id}`);
    return savedSim ? JSON.parse(savedSim) : null;
  });

  // Initialize diagnosis state lazily from cached diagnosis to avoid calling setDiagnosis in useEffect
  const [diagnosis, setDiagnosis] = useState<DiagnosisResponse | null>(() => {
    if (!id) return null;
    const cachedDiag = localStorage.getItem(`diagnosis_${id}`);
    return cachedDiag ? JSON.parse(cachedDiag) : null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDiagnosis = async (simData: SimulationDetails) => {
    setLoading(true);
    setError(null);

    try {
      const result = await generateFinancialDiagnosis(simData);
      setDiagnosis(result);

      // Cache the result
      localStorage.setItem(`diagnosis_${simData.id}`, JSON.stringify(result));
    } catch (err: unknown) {
      console.error(err);
      setError(
        'Ocorreu um erro ao gerar a análise da inteligência artificial. Por favor, tente novamente.',
      );
    } finally {
      setLoading(false);
    }
  };

  // Trigger api call if simulation exists and diagnosis is not loaded/cached yet
  useEffect(() => {
    if (simulation && !diagnosis) {
      const timer = setTimeout(() => {
        fetchDiagnosis(simulation);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [simulation, diagnosis]);

  const handleRetry = () => {
    if (simulation) {
      fetchDiagnosis(simulation);
    }
  };

  if (!simulation) {
    return (
      <div className="animate-fadeIn mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-white">
          Simulação não encontrada
        </h2>
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

  // Render score color dynamics with neon glow effects
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
            <h2 className="mt-1 text-3xl font-extrabold text-white">
              Olá, {profile.name}!
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              {profile.occupation ? `${profile.occupation}, ` : ''}
              {profile.age} anos • Objetivo:{' '}
              <span className="font-semibold text-accent-lime">
                {profile.mainGoal}
              </span>
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
            <span className="mb-1 block text-xs font-semibold text-slate-400">
              Receitas Totais
            </span>
            <span className="font-mono text-2xl font-bold text-emerald-400">
              {formatCurrency(finances.income.total)}
            </span>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-6 hover:border-white/10 transition-colors">
            <span className="mb-1 block text-xs font-semibold text-slate-400">
              Gastos Totais
            </span>
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

        {/* Dynamic Specific Savings Target Goal (2 to 12+ months indicator) */}
        {finances.targetGoal && finances.targetGoal.name && (
          <div className="mt-8 border-t border-white/5 pt-8">
            <h4 className="text-base font-bold text-white mb-4">
              🎯 Objetivo Específico: {finances.targetGoal.name}
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
                  <span className="text-slate-400 font-semibold">Quanto precisa poupar por mês:</span>
                  <span className="font-extrabold text-accent-lime font-mono">
                    {formatCurrency(finances.targetGoal.monthlyTarget)}
                  </span>
                </div>
              </div>

              <div className={`p-4 rounded-xl border flex flex-col justify-center ${
                finances.netBalance >= finances.targetGoal.monthlyTarget
                  ? 'border-emerald-500/20 bg-emerald-500/5'
                  : 'border-amber-500/20 bg-amber-500/5'
              }`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span>{finances.netBalance >= finances.targetGoal.monthlyTarget ? '✅' : '⚠️'}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    finances.netBalance >= finances.targetGoal.monthlyTarget 
                      ? 'text-emerald-400' 
                      : 'text-amber-400'
                  }`}>
                    {finances.netBalance >= finances.targetGoal.monthlyTarget ? 'Viabilidade Positiva!' : 'Requer Ajustes'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {finances.netBalance >= finances.targetGoal.monthlyTarget
                    ? `Parabéns! Sua sobra atual de ${formatCurrency(finances.netBalance)}/mês cobre os ${formatCurrency(finances.targetGoal.monthlyTarget)}/mês necessários para este objetivo.`
                    : `Sua sobra de ${formatCurrency(finances.netBalance)}/mês é menor do que a meta necessária. Para alcançar, você precisará economizar mais ${formatCurrency(finances.targetGoal.monthlyTarget - finances.netBalance)}/mês ou adiar o prazo para ${Math.ceil(finances.targetGoal.value / Math.max(1, finances.netBalance))} meses.`
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. IA Diagnosis Box */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white">
          Diagnóstico e Recomendações OrganizAI
        </h3>

        {/* LOADING STATE - SKELETON */}
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

        {/* ERROR STATE */}
        {error && !loading && (
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 text-center">
            <p className="mb-4 text-sm text-rose-400">
              {error}
            </p>
            <Button onClick={handleRetry}>Tentar Novamente</Button>
          </div>
        )}

        {/* DIAGNOSIS RESULTS CONTAINER */}
        {diagnosis && !loading && (
          <div className="space-y-8">
            {/* Score & General Diagnostic */}
            <div className="flex flex-col items-center gap-8 rounded-3xl border border-white/5 bg-white/[0.01] p-6 shadow-2xl md:flex-row">
              {/* Score visualizer */}
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

              {/* Text diagnosis */}
              <div className="flex-1 space-y-3">
                <h4 className="text-lg font-bold text-white">
                  Análise Financeira Geral
                </h4>
                <p className="text-sm leading-relaxed whitespace-pre-line text-slate-300">
                  {diagnosis.diagnosticoGeral}
                </p>
              </div>
            </div>

            {/* Pros and Cons lists */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Pontos Fortes */}
              <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/5 p-6 text-emerald-400">
                <h4 className="mb-4 flex items-center gap-2 text-sm font-bold">
                  <span>✓</span> Pontos Fortes Financeiros
                </h4>
                <ul className="space-y-3">
                  {diagnosis.pontosFortes.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-xs leading-relaxed text-slate-300"
                    >
                      <span className="text-emerald-400">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Oportunidades de Melhoria */}
              <div className="rounded-2xl border border-amber-500/15 bg-amber-500/5 p-6 text-amber-400">
                <h4 className="mb-4 flex items-center gap-2 text-sm font-bold">
                  <span>⚠</span> Oportunidades de Melhoria
                </h4>
                <ul className="space-y-3">
                  {diagnosis.oportunidadesMelhoria.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-xs leading-relaxed text-slate-300"
                    >
                      <span className="text-amber-400">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Plan timeline */}
            {diagnosis.planoAcao.length > 0 && (
              <div className="rounded-3xl border border-white/5 bg-white/[0.01] p-6 shadow-2xl">
                <h4 className="mb-6 text-lg font-bold text-white">
                  Seu Plano de Ação Passo a Passo
                </h4>

                <div className="relative space-y-6 before:absolute before:inset-y-1 before:left-3.5 before:w-0.5 before:bg-violet-600/30">
                  {diagnosis.planoAcao.map((step, idx) => (
                    <div
                      key={idx}
                      className="animate-fadeIn relative flex gap-4"
                    >
                      {/* Badge Icon */}
                      <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-accent-lime text-xs font-bold text-space-950 shadow-[0_0_10px_rgba(197,255,34,0.3)]">
                        {idx + 1}
                      </div>

                      <div className="flex-1 rounded-xl border border-white/5 bg-white/[0.02] p-4 hover:border-white/10 transition-colors">
                        <h5 className="text-sm font-bold text-white">
                          {step.titulo}
                        </h5>
                        <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                          {step.descricao}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. Footer Action Buttons */}
      <div className="flex flex-col justify-end gap-4 border-t border-white/5 pt-6 sm:flex-row">
        <Link to="/simulacao">
          <Button variant="outline">Fazer Nova Simulação</Button>
        </Link>
        <Link to="/">
          <Button>Ir para o Início</Button>
        </Link>
      </div>
    </div>
  );
};
