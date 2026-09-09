document.addEventListener('DOMContentLoaded', () => {
  const carousels = document.querySelectorAll('.interactive-opportunity');

  carousels.forEach((carousel) => {
    const problems = [...carousel.querySelectorAll('[data-problem-index]')];
    const opportunities = [...carousel.querySelectorAll('[data-opportunity-index]')];

    function activateProblem(activeIndex) {
      problems.forEach((problem, index) => {
        const relativePosition = (index - activeIndex + problems.length) % problems.length;
        const hasFarPositions = problems.length > 3;

        problem.classList.toggle('is-active', relativePosition === 0);
        problem.classList.toggle('is-after', relativePosition === 1);
        problem.classList.toggle('is-after-far', hasFarPositions && relativePosition === 2);
        problem.classList.toggle('is-before-far', hasFarPositions && relativePosition === problems.length - 2);
        problem.classList.toggle('is-before', relativePosition === problems.length - 1);
        problem.setAttribute('aria-selected', String(relativePosition === 0));
      });

      opportunities.forEach((opportunity, index) => {
        const isActive = index === activeIndex;
        opportunity.classList.toggle('is-active', isActive);
        opportunity.setAttribute('aria-hidden', String(!isActive));
      });
    }

    problems.forEach((problem, index) => {
      problem.addEventListener('click', () => activateProblem(index));
      problem.addEventListener('keydown', (event) => {
        if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') {
          return;
        }

        event.preventDefault();
        const direction = event.key === 'ArrowDown' ? 1 : -1;
        const nextIndex = (index + direction + problems.length) % problems.length;
        activateProblem(nextIndex);
        problems[nextIndex].focus();
      });
    });
  });

  const wireframeTabs = [...document.querySelectorAll('.wireframe-tab')];
  const wireframeDisplay = document.querySelector('#wireframe-display');
  const wireframeScreen = wireframeDisplay?.querySelector('.desktop-monitor-screen');
  const wireframeImage = wireframeScreen?.querySelector('img');
  let wireframeSwitchTimer;

  function activateWireframe(tab) {
    if (!wireframeDisplay || !wireframeScreen || !wireframeImage || tab.classList.contains('is-active')) {
      return;
    }

    wireframeTabs.forEach((candidate) => {
      const isActive = candidate === tab;
      candidate.classList.toggle('is-active', isActive);
      candidate.setAttribute('aria-selected', String(isActive));
    });

    wireframeDisplay.setAttribute('aria-labelledby', tab.id);
    wireframeScreen.classList.add('is-switching');
    window.clearTimeout(wireframeSwitchTimer);
    wireframeSwitchTimer = window.setTimeout(() => {
      wireframeImage.src = tab.dataset.wireframeSrc;
      wireframeImage.alt = tab.dataset.wireframeAlt;
      wireframeScreen.setAttribute('aria-label', `Scrollable ${tab.dataset.wireframeAlt}`);
      wireframeScreen.scrollTop = 0;
      wireframeScreen.classList.remove('is-switching');
    }, 180);
  }

  wireframeTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateWireframe(tab));
    tab.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
        return;
      }

      event.preventDefault();
      const direction = event.key === 'ArrowRight' ? 1 : -1;
      const nextIndex = (index + direction + wireframeTabs.length) % wireframeTabs.length;
      activateWireframe(wireframeTabs[nextIndex]);
      wireframeTabs[nextIndex].focus();
    });
  });
});
