import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { DailyTip } from '../components/DailyTip';

const AVATAR_GUSTAVO =
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';

const HERO_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
];

const IconMic: React.FC<{ className?: string }> = ({ className = 'h-4.5 w-4.5' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
  </svg>
);

const IconPhone: React.FC<{ className?: string }> = ({ className = 'h-5.5 w-5.5' }) => (
  <svg className={`${className} rotate-[135deg]`} fill="currentColor" viewBox="0 0 24 24">
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
  </svg>
);

const IconVideo: React.FC<{ className?: string }> = ({ className = 'h-4.5 w-4.5' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
  </svg>
);

const IconCursor: React.FC<{ className?: string }> = ({ className = 'h-4.5 w-4.5' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M4.5 3v15.25l4.5-4.5 3 6.75 2.25-1-3-6.75 6.5-.5z" />
  </svg>
);

const CallWidgetContent: React.FC = () => (
  <>
    <div className="flex items-center justify-between gap-3 bg-white rounded-full pl-3 pr-2 py-1.5 shadow-md">
      <div className="flex items-center gap-2">
        <img
          className="h-7 w-7 rounded-full border border-slate-200"
          src={AVATAR_GUSTAVO}
          alt="avatar"
        />
        <span className="text-xs font-bold text-space-950 truncate max-w-[100px]">Gustavo C.</span>
      </div>
      <span className="rounded-full bg-[#a3e635] px-3 py-1 font-mono text-[10px] font-bold text-space-950">
        Simulando
      </span>
    </div>
    <div className="mt-5 flex items-center justify-center gap-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-space-950 hover:bg-slate-100 cursor-pointer shadow-md transition-colors">
        <IconMic />
      </div>
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#ff5a5f] text-white hover:bg-[#ff4349] cursor-pointer shadow-lg transition-all active:scale-90">
        <IconPhone />
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-space-950 hover:bg-slate-100 cursor-pointer shadow-md transition-colors">
        <IconVideo />
      </div>
    </div>
  </>
);

const ChecklistWidgetContent: React.FC = () => (
  <>
    <div className="flex items-center justify-between mb-4">
      <span className="text-xs font-bold tracking-wider text-slate-300">Plano de Ação</span>
      <span className="text-[9px] font-bold text-accent-lime border border-accent-lime/20 rounded-full px-2.5 py-0.5">
        2/5 feitos
      </span>
    </div>
    <div className="space-y-3.5">
      <div className="flex items-center gap-2.5 rounded-full bg-white px-4 py-2.5 text-space-950 font-bold text-[10.5px] shadow-lg">
        <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#536dfe] text-white text-[10px] font-extrabold">
          ✓
        </span>
        <span className="truncate">Criar reserva de emergência.</span>
      </div>
      <div className="flex items-center gap-2.5 px-4 py-1 text-slate-400 text-[10.5px]">
        <span className="h-4 w-4 rounded-full border-2 border-white/20 shrink-0" />
        <span className="truncate">Quitar dívidas com juros altos.</span>
      </div>
    </div>
  </>
);

const FEATURES = [
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Simule em minutos',
    desc: 'Preencha receitas, gastos fixos, variáveis e dívidas em 6 passos guiados. Veja sua saúde financeira em tempo real enquanto digita.',
    color: 'text-violet-400',
    border: 'border-violet-500/15',
    bg: 'bg-violet-500/5',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
    title: 'Diagnóstico com IA',
    desc: 'O Google Gemini analisa toda a sua situação e gera um score de saúde financeira, pontos fortes, oportunidades e um plano de ação personalizado.',
    color: 'text-accent-lime',
    border: 'border-accent-lime/15',
    bg: 'bg-accent-lime/5',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
      </svg>
    ),
    title: 'Acompanhe sua evolução',
    desc: 'Histórico de simulações com gráfico de evolução do score, checklist interativa do plano de ação e comparação lado a lado entre períodos.',
    color: 'text-emerald-400',
    border: 'border-emerald-500/15',
    bg: 'bg-emerald-500/5',
  },
];

export const Home: React.FC = () => {
  return (
    <div className="relative pt-12 pb-24 sm:pt-20 sm:pb-32">

      {/* Desktop widgets — outside max-w-7xl so viewport never clips them */}
      <div className="hidden lg:block glass-panel absolute left-6 xl:left-12 top-[18%] z-10 w-65 rounded-3xl p-4 shadow-2xl animate-float-slow bg-space-950/40 -rotate-6 hover:rotate-0 hover:scale-102 hover:z-30 transition-all duration-300">
        <CallWidgetContent />
        <div className="absolute -bottom-6 left-6 z-30 inline-flex items-center gap-1">
          <IconCursor className="h-4.5 w-4.5 text-[#ff9f1c] drop-shadow-md animate-bounce" />
          <div className="rounded-full bg-[#ff9f1c] px-3 py-1 text-[9px] font-extrabold text-black shadow-md uppercase tracking-wider">
            Gustavo (Usuário)
          </div>
        </div>
      </div>

      <div className="hidden lg:block glass-panel absolute right-6 xl:right-12 top-[28%] z-10 w-70 rounded-3xl p-5 shadow-2xl animate-float-medium bg-space-950/40 rotate-6 hover:rotate-0 hover:scale-102 hover:z-30 transition-all duration-300">
        <ChecklistWidgetContent />
        <div className="absolute -bottom-6 right-6 z-30 inline-flex items-center gap-1">
          <IconCursor className="h-4.5 w-4.5 text-[#fff200] drop-shadow-md animate-bounce" />
          <div className="rounded-full bg-[#fff200] px-3 py-1 text-[9px] font-extrabold text-black shadow-md uppercase tracking-wider">
            IA OrganizAI
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Hero */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-137.5 py-12 w-full">

          <div className="text-center space-y-6 max-w-3xl mx-auto z-20 flex flex-col items-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold text-slate-300 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-lime animate-pulse" />
              Educação Financeira com Inteligência Artificial
            </span>

            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl leading-tight">
              Sua
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 align-middle mx-2 text-xs font-bold text-slate-300 select-none shadow-lg">
                <div className="flex -space-x-1.5">
                  {HERO_AVATARS.map((src, i) => (
                    <img
                      key={i}
                      className="inline-block h-5.5 w-5.5 rounded-full ring-2 ring-space-950"
                      src={src}
                      alt=""
                    />
                  ))}
                </div>
                <span className="text-[10px] font-bold text-accent-lime">+2k</span>
              </span>
              <span className="italic font-display font-light text-slate-200">inteligência</span>{' '}
              <br />
              para planejar seu <br className="hidden sm:inline" />
              <span className="text-glow-gradient">futuro financeiro!</span>
            </h1>

            <p className="text-sm text-white/80 max-w-xl leading-relaxed mx-auto drop-shadow-sm">
              Mapeie suas finanças em minutos e receba um diagnóstico completo gerado por IA — com
              score de saúde financeira, pontos fortes e um plano de ação personalizado.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <Link to="/simulacao" className="w-full sm:w-auto">
                <Button size="lg" variant="primary" className="w-full">
                  Começar Agora — é grátis
                </Button>
              </Link>
              <Link to="/historico" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full">
                  Ver Histórico
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile widgets */}
        <div className="lg:hidden mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto px-4">
          <div className="glass-panel w-full rounded-3xl p-4 shadow-xl bg-space-950/40 rotate-[-2deg]">
            <CallWidgetContent />
          </div>
          <div className="glass-panel w-full rounded-3xl p-4 shadow-xl bg-space-950/40 rotate-[2deg]">
            <ChecklistWidgetContent />
          </div>
        </div>

        {/* Daily Tip */}
        {localStorage.getItem('simulations') && (
          <div className="mt-12 mx-auto max-w-2xl">
            <DailyTip />
          </div>
        )}

        {/* Features + CTA — dark glass container so content reads over the gradient */}
        <div className="mt-24 rounded-3xl bg-black/30 backdrop-blur-lg px-6 py-10 sm:px-10">
          <div id="como-funciona">
            <div className="text-center mb-12">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-3">
                Como funciona
              </p>
              <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
                Da simulação ao plano de ação
              </h2>
              <p className="mt-3 text-sm text-white/70 max-w-xl mx-auto">
                Tudo que você precisa para entender e melhorar sua saúde financeira, em um só lugar.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {FEATURES.map(({ icon, title, desc, color }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-white/15 bg-white/7 p-6 transition-all duration-300 hover:scale-[1.02] hover:bg-white/11 hover:border-white/25"
                >
                  <div className={`mb-4 ${color}`}>{icon}</div>
                  <h3 className="mb-2 font-bold text-white">{title}</h3>
                  <p className="text-xs leading-relaxed text-white/70">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA final */}
          <div className="mt-16 text-center">
            <Link to="/simulacao">
              <Button size="lg" variant="primary">
                Fazer minha primeira simulação
              </Button>
            </Link>
            <p className="mt-3 text-xs text-white/50">
              Gratuito · Sem cadastro · Dados salvos localmente
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
