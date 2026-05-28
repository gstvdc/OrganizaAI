import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Header } from '../components/Header';
import { MeshGradientBackground } from '../components/MeshGradientBackground';
import { StaticBackground } from '../components/StaticBackground';
import { PageTransition } from '../components/PageTransition';

const NAV_LINKS = [
  { to: '/', label: 'Início' },
  { to: '/simulacao', label: 'Simulação' },
  { to: '/historico', label: 'Histórico' },
];

const IconSparkle = () => (
  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
  </svg>
);

export const BaseLayout: React.FC = () => {
  const { pathname } = useLocation();

  return (
    <div className="relative flex min-h-screen flex-col bg-transparent text-white font-sans antialiased" style={{ overflowX: 'clip' }}>
      {pathname === '/' && <MeshGradientBackground />}
      <StaticBackground />
      <Header />

      <main className="flex-1">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>

      <footer
        className="relative mt-auto border-t border-white/5 backdrop-blur-md"
        style={{
          backgroundColor: pathname === '/' ? 'rgba(3, 0, 20, 0.45)' : 'transparent',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {/* subtle gradient top-edge glow */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-accent-lime/20 to-transparent" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Main footer row */}
          <div className="flex flex-col gap-8 py-10 sm:flex-row sm:items-start sm:justify-between">

            {/* Brand column */}
            <div className="flex flex-col gap-3 max-w-xs">
              <Link to="/" className="w-fit">
                <span className="font-display text-xl font-extrabold tracking-tight text-white">
                  OrganizAI<span className="text-accent-lime">.</span>
                </span>
              </Link>
              <p className="text-sm leading-relaxed text-slate-400">
                Inteligência artificial para mapear suas finanças e construir um futuro mais próspero.
              </p>
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-accent-lime/20 bg-accent-lime/5 px-3 py-1 text-[11px] font-semibold text-accent-lime">
                <IconSparkle />
                Gratuito &amp; sem cadastro
              </span>
            </div>

            {/* Nav + CTA column */}
            <div className="flex flex-col gap-4 sm:items-end">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                Navegação
              </p>
              <nav className="flex flex-wrap gap-x-6 gap-y-2 sm:flex-col sm:items-end sm:gap-2">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="text-sm font-medium text-slate-400 transition-colors duration-200 hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/5 py-5 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} OrganizAI. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

