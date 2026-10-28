document.addEventListener('DOMContentLoaded', () => {
  const imageDialog = document.querySelector('#org-monitor-dialog');
  const dialogImage = imageDialog?.querySelector('img');
  const closeDialogButton = imageDialog?.querySelector('.dialog-close');

  document.querySelectorAll('[data-lightbox-src]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      if (!imageDialog || !dialogImage) return;
      dialogImage.src = trigger.dataset.lightboxSrc;
      dialogImage.alt = trigger.dataset.lightboxAlt || '';
      imageDialog.showModal();
    });
  });

  closeDialogButton?.addEventListener('click', () => imageDialog.close());

  imageDialog?.addEventListener('click', (event) => {
    if (event.target === imageDialog) {
      imageDialog.close();
    }
  });

  const opportunityCarousel = document.querySelector('.fixed-opportunity-carousel');

  if (opportunityCarousel) {
    const cards = [...opportunityCarousel.querySelectorAll('[data-card-index]')];
    const dots = [...opportunityCarousel.querySelectorAll('[data-dot-index]')];
    const activeNumber = opportunityCarousel.querySelector('.fixed-opportunity-number');
    const opportunityPrevious = opportunityCarousel.querySelector('.org-opportunity-previous');
    const opportunityNext = opportunityCarousel.querySelector('.org-opportunity-next');
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

    opportunityPrevious?.addEventListener('click', () => {
      const activeIndex = cards.findIndex((card) => card.classList.contains('is-active'));
      activateOpportunity((activeIndex - 1 + cards.length) % cards.length, -1);
    });

    opportunityNext?.addEventListener('click', () => {
      const activeIndex = cards.findIndex((card) => card.classList.contains('is-active'));
      activateOpportunity((activeIndex + 1) % cards.length, 1);
    });
  }

  const impactTrack = document.querySelector('.fixed-impact-grid');
  const impactCards = [...document.querySelectorAll('.fixed-impact-card')];
  const impactDots = [...document.querySelectorAll('[data-impact-page]')];
  const impactPrevious = document.querySelector('.fixed-impact-previous');
  const impactNext = document.querySelector('.fixed-impact-next');
  const impactPageStarts = impactCards.reduce((pages, _card, index) => {
    if (index % 3 === 0) {
      pages.push(index);
    }
    return pages;
  }, []);
  let impactScrollFrame;
  let impactSettleTimer;
  let activeImpactPage = 0;
  let targetImpactPage = null;

  function setActiveImpact(index) {
    activeImpactPage = index;
    impactDots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === index;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-selected', String(isActive));
    });

  }

  function getImpactOffset(card) {
    return card.offsetLeft - impactCards[0].offsetLeft;
  }

  function getImpactPageOffset(card) {
    return Math.min(getImpactOffset(card), impactTrack.scrollWidth - impactTrack.clientWidth);
  }

  function getClosestImpactPage() {
    return impactPageStarts.reduce((closestPage, cardIndex, pageIndex) => {
      const currentDistance = Math.abs(getImpactPageOffset(impactCards[cardIndex]) - impactTrack.scrollLeft);
      const closestDistance = Math.abs(getImpactPageOffset(impactCards[impactPageStarts[closestPage]]) - impactTrack.scrollLeft);
      return currentDistance < closestDistance ? pageIndex : closestPage;
    }, 0);
  }

  function scrollToImpact(pageIndex) {
    const card = impactCards[impactPageStarts[pageIndex]];
    if (!impactTrack || !card) {
      return;
    }

    targetImpactPage = pageIndex;
    setActiveImpact(pageIndex);
    impactTrack.scrollTo({ left: getImpactPageOffset(card), behavior: 'smooth' });
  }

  if (impactTrack && impactCards.length) {
    impactTrack.addEventListener('scroll', () => {
      if (targetImpactPage !== null) {
        window.clearTimeout(impactSettleTimer);
        impactSettleTimer = window.setTimeout(() => {
          targetImpactPage = null;
          setActiveImpact(getClosestImpactPage());
        }, 120);
        return;
      }

      window.cancelAnimationFrame(impactScrollFrame);
      impactScrollFrame = window.requestAnimationFrame(() => {
        setActiveImpact(getClosestImpactPage());
      });
    }, { passive: true });

    impactTrack.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
        return;
      }
      event.preventDefault();
      event.preventDefault();
      const direction = event.key === 'ArrowRight' ? 1 : -1;
      const nextPage = (activeImpactPage + direction + impactDots.length) % impactDots.length;
      scrollToImpact(nextPage);
    });

    impactDots.forEach((dot) => {
      dot.addEventListener('click', () => scrollToImpact(Number(dot.dataset.impactPage)));
    });

    impactPrevious?.addEventListener('click', () => {
      scrollToImpact((activeImpactPage - 1 + impactPageStarts.length) % impactPageStarts.length);
    });

    impactNext?.addEventListener('click', () => {
      scrollToImpact((activeImpactPage + 1) % impactPageStarts.length);
    });

    setActiveImpact(0);
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

  const voicesSection = document.querySelector('.org-voices');
  const voicesControl = voicesSection?.querySelector('.org-voices-control');
  const voicesLabel = voicesControl?.querySelector('.org-voices-control-label');

  if (voicesSection && voicesControl && voicesLabel) {
    const visibleQuotes = [...voicesSection.querySelectorAll('blockquote:not([aria-hidden="true"])')];
    const allQuotes = [...voicesSection.querySelectorAll('blockquote')];
    let currentQuote = 0;
    let isPlaying = false;
    let isPaused = false;

    const updateVoicesControl = () => {
      voicesControl.classList.toggle('is-playing', isPlaying && !isPaused);
      voicesControl.setAttribute('aria-pressed', String(isPlaying));
      voicesLabel.textContent = !isPlaying
        ? 'Play customer voices'
        : isPaused
          ? 'Resume customer voices'
          : 'Pause customer voices';
      allQuotes.forEach((quote, index) => {
        quote.classList.toggle('is-speaking', isPlaying && index % visibleQuotes.length === currentQuote);
      });
    };

    const finishVoices = () => {
      isPlaying = false;
      isPaused = false;
      currentQuote = 0;
      updateVoicesControl();
    };

    const speakQuote = () => {
      if (!isPlaying || currentQuote >= visibleQuotes.length) {
        finishVoices();
        return;
      }

      updateVoicesControl();
      const utterance = new SpeechSynthesisUtterance(visibleQuotes[currentQuote].textContent.trim());
      utterance.lang = 'en-US';
      utterance.onend = () => {
        currentQuote += 1;
        speakQuote();
      };
      utterance.onerror = finishVoices;
      window.speechSynthesis.speak(utterance);
    };

    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
      voicesControl.disabled = true;
      voicesLabel.textContent = 'Voiceover unavailable';
    } else {
      voicesControl.addEventListener('click', () => {
        if (!isPlaying) {
          window.speechSynthesis.cancel();
          currentQuote = 0;
          isPlaying = true;
          isPaused = false;
          speakQuote();
          return;
        }

        if (isPaused) {
          window.speechSynthesis.resume();
          isPaused = false;
        } else {
          window.speechSynthesis.pause();
          isPaused = true;
        }
        updateVoicesControl();
      });

      window.addEventListener('pagehide', () => window.speechSynthesis.cancel());
      updateVoicesControl();
    }
  }
});
