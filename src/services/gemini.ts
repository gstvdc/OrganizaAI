import { GoogleGenerativeAI } from '@google/generative-ai';
import type { SimulationDetails, DiagnosisResponse } from '../types';
import { buildFinancialPrompt } from '../utils/prompt';
import { formatCurrency } from '../utils/formatters';

export type { SimulationDetails, DiagnosisResponse };

const getApiKey = (): string =>
  (import.meta.env.VITE_GEMINI_API_KEY as string | undefined)?.trim() ||
  localStorage.getItem('organizai_gemini_api_key')?.trim() ||
  '';

const sanitizeJsonResponse = (text: string): string => {
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```json\s*/i, '');
    cleaned = cleaned.replace(/^```\s*/, '');
    cleaned = cleaned.replace(/\s*```$/, '');
  }
  return cleaned.trim();
};

export const generateFinancialDiagnosis = async (
  simulationData: SimulationDetails,
): Promise<DiagnosisResponse> => {
  const ai = new GoogleGenerativeAI(getApiKey());
  const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });
  const prompt = buildFinancialPrompt(simulationData);

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();
  const sanitizedText = sanitizeJsonResponse(responseText);
  const parsedData: DiagnosisResponse = JSON.parse(sanitizedText);

  return {
    diagnosticoGeral: parsedData.diagnosticoGeral || '',
    pontosFortes: parsedData.pontosFortes || [],
    oportunidadesMelhoria: parsedData.oportunidadesMelhoria || [],
    planoAcao: parsedData.planoAcao || [],
    saudeFinanceiraScore:
      typeof parsedData.saudeFinanceiraScore === 'number' ? parsedData.saudeFinanceiraScore : 70,
  };
};

const buildChatSystemPrompt = (
  simulation: SimulationDetails,
  diagnosis: DiagnosisResponse,
): string => {
  const { profile, finances } = simulation;
  return `Você é o OrganizAI, assistente de educação financeira pessoal de ${profile.name}.

Dados financeiros do usuário:
- Renda mensal total: ${formatCurrency(finances.income.total)}
- Despesas totais: ${formatCurrency(finances.totalExpenses)}
- Saldo líquido mensal: ${formatCurrency(finances.netBalance)}
- Objetivo principal: ${profile.mainGoal}
- Nota de saúde financeira: ${diagnosis.saudeFinanceiraScore}/100
- Dívidas: ${formatCurrency(finances.savingsAndDebts.currentDebts)}
- Reservas: ${formatCurrency(finances.savingsAndDebts.amountSaved)}

Diagnóstico já emitido: "${diagnosis.diagnosticoGeral.substring(0, 300)}..."

Responda perguntas de acompanhamento de forma empática, didática e sempre referenciando os dados reais do usuário. Seja conciso (máximo 3 parágrafos). Não repita o diagnóstico completo.`;
};

export const sendChatMessage = async (
  history: { role: 'user' | 'model'; text: string }[],
  newMessage: string,
  simulation: SimulationDetails,
  diagnosis: DiagnosisResponse,
): Promise<string> => {
  const ai = new GoogleGenerativeAI(getApiKey());
  const model = ai.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: buildChatSystemPrompt(simulation, diagnosis),
  });

  const chat = model.startChat({
    history: history.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.text }],
    })),
  });

  const result = await chat.sendMessage(newMessage);
  return result.response.text();
};
