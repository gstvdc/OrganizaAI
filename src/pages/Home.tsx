import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';

export const Home: React.FC = () => {
  return (
    <div className="relative overflow-hidden pt-12 pb-24 sm:pt-20 sm:pb-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Main Hero Container - Centered Flex layout with side absolutely-positioned widgets */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[550px] py-12 w-full">
          
          {/* Centered Hero Text Content */}
          <div className="text-center space-y-6 max-w-3xl mx-auto z-20 flex flex-col items-center">
            
            {/* Pill Badges - Overlapping avatar images and +2k badge (Planirium style) */}
            <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4.5 py-1 text-xs font-semibold text-slate-300 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-lime animate-pulse" />
                Inteligência Artificial & Educação Financeira
              </span>
            </div>

            {/* Premium Typographic Title - Planirium style (avatars inline, weights combination) */}
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl leading-tight">
              Sua
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 align-middle mx-2 text-xs font-bold text-slate-300 select-none shadow-lg">
                <div className="flex -space-x-1.5">
                  <img
                    className="inline-block h-5.5 w-5.5 rounded-full ring-2 ring-[#030014]"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="User 1"
                  />
                  <img
                    className="inline-block h-5.5 w-5.5 rounded-full ring-2 ring-[#030014]"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="User 2"
                  />
                  <img
                    className="inline-block h-5.5 w-5.5 rounded-full ring-2 ring-[#030014]"
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="User 3"
                  />
                </div>
                <span className="text-[10px] font-bold text-[#c5ff22]">+2k</span>
              </span>
              <span className="italic font-display font-light text-slate-200">inteligência</span> <br />
              para planejar seu <br className="hidden sm:inline" />
              <span className="text-glow-gradient">futuro financeiro!</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm text-slate-400 max-w-xl leading-relaxed mx-auto">
              Junte-se ao time que transformou sua produtividade, simplificou a comunicação e superou suas metas financeiras. É hora de fazer cada planejamento um sucesso com OrganizAI.
            </p>

            {/* Action CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <Link to="/simulacao" className="w-full sm:w-auto">
                <Button size="lg" variant="primary" className="w-full">
                  Começar Agora
                </Button>
              </Link>
              <a href="#roadmap" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full">
                  Como Funciona
                </Button>
              </a>
            </div>
          </div>

          {/* DESKTOP SIDE WIDGETS - Absolutely positioned on Left and Right (lg and up) */}
          
          {/* LEFT SIDE: Call Widget (Tilted -6deg) */}
          <div className="hidden lg:block glass-panel absolute left-[-60px] xl:left-[-140px] top-[15%] z-10 w-[260px] rounded-3xl p-4 shadow-2xl animate-float-slow bg-space-950/40 rotate-[-6deg] hover:rotate-0 hover:scale-102 hover:z-30 transition-all duration-300">
            {/* Inner white container (pill shape) */}
            <div className="flex items-center justify-between gap-3 bg-white rounded-full pl-3 pr-2 py-1.5 shadow-md">
              <div className="flex items-center gap-2">
                <img
                  className="h-7 w-7 rounded-full border border-slate-200"
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="Gustavo avatar"
                />
                <span className="text-xs font-bold text-space-950 truncate max-w-[100px]">
                  Gustavo C.
                </span>
              </div>
              <span className="rounded-full bg-[#a3e635] px-3 py-1 font-mono text-[10px] font-bold text-space-950">
                Simulando
              </span>
            </div>
            
            {/* Call Controls: Mic, Hang up, Video */}
            <div className="mt-5 flex items-center justify-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-space-950 hover:bg-slate-100 cursor-pointer shadow-md transition-colors">
                <svg className="h-4.5 w-4.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
                </svg>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#ff5a5f] text-white hover:bg-[#ff4349] cursor-pointer shadow-lg transition-all active:scale-90">
                <svg className="h-5.5 w-5.5 rotate-[135deg]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-space-950 hover:bg-slate-100 cursor-pointer shadow-md transition-colors">
                <svg className="h-4.5 w-4.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
                </svg>
              </div>
            </div>

            {/* Cursor indicator label - Orange Ann Designer style */}
            <div className="absolute -bottom-6 left-6 z-30 inline-flex items-center gap-1">
              <svg className="h-4.5 w-4.5 text-[#ff9f1c] drop-shadow-md animate-bounce" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.5 3v15.25l4.5-4.5 3 6.75 2.25-1-3-6.75 6.5-.5z" />
              </svg>
              <div className="rounded-full bg-[#ff9f1c] px-3 py-1 text-[9px] font-extrabold text-black shadow-md uppercase tracking-wider">
                Gustavo (Usuário)
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Checklist Widget (Tilted 6deg) */}
          <div className="hidden lg:block glass-panel absolute right-[-60px] xl:right-[-140px] bottom-[12%] z-10 w-[280px] rounded-3xl p-5 shadow-2xl animate-float-medium bg-space-950/40 rotate-[6deg] hover:rotate-0 hover:scale-102 hover:z-30 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold tracking-wider text-slate-300">
                Checklist
              </span>
              <span className="text-[9px] font-bold text-slate-400 border border-white/10 rounded-full px-2.5 py-0.5 hover:bg-white/5 cursor-pointer transition-colors">
                + Add Subtask
              </span>
            </div>
            
            <div className="space-y-3.5">
              {/* Active White Pill Item */}
              <div className="flex items-center gap-2.5 rounded-full bg-white px-4 py-2.5 text-space-950 font-bold text-[10.5px] shadow-lg">
                <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#536dfe] text-white text-[10px] font-extrabold">
                  ✓
                </span>
                <span className="truncate">
                  Testar viabilidade do orçamento atual.
                </span>
              </div>
              
              {/* Unchecked Transparent Item */}
              <div className="flex items-center gap-2.5 px-4 py-1 text-slate-400 text-[10.5px]">
                <span className="h-4 w-4 rounded-full border-2 border-white/20 flex-shrink-0" />
                <span className="truncate">
                  Estudar recomendações de investimentos.
                </span>
              </div>
            </div>

            {/* Cursor indicator label - Yellow Jeremy Developer style */}
            <div className="absolute -bottom-6 right-6 z-30 inline-flex items-center gap-1">
              <svg className="h-4.5 w-4.5 text-[#fff200] drop-shadow-md animate-bounce" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.5 3v15.25l4.5-4.5 3 6.75 2.25-1-3-6.75 6.5-.5z" />
              </svg>
              <div className="rounded-full bg-[#fff200] px-3 py-1 text-[9px] font-extrabold text-black shadow-md uppercase tracking-wider">
                IA OrganizAI
              </div>
            </div>
          </div>

        </div>

        {/* MOBILE RESPONSIVE WIDGETS DISPLAY (Below text on screens < lg) */}
        <div className="lg:hidden mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto px-4">
          
          {/* Mobile Widget 1: Call Card (slightly tilted -2deg) */}
          <div className="glass-panel w-full rounded-3xl p-4 shadow-xl bg-space-950/40 rotate-[-2deg] relative">
            <div className="flex items-center justify-between gap-3 bg-white rounded-full pl-3 pr-2 py-1.5 shadow-md">
              <div className="flex items-center gap-2">
                <img
                  className="h-7 w-7 rounded-full border border-slate-200"
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="Gustavo avatar"
                />
                <span className="text-xs font-bold text-space-950">Gustavo C.</span>
              </div>
              <span className="rounded-full bg-[#a3e635] px-3 py-1 font-mono text-[10px] font-bold text-space-950">
                Simulando
              </span>
            </div>
            
            <div className="mt-5 flex items-center justify-center gap-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-space-950 shadow">
                🎤
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff5a5f] text-white shadow">
                📞
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-space-950 shadow">
                📹
              </div>
            </div>
          </div>

          {/* Mobile Widget 2: Checklist Card (slightly tilted 2deg) */}
          <div className="glass-panel w-full rounded-3xl p-4 shadow-xl bg-space-950/40 rotate-[2deg] relative">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-bold text-slate-300">Checklist</span>
              <span className="text-[9px] font-bold text-slate-400 border border-white/10 rounded-full px-2 py-0.5">
                + Add Subtask
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-space-950 font-bold text-[10px]">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#536dfe] text-white text-[8px]">
                  ✓
                </span>
                <span className="truncate">Testar viabilidade do orçamento.</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 text-slate-400 text-[10px]">
                <span className="h-3.5 w-3.5 rounded-full border border-white/20" />
                <span className="truncate">Estudar recomendações de investimentos.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Technology Stack / Partner Logos row */}
        <div className="mt-20 border-t border-white/5 pt-12">
          <p className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-6">
            Desenvolvido com Tecnologias de Ponta
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 md:justify-between px-4">
            
            {/* Logo 1: Google Gemini */}
            <div className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-300 cursor-pointer">
              <span className="text-lg">✨</span>
              <span className="font-semibold tracking-tight text-sm">Google Gemini IA</span>
            </div>
            
            {/* Logo 2: React 19 */}
            <div className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-300 cursor-pointer">
              <span className="text-lg">⚛</span>
              <span className="font-semibold tracking-tight text-sm">React 19</span>
            </div>

            {/* Logo 3: Tailwind CSS */}
            <div className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-300 cursor-pointer">
              <span className="text-lg">🌊</span>
              <span className="font-semibold tracking-tight text-sm">Tailwind CSS v4</span>
            </div>

            {/* Logo 4: TypeScript */}
            <div className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-300 cursor-pointer">
              <span className="text-lg">🛡️</span>
              <span className="font-semibold tracking-tight text-sm">TypeScript</span>
            </div>

            {/* Logo 5: Vite */}
            <div className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-300 cursor-pointer">
              <span className="text-lg">⚡</span>
              <span className="font-semibold tracking-tight text-sm">Vite.js</span>
            </div>
          </div>
        </div>

        {/* Local Roadmap tracking section */}
        <div
          id="roadmap"
          className="mt-24 rounded-3xl border border-white/5 bg-white/[0.01] p-8 backdrop-blur-md shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 -z-10 h-[200px] w-[200px] rounded-full bg-violet-600/5 blur-[50px]" />
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Status do Roadmap do Projeto
          </h2>
          <p className="mt-2 text-slate-400 text-sm">
            Todas as fases iniciais e integrações estão ativas e padronizadas no novo design system.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 hover:border-white/10 transition-colors">
              <div className="mb-1 font-semibold text-accent-lime">
                ✓ React + TypeScript
              </div>
              <p className="text-xs text-slate-400">
                Configurado com tipagem estrita e sem exports ausentes.
              </p>
            </div>
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 hover:border-white/10 transition-colors">
              <div className="mb-1 font-semibold text-accent-lime">
                ✓ ESLint & Prettier
              </div>
              <p className="text-xs text-slate-400">
                Garantia de formatação unificada sob o salvamento.
              </p>
            </div>
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 hover:border-white/10 transition-colors">
              <div className="mb-1 font-semibold text-accent-lime">
                ✓ Tailwind CSS v4
              </div>
              <p className="text-xs text-slate-400">
                Customizado com gradientes mesh e design tokens fluídos.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
