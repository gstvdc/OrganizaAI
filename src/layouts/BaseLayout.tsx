import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header';
import { MeshGradientBackground } from '../components/MeshGradientBackground';

export const BaseLayout: React.FC = () => {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-transparent text-white font-sans antialiased">
      {/* Dynamic WebGL Mesh Gradient Background */}
      <MeshGradientBackground />

      <Header />
      
      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-white/5 bg-space-950/45 py-8 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-slate-400">
              © {new Date().getFullYear()} OrganizAI. Todos os direitos
              reservados.
            </p>
            <div className="flex gap-6 text-sm text-slate-400">
              <a
                href="#"
                className="transition-colors hover:text-accent-lime"
              >
                Termos de Uso
              </a>
              <a
                href="#"
                className="transition-colors hover:text-accent-lime"
              >
                Privacidade
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
