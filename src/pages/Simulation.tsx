import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { CurrencyInput } from '../components/CurrencyInput';
import { FormProgress } from '../components/FormProgress';
import { FormStep } from '../components/FormStep';
import {
  IconUser,
  IconCalendar,
  IconBriefcase,
  IconChartBar,
  IconCalculator,
  IconTarget,
  IconArrowRight,
  IconSparkles,
  IconLock,
  IconCheck,
  IconNoEntry,
  IconTrendingUp,
} from '../components/icons';
import { GOAL_OPTIONS } from '../constants/goals';
import { useForm } from '../hooks/useForm';
import { formatCurrency, parseCurrencyToNumber } from '../utils/formatters';

const STEP_LABELS = [
  'Perfil',
  'Receitas',
  'Gastos Fixos',
  'Gastos Variáveis',
  'Reservas & Dívidas',
  'Revisão',
];

const SHAKE_DURATION_MS = 450;

export const Simulation: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  const preloadData = React.useMemo((): Partial<import('../hooks/useForm').SimulationData> | undefined => {
    if (!editId) return undefined;
    try {
      const raw = localStorage.getItem(`simulation_${editId}`);
      if (!raw) return undefined;
      const sim = JSON.parse(raw);
      const { profile, finances } = sim;
      return {
        name: profile.name,
        age: String(profile.age),
        occupation: profile.occupation,
        mainGoal: profile.mainGoal,
        salary: formatCurrency(finances.income.salary),
        additionalIncome: formatCurrency(finances.income.additionalIncome),
        rentOrMortgage: formatCurrency(finances.fixedExpenses.rentOrMortgage),
        utilities: formatCurrency(finances.fixedExpenses.utilities),
        health: formatCurrency(finances.fixedExpenses.health),
        education: formatCurrency(finances.fixedExpenses.education),
        food: formatCurrency(finances.variableExpenses.food),
        leisure: formatCurrency(finances.variableExpenses.leisure),
        transport: formatCurrency(finances.variableExpenses.transport),
        otherExpenses: formatCurrency(finances.variableExpenses.otherExpenses),
        amountSaved: formatCurrency(finances.savingsAndDebts.amountSaved),
        currentDebts: formatCurrency(finances.savingsAndDebts.currentDebts),
        targetGoalName: finances.targetGoal?.name ?? '',
        targetGoalValue: finances.targetGoal ? formatCurrency(finances.targetGoal.value) : 'R$ 0,00',
        targetGoalMonths: finances.targetGoal ? String(finances.targetGoal.months) : '',
      };
    } catch {
      return undefined;
    }
  }, [editId]);

  const originalDate = React.useMemo(() => {
    if (!editId) return '';
    try {
      const raw = localStorage.getItem(`simulation_${editId}`);
      return raw ? JSON.parse(raw).date : '';
    } catch {
      return '';
    }
  }, [editId]);

  const { formData, errors, updateField, validateStep } = useForm(preloadData);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepDir, setStepDir] = useState<'forward' | 'back'>('forward');
  const [shakeForm, setShakeForm] = useState(false);

  const handleNext = () => {
    if (currentStep > 0 && !validateStep(currentStep)) {
      setShakeForm(true);
      setTimeout(() => setShakeForm(false), SHAKE_DURATION_MS);
      return;
    }
    setStepDir('forward');
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStepDir('back');
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
    updateField(field, formatCurrency(value));
  };

  // Derived financial calculations
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
  const hasGoal = formData.targetGoalName.trim() !== '' && goalVal > 0 && goalMonths > 0;

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
        income: { salary: salaryVal, additionalIncome: addIncomeVal, total: totalIncome },
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
        savingsAndDebts: { amountSaved: amountSavedVal, currentDebts: currentDebtsVal },
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

    const existing = JSON.parse(localStorage.getItem('simulations') || '[]');
    localStorage.setItem('simulations', JSON.stringify([...existing, newSimulation]));
    localStorage.setItem(`simulation_${simulationId}`, JSON.stringify(newSimulation));
    navigate(`/resultado/${simulationId}`);
  };

  // Budget health indicator
  const commitmentPct = totalIncome > 0 ? Math.round((totalExpenses / totalIncome) * 100) : 0;
  const healthColor =
    commitmentPct > 80 ? 'text-rose-400' : commitmentPct > 60 ? 'text-amber-400' : 'text-accent-lime';
  const healthBarColor =
    commitmentPct > 80 ? 'bg-rose-500' : commitmentPct > 60 ? 'bg-amber-500' : 'bg-accent-lime';
  const healthLabel = commitmentPct > 80 ? 'Atenção' : commitmentPct > 60 ? 'Moderado' : 'Saudável';

  const reviewRows = [
    { label: 'Salário Líquido', value: formData.salary, type: 'income' as const },
    ...(addIncomeVal > 0
      ? [{ label: 'Rendas Extras', value: formData.additionalIncome, type: 'income' as const }]
      : []),
    { label: 'Moradia', value: formatCurrency(rentVal), type: 'expense' as const },
    { label: 'Contas Básicas', value: formatCurrency(utilVal), type: 'expense' as const },
    { label: 'Saúde', value: formatCurrency(healthVal), type: 'expense' as const },
    { label: 'Educação', value: formatCurrency(eduVal), type: 'expense' as const },
    { label: 'Alimentação', value: formatCurrency(foodVal), type: 'expense' as const },
    { label: 'Lazer e Compras', value: formatCurrency(leisureVal), type: 'expense' as const },
    { label: 'Transporte', value: formatCurrency(transVal), type: 'expense' as const },
    ...(otherVal > 0
      ? [{ label: 'Outras Despesas', value: formatCurrency(otherVal), type: 'expense' as const }]
      : []),
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">

      {/* ═══════════ INTRO STEP ═══════════ */}
      {currentStep === 0 && (
        <div className="animate-fadeIn glass-panel rounded-3xl p-10 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -z-10 h-[200px] w-[200px] rounded-full bg-violet-600/10 blur-[60px]" />
          <div className="absolute bottom-0 left-0 -z-10 h-[150px] w-[150px] rounded-full bg-accent-lime/5 blur-[50px]" />

          <div className="relative mx-auto w-fit">
            <div className="absolute inset-0 rounded-2xl bg-accent-lime/10 animate-glow-pulse" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-accent-lime/10 border border-white/10 text-accent-lime shadow-lg">
              <IconCalculator className="h-8 w-8" />
            </div>
          </div>

          <h2
            className="mt-6 font-display text-3xl font-extrabold text-white sm:text-4xl"
            style={{ animationDelay: '80ms' }}
          >
            Simulador Financeiro
            <span className="text-glow-gradient"> Inteligente</span>
          </h2>

          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-slate-400 text-sm">
            Em poucos passos, mapeie suas finanças pessoais — receitas, gastos fixos e variáveis —
            para obter um diagnóstico completo e conselhos personalizados gerados por inteligência
            artificial.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {[
              { icon: <IconLock className="h-3.5 w-3.5" />, text: 'Dados seguros', delay: '100ms' },
              { icon: <IconSparkles className="h-3.5 w-3.5" />, text: 'IA avançada', delay: '180ms' },
              { icon: <IconChartBar className="h-3.5 w-3.5" />, text: '6 etapas simples', delay: '260ms' },
            ].map((badge) => (
              <span
                key={badge.text}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-[11px] font-semibold text-slate-300 animate-fadeIn opacity-0"
                style={{ animationDelay: badge.delay, animationFillMode: 'forwards' }}
              >
                {badge.icon}
                {badge.text}
              </span>
            ))}
          </div>

          <div className="mt-10 border-t border-white/5 pt-8">
            <Button size="lg" onClick={handleNext} className="gap-2 group">
              Começar Simulação
              <IconArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      )}

      {/* ═══════════ FORM WIZARD STEPS ═══════════ */}
      {currentStep > 0 && (
        <div className={shakeForm ? 'animate-shake' : ''}>
          {editId && originalDate && (
            <div className="mb-4 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-xs text-amber-400">
              ✏️ Editando simulação de {originalDate} — um novo registro será criado ao finalizar
            </div>
          )}
          <div className="animate-fadeIn glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -z-10 h-[180px] w-[180px] rounded-full bg-violet-600/5 blur-[55px]" />

            <FormProgress
              currentStep={currentStep}
              totalSteps={STEP_LABELS.length}
              stepLabels={STEP_LABELS}
            />

            <div
              key={currentStep}
              className={`mt-8 ${stepDir === 'forward' ? 'step-slide-in-right' : 'step-slide-in-left'}`}
            >
              {/* ─── STEP 1: PERFIL ─── */}
              {currentStep === 1 && (
                <FormStep
                  title="Quem é você?"
                  subtitle="Vamos começar definindo o seu perfil e o que você gostaria de conquistar."
                >
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
                            className="w-full glass-input pr-4 pl-10"
                          />
                        </div>
                        {errors.name && (
                          <span className="mt-1.5 text-xs font-medium text-red-500">{errors.name}</span>
                        )}
                      </div>

                      <div className="flex flex-col group">
                        <label className="mb-2 text-sm font-semibold text-slate-300 group-focus-within:text-white transition-colors">
                          Idade
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={formData.age}
                            onChange={(e) => updateField('age', e.target.value)}
                            className="w-full glass-input pr-4 pl-4"
                          />
                        </div>
                        {errors.age && (
                          <span className="mt-1.5 text-xs font-medium text-red-500">{errors.age}</span>
                        )}
                      </div>

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
                            onChange={(e) => updateField('occupation', e.target.value)}
                            className="w-full glass-input pr-4 pl-10"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label className="mb-4 text-sm font-semibold text-slate-300">
                        Qual o seu principal objetivo financeiro hoje?
                      </label>
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        {GOAL_OPTIONS.map((opt) => {
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
                                <span
                                  className={`text-sm font-bold block ${isSelected ? 'text-white' : 'text-slate-200 group-hover/goal:text-white'} transition-colors`}
                                >
                                  {opt.label}
                                </span>
                                <span className="mt-0.5 text-xs text-slate-400 block">{opt.desc}</span>
                              </div>
                              {isSelected && (
                                <div
                                  className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${opt.accent} bg-white/10 mt-0.5`}
                                >
                                  <IconCheck className="h-3 w-3" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                      {errors.mainGoal && (
                        <span className="mt-3 text-xs font-medium text-red-500">{errors.mainGoal}</span>
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

              {/* ─── STEP 5: RESERVAS & DÍVIDAS + META ─── */}
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

                    <div className="mt-4 space-y-5 border-t border-white/5 pt-6 sm:col-span-2">
                      <div>
                        <h4 className="flex items-center gap-2 text-sm font-bold text-white">
                          <IconTarget className="h-4 w-4 text-accent-lime" />
                          Meta de Economia
                          <span className="text-xs font-normal text-slate-500">(Opcional)</span>
                        </h4>
                        <p className="mt-1 text-xs text-slate-400">
                          Preencha se deseja juntar dinheiro para algo específico e calcular quanto
                          precisa poupar mensalmente.
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
                            onChange={(e) => updateField('targetGoalName', e.target.value)}
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
                              onChange={(e) => handleCurrencyChange('targetGoalValue', e.target.value)}
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
                            onChange={(e) => updateField('targetGoalMonths', e.target.value)}
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
                          <div
                            className={`flex h-7 w-7 items-center justify-center rounded-lg ${netBalance >= 0 ? 'bg-accent-lime/20 text-accent-lime' : 'bg-amber-500/20 text-amber-400'}`}
                          >
                            <IconChartBar className="h-3.5 w-3.5" />
                          </div>
                          <span
                            className={`text-xs font-bold uppercase tracking-wider ${netBalance >= 0 ? 'text-accent-lime' : 'text-amber-400'}`}
                          >
                            Saldo Líquido
                          </span>
                        </div>
                        <span
                          className={`font-mono text-xl font-bold ${netBalance >= 0 ? 'text-accent-lime' : 'text-amber-300'}`}
                        >
                          {formatCurrency(netBalance)}
                        </span>
                      </div>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-white/5 bg-white/[0.01]">
                      <table className="w-full border-collapse text-left text-sm">
                        <thead>
                          <tr className="border-b border-white/5 bg-white/5">
                            <th className="p-4 font-semibold text-slate-300">Categoria</th>
                            <th className="p-4 text-right font-semibold text-slate-300">
                              Valor Mensal
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-slate-400">
                          {reviewRows.map((row) => (
                            <tr key={row.label} className="hover:bg-white/[0.02] transition-colors">
                              <td className="p-4 font-medium text-white">{row.label}</td>
                              <td
                                className={`p-4 text-right font-mono ${row.type === 'expense' ? 'text-rose-400' : 'text-emerald-400'}`}
                              >
                                {row.type === 'expense' ? '-' : ''}
                                {row.value}
                              </td>
                            </tr>
                          ))}
                          <tr className="hover:bg-white/[0.02] transition-colors">
                            <td className="p-4 font-medium text-white">Patrimônio Guardado</td>
                            <td className="p-4 text-right font-mono font-semibold text-emerald-400">
                              {formData.amountSaved}
                            </td>
                          </tr>
                          {currentDebtsVal > 0 && (
                            <tr className="hover:bg-white/[0.02] transition-colors">
                              <td className="p-4 font-semibold text-white">Dívidas Pendentes</td>
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

                    <div className="flex items-center gap-3 rounded-xl bg-white/[0.03] border border-white/5 p-4">
                      <IconLock className="h-4 w-4 text-slate-500 flex-shrink-0" />
                      <span className="text-xs text-slate-400">
                        Ao prosseguir, esses dados serão enviados com segurança para o Google
                        Gemini gerar o seu diagnóstico de saúde financeira e orientações
                        personalizadas.
                      </span>
                    </div>
                  </div>
                </FormStep>
              )}
            </div>

            {/* ─── Real-time Budget Feedback (Steps 2–5) ─── */}
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

                  {totalIncome > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] text-slate-500">Comprometimento da renda</span>
                        <span className={`text-xs font-bold ${healthColor}`}>{commitmentPct}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ease-out ${healthBarColor}`}
                          style={{ width: `${Math.min(commitmentPct, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}

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
              <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
                Voltar
              </Button>

              {currentStep < STEP_LABELS.length ? (
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
        </div>
      )}
    </div>
  );
};
