import { formatCurrency } from './formatters';

interface SimulationDetails {
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

export const buildFinancialPrompt = (data: SimulationDetails): string => {
  const { profile, finances } = data;

  let targetGoalSection = '';
  if (finances.targetGoal && finances.targetGoal.name) {
    const tg = finances.targetGoal;
    targetGoalSection = `
### META DE ECONOMIA ESPECÍFICA DO USUÁRIO
- O usuário definiu uma meta de economia específica: "${tg.name}"
- Valor alvo necessário: ${formatCurrency(tg.value)}
- Prazo desejado: ${tg.months} meses
- Valor que ele precisa economizar por mês: ${formatCurrency(tg.monthlyTarget)} por mês.

Por favor, inclua orientações claras no diagnóstico e adicione passos práticos no Plano de Ação explicando se a meta é viável com a sobra atual dele (${formatCurrency(finances.netBalance)} por mês) e, se não for, dê dicas de como cortar gastos ou ajustar o prazo para alcançá-la.
`;
  }

  return `
Você é o OrganizAI, um Educador Financeiro com Inteligência Artificial sênior, empático, didático e altamente técnico.
Analise a situação financeira descrita a seguir e gere um diagnóstico completo e plano de ação estruturado.

### PERFIL DO USUÁRIO
- Nome: ${profile.name}
- Idade: ${profile.age} anos
- Ocupação: ${profile.occupation || 'Não informada'}
- Principal Objetivo Financeiro: ${profile.mainGoal}
${targetGoalSection}

### DADOS FINANCEIROS MENSAIS
- Receitas Totais: ${formatCurrency(finances.income.total)} (Salário: ${formatCurrency(finances.income.salary)}, Extras: ${formatCurrency(finances.income.additionalIncome)})
- Despesas Fixas Totais: ${formatCurrency(finances.fixedExpenses.total)}
  * Moradia: ${formatCurrency(finances.fixedExpenses.rentOrMortgage)}
  * Consumo Básico: ${formatCurrency(finances.fixedExpenses.utilities)}
  * Saúde: ${formatCurrency(finances.fixedExpenses.health)}
  * Educação: ${formatCurrency(finances.fixedExpenses.education)}
- Despesas Variáveis Totais: ${formatCurrency(finances.variableExpenses.total)}
  * Alimentação: ${formatCurrency(finances.variableExpenses.food)}
  * Lazer/Compras: ${formatCurrency(finances.variableExpenses.leisure)}
  * Transporte: ${formatCurrency(finances.variableExpenses.transport)}
  * Outros: ${formatCurrency(finances.variableExpenses.otherExpenses)}
- Saldo Mensal Líquido: ${formatCurrency(finances.netBalance)}
- Dívidas Pendentes: ${formatCurrency(finances.savingsAndDebts.currentDebts)}
- Valor Poupado / Reservas: ${formatCurrency(finances.savingsAndDebts.amountSaved)}

---

### INSTRUÇÃO DE RETORNO (OBRIGATÓRIO)
Você deve responder **APENAS** com um objeto JSON válido, sem tags markdown adicionais (como \`\`\`json ou \`\`\`), no seguinte formato exato:

{
  "diagnosticoGeral": "Texto curto (máximo de 3 parágrafos, em formato markdown amigável com quebras de linha \\n) contendo a análise geral das finanças do usuário frente ao seu objetivo principal e sua meta de economia (se aplicável).",
  "pontosFortes": [
    "Ponto forte 1 detalhado",
    "Ponto forte 2 detalhado"
  ],
  "oportunidadesMelhoria": [
    "Oportunidade de melhoria 1 detalhada",
    "Oportunidade de melhoria 2 detalhada"
  ],
  "planoAcao": [
    {
      "titulo": "Nome curto da ação (ex: Cortar assinaturas supérfluas)",
      "descricao": "Explicação detalhada e prática do que fazer e como fazer."
    },
    {
      "titulo": "Nome curto da ação 2",
      "descricao": "Explicação detalhada da ação 2."
    }
  ],
  "saudeFinanceiraScore": 75
}

Observações importantes para a análise:
- Seja realista, mas encorajador.
- Calcule a "saudeFinanceiraScore" de 0 a 100 com base em métricas reais (ex: taxa de poupança positiva, proporção de despesas fixas em relação à renda (regra 50/30/20), presença de dívidas acumuladas).
- O plano de ação deve ser focado no objetivo do usuário: "${profile.mainGoal}".
- Lembre-se de retornar APENAS o JSON puro. Não escreva textos antes ou depois.
`;
};
