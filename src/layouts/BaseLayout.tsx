import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '../components/Header';
import { MeshGradientBackground } from '../components/MeshGradientBackground';
import { StaticBackground } from '../components/StaticBackground';
import { PageTransition } from '../components/PageTransition';

export const BaseLayout: React.FC = () => {
  const { pathname } = useLocation();

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-transparent text-white font-sans antialiased">
      {/* WebGL mesh gradient — only on home route to avoid 60fps GPU drain on inner pages */}
      {pathname === '/' && <MeshGradientBackground />}

      {/* Static overlay — sits above mesh (z-index -9), fades in on non-home routes */}
      <StaticBackground />

      <Header />
      
      <main className="flex-1">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>

      <footer className="border-t border-white/5 bg-space-950/45 py-8 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} OrganizAI. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

