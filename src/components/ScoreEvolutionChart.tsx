import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { SimulationDetails } from '../types';

interface ChartSimulation extends SimulationDetails {
  saudeFinanceiraScore?: number;
}

const loadCachedScore = (id: string): number | null => {
  try {
    const raw = localStorage.getItem(`diagnosis_${id}`);
    if (!raw) return null;
    const diag = JSON.parse(raw);
    return typeof diag.saudeFinanceiraScore === 'number' ? diag.saudeFinanceiraScore : null;
  } catch {
    return null;
  }
};

interface ScoreEvolutionChartProps {
  simulations: ChartSimulation[];
}

export const ScoreEvolutionChart: React.FC<ScoreEvolutionChartProps> = ({ simulations }) => {
  const data = simulations
    .map((s) => ({
      date: s.date,
      score: loadCachedScore(s.id),
      label: s.profile.name,
    }))
    .filter((d): d is { date: string; score: number; label: string } => d.score !== null);

  return (
    <div className="glass-panel rounded-3xl p-6 shadow-2xl">
      <div className="mb-4">
        <h3 className="text-base font-bold text-white">Evolução da Saúde Financeira</h3>
        <p className="mt-0.5 text-xs text-slate-400">Score ao longo das suas simulações</p>
      </div>

      {data.length < 2 ? (
        <div className="flex h-40 items-center justify-center rounded-2xl border border-white/5 bg-white/[0.02]">
          <p className="text-center text-xs text-slate-500 max-w-xs px-4">
            Faça pelo menos 2 simulações com diagnóstico para ver a evolução do seu score.
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} />
            <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                background: '#030014',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '12px',
              }}
              labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
              formatter={(value) => [`${value}/100`, 'Score']}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#c5ff22"
              strokeWidth={2}
              dot={{ fill: '#c5ff22', r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#c5ff22' }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
