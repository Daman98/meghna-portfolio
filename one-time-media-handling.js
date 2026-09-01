const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle?.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Open navigation");
  });
});

const imageDialog = document.querySelector("#image-dialog");
const dialogImage = imageDialog?.querySelector("img");
const closeDialogButton = imageDialog?.querySelector(".dialog-close");

document.querySelectorAll("[data-lightbox-src]").forEach((button) => {
  button.addEventListener("click", () => {
    dialogImage.src = button.dataset.lightboxSrc;
    dialogImage.alt = button.dataset.lightboxAlt;
    imageDialog.showModal();
  });
});

closeDialogButton?.addEventListener("click", () => imageDialog.close());

imageDialog?.addEventListener("click", (event) => {
  if (event.target === imageDialog) {
    imageDialog.close();
  }
});

const questionOptions = Array.from(document.querySelectorAll(".question-option"));
const questionPanels = Array.from(document.querySelectorAll(".question-panel"));
let activeQuestionIndex = questionOptions.findIndex((option) => option.classList.contains("is-active"));

const selectQuestion = (nextIndex) => {
  activeQuestionIndex = (nextIndex + questionOptions.length) % questionOptions.length;

  questionOptions.forEach((option, index) => {
    const offset = (index - activeQuestionIndex + questionOptions.length) % questionOptions.length;
    const position = offset === 0 ? "active" : offset === 1 ? "next" : "previous";
    const isActive = index === activeQuestionIndex;

    option.dataset.position = position;
    option.classList.toggle("is-active", isActive);
    option.setAttribute("aria-selected", String(isActive));
    option.tabIndex = isActive ? 0 : -1;
  });

  questionPanels.forEach((panel, index) => {
    panel.classList.toggle("is-active", index === activeQuestionIndex);
  });
};

questionOptions.forEach((option, index) => {
  option.addEventListener("click", () => selectQuestion(index));
  option.addEventListener("keydown", (event) => {
    if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
      return;
    }

    event.preventDefault();
    const nextIndex =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? questionOptions.length - 1
          : activeQuestionIndex + (["ArrowUp", "ArrowLeft"].includes(event.key) ? -1 : 1);
    selectQuestion(nextIndex);
    questionOptions[activeQuestionIndex].focus();
  });
});

selectQuestion(activeQuestionIndex);

const impactTrack = document.querySelector(".impact-track");
const impactCards = Array.from(document.querySelectorAll(".impact-card"));
const impactDots = document.querySelector(".impact-dots");
const impactControls = document.querySelectorAll("[data-impact-direction]");

if (impactTrack && impactCards.length && impactDots) {
  const autoplayDelay = 4500;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let currentPage = 0;
  let autoplayTimer;
  let scrollFrame;

  const getVisibleCardCount = () => (window.matchMedia("(max-width: 720px)").matches ? 1 : 3);
  const getPageCount = () => Math.ceil(impactCards.length / getVisibleCardCount());

  const updateDots = () => {
    impactDots.querySelectorAll("button").forEach((dot, index) => {
      dot.classList.toggle("is-active", index === currentPage);
      dot.setAttribute("aria-current", index === currentPage ? "true" : "false");
    });
  };

  const goToPage = (page, behavior = "smooth") => {
    const pageCount = getPageCount();
    currentPage = (page + pageCount) % pageCount;
    const cardIndex = currentPage * getVisibleCardCount();
    const firstCardOffset = impactCards[0].offsetLeft;
    impactTrack.scrollTo({
      left: impactCards[cardIndex].offsetLeft - firstCardOffset,
      behavior,
    });
    updateDots();
  };

  const stopAutoplay = () => {
    window.clearInterval(autoplayTimer);
  };

  const startAutoplay = () => {
    stopAutoplay();
    if (!reducedMotion.matches && !document.hidden) {
      autoplayTimer = window.setInterval(() => goToPage(currentPage + 1), autoplayDelay);
    }
  };

  const renderDots = () => {
    impactDots.replaceChildren();
    for (let page = 0; page < getPageCount(); page += 1) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `Show impact page ${page + 1}`);
      dot.addEventListener("click", () => {
        goToPage(page);
        startAutoplay();
      });
      impactDots.appendChild(dot);
    }
    updateDots();
  };

  impactControls.forEach((control) => {
    control.addEventListener("click", () => {
      goToPage(currentPage + Number(control.dataset.impactDirection));
      startAutoplay();
    });
  });

  impactTrack.addEventListener(
    "scroll",
    () => {
      window.cancelAnimationFrame(scrollFrame);
      scrollFrame = window.requestAnimationFrame(() => {
        const pagePositions = Array.from({ length: getPageCount() }, (_, page) => {
          const card = impactCards[page * getVisibleCardCount()];
          return card.offsetLeft - impactCards[0].offsetLeft;
        });
        currentPage = pagePositions.reduce(
          (closest, position, index) =>
            Math.abs(position - impactTrack.scrollLeft) <
            Math.abs(pagePositions[closest] - impactTrack.scrollLeft)
              ? index
              : closest,
          0,
        );
        updateDots();
      });
    },
    { passive: true },
  );

  impactTrack.addEventListener("mouseenter", stopAutoplay);
  impactTrack.addEventListener("mouseleave", startAutoplay);
  impactTrack.addEventListener("focusin", stopAutoplay);
  impactTrack.addEventListener("focusout", startAutoplay);

  window.addEventListener("resize", () => {
    currentPage = 0;
    renderDots();
    goToPage(0, "auto");
  });

  document.addEventListener("visibilitychange", startAutoplay);
  reducedMotion.addEventListener("change", startAutoplay);

  renderDots();
  startAutoplay();
}

window.addEventListener("load", () => {
  const targetId = window.location.hash.slice(1);
  document.getElementById(targetId)?.scrollIntoView();
});
