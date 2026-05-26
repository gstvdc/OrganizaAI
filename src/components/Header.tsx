import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Button } from './Button';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full bg-transparent py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo - Planirium Dot style */}
        <div className="flex items-center">
          <Link to="/" className="group flex items-center gap-2">
            <span className="font-display text-xl font-extrabold tracking-tight text-white">
              OrganizAI<span className="text-accent-lime font-extrabold">.</span>
            </span>
          </Link>
        </div>

        {/* Navigation - Glassmorphic Pill Capsule with vertical separators and active green dots */}
        <nav className="hidden items-center rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-lg md:flex shadow-lg shadow-black/25">
          <NavLink
            to="/"
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
                Início
              </>
            )}
          </NavLink>
          
          <div className="h-4 w-[1px] bg-white/10 mx-1" />

          <NavLink
            to="/simulacao"
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
                Simulação
              </>
            )}
          </NavLink>
        </nav>

        {/* Actions (Start Button) */}
        <div className="flex items-center gap-3.5">
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
