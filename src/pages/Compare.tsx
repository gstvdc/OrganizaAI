import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { formatCurrency } from '../utils/formatters';
import type { DiagnosisResponse, SimulationDetails } from '../types';

type StoredSimulation = SimulationDetails;

function loadAllSimulations(): StoredSimulation[] {
  try {
    const raw = localStorage.getItem('simulations');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function loadSimulationById(id: string): StoredSimulation | null {
  try {
    const raw = localStorage.getItem(`simulation_${id}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function loadCachedScore(id: string): number | null {
  try {
    const raw = localStorage.getItem(`diagnosis_${id}`);
    if (!raw) return null;
    const diag: DiagnosisResponse = JSON.parse(raw);
    return typeof diag.saudeFinanceiraScore === 'number' ? diag.saudeFinanceiraScore : null;
  } catch {
    return null;
  }
}

interface CompareRow {
  label: string;
  valueA: number;
  valueB: number;
  higherIsBetter: boolean;
}

const ScoreCircle: React.FC<{ score: number | null }> = ({ score }) => {
  if (score === null)
    return <span className="text-sm text-slate-500">Diagnóstico pendente</span>;
  const color =
    score < 50
      ? 'text-rose-400 border-rose-500/30'
      : score < 75
        ? 'text-amber-400 border-amber-500/30'
        : 'text-accent-lime border-accent-lime/30';
  return (
    <div
      className={`flex h-16 w-16 flex-col items-center justify-center rounded-full border-2 ${color}`}
    >
      <span className="font-mono text-xl font-extrabold">{score}</span>
      <span className="text-[8px] font-bold uppercase opacity-80">Score</span>
    </div>
  );
};

export const Compare: React.FC = () => {
  const allSimulations = loadAllSimulations();
  const [searchParams] = useSearchParams();
  const [idA, setIdA] = useState(() => searchParams.get('a') ?? '');
  const [idB, setIdB] = useState('');

  const simA = idA ? loadSimulationById(idA) : null;
  const simB = idB ? loadSimulationById(idB) : null;
  const scoreA = idA ? loadCachedScore(idA) : null;
  const scoreB = idB ? loadCachedScore(idB) : null;

  const rows: CompareRow[] = simA && simB
    ? [
        { label: 'Renda Total', valueA: simA.finances.income.total, valueB: simB.finances.income.total, higherIsBetter: true },
        { label: 'Despesas Fixas', valueA: simA.finances.fixedExpenses.total, valueB: simB.finances.fixedExpenses.total, higherIsBetter: false },
        { label: 'Despesas Variáveis', valueA: simA.finances.variableExpenses.total, valueB: simB.finances.variableExpenses.total, higherIsBetter: false },
        { label: 'Saldo Líquido', valueA: simA.finances.netBalance, valueB: simB.finances.netBalance, higherIsBetter: true },
        { label: 'Dívidas', valueA: simA.finances.savingsAndDebts.currentDebts, valueB: simB.finances.savingsAndDebts.currentDebts, higherIsBetter: false },
        { label: 'Reservas', valueA: simA.finances.savingsAndDebts.amountSaved, valueB: simB.finances.savingsAndDebts.amountSaved, higherIsBetter: true },
      ]
    : [];

  const getCellClass = (a: number, b: number, higherIsBetter: boolean, isA: boolean): string => {
    if (a === b) return 'text-slate-300';
    const aIsBetter = higherIsBetter ? a > b : a < b;
    if (isA) return aIsBetter ? 'text-accent-lime font-bold' : 'text-rose-400';
    return aIsBetter ? 'text-rose-400' : 'text-accent-lime font-bold';
  };

  if (allSimulations.length < 2) {
    return (
      <div className="animate-fadeIn mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-white">Simulações insuficientes</h2>
        <p className="mt-2 text-slate-400 text-sm">
          Você precisa de pelo menos 2 simulações para fazer uma comparação.
        </p>
        <div className="mt-8">
          <Link to="/simulacao">
            <Button>Fazer nova simulação</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-white">Comparar Simulações</h1>
        <p className="mt-1 text-sm text-slate-400">
          Selecione duas simulações para ver as diferenças lado a lado.
        </p>
      </div>

      {/* Selects */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        {([
          { id: idA, setId: setIdA, label: 'Simulação A', other: idB },
          { id: idB, setId: setIdB, label: 'Simulação B', other: idA },
        ] as const).map(({ id, setId, label, other }) => (
          <div key={label} className="glass-panel rounded-2xl p-4">
            <label className="mb-2 block text-xs font-bold text-slate-400 uppercase tracking-wider">
              {label}
            </label>
            <select
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="w-full glass-input bg-transparent text-sm"
            >
              <option value="">Selecionar simulação...</option>
              {allSimulations
                .filter((s) => s.id !== other)
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.profile.name} — {s.date}
                  </option>
                ))}
            </select>
          </div>
        ))}
      </div>

      {/* Side-by-side comparison */}
      {simA && simB && (
        <div className="space-y-6 animate-fadeIn">
          {/* Profile cards */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { sim: simA, score: scoreA, label: 'A' },
              { sim: simB, score: scoreB, label: 'B' },
            ].map(({ sim, score, label }) => (
              <div
                key={label}
                className="glass-panel rounded-2xl p-5 flex flex-col items-center gap-3 text-center"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Simulação {label}
                </span>
                <ScoreCircle score={score} />
                <div>
                  <p className="font-bold text-white">{sim.profile.name}</p>
                  <p className="text-xs text-slate-400">{sim.profile.occupation}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{sim.date}</p>
                </div>
                <Link to={`/resultado/${sim.id}`}>
                  <Button size="sm" variant="outline">
                    Ver diagnóstico
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          {/* Comparison table */}
          <div className="overflow-hidden rounded-2xl border border-white/5 bg-white/[0.01]">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-white/5 bg-white/5">
                  <th className="p-4 text-left font-semibold text-slate-300">Categoria</th>
                  <th className="p-4 text-right font-semibold text-slate-300">
                    {simA.profile.name}
                  </th>
                  <th className="p-4 text-right font-semibold text-slate-300">
                    {simB.profile.name}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {rows.map((row) => (
                  <tr key={row.label} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 text-slate-300">{row.label}</td>
                    <td
                      className={`p-4 text-right font-mono ${getCellClass(row.valueA, row.valueB, row.higherIsBetter, true)}`}
                    >
                      {formatCurrency(row.valueA)}
                    </td>
                    <td
                      className={`p-4 text-right font-mono ${getCellClass(row.valueA, row.valueB, row.higherIsBetter, false)}`}
                    >
                      {formatCurrency(row.valueB)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-[10px] text-slate-500 text-center">
            Verde = melhor valor • Vermelho = pior valor
          </p>
        </div>
      )}
    </div>
  );
};
