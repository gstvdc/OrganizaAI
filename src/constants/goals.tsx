import React from 'react';
import {
  IconShield,
  IconNoEntry,
  IconHome,
  IconTrendingUp,
  IconSun,
  IconChartBar,
} from '../components/icons';

export interface GoalOption {
  value: string;
  label: string;
  icon: React.ReactNode;
  desc: string;
  color: string;
  accent: string;
  border: string;
  ring: string;
}

export const GOAL_OPTIONS: GoalOption[] = [
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
