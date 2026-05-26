import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';

export const NotFound: React.FC = () => (
  <div className="animate-fadeIn mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:px-8">
    <p className="font-mono text-7xl font-extrabold text-white/10">404</p>
    <h2 className="mt-4 text-2xl font-bold text-white">Página não encontrada</h2>
    <p className="mt-2 text-sm text-slate-400">
      O endereço que você acessou não existe ou foi removido.
    </p>
    <div className="mt-8">
      <Link to="/">
        <Button size="lg">Voltar ao Início</Button>
      </Link>
    </div>
  </div>
);
