import type { SimulationDetails, DiagnosisResponse } from '../types';
import { buildFinancialPrompt } from '../utils/prompt';
import { formatCurrency } from '../utils/formatters';

export type { SimulationDetails, DiagnosisResponse };

const API_BASE = import.meta.env.DEV ? 'http://localhost:3000' : '';

export const generateFinancialDiagnosis = async (
  simulationData: SimulationDetails,
): Promise<DiagnosisResponse> => {
  const response = await fetch(`${API_BASE}/api/diagnose`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: buildFinancialPrompt(simulationData) }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? `Erro ${response.status}`);
  }
  const data = (await response.json()) as Partial<DiagnosisResponse>;
  return {
    diagnosticoGeral: data.diagnosticoGeral ?? '',
    pontosFortes: data.pontosFortes ?? [],
    oportunidadesMelhoria: data.oportunidadesMelhoria ?? [],
    planoAcao: data.planoAcao ?? [],
    saudeFinanceiraScore:
      typeof data.saudeFinanceiraScore === 'number' ? data.saudeFinanceiraScore : 70,
  };
};

const buildChatSystemPrompt = (
  simulation: SimulationDetails,
  diagnosis: DiagnosisResponse,
): string => {
  const { profile, finances } = simulation;
  return `Você é o OrganizAI, assistente de educação financeira pessoal de ${profile.name}.
Renda mensal: ${formatCurrency(finances.income.total)} | Despesas: ${formatCurrency(finances.totalExpenses)} | Saldo: ${formatCurrency(finances.netBalance)}
Objetivo: ${profile.mainGoal} | Score: ${diagnosis.saudeFinanceiraScore}/100
Dívidas: ${formatCurrency(finances.savingsAndDebts.currentDebts)} | Reservas: ${formatCurrency(finances.savingsAndDebts.amountSaved)}
Diagnóstico: "${diagnosis.diagnosticoGeral.substring(0, 300)}..."
Responda de forma empática, didática, referenciando os dados reais. Máximo 3 parágrafos.`;
};

export const sendChatMessage = async (
  history: { role: 'user' | 'model'; text: string }[],
  newMessage: string,
  simulation: SimulationDetails,
  diagnosis: DiagnosisResponse,
): Promise<string> => {
  const response = await fetch(`${API_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      history,
      newMessage,
      systemPrompt: buildChatSystemPrompt(simulation, diagnosis),
    }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? `Erro ${response.status}`);
  }
  const data = (await response.json()) as { text: string };
  return data.text;
};
