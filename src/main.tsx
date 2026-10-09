import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { DIAGNOSTIC_HREF } from './config';
import './site.js';

const mount = document.getElementById('doubleclicc-player');
const fallback = document.getElementById('player-fallback');
const fallbackLink = fallback?.querySelector('a');
if (fallbackLink) fallbackLink.href = DIAGNOSTIC_HREF;

if (mount) {
  import('./components/doubleclicc/DoublecliccPlayer').then(({ DoublecliccPlayer }) => {
    function HeroPlayer() {
      useEffect(() => { if (fallback) fallback.hidden = true; }, []);
      return <DoublecliccPlayer diagnosticHref={DIAGNOSTIC_HREF} />;
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
