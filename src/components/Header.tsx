import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Button } from './Button';

const BASE_NAV_LINKS = [
  { to: '/', label: 'Início', exact: true },
  { to: '/simulacao', label: 'Simulação', exact: false },
  { to: '/historico', label: 'Histórico', exact: false },
];

export const Header: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isSimulacao = location.pathname === '/simulacao';

  const [hasEnoughSimulations] = useState(
    () => JSON.parse(localStorage.getItem('simulations') ?? '[]').length >= 2,
  );

  const NAV_LINKS = hasEnoughSimulations
    ? [...BASE_NAV_LINKS, { to: '/comparar', label: 'Comparar', exact: false }]
    : BASE_NAV_LINKS;

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        mobileOpen
          ? 'bg-space-950/95 backdrop-blur-lg'
          : 'bg-transparent'
      }`}
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-2" onClick={() => setMobileOpen(false)}>
            <span className="font-display text-xl font-extrabold tracking-tight text-white">
              OrganizAI<span className="text-accent-lime font-extrabold">.</span>
            </span>
          </Link>

          {/* Nav pill — desktop only */}
          <nav className="hidden items-center rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-lg md:flex shadow-lg shadow-black/25">
            {NAV_LINKS.map((link, idx) => (
              <React.Fragment key={link.to}>
                {idx > 0 && <div className="h-4 w-px bg-white/10 mx-1" />}
                <NavLink
                  to={link.to}
                  end={link.exact}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-5 py-1.5 text-xs font-semibold rounded-full transition-all duration-300 ${
                      isActive
                        ? 'bg-white text-space-950 shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && <span className="h-1.5 w-1.5 rounded-full bg-accent-lime" />}
                      {link.label}
                    </>
                  )}
                </NavLink>
              </React.Fragment>
            ))}
          </nav>

          {/* Right side: CTA + hamburger */}
          <div className="flex items-center gap-2">
            {/* CTA — hidden on /simulacao and on mobile */}
            {!isSimulacao && (
              <Link to="/simulacao" className="hidden sm:inline-block">
                <Button size="sm" variant="secondary" className="flex items-center gap-1.5">
                  Simular Já
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </Link>
            )}

            {/* Hamburger button — mobile only */}
            <button
              className={`flex items-center justify-center rounded-lg p-2 transition-all duration-200 md:hidden ${
                mobileOpen
                  ? 'bg-white/10 text-white'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={mobileOpen}
            >
              {/* Animated hamburger → X */}
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-all duration-300 origin-center"
                  d={mobileOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu — always rendered, animated with max-h + opacity */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
          mobileOpen
            ? 'max-h-125 opacity-100'
            : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="border-t border-white/5">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-3 sm:px-6">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.exact}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-lime" />}
                    {link.label}
                  </>
                )}
              </NavLink>
            ))}

            {/* Mobile CTA */}
            {!isSimulacao && (
              <div className="mt-2 border-t border-white/5 pt-3 pb-1">
                <Link to="/simulacao" onClick={() => setMobileOpen(false)}>
                  <Button size="sm" variant="secondary" className="flex w-full items-center justify-center gap-1.5">
                    Simular Já
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
