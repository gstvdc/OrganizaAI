import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildFinancialPrompt } from '../utils/prompt';
import { formatCurrency } from '../utils/formatters';

export interface SimulationDetails {
  id: string;
  date: string;
  profile: {
    name: string;
    age: number;
    occupation: string;
    mainGoal: string;
  };
  finances: {
    income: {
      salary: number;
      additionalIncome: number;
      total: number;
    };
    fixedExpenses: {
      rentOrMortgage: number;
      utilities: number;
      health: number;
      education: number;
      total: number;
    };
    variableExpenses: {
      food: number;
      leisure: number;
      transport: number;
      otherExpenses: number;
      total: number;
    };
    savingsAndDebts: {
      amountSaved: number;
      currentDebts: number;
    };
    targetGoal?: {
      name: string;
      value: number;
      months: number;
      monthlyTarget: number;
    };
    totalExpenses: number;
    netBalance: number;
  };
}

export interface DiagnosisResponse {
  diagnosticoGeral: string;
  pontosFortes: string[];
  oportunidadesMelhoria: string[];
  planoAcao: {
    titulo: string;
    descricao: string;
  }[];
  saudeFinanceiraScore: number;
}

/**
 * Generates a high-quality simulated AI response when no API Key is present.
 */
export const generateMockFinancialDiagnosis = (
  simulationData: SimulationDetails,
): DiagnosisResponse => {
  const { profile, finances } = simulationData;
  const fixedRatio = Math.round((finances.fixedExpenses.total / finances.income.total) * 100);
  const variableRatio = Math.round((finances.variableExpenses.total / finances.income.total) * 100);
  const savingsRatio = Math.round((finances.netBalance / finances.income.total) * 100);

  // Calculate dynamic score
  let score = 70;
  if (finances.netBalance < 0) {
    score = 40;
  } else if (savingsRatio > 25) {
    score = 88;
  } else if (savingsRatio > 12) {
    score = 78;
  }
  
  if (finances.savingsAndDebts.currentDebts > 0) {
    score -= 15;
  }
  score = Math.max(10, Math.min(100, score));

  // Points of strength
  const pontosFortes: string[] = [];
  if (finances.netBalance > 0) {
    pontosFortes.push(
      `Capacidade de Poupança: Você possui um superávit mensal de ${formatCurrency(
        finances.netBalance,
      )} (cerca de ${savingsRatio}% da sua renda), o que é uma base sólida para investimentos.`,
    );
  } else {
    pontosFortes.push(
      `Consciência de Déficit: Identificar que você está fechando o mês com R$ ${formatCurrency(
        Math.abs(finances.netBalance),
      )} no vermelho é o primeiro passo para reestruturar as contas.`,
    );
  }
  
  if (finances.savingsAndDebts.amountSaved > 0) {
    pontosFortes.push(
      `Reserva Financeira Inicial: Você já possui R$ ${formatCurrency(
        finances.savingsAndDebts.amountSaved,
      )} poupados ou investidos, oferecendo segurança contra imprevistos.`,
    );
  }

  // Improvements
  const oportunidadesMelhoria: string[] = [];
  if (fixedRatio > 50) {
    oportunidadesMelhoria.push(
      `Comprometimento com Despesas Fixas: Seus custos fixos consomem ${fixedRatio}% da sua renda. O ideal (Regra 50/30/20) é mantê-los abaixo de 50% para liberar espaço para poupança.`,
    );
  }
  if (variableRatio > 35) {
    oportunidadesMelhoria.push(
      `Custos Variáveis Elevados: Suas despesas diárias (alimentação fora, lazer, compras) representam ${variableRatio}% do orçamento. Tente reduzi-los definindo limites semanais.`,
    );
  }
  if (finances.savingsAndDebts.currentDebts > 0) {
    oportunidadesMelhoria.push(
      `Juros de Dívidas Ativas: As pendências somam R$ ${formatCurrency(
        finances.savingsAndDebts.currentDebts,
      )}, consumindo seu poder de compra com tarifas adicionais.`,
    );
  }

  // Action plan
  const planoAcao = [];
  if (finances.savingsAndDebts.currentDebts > 0) {
    planoAcao.push({
      titulo: 'Renegociar e Quitar Dívidas',
      descricao: `Priorize a quitação do saldo de ${formatCurrency(
        finances.savingsAndDebts.currentDebts,
      )} negociando taxas de juros mais acessíveis e reduzindo custos extras.`,
    });
  }

  if (finances.targetGoal && finances.targetGoal.name) {
    const tg = finances.targetGoal;
    const isViable = finances.netBalance >= tg.monthlyTarget;
    planoAcao.push({
      titulo: `Planejamento para Meta: ${tg.name}`,
      descricao: isViable
        ? `Sua folga financeira permite destinar os ${formatCurrency(
            tg.monthlyTarget,
          )} mensais para a meta. Automatize essa transferência para garantir a conquista em ${tg.months} meses.`
        : `Você precisa economizar ${formatCurrency(
            tg.monthlyTarget,
          )} por mês. Como seu saldo atual é de ${formatCurrency(
            finances.netBalance,
          )}, reavalie cortar pelo menos ${formatCurrency(
            tg.monthlyTarget - finances.netBalance,
          )} de despesas variáveis.`,
    });
  } else {
    planoAcao.push({
      titulo: 'Formar Reserva de Emergência',
      descricao:
        'Crie uma reserva de segurança guardando mensalmente uma porcentagem de seus ganhos em uma conta de liquidez diária até cobrir 6 meses de gastos fixos.',
    });
  }

  planoAcao.push({
    titulo: 'Regra dos 10%',
    descricao:
      'Pague-se primeiro: assim que receber seu salário, separe 10% para investimentos antes mesmo de quitar as despesas variáveis.',
  });

  const goalText = finances.targetGoal
    ? `Seu objetivo de acumular ${formatCurrency(
        finances.targetGoal.value,
      )} em ${finances.targetGoal.months} meses exige poupar ${formatCurrency(
        finances.targetGoal.monthlyTarget,
      )} mensais.`
    : '';

  const diagnosticoGeral = `Olá, ${profile.name}. Analisamos com atenção o seu orçamento de ${
    profile.occupation || 'profissional'
  }. Suas receitas mensais somam ${formatCurrency(
    finances.income.total,
  )}, enquanto seus gastos consolidados alcançam ${formatCurrency(
    finances.totalExpenses,
  )}, resultando em um saldo mensal líquido de ${formatCurrency(
    finances.netBalance,
  )}.\n\nSua saúde financeira recebeu nota ${score}/100. ${goalText} ${
    finances.netBalance >= 0
      ? 'Você possui um saldo positivo, recomendando-se investir a folga imediatamente para acelerar seus objetivos.'
      : 'Seu saldo está negativo. Sugerimos revisar despesas de lazer e consumo básico com urgência para estancar a saída de caixa.'
  }`;

  return {
    diagnosticoGeral,
    pontosFortes,
    oportunidadesMelhoria,
    planoAcao,
    saudeFinanceiraScore: score,
  };
};

/**
 * Sanitizes an LLM output string, extracting raw JSON content
 * in case the model outputs markdown code blocks.
 */
const sanitizeJsonResponse = (text: string): string => {
  let cleaned = text.trim();
  // Remove markdown code blocks if present
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```json\s*/i, '');
    cleaned = cleaned.replace(/^```\s*/, '');
    cleaned = cleaned.replace(/\s*```$/, '');
  }
  return cleaned.trim();
};

export const generateFinancialDiagnosis = async (
  simulationData: SimulationDetails,
  customApiKey?: string,
): Promise<DiagnosisResponse> => {
  const apiKey =
    customApiKey || (import.meta.env.VITE_GEMINI_API_KEY as string);

  // If no API key is set, return a beautiful dynamic mock response directly!
  if (!apiKey || apiKey.trim() === '') {
    // Artificial delay to simulate AI processing for premium feel
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return generateMockFinancialDiagnosis(simulationData);
  }

  const ai = new GoogleGenerativeAI(apiKey);
  const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });
  const prompt = buildFinancialPrompt(simulationData);

  try {
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
        typeof parsedData.saudeFinanceiraScore === 'number'
          ? parsedData.saudeFinanceiraScore
          : 70,
    };
  } catch (error) {
    console.error('Error generating diagnosis from Gemini, falling back to mock:', error);
    // Fallback on failure so it never crashes
    return generateMockFinancialDiagnosis(simulationData);
  }
};
