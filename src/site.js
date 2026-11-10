(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------
     Header: scroll progress + section status
     ------------------------------------------------------------ */
  var progressBar = document.getElementById('progressBar');
  var navStatus = document.getElementById('navStatus');
  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
  var ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      if (progressBar) {
        progressBar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0).toFixed(2) + '%';
      }

      if (navStatus) {
        var probe = window.scrollY + window.innerHeight * 0.4;
        var current = null;
        sections.forEach(function (s) {
          if (s.offsetTop <= probe) current = s;
        });
        if (!current || current.id === 'hero') {
          navStatus.textContent = 'SYSTEM ONLINE';
        } else {
          navStatus.textContent = 'SECTION ' + String(sections.indexOf(current) + 1).padStart(2, '0') + ' / ' + String(sections.length).padStart(2, '0');
        }
      }
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ------------------------------------------------------------
     Qualification modal (diagnostic flow)
     ------------------------------------------------------------ */
  var modal = document.getElementById('diagnosticModal');
  var consultFrame = document.getElementById('consultForm');

  function openModal() {
    if (!modal) return;
    if (consultFrame && !consultFrame.hasAttribute('src')) consultFrame.src = consultFrame.dataset.src;
    if (typeof modal.showModal === 'function') {
      if (!modal.open) modal.showModal();
    } else {
      modal.setAttribute('open', '');
    }
  }
  function closeModal() {
    if (!modal) return;
    if (typeof modal.close === 'function') modal.close();
    else modal.removeAttribute('open');
  }

  Array.prototype.forEach.call(document.querySelectorAll('[data-open-diagnostic]'), function (b) {
    b.addEventListener('click', openModal);
  });
  Array.prototype.forEach.call(document.querySelectorAll('[data-close-diagnostic]'), function (b) {
    b.addEventListener('click', closeModal);
  });

  document.querySelectorAll('[data-open-paper]').forEach(function (button) {
    var paper = document.getElementById(button.dataset.openPaper);
    if (!paper) return;
    button.addEventListener('click', function () {
      paper.showModal();
      paper.querySelector('.modal__panel').scrollTop = 0;
      document.body.classList.add('paper-is-open');
    });
    paper.querySelector('[data-close-paper]').addEventListener('click', function () {
      paper.close();
    });
    paper.addEventListener('click', function (event) {
      if (event.target === paper) paper.close();
    });
    paper.addEventListener('close', function () {
      document.body.classList.remove('paper-is-open');
      button.focus({ preventScroll: true });
    });
  });

  var projectCarousel = document.getElementById('projectCarousel');
  if (projectCarousel) {
    var projectNavigation = document.querySelector('.project-navigation');
    var projectPrevious = projectNavigation.querySelector('[data-project-prev]');
    var projectNext = projectNavigation.querySelector('[data-project-next]');
    projectNavigation.hidden = false;
    function updateProjectNavigation() {
      projectPrevious.disabled = projectCarousel.scrollLeft <= 1;
      projectNext.disabled = projectCarousel.scrollLeft >= projectCarousel.scrollWidth - projectCarousel.clientWidth - 1;
    }
    function scrollProjects(direction) {
      var cards = projectCarousel.querySelectorAll('.project-card');
      var step = cards[1].offsetLeft - cards[0].offsetLeft;
      projectCarousel.scrollBy({ left: direction * step, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    }
    projectPrevious.addEventListener('click', function () { scrollProjects(-1); });
    projectNext.addEventListener('click', function () { scrollProjects(1); });
    projectCarousel.addEventListener('scroll', updateProjectNavigation, { passive: true });
    new ResizeObserver(updateProjectNavigation).observe(projectCarousel);
    updateProjectNavigation();
  }

  var unfold = document.getElementById('unfold-showcase');
  var unfoldTrigger = document.querySelector('[data-open-unfold]');
  if (unfold && unfoldTrigger) {
    var unfoldVideo = unfold.querySelector('video');
    unfoldTrigger.addEventListener('click', function () {
      unfold.showModal();
      unfold.querySelector('.modal__panel').scrollTop = 0;
      document.body.classList.add('showcase-is-open');
    });
    unfold.querySelector('[data-close-unfold]').addEventListener('click', function () { unfold.close(); });
    unfold.addEventListener('click', function (event) {
      if (event.target === unfold) unfold.close();
    });
    unfold.addEventListener('close', function () {
      unfoldVideo.pause();
      document.body.classList.remove('showcase-is-open');
      unfoldTrigger.focus({ preventScroll: true });
    });
  }

  // Repeat the client strip once for a seamless loop; keep one accessible list.
  var clientCarousel = document.getElementById('clientCarousel');
  if (clientCarousel) {
    var clientTrack = clientCarousel.querySelector('.client-carousel__track');
    var clientCopy = clientTrack.querySelector('.client-grid').cloneNode(true);
    clientCopy.setAttribute('aria-hidden', 'true');
    clientCopy.removeAttribute('aria-label');
    clientCopy.inert = true;
    clientTrack.appendChild(clientCopy);
    clientCarousel.classList.add('is-ready');
    var clientMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    function updateClientMotion() {
      // Make the static, scrollable strip reachable with the keyboard.
      if (clientMotion.matches) {
        clientCarousel.tabIndex = 0;
        clientCarousel.setAttribute('role', 'region');
        clientCarousel.setAttribute('aria-label', 'Client organizations; scroll to see more');
      } else {
        clientCarousel.removeAttribute('tabindex');
        clientCarousel.removeAttribute('role');
        clientCarousel.removeAttribute('aria-label');
      }
    }
    clientMotion.addEventListener('change', updateClientMotion);
    updateClientMotion();
  }

  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  document.querySelectorAll('.client-card, .protocol__step, .paper-card').forEach(function (surface) {
    surface.classList.add('pointer-surface');
    surface.addEventListener('pointermove', function (event) {
      if (reduceMotion || !finePointer.matches) return;
      var rect = surface.getBoundingClientRect();
      surface.style.setProperty('--pointer-x', (event.clientX - rect.left) + 'px');
      surface.style.setProperty('--pointer-y', (event.clientY - rect.top) + 'px');
    });
  });

})();
