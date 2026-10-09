import { useEffect, useSyncExternalStore } from 'react';
import { createRoot } from 'react-dom/client';
import { DIAGNOSTIC_HREF } from './config';
import './site.js';
import { initMobileMenu, isMobileMenuOpen, subscribeMobileMenu } from './mobile-menu';

initMobileMenu();

const mount = document.getElementById('doubleclicc-player');
const fallback = document.getElementById('player-fallback');

if (mount) {
  import('./components/doubleclicc/DoublecliccPlayer').then(({ DoublecliccPlayer }) => {
    function HeroPlayer() {
      const menuOpen = useSyncExternalStore(subscribeMobileMenu, isMobileMenuOpen);
      useEffect(() => { if (fallback) fallback.hidden = true; }, []);
      return <DoublecliccPlayer diagnosticHref={DIAGNOSTIC_HREF} playbackSuspended={menuOpen} />;
    }
    createRoot(mount, {
      onUncaughtError: () => {
        mount.hidden = true;
        if (fallback) fallback.hidden = false;
      },
    }).render(<HeroPlayer />);
  }).catch(() => {
    // The HTML message and link remain usable if the player bundle cannot load.
  });
}
