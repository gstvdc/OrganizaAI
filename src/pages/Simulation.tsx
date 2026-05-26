import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { FormProgress } from '../components/FormProgress';
import { FormStep } from '../components/FormStep';
import { useForm } from '../hooks/useForm';
import { formatCurrency, parseCurrencyToNumber } from '../utils/formatters';

/* ──────────────── SVG Icon Components ──────────────── */
const IconUser: React.FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const IconBriefcase: React.FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);

const IconShield: React.FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);

const IconNoEntry: React.FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
  </svg>
);

const IconHome: React.FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>
);

const IconTrendingUp: React.FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
  </svg>
);

const IconSun: React.FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
  </svg>
);

const IconChartBar: React.FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
);

const IconCalculator: React.FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z" />
  </svg>
);

const IconTarget: React.FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12h.01" />
  </svg>
);

const IconArrowRight: React.FC<{ className?: string }> = ({ className = 'h-4 w-4' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);

const IconSparkles: React.FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
  </svg>
);

const IconLock: React.FC<{ className?: string }> = ({ className = 'h-4 w-4' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

const IconCheck: React.FC<{ className?: string }> = ({ className = 'h-4 w-4' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

/* ──────────────── Currency Input Component ──────────────── */
const CurrencyInput: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
}> = ({ label, value, onChange, hint }) => (
  <div className="flex flex-col group">
    <label className="mb-2 text-sm font-semibold text-slate-300 group-focus-within:text-white transition-colors">
      {label}
    </label>
    <div className="relative">
      <span className="absolute inset-y-0 left-0 flex items-center pl-4 font-mono text-xs font-bold text-slate-500 group-focus-within:text-accent-lime/70 transition-colors">
        R$
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full glass-input pr-4 pl-11 font-mono tracking-wide"
      />
    </div>
    {hint && (
      <span className="mt-1.5 text-[10px] text-slate-500">{hint}</span>
    )}
  </div>
);

/* ──────────────── Main Component ──────────────── */
export const Simulation: React.FC = () => {
  const navigate = useNavigate();
  const { formData, errors, updateField, validateStep } = useForm();
  const [currentStep, setCurrentStep] = useState(0);

  const stepLabels = [
    'Perfil',
    'Receitas',
    'Gastos Fixos',
    'Gastos Variáveis',
    'Reservas & Dívidas',
    'Revisão',
  ];

  const goalOptions = [
    {
      value: 'Criar reserva de emergência',
      label: 'Criar Reserva de Emergência',
      icon: <IconShield className="h-5 w-5" />,
      desc: 'Guardar um colchão financeiro seguro',
      color: 'from-emerald-500/20 to-emerald-500/5',
      accent: 'text-emerald-400',
      border: 'border-emerald-500/30',
      ring: 'ring-emerald-500/20',
    },
    {
      value: 'Sair das dívidas',
      label: 'Sair das Dívidas',
      icon: <IconNoEntry className="h-5 w-5" />,
      desc: 'Quitar pendências e juros altos',
      color: 'from-rose-500/20 to-rose-500/5',
      accent: 'text-rose-400',
      border: 'border-rose-500/30',
      ring: 'ring-rose-500/20',
    },
    {
      value: 'Comprar bens (casa, carro, etc.)',
      label: 'Comprar Bens',
      icon: <IconHome className="h-5 w-5" />,
      desc: 'Adquirir imóvel, veículo ou outro bem',
      color: 'from-blue-500/20 to-blue-500/5',
      accent: 'text-blue-400',
      border: 'border-blue-500/30',
      ring: 'ring-blue-500/20',
    },
    {
      value: 'Começar a investir / Multiplicar patrimônio',
      label: 'Aprender a Investir',
      icon: <IconTrendingUp className="h-5 w-5" />,
      desc: 'Fazer o dinheiro render e crescer',
      color: 'from-violet-500/20 to-violet-500/5',
      accent: 'text-violet-400',
      border: 'border-violet-500/30',
      ring: 'ring-violet-500/20',
    },
    {
      value: 'Aposentadoria / Liberdade financeira',
      label: 'Liberdade Financeira',
      icon: <IconSun className="h-5 w-5" />,
      desc: 'Construir sua independência futura',
      color: 'from-amber-500/20 to-amber-500/5',
      accent: 'text-amber-400',
      border: 'border-amber-500/30',
      ring: 'ring-amber-500/20',
    },
    {
      value: 'Apenas organizar meu orçamento mensal',
      label: 'Organizar Orçamento',
      icon: <IconChartBar className="h-5 w-5" />,
      desc: 'Mapear, categorizar e equilibrar as contas',
      color: 'from-cyan-500/20 to-cyan-500/5',
      accent: 'text-cyan-400',
      border: 'border-cyan-500/30',
      ring: 'ring-cyan-500/20',
    },
  ];

  const handleNext = () => {
    if (currentStep > 0 && !validateStep(currentStep)) {
      return;
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleCurrencyChange = (
    field:
      | 'salary'
      | 'additionalIncome'
      | 'rentOrMortgage'
      | 'utilities'
      | 'health'
      | 'education'
      | 'food'
      | 'leisure'
      | 'transport'
      | 'otherExpenses'
      | 'amountSaved'
      | 'currentDebts'
      | 'targetGoalValue',
    value: string,
  ) => {
    const formatted = formatCurrency(value);
    updateField(field, formatted);
  };

  // Calculations for dynamic feedback and review
  const salaryVal = parseCurrencyToNumber(formData.salary);
  const addIncomeVal = parseCurrencyToNumber(formData.additionalIncome);
  const totalIncome = salaryVal + addIncomeVal;

  const rentVal = parseCurrencyToNumber(formData.rentOrMortgage);
  const utilVal = parseCurrencyToNumber(formData.utilities);
  const healthVal = parseCurrencyToNumber(formData.health);
  const eduVal = parseCurrencyToNumber(formData.education);
  const totalFixedExpenses = rentVal + utilVal + healthVal + eduVal;

  const foodVal = parseCurrencyToNumber(formData.food);
  const leisureVal = parseCurrencyToNumber(formData.leisure);
  const transVal = parseCurrencyToNumber(formData.transport);
  const otherVal = parseCurrencyToNumber(formData.otherExpenses);
  const totalVariableExpenses = foodVal + leisureVal + transVal + otherVal;

  const totalExpenses = totalFixedExpenses + totalVariableExpenses;
  const netBalance = totalIncome - totalExpenses;

  const amountSavedVal = parseCurrencyToNumber(formData.amountSaved);
  const currentDebtsVal = parseCurrencyToNumber(formData.currentDebts);

  const goalVal = parseCurrencyToNumber(formData.targetGoalValue);
  const goalMonths = parseInt(formData.targetGoalMonths, 10);
  const hasGoal =
    formData.targetGoalName.trim() !== '' && goalVal > 0 && goalMonths > 0;

  const handleSubmit = () => {
    const simulationId = Math.random().toString(36).substring(2, 11);

    const newSimulation = {
      id: simulationId,
      date: new Date().toLocaleDateString('pt-BR'),
      profile: {
        name: formData.name,
        age: parseInt(formData.age, 10),
        occupation: formData.occupation,
        mainGoal: formData.mainGoal,
      },
      finances: {
        income: {
          salary: salaryVal,
          additionalIncome: addIncomeVal,
          total: totalIncome,
        },
        fixedExpenses: {
          rentOrMortgage: rentVal,
          utilities: utilVal,
          health: healthVal,
          education: eduVal,
          total: totalFixedExpenses,
        },
        variableExpenses: {
          food: foodVal,
          leisure: leisureVal,
          transport: transVal,
          otherExpenses: otherVal,
          total: totalVariableExpenses,
        },
        savingsAndDebts: {
          amountSaved: amountSavedVal,
          currentDebts: currentDebtsVal,
        },
        targetGoal: hasGoal
          ? {
              name: formData.targetGoalName,
              value: goalVal,
              months: goalMonths,
              monthlyTarget: goalVal / goalMonths,
            }
          : undefined,
        totalExpenses,
        netBalance,
      },
    };

    const existingSimulations = JSON.parse(
      localStorage.getItem('simulations') || '[]',
    );
    localStorage.setItem(
      'simulations',
      JSON.stringify([...existingSimulations, newSimulation]),
    );

    localStorage.setItem(
      `simulation_${simulationId}`,
      JSON.stringify(newSimulation),
    );
    navigate(`/resultado/${simulationId}`);
  };

  /* ──── Budget health indicator ──── */
  const commitmentPct = totalIncome > 0 ? Math.round((totalExpenses / totalIncome) * 100) : 0;
  const healthColor =
    commitmentPct > 80
      ? 'text-rose-400'
      : commitmentPct > 60
        ? 'text-amber-400'
        : 'text-accent-lime';
  const healthBarColor =
    commitmentPct > 80
      ? 'bg-rose-500'
      : commitmentPct > 60
        ? 'bg-amber-500'
        : 'bg-accent-lime';
  const healthLabel =
    commitmentPct > 80
      ? 'Atenção'
      : commitmentPct > 60
        ? 'Moderado'
        : 'Saudável';

  /* ──── Review rows helper ──── */
  const reviewRows = [
    { label: 'Salário Líquido', value: formData.salary, type: 'income' as const },
    ...(addIncomeVal > 0 ? [{ label: 'Rendas Extras', value: formData.additionalIncome, type: 'income' as const }] : []),
    { label: 'Moradia', value: formatCurrency(rentVal), type: 'expense' as const },
    { label: 'Contas Básicas', value: formatCurrency(utilVal), type: 'expense' as const },
    { label: 'Saúde', value: formatCurrency(healthVal), type: 'expense' as const },
    { label: 'Educação', value: formatCurrency(eduVal), type: 'expense' as const },
    { label: 'Alimentação', value: formatCurrency(foodVal), type: 'expense' as const },
    { label: 'Lazer e Compras', value: formatCurrency(leisureVal), type: 'expense' as const },
    { label: 'Transporte', value: formatCurrency(transVal), type: 'expense' as const },
    ...(otherVal > 0 ? [{ label: 'Outras Despesas', value: formatCurrency(otherVal), type: 'expense' as const }] : []),
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">

      {/* ═══════════ INTRO STEP ═══════════ */}
      {currentStep === 0 && (
        <div className="animate-fadeIn glass-panel rounded-3xl p-10 text-center shadow-2xl relative overflow-hidden">
          {/* Decorative gradients */}
          <div className="absolute top-0 right-0 -z-10 h-[200px] w-[200px] rounded-full bg-violet-600/10 blur-[60px]" />
          <div className="absolute bottom-0 left-0 -z-10 h-[150px] w-[150px] rounded-full bg-accent-lime/5 blur-[50px]" />

          {/* Icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-accent-lime/10 border border-white/10 text-accent-lime shadow-lg">
            <IconCalculator className="h-8 w-8" />
          </div>

          {/* Title */}
          <h2 className="mt-6 font-display text-3xl font-extrabold text-white sm:text-4xl">
            Simulador Financeiro
            <span className="text-glow-gradient"> Inteligente</span>
          </h2>

          {/* Description */}
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-slate-400 text-sm">
            Em poucos passos, mapeie suas finanças pessoais — receitas, gastos
            fixos e variáveis — para obter um diagnóstico completo e conselhos
            personalizados gerados por inteligência artificial.
          </p>

          {/* Feature badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {[
              { icon: <IconLock className="h-3.5 w-3.5" />, text: 'Dados seguros' },
              { icon: <IconSparkles className="h-3.5 w-3.5" />, text: 'IA avançada' },
              { icon: <IconChartBar className="h-3.5 w-3.5" />, text: '6 etapas simples' },
            ].map((badge) => (
              <span
                key={badge.text}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-[11px] font-semibold text-slate-300"
              >
                {badge.icon}
                {badge.text}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-10 border-t border-white/5 pt-8">
            <Button size="lg" onClick={handleNext} className="gap-2">
              Começar Simulação
              <IconArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* ═══════════ FORM WIZARD STEPS ═══════════ */}
      {currentStep > 0 && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Decorative blur */}
          <div className="absolute top-0 right-0 -z-10 h-[180px] w-[180px] rounded-full bg-violet-600/5 blur-[55px]" />

          <FormProgress
            currentStep={currentStep}
            totalSteps={stepLabels.length}
            stepLabels={stepLabels}
          />

          <div className="mt-8">

            {/* ─── STEP 1: PERFIL ─── */}
            {currentStep === 1 && (
              <FormStep
                title="Quem é você?"
                subtitle="Vamos começar definindo o seu perfil e o que você gostaria de conquistar."
              >
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

                    {/* Nome */}
                    <div className="flex flex-col group">
                      <label className="mb-2 text-sm font-semibold text-slate-300 group-focus-within:text-white transition-colors">
                        Nome Completo
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500 group-focus-within:text-accent-lime/60 transition-colors">
                          <IconUser className="h-4 w-4" />
                        </span>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => updateField('name', e.target.value)}
                          placeholder="Ex: Gustavo Constante"
                          className="w-full glass-input pr-4 pl-10"
                        />
                      </div>
                      {errors.name && (
                        <span className="mt-1.5 text-xs font-medium text-red-500">
                          {errors.name}
                        </span>
                      )}
                    </div>

                    {/* Idade */}
                    <div className="flex flex-col group">
                      <label className="mb-2 text-sm font-semibold text-slate-300 group-focus-within:text-white transition-colors">
                        Idade
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 font-mono text-sm font-bold text-slate-500 group-focus-within:text-accent-lime/60 transition-colors">
                          #
                        </span>
                        <input
                          type="number"
                          value={formData.age}
                          onChange={(e) => updateField('age', e.target.value)}
                          placeholder="Ex: 25"
                          className="w-full glass-input pr-4 pl-10"
                        />
                      </div>
                      {errors.age && (
                        <span className="mt-1.5 text-xs font-medium text-red-500">
                          {errors.age}
                        </span>
                      )}
                    </div>

                    {/* Profissão */}
                    <div className="flex flex-col sm:col-span-2 group">
                      <label className="mb-2 text-sm font-semibold text-slate-300 group-focus-within:text-white transition-colors">
                        Profissão / Ocupação principal
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500 group-focus-within:text-accent-lime/60 transition-colors">
                          <IconBriefcase className="h-4 w-4" />
                        </span>
                        <input
                          type="text"
                          value={formData.occupation}
                          onChange={(e) =>
                            updateField('occupation', e.target.value)
                          }
                          placeholder="Ex: Desenvolvedor, Estudante, Autônomo"
                          className="w-full glass-input pr-4 pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Objetivos financeiros */}
                  <div className="flex flex-col">
                    <label className="mb-4 text-sm font-semibold text-slate-300">
                      Qual o seu principal objetivo financeiro hoje?
                    </label>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      {goalOptions.map((opt) => {
                        const isSelected = formData.mainGoal === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => updateField('mainGoal', opt.value)}
                            className={`group/goal flex items-start gap-3.5 rounded-2xl border p-4 text-left transition-all duration-300 cursor-pointer ${
                              isSelected
                                ? `${opt.border} bg-gradient-to-br ${opt.color} ring-2 ${opt.ring}`
                                : 'border-white/8 bg-white/[0.02] text-slate-300 hover:bg-white/[0.05] hover:border-white/15'
                            }`}
                          >
                            <div
                              className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
                                isSelected
                                  ? `${opt.accent} bg-white/10`
                                  : 'text-slate-400 bg-white/5 group-hover/goal:text-white group-hover/goal:bg-white/10'
                              }`}
                            >
                              {opt.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className={`text-sm font-bold block ${isSelected ? 'text-white' : 'text-slate-200 group-hover/goal:text-white'} transition-colors`}>
                                {opt.label}
                              </span>
                              <span className="mt-0.5 text-xs text-slate-400 block">
                                {opt.desc}
                              </span>
                            </div>
                            {isSelected && (
                              <div className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${opt.accent} bg-white/10 mt-0.5`}>
                                <IconCheck className="h-3 w-3" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {errors.mainGoal && (
                      <span className="mt-3 text-xs font-medium text-red-500">
                        {errors.mainGoal}
                      </span>
                    )}
                  </div>
                </div>
              </FormStep>
            )}

            {/* ─── STEP 2: RECEITAS ─── */}
            {currentStep === 2 && (
              <FormStep
                title="Suas Receitas Mensais"
                subtitle="Quanto você ganha em média todos os meses?"
              >
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <CurrencyInput
                    label="Salário / Receita Líquida"
                    value={formData.salary}
                    onChange={(v) => handleCurrencyChange('salary', v)}
                    hint="Ganhos principais e recorrentes."
                  />
                  <CurrencyInput
                    label="Rendas Adicionais / Extras"
                    value={formData.additionalIncome}
                    onChange={(v) => handleCurrencyChange('additionalIncome', v)}
                    hint="Freelances, investimentos, pensões, etc."
                  />
                </div>
              </FormStep>
            )}

            {/* ─── STEP 3: GASTOS FIXOS ─── */}
            {currentStep === 3 && (
              <FormStep
                title="Suas Despesas Fixas"
                subtitle="Contas recorrentes essenciais (possuem o mesmo valor quase todo mês)."
              >
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <CurrencyInput
                    label="Moradia (Aluguel, Financiamento, Condomínio)"
                    value={formData.rentOrMortgage}
                    onChange={(v) => handleCurrencyChange('rentOrMortgage', v)}
                  />
                  <CurrencyInput
                    label="Contas Básicas (Água, Luz, Internet, Gás)"
                    value={formData.utilities}
                    onChange={(v) => handleCurrencyChange('utilities', v)}
                  />
                  <CurrencyInput
                    label="Saúde (Plano de saúde, Medicamentos contínuos)"
                    value={formData.health}
                    onChange={(v) => handleCurrencyChange('health', v)}
                  />
                  <CurrencyInput
                    label="Educação (Faculdade, Escolas, Cursos fixos)"
                    value={formData.education}
                    onChange={(v) => handleCurrencyChange('education', v)}
                  />
                </div>
              </FormStep>
            )}

            {/* ─── STEP 4: GASTOS VARIÁVEIS ─── */}
            {currentStep === 4 && (
              <FormStep
                title="Suas Despesas Variáveis"
                subtitle="Gastos cotidianos flexíveis que mudam de acordo com seu estilo de vida."
              >
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <CurrencyInput
                    label="Alimentação (Supermercado, Feira, Restaurantes)"
                    value={formData.food}
                    onChange={(v) => handleCurrencyChange('food', v)}
                  />
                  <CurrencyInput
                    label="Lazer e Compras (Streamings, Viagens, Roupas)"
                    value={formData.leisure}
                    onChange={(v) => handleCurrencyChange('leisure', v)}
                  />
                  <CurrencyInput
                    label="Transporte (Combustível, IPVA, Uber, Passagens)"
                    value={formData.transport}
                    onChange={(v) => handleCurrencyChange('transport', v)}
                  />
                  <CurrencyInput
                    label="Outras Despesas e Imprevistos"
                    value={formData.otherExpenses}
                    onChange={(v) => handleCurrencyChange('otherExpenses', v)}
                  />
                </div>
              </FormStep>
            )}

            {/* ─── STEP 5: RESERVAS & DÍVIDAS + GOAL META ─── */}
            {currentStep === 5 && (
              <FormStep
                title="Sua Situação Patrimonial e Objetivos"
                subtitle="Últimos detalhes para a IA compreender seu ponto de partida atual."
              >
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <CurrencyInput
                    label="Patrimônio Líquido Guardado (Reserva, investimentos)"
                    value={formData.amountSaved}
                    onChange={(v) => handleCurrencyChange('amountSaved', v)}
                  />
                  <CurrencyInput
                    label="Saldo Total Devedor (Dívidas, parcelas, empréstimos)"
                    value={formData.currentDebts}
                    onChange={(v) => handleCurrencyChange('currentDebts', v)}
                  />

                  {/* Personal Savings Goal */}
                  <div className="mt-4 space-y-5 border-t border-white/5 pt-6 sm:col-span-2">
                    <div>
                      <h4 className="flex items-center gap-2 text-sm font-bold text-white">
                        <IconTarget className="h-4 w-4 text-accent-lime" />
                        Meta de Economia
                        <span className="text-xs font-normal text-slate-500">(Opcional)</span>
                      </h4>
                      <p className="mt-1 text-xs text-slate-400">
                        Preencha se deseja juntar dinheiro para algo específico e calcular quanto precisa poupar mensalmente.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                      <div className="flex flex-col group">
                        <label className="mb-2 text-xs font-semibold text-slate-400 group-focus-within:text-white transition-colors">
                          Nome da Meta
                        </label>
                        <input
                          type="text"
                          value={formData.targetGoalName}
                          onChange={(e) =>
                            updateField('targetGoalName', e.target.value)
                          }
                          placeholder="Ex: Viagem para o Chile"
                          className="glass-input"
                        />
                      </div>

                      <div className="flex flex-col group">
                        <label className="mb-2 text-xs font-semibold text-slate-400 group-focus-within:text-white transition-colors">
                          Valor Alvo (Necessário)
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 font-mono text-xs font-bold text-slate-500 group-focus-within:text-accent-lime/60 transition-colors">
                            R$
                          </span>
                          <input
                            type="text"
                            value={formData.targetGoalValue}
                            onChange={(e) =>
                              handleCurrencyChange(
                                'targetGoalValue',
                                e.target.value,
                              )
                            }
                            className="w-full glass-input pr-4 pl-11 font-mono"
                          />
                        </div>
                        {errors.targetGoalValue && (
                          <span className="mt-1 text-[10px] font-medium text-red-500">
                            {errors.targetGoalValue}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col group">
                        <label className="mb-2 text-xs font-semibold text-slate-400 group-focus-within:text-white transition-colors">
                          Prazo em Meses
                        </label>
                        <input
                          type="number"
                          value={formData.targetGoalMonths}
                          onChange={(e) =>
                            updateField('targetGoalMonths', e.target.value)
                          }
                          placeholder="Ex: 12"
                          className="glass-input"
                        />
                        {errors.targetGoalMonths && (
                          <span className="mt-1 text-[10px] font-medium text-red-500">
                            {errors.targetGoalMonths}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </FormStep>
            )}

            {/* ─── STEP 6: REVISÃO ─── */}
            {currentStep === 6 && (
              <FormStep
                title="Revisão do seu Orçamento"
                subtitle="Verifique se os dados abaixo correspondem à sua realidade antes de submeter para análise da IA."
              >
                <div className="space-y-6">

                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-emerald-500/15 bg-gradient-to-br from-emerald-500/10 to-transparent p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                          <IconTrendingUp className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                          Receita Total
                        </span>
                      </div>
                      <span className="font-mono text-xl font-bold text-emerald-300">
                        {formatCurrency(totalIncome)}
                      </span>
                    </div>

                    <div className="rounded-2xl border border-rose-500/15 bg-gradient-to-br from-rose-500/10 to-transparent p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400">
                          <IconNoEntry className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                          Despesa Total
                        </span>
                      </div>
                      <span className="font-mono text-xl font-bold text-rose-300">
                        {formatCurrency(totalExpenses)}
                      </span>
                    </div>

                    <div
                      className={`rounded-2xl border p-5 ${
                        netBalance >= 0
                          ? 'border-accent-lime/15 bg-gradient-to-br from-accent-lime/10 to-transparent'
                          : 'border-amber-500/15 bg-gradient-to-br from-amber-500/10 to-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${netBalance >= 0 ? 'bg-accent-lime/20 text-accent-lime' : 'bg-amber-500/20 text-amber-400'}`}>
                          <IconChartBar className="h-3.5 w-3.5" />
                        </div>
                        <span
                          className={`text-xs font-bold uppercase tracking-wider ${
                            netBalance >= 0 ? 'text-accent-lime' : 'text-amber-400'
                          }`}
                        >
                          Saldo Líquido
                        </span>
                      </div>
                      <span
                        className={`font-mono text-xl font-bold ${
                          netBalance >= 0 ? 'text-accent-lime' : 'text-amber-300'
                        }`}
                      >
                        {formatCurrency(netBalance)}
                      </span>
                    </div>
                  </div>

                  {/* Detailed breakdown table */}
                  <div className="overflow-hidden rounded-2xl border border-white/5 bg-white/[0.01]">
                    <table className="w-full border-collapse text-left text-sm">
                      <thead>
                        <tr className="border-b border-white/5 bg-white/5">
                          <th className="p-4 font-semibold text-slate-300">
                            Categoria
                          </th>
                          <th className="p-4 text-right font-semibold text-slate-300">
                            Valor Mensal
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-slate-400">
                        {reviewRows.map((row) => (
                          <tr key={row.label} className="hover:bg-white/[0.02] transition-colors">
                            <td className="p-4 font-medium text-white">
                              {row.label}
                            </td>
                            <td className={`p-4 text-right font-mono ${row.type === 'expense' ? 'text-rose-400' : 'text-emerald-400'}`}>
                              {row.type === 'expense' ? '-' : ''}{row.value}
                            </td>
                          </tr>
                        ))}
                        <tr className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-4 font-medium text-white">
                            Patrimônio Guardado
                          </td>
                          <td className="p-4 text-right font-mono font-semibold text-emerald-400">
                            {formData.amountSaved}
                          </td>
                        </tr>
                        {currentDebtsVal > 0 && (
                          <tr className="hover:bg-white/[0.02] transition-colors">
                            <td className="p-4 font-semibold text-white">
                              Dívidas Pendentes
                            </td>
                            <td className="p-4 text-right font-mono font-semibold text-rose-400">
                              -{formData.currentDebts}
                            </td>
                          </tr>
                        )}
                        {hasGoal && (
                          <tr className="bg-accent-lime/5">
                            <td className="p-4 font-bold text-accent-lime flex items-center gap-2">
                              <IconTarget className="h-4 w-4" />
                              Meta: {formData.targetGoalName}
                              <span className="text-xs font-normal text-slate-400">
                                (em {formData.targetGoalMonths} meses)
                              </span>
                            </td>
                            <td className="p-4 text-right font-mono font-bold text-accent-lime">
                              Economizar {formatCurrency(goalVal / goalMonths)}/mês
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Security notice */}
                  <div className="flex items-center gap-3 rounded-xl bg-white/[0.03] border border-white/5 p-4">
                    <IconLock className="h-4 w-4 text-slate-500 flex-shrink-0" />
                    <span className="text-xs text-slate-400">
                      Ao prosseguir, esses dados serão enviados com segurança para o Google Gemini gerar o seu diagnóstico de saúde financeira e orientações personalizadas.
                    </span>
                  </div>
                </div>
              </FormStep>
            )}
          </div>

          {/* ─── Real-time Budget Feedback (Steps 2-5) ─── */}
          {currentStep >= 2 && currentStep <= 5 && (
            <div className="mt-8 border-t border-white/5 pt-6">
              <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                    <IconChartBar className="h-3.5 w-3.5" />
                    Análise Dinâmica do Orçamento
                  </h4>
                  {totalIncome > 0 && (
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${healthColor}`}>
                      {healthLabel}
                    </span>
                  )}
                </div>

                {/* Visual progress bar */}
                {totalIncome > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] text-slate-500">Comprometimento da renda</span>
                      <span className={`text-xs font-bold ${healthColor}`}>
                        {commitmentPct}%
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ease-out ${healthBarColor}`}
                        style={{ width: `${Math.min(commitmentPct, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Metrics grid */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-xl bg-white/[0.03] p-3">
                    <span className="block text-[9px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Receitas
                    </span>
                    <span className="font-mono text-sm font-bold text-emerald-400">
                      {formatCurrency(totalIncome)}
                    </span>
                  </div>
                  <div className="rounded-xl bg-white/[0.03] p-3">
                    <span className="block text-[9px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Despesas
                    </span>
                    <span className="font-mono text-sm font-bold text-rose-400">
                      {totalExpenses > 0 ? `-${formatCurrency(totalExpenses)}` : formatCurrency(0)}
                    </span>
                  </div>
                  <div className="rounded-xl bg-white/[0.03] p-3">
                    <span className="block text-[9px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Saldo
                    </span>
                    <span
                      className={`font-mono text-sm font-bold ${netBalance >= 0 ? 'text-accent-lime' : 'text-amber-400'}`}
                    >
                      {formatCurrency(netBalance)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── Navigation Controls ─── */}
          <div className="mt-8 flex justify-between border-t border-white/5 pt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              Voltar
            </Button>

            {currentStep < stepLabels.length ? (
              <Button onClick={handleNext} className="gap-2">
                Avançar
                <IconArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button variant="primary" onClick={handleSubmit} className="gap-2">
                <IconSparkles className="h-4 w-4" />
                Concluir e Analisar com IA
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
