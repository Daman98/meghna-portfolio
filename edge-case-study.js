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
