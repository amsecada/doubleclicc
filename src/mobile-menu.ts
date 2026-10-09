const toggle = document.getElementById('menuToggle');
const changeEvent = 'mobile-menu-change';

export function isMobileMenuOpen() {
  return toggle?.getAttribute('aria-expanded') === 'true';
}

export function subscribeMobileMenu(listener: () => void) {
  toggle?.addEventListener(changeEvent, listener);
  return () => toggle?.removeEventListener(changeEvent, listener);
}

export function initMobileMenu() {
  const header = document.getElementById('siteHeader');
  const panel = document.getElementById('headerMenu');
  const backdrop = document.getElementById('menuBackdrop');
  if (!toggle || !header || !panel || !backdrop) return;

  const mobile = window.matchMedia('(max-width: 960px)');
  function setOpen(open: boolean, restoreFocus = true) {
    const expanded = open && mobile.matches;
    toggle!.setAttribute('aria-expanded', String(expanded));
    toggle!.setAttribute('aria-label', expanded ? 'Close menu' : 'Open menu');
    header!.classList.toggle('is-menu-open', expanded);
    document.body.classList.toggle('mobile-menu-open', expanded);
    backdrop!.hidden = !expanded;
    if (!expanded && restoreFocus) toggle!.focus({ preventScroll: true });
    toggle!.dispatchEvent(new Event(changeEvent));
  }

  toggle.addEventListener('click', () => setOpen(!isMobileMenuOpen()));
  backdrop.addEventListener('click', () => setOpen(false));
  // Close before a diagnostic button opens its dialog, so focus returns to Menu.
  panel.addEventListener('click', event => {
    if (isMobileMenuOpen() && (event.target as Element).closest('a, button')) setOpen(false);
  }, true);
  header.addEventListener('click', event => {
    if (isMobileMenuOpen() && (event.target as Element).closest('.brand')) setOpen(false);
  });
  header.addEventListener('focusout', event => {
    if (isMobileMenuOpen() && event.relatedTarget instanceof Node && !header.contains(event.relatedTarget)) {
      setOpen(false, false);
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && isMobileMenuOpen()) {
      event.preventDefault();
      setOpen(false);
    }
  });
  mobile.addEventListener('change', () => {
    const toggleHadFocus = document.activeElement === toggle;
    setOpen(false, false);
    if (!mobile.matches && toggleHadFocus) header.querySelector<HTMLAnchorElement>('.brand')?.focus();
  });

  // Measure only the bar: the overlay panel never changes its height.
  const measure = () => document.documentElement.style.setProperty('--header-height', `${header.getBoundingClientRect().height}px`);
  new ResizeObserver(measure).observe(header);
  header.classList.add('has-mobile-menu');
  toggle.hidden = false;
  measure();
}
