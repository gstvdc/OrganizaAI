import React, { useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Enter-only page transition using direct DOM manipulation.
 *
 * The class is set via ref.className inside useLayoutEffect — before the
 * browser ever paints — with no useState involved. A useState setter would
 * schedule a React re-render, creating a two-render gap (no-class → class)
 * that can be visible even inside useLayoutEffect. Direct DOM mutation has
 * no such gap: one commit, one paint, animation class already there.
 *
 * animation-fill-mode: both on each class guarantees the 0% keyframe
 * (e.g. translateX(100%)) is applied the instant the class lands.
 */

const ROUTE_ORDER = ['/', '/simulacao', '/historico', '/resultado'];

function getDepth(path: string): number {
  const idx = ROUTE_ORDER.findIndex((r) =>
    r === '/' ? path === '/' : path.startsWith(r),
  );
  return idx >= 0 ? idx : ROUTE_ORDER.length;
}

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const prevPathRef = useRef(location.pathname);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prev = prevPathRef.current;
    const next = location.pathname;

    if (prev === next) return;
    prevPathRef.current = next;

    const isPanelForward = prev === '/' && next === '/simulacao';
    const isPanelBack = prev === '/simulacao' && next === '/';
    const goingForward = getDepth(next) >= getDepth(prev);

    if (isPanelForward) {
      el.className = 'page-panel-slide-in';
    } else if (isPanelBack) {
      el.className = 'page-panel-expand-in';
    } else if (goingForward) {
      el.className = 'page-slide-in-from-right';
    } else {
      el.className = 'page-slide-in-from-left';
    }
  }, [location.pathname]);

  return (
    <div key={location.pathname} ref={containerRef}>
      {children}
    </div>
  );
};
