import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { ScoreEvolutionChart } from '../components/ScoreEvolutionChart';
import { ChecklistProgressBadge } from '../components/ChecklistProgressBadge';
import { IconChartBar, IconArrowRight, IconSparkles, IconTrendingUp, IconNoEntry } from '../components/icons';
import { formatCurrency } from '../utils/formatters';
import type { SimulationDetails, DiagnosisResponse } from '../types';

type StoredSimulation = SimulationDetails;

function loadSimulations(): StoredSimulation[] {
  try {
    const raw = localStorage.getItem('simulations');
    if (!raw) return [];
    const list: StoredSimulation[] = JSON.parse(raw);
    return list.slice().reverse();
  } catch {
    return [];
  }
}

function loadCachedScore(id: string): number | null {
  try {
    const raw = localStorage.getItem(`diagnosis_${id}`);
    if (!raw) return null;
    const diag = JSON.parse(raw);
    return typeof diag.saudeFinanceiraScore === 'number' ? diag.saudeFinanceiraScore : null;
  } catch {
    return null;
  }
}

function loadCachedDiagnosis(id: string): DiagnosisResponse | null {
  try {
    const raw = localStorage.getItem(`diagnosis_${id}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function deleteSimulation(id: string, onDone: () => void) {
  try {
    const raw = localStorage.getItem('simulations');
    if (raw) {
      const list: StoredSimulation[] = JSON.parse(raw);
      localStorage.setItem('simulations', JSON.stringify(list.filter((s) => s.id !== id)));
    }
    localStorage.removeItem(`simulation_${id}`);
    localStorage.removeItem(`diagnosis_${id}`);
    localStorage.removeItem(`checklist_${id}`);
  } catch {
    // ignore
  }
  onDone();
}

function deleteAll(onDone: () => void) {
  try {
    const raw = localStorage.getItem('simulations');
    if (raw) {
      const list: StoredSimulation[] = JSON.parse(raw);
      list.forEach((s) => {
        localStorage.removeItem(`simulation_${s.id}`);
        localStorage.removeItem(`diagnosis_${s.id}`);
        localStorage.removeItem(`checklist_${s.id}`);
      });
    }
    localStorage.removeItem('simulations');
  } catch {
    // ignore
  }
  onDone();
}

const ScoreBadge: React.FC<{ score: number | null }> = ({ score }) => {
  if (score === null)
    return (
      <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-bold text-slate-500">
        Diagnóstico pendente
      </span>
    );
  const color =
    score < 50
      ? 'border-rose-500/30 bg-rose-500/10 text-rose-400'
      : score < 75
        ? 'border-amber-500/30 bg-amber-500/10 text-amber-400'
        : 'border-accent-lime/30 bg-accent-lime/10 text-accent-lime';
  return (
    <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${color}`}>
      Saúde {score}/100
    </span>
  );
};

export const History: React.FC = () => {
  const navigate = useNavigate();
  const [simulations, setSimulations] = useState<StoredSimulation[]>(loadSimulations);
  const [confirmClearAll, setConfirmClearAll] = useState(false);

  const refresh = () => setSimulations(loadSimulations());

  if (simulations.length === 0) {
    return (
      <div className="animate-fadeIn mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-500">
          <IconChartBar className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">Nenhuma simulação ainda</h2>
        <p className="mt-2 text-slate-400 text-sm">
          Faça sua primeira simulação financeira para ver o histórico aqui.
        </p>
        <div className="mt-8">
          <Link to="/simulacao">
            <Button size="lg" variant="primary" className="gap-2">
              <IconSparkles className="h-4 w-4" />
              Iniciar Simulação
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Histórico de Simulações</h1>
          <p className="mt-1 text-sm text-slate-400">
            {simulations.length} simulaç{simulations.length === 1 ? 'ão' : 'ões'} salva
            {simulations.length === 1 ? '' : 's'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/simulacao">
            <Button size="sm" variant="primary" className="gap-1.5">
              <IconSparkles className="h-3.5 w-3.5" />
              Nova Simulação
            </Button>
          </Link>
          {!confirmClearAll ? (
            <Button size="sm" variant="outline" onClick={() => setConfirmClearAll(true)}>
              Limpar tudo
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Tem certeza?</span>
              <Button
                size="sm"
                variant="outline"
                className="border-rose-500/40 text-rose-400 hover:bg-rose-500/10"
                onClick={() => deleteAll(refresh)}
              >
                Confirmar
              </Button>
              <Button size="sm" variant="outline" onClick={() => setConfirmClearAll(false)}>
                Cancelar
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Score Evolution Chart */}
      <div className="mb-8">
        <ScoreEvolutionChart simulations={[...simulations].reverse()} />
      </div>

      {/* Simulation cards */}
      <div className="space-y-4">
        {simulations.map((sim) => {
          const score = loadCachedScore(sim.id);
          const diagnosis = loadCachedDiagnosis(sim.id);
          const totalSteps = diagnosis?.planoAcao?.length ?? 0;
          const { profile, finances } = sim;
          const isPositive = finances.netBalance >= 0;

          return (
            <div
              key={sim.id}
              className="glass-panel rounded-2xl p-5 transition-all duration-200 hover:border-white/15 relative overflow-hidden"
            >
              <div
                className={`absolute top-0 right-0 -z-10 h-[120px] w-[120px] rounded-full blur-[50px] ${isPositive ? 'bg-accent-lime/5' : 'bg-rose-500/5'}`}
              />

              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                {/* Left: identity */}
                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <ScoreBadge score={score} />
                    <span className="text-[10px] text-slate-500">{sim.date}</span>
                  </div>
                  <h3 className="text-base font-bold text-white truncate">{profile.name}</h3>
                  <p className="text-xs text-slate-400 truncate">
                    {profile.occupation && `${profile.occupation} · `}
                    {profile.mainGoal}
                  </p>
                  {totalSteps > 0 && (
                    <ChecklistProgressBadge simulationId={sim.id} totalSteps={totalSteps} />
                  )}
                </div>

                {/* Right: key metrics */}
                <div className="flex shrink-0 items-center gap-6">
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1 text-[9px] font-bold uppercase tracking-wider text-emerald-400">
                      <IconTrendingUp className="h-3 w-3" />
                      Receita
                    </div>
                    <span className="font-mono text-sm font-bold text-emerald-400">
                      {formatCurrency(finances.income.total)}
                    </span>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1 text-[9px] font-bold uppercase tracking-wider text-rose-400">
                      <IconNoEntry className="h-3 w-3" />
                      Gastos
                    </div>
                    <span className="font-mono text-sm font-bold text-rose-400">
                      {formatCurrency(finances.totalExpenses)}
                    </span>
                  </div>

                  <div className="text-right">
                    <div
                      className={`text-[9px] font-bold uppercase tracking-wider ${isPositive ? 'text-accent-lime' : 'text-amber-400'}`}
                    >
                      Saldo
                    </div>
                    <span
                      className={`font-mono text-sm font-bold ${isPositive ? 'text-accent-lime' : 'text-amber-400'}`}
                    >
                      {formatCurrency(finances.netBalance)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer actions */}
              <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => deleteSimulation(sim.id, refresh)}
                    className="text-xs text-slate-500 transition-colors hover:text-rose-400"
                  >
                    Excluir
                  </button>
                  <button
                    onClick={() => navigate(`/simulacao?edit=${sim.id}`)}
                    className="text-xs text-slate-500 transition-colors hover:text-accent-lime"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => navigate(`/comparar?a=${sim.id}`)}
                    className="text-xs text-slate-500 transition-colors hover:text-violet-400"
                  >
                    Comparar
                  </button>
                </div>
                <Link to={`/resultado/${sim.id}`}>
                  <Button size="sm" className="gap-1.5">
                    Ver Diagnóstico
                    <IconArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
