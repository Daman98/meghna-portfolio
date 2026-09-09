const edgeImpactTrack = document.querySelector(".edge-impact-track");
const edgeImpactCards = Array.from(document.querySelectorAll(".edge-impact-card"));
const edgeImpactDots = document.querySelector(".edge-impact-dots");

if (edgeImpactTrack && edgeImpactCards.length && edgeImpactDots) {
  let currentPage = 0;
  let scrollFrame;

  const getVisibleCardCount = () => (window.matchMedia("(max-width: 760px)").matches ? 1 : 3);
  const getPageCount = () => Math.ceil(edgeImpactCards.length / getVisibleCardCount());
  const getPageOffset = page => {
    const cardIndex = Math.min(page * getVisibleCardCount(), edgeImpactCards.length - 1);
    const requestedOffset = edgeImpactCards[cardIndex].offsetLeft - edgeImpactCards[0].offsetLeft;
    return Math.min(requestedOffset, edgeImpactTrack.scrollWidth - edgeImpactTrack.clientWidth);
  };

  const updateDots = () => {
    edgeImpactDots.querySelectorAll("button").forEach((dot, index) => {
      dot.classList.toggle("is-active", index === currentPage);
      dot.setAttribute("aria-current", index === currentPage ? "true" : "false");
    });
  };

  const goToPage = (page, behavior = "smooth") => {
    const pageCount = getPageCount();
    currentPage = (page + pageCount) % pageCount;

    edgeImpactTrack.scrollTo({
      left: getPageOffset(currentPage),
      behavior,
    });
    updateDots();
  };

  const renderDots = () => {
    edgeImpactDots.replaceChildren();

    for (let page = 0; page < getPageCount(); page += 1) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `Show impact page ${page + 1}`);
      dot.addEventListener("click", () => goToPage(page));
      edgeImpactDots.appendChild(dot);
    }

    updateDots();
  };

  edgeImpactTrack.addEventListener(
    "scroll",
    () => {
      window.cancelAnimationFrame(scrollFrame);
      scrollFrame = window.requestAnimationFrame(() => {
        const pagePositions = Array.from({ length: getPageCount() }, (_, page) => getPageOffset(page));

        currentPage = pagePositions.reduce(
          (closest, position, index) =>
            Math.abs(position - edgeImpactTrack.scrollLeft) <
            Math.abs(pagePositions[closest] - edgeImpactTrack.scrollLeft)
              ? index
              : closest,
          0,
        );
        updateDots();
      });
    },
    { passive: true },
  );

  window.addEventListener("resize", () => {
    currentPage = 0;
    renderDots();
    goToPage(0, "auto");
  });

  renderDots();
}

(() => {
  const voicesSection = document.querySelector(".edge-customer-voices");
  const control = voicesSection?.querySelector(".edge-customer-voices-control");
  const label = control?.querySelector(".edge-customer-voices-control-label");

  if (!voicesSection || !control || !label) {
    return;
  }

  if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
    control.disabled = true;
    label.textContent = "Voiceover unavailable";
    return;
  }

  const visibleQuotes = [...voicesSection.querySelectorAll('blockquote:not([aria-hidden="true"])')];
  const allQuotes = [...voicesSection.querySelectorAll("blockquote")];
  const masculineVoicePatterns = [
    /\brishi\b/i,
    /\bdaniel\b/i,
    /microsoft (david|mark|guy|ryan|christopher|eric)/i,
    /google uk english male/i,
    /\b(alex|ralph|fred|aaron|arthur|bruce|eddy|reed|rocko)\b/i,
    /\bmale\b/i,
  ];
  let currentIndex = 0;
  let isPlaying = false;
  let isPaused = false;
  let playbackId = 0;

  const selectMasculineVoice = () => {
    const englishVoices = window.speechSynthesis
      .getVoices()
      .filter(voice => voice.lang.toLowerCase().startsWith("en"));

    for (const pattern of masculineVoicePatterns) {
      const match = englishVoices.find(voice => pattern.test(voice.name));
      if (match) {
        return match;
      }
    }

    return englishVoices[0] ?? null;
  };

  const waitForMasculineVoice = async () => {
    const availableVoice = selectMasculineVoice();
    if (availableVoice) {
      return availableVoice;
    }

    await new Promise(resolve => {
      const handleVoicesChanged = () => {
        window.clearTimeout(timeoutId);
        resolve();
      };
      const timeoutId = window.setTimeout(() => {
        window.speechSynthesis.removeEventListener("voiceschanged", handleVoicesChanged);
        resolve();
      }, 750);

      window.speechSynthesis.addEventListener("voiceschanged", handleVoicesChanged, { once: true });
    });

    return selectMasculineVoice();
  };

  const updateControl = () => {
    control.classList.toggle("is-playing", isPlaying && !isPaused);
    control.setAttribute("aria-pressed", String(isPlaying));
    label.textContent = !isPlaying
      ? "Play customer voices"
      : isPaused
        ? "Resume customer voices"
        : "Pause customer voices";
  };

  const highlightQuote = () => {
    allQuotes.forEach((quote, index) => {
      quote.classList.toggle("is-speaking", isPlaying && index % visibleQuotes.length === currentIndex);
    });
  };

  const finishPlayback = () => {
    isPlaying = false;
    isPaused = false;
    currentIndex = 0;
    highlightQuote();
    updateControl();
  };

  const speakCurrentQuote = async activePlaybackId => {
    if (!isPlaying || activePlaybackId !== playbackId) {
      return;
    }

    if (currentIndex >= visibleQuotes.length) {
      finishPlayback();
      return;
    }

    highlightQuote();
    const masculineVoice = await waitForMasculineVoice();
    if (!isPlaying || activePlaybackId !== playbackId) {
      return;
    }

    const quote = visibleQuotes[currentIndex].textContent.trim();
    const utterance = new SpeechSynthesisUtterance(quote.replace(/[“”]/g, ""));
    if (masculineVoice) {
      utterance.voice = masculineVoice;
    }
    utterance.lang = masculineVoice?.lang ?? "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.onend = () => {
      if (!isPlaying || activePlaybackId !== playbackId) {
        return;
      }

      currentIndex += 1;
      speakCurrentQuote(activePlaybackId);
    };
    utterance.onerror = event => {
      if (event.error !== "canceled" && event.error !== "interrupted") {
        finishPlayback();
      }
    };
    window.speechSynthesis.speak(utterance);
  };

  control.addEventListener("click", () => {
    if (!isPlaying) {
      playbackId += 1;
      currentIndex = 0;
      isPlaying = true;
      isPaused = false;
      updateControl();
      speakCurrentQuote(playbackId);
      return;
    }

    if (isPaused) {
      window.speechSynthesis.resume();
      isPaused = false;
    } else {
      window.speechSynthesis.pause();
      isPaused = true;
    }

    updateControl();
  });

  window.addEventListener("pagehide", () => {
    playbackId += 1;
    window.speechSynthesis.cancel();
  });

  updateControl();
})();
