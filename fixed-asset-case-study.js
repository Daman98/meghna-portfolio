document.addEventListener('DOMContentLoaded', () => {
  const opportunityCarousel = document.querySelector('.fixed-opportunity-carousel');

  if (opportunityCarousel) {
    const cards = [...opportunityCarousel.querySelectorAll('[data-card-index]')];
    const dots = [...opportunityCarousel.querySelectorAll('[data-dot-index]')];
    const activeNumber = opportunityCarousel.querySelector('.fixed-opportunity-number');
    let transitionTimer;
    let isTransitioning = false;

    function activateOpportunity(activeIndex, requestedDirection) {
      if (isTransitioning) {
        return;
      }

      const previousActive = cards.findIndex((card) => card.classList.contains('is-active'));
      if (previousActive === activeIndex) {
        return;
      }

      isTransitioning = previousActive !== -1;
      const forwardDistance = (activeIndex - previousActive + cards.length) % cards.length;
      const backwardDistance = (previousActive - activeIndex + cards.length) % cards.length;
      const direction = requestedDirection ?? (forwardDistance <= backwardDistance ? 1 : -1);
      const previousRects = new Map();
      const previouslyVisible = new Set();

      cards.forEach((card) => {
        card.getAnimations().forEach((animation) => animation.cancel());
        previousRects.set(card, card.getBoundingClientRect());
        if (getComputedStyle(card).visibility === 'visible') {
          previouslyVisible.add(card);
        }
      });

      cards.forEach((card, index) => {
        window.clearTimeout(card.exitTimer);
        card.classList.remove('is-exiting', 'is-exiting-far');
        const relativePosition = (index - activeIndex + cards.length) % cards.length;
        card.classList.toggle('is-active', relativePosition === 0);
        card.classList.toggle('is-next', relativePosition === 1);
        card.classList.toggle('is-next-far', relativePosition === 2);
        card.classList.toggle('is-hidden', relativePosition > 2);
        card.setAttribute('aria-selected', String(relativePosition === 0));
      });

      const outgoingIndex = direction > 0
        ? previousActive
        : (previousActive + 2) % cards.length;
      const exitingCard = cards[outgoingIndex];
      exitingCard.classList.add(direction > 0 ? 'is-exiting' : 'is-exiting-far');
      const outgoingAnimation = exitingCard.animate(
        [
          { opacity: 1, translate: '0 0' },
          { opacity: 0, translate: `${direction > 0 ? -24 : 24}px 0` }
        ],
        { duration: 180, easing: 'ease-out', fill: 'forwards' }
      );

      cards.forEach((card, index) => {
        if (card === exitingCard || card.classList.contains('is-hidden')) {
          return;
        }

        const finalRect = card.getBoundingClientRect();
        let previousRect = previousRects.get(card);
        const wasVisible = previouslyVisible.has(card);

        if (direction < 0 && index === activeIndex && !wasVisible) {
          const entrySize = finalRect.width * 0.5;
          previousRect = {
            left: finalRect.left - entrySize,
            top: finalRect.top + ((finalRect.height - entrySize) / 2),
            width: entrySize,
            height: entrySize
          };
        }

        const previousCenterX = previousRect.left + (previousRect.width / 2);
        const previousCenterY = previousRect.top + (previousRect.height / 2);
        const finalCenterX = finalRect.left + (finalRect.width / 2);
        const finalCenterY = finalRect.top + (finalRect.height / 2);
        const scale = previousRect.width / finalRect.width;

        card.animate(
          [
            {
              opacity: wasVisible ? 1 : 0,
              translate: `${previousCenterX - finalCenterX}px ${previousCenterY - finalCenterY}px`,
              scale
            },
            { opacity: 1, translate: '0 0', scale: 1 }
          ],
          {
            duration: 300,
            easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)'
          }
        );
      });

      if (exitingCard) {
        exitingCard.exitTimer = window.setTimeout(() => {
          outgoingAnimation.cancel();
          exitingCard.classList.remove('is-exiting', 'is-exiting-far');
        }, 300);
      }

      dots.forEach((dot, index) => {
        const isActive = index === activeIndex;
        dot.classList.toggle('is-active', isActive);
        dot.setAttribute('aria-selected', String(isActive));
      });

      if (activeNumber) {
        activeNumber.textContent = String(activeIndex + 1).padStart(2, '0');
        activeNumber.animate(
          [
            { opacity: 0.25, transform: 'translateY(14px)' },
            { opacity: 1, transform: 'translateY(0)' }
          ],
          { duration: 220, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' }
        );
      }

      window.clearTimeout(transitionTimer);
      transitionTimer = window.setTimeout(() => {
        isTransitioning = false;
      }, 300);
    }

    cards.forEach((card) => {
      card.addEventListener('click', () => {
        const activeIndex = cards.findIndex((candidate) => candidate.classList.contains('is-active'));
        const direction = card.classList.contains('is-active') ? -1 : 1;
        activateOpportunity((activeIndex + direction + cards.length) % cards.length, direction);
      });
      card.addEventListener('keydown', (event) => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
          return;
        }

        event.preventDefault();
        const activeIndex = cards.findIndex((candidate) => candidate.classList.contains('is-active'));
        const direction = event.key === 'ArrowRight' ? 1 : -1;
        activateOpportunity((activeIndex + direction + cards.length) % cards.length, direction);
      });
    });

    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const targetIndex = Number(dot.dataset.dotIndex);
        const activeIndex = cards.findIndex((card) => card.classList.contains('is-active'));
        const forwardDistance = (targetIndex - activeIndex + cards.length) % cards.length;
        const backwardDistance = (activeIndex - targetIndex + cards.length) % cards.length;
        activateOpportunity(targetIndex, forwardDistance <= backwardDistance ? 1 : -1);
      });
    });
  }

  const impactTrack = document.querySelector('.fixed-impact-grid');
  const impactCards = [...document.querySelectorAll('.fixed-impact-card')];
  const impactDots = [...document.querySelectorAll('[data-impact-page]')];
  const impactPageStarts = [0, 3, 6];
  let impactScrollFrame;

  function setActiveImpact(index) {
    impactDots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === index;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-selected', String(isActive));
    });
  }

  function getImpactOffset(card) {
    return card.offsetLeft - impactCards[0].offsetLeft;
  }

  function scrollToImpact(pageIndex) {
    const card = impactCards[impactPageStarts[pageIndex]];
    if (!impactTrack || !card) {
      return;
    }

    impactTrack.scrollTo({ left: getImpactOffset(card), behavior: 'smooth' });
    setActiveImpact(pageIndex);
  }

  if (impactTrack && impactCards.length) {
    impactTrack.addEventListener('scroll', () => {
      window.cancelAnimationFrame(impactScrollFrame);
      impactScrollFrame = window.requestAnimationFrame(() => {
        const activePage = impactPageStarts.reduce((closestPage, cardIndex, pageIndex) => {
          const currentDistance = Math.abs(getImpactOffset(impactCards[cardIndex]) - impactTrack.scrollLeft);
          const closestDistance = Math.abs(getImpactOffset(impactCards[impactPageStarts[closestPage]]) - impactTrack.scrollLeft);
          return currentDistance < closestDistance ? pageIndex : closestPage;
        }, 0);
        setActiveImpact(activePage);
      });
    }, { passive: true });

    impactTrack.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
        return;
      }

      event.preventDefault();
      const activePage = impactDots.findIndex((dot) => dot.classList.contains('is-active'));
      const direction = event.key === 'ArrowRight' ? 1 : -1;
      const nextPage = Math.max(0, Math.min(impactDots.length - 1, activePage + direction));
      scrollToImpact(nextPage);
    });

    impactDots.forEach((dot) => {
      dot.addEventListener('click', () => scrollToImpact(Number(dot.dataset.impactPage)));
    });
  }

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
