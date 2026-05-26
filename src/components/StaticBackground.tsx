import React from 'react';
import { useLocation } from 'react-router-dom';

export const StaticBackground: React.FC = () => {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{
        zIndex: -9,
        opacity: isHome ? 0 : 1,
        // Instant cover when entering simulation; slow fade when returning to home
        transition: isHome ? 'opacity 600ms ease' : 'none',
      }}
      aria-hidden
    >
      {/* Base dark fill */}
      <div className="absolute inset-0" style={{ backgroundColor: '#030014' }} />

      {/* Top-left violet glow */}
      <div
        className="absolute rounded-full"
        style={{
          top: '-15%',
          left: '-8%',
          width: '55vw',
          height: '55vw',
          background: 'radial-gradient(circle, rgba(109,40,217,0.12) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Bottom-right lime glow */}
      <div
        className="absolute rounded-full"
        style={{
          bottom: '-12%',
          right: '-6%',
          width: '45vw',
          height: '45vw',
          background: 'radial-gradient(circle, rgba(197,255,34,0.04) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Center-right purple glow */}
      <div
        className="absolute rounded-full"
        style={{
          top: '35%',
          right: '20%',
          width: '35vw',
          height: '35vw',
          background: 'radial-gradient(circle, rgba(168,85,247,0.07) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />

      {/* Subtle noise grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
        }}
      />
    </div>
  );
};
