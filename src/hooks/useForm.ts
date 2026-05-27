import { useState } from 'react';

export interface SimulationData {
  // Step 1: Perfil
  name: string;
  age: string;
  occupation: string;
  mainGoal: string;

  // Step 2: Receitas
  salary: string;
  additionalIncome: string;

  // Step 3: Despesas Fixas
  rentOrMortgage: string;
  utilities: string;
  health: string;
  education: string;

  // Step 4: Despesas Variáveis
  food: string;
  leisure: string;
  transport: string;
  otherExpenses: string;

  // Step 5: Reservas & Dívidas
  amountSaved: string;
  currentDebts: string;

  // Meta de Economia (Opcional)
  targetGoalName: string;
  targetGoalValue: string;
  targetGoalMonths: string;
}

const initialData: SimulationData = {
  name: '',
  age: '',
  occupation: '',
  mainGoal: '',
  salary: 'R$ 0,00',
  additionalIncome: 'R$ 0,00',
  rentOrMortgage: 'R$ 0,00',
  utilities: 'R$ 0,00',
  health: 'R$ 0,00',
  education: 'R$ 0,00',
  food: 'R$ 0,00',
  leisure: 'R$ 0,00',
  transport: 'R$ 0,00',
  otherExpenses: 'R$ 0,00',
  amountSaved: 'R$ 0,00',
  currentDebts: 'R$ 0,00',
  targetGoalName: '',
  targetGoalValue: 'R$ 0,00',
  targetGoalMonths: '',
};

export const useForm = (preloadData?: Partial<SimulationData>) => {
  const [formData, setFormData] = useState<SimulationData>({ ...initialData, ...preloadData });
  const [errors, setErrors] = useState<Partial<Record<keyof SimulationData, string>>>({});

  const updateField = (field: keyof SimulationData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof SimulationData, string>> = {};

    if (step === 1) {
      if (!formData.name.trim()) {
        newErrors.name = 'Por favor, insira o seu nome.';
      }
      if (!formData.age.trim()) {
        newErrors.age = 'Por favor, insira a sua idade.';
      } else {
        const numAge = Number(formData.age);
        if (isNaN(numAge) || numAge <= 0 || numAge > 120) {
          newErrors.age = 'Por favor, insira uma idade válida (ex: 25).';
        }
      }
      if (!formData.mainGoal.trim()) {
        newErrors.mainGoal = 'Por favor, selecione ou insira o seu principal objetivo.';
      }
    }

    if (step === 5) {
      if (formData.targetGoalName.trim()) {
        const valueNum = parseFloat(
          formData.targetGoalValue.replace(/[^\d,]/g, '').replace(',', '.'),
        );
        if (isNaN(valueNum) || valueNum <= 0) {
          newErrors.targetGoalValue = 'Insira um valor maior que R$ 0,00 para o objetivo.';
        }

        const monthsNum = parseInt(formData.targetGoalMonths, 10);
        if (
          !formData.targetGoalMonths.trim() ||
          isNaN(monthsNum) ||
          monthsNum <= 0 ||
          monthsNum > 360
        ) {
          newErrors.targetGoalMonths = 'Insira um prazo válido em meses (ex: 2 a 360).';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { formData, errors, updateField, validateStep };
};
