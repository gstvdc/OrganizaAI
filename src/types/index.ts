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
