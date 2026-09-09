document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("header");

  const initializeNavigation = () => {
    const menuToggle = header?.querySelector(".hamburger");
    const navLinks = header?.querySelector(".nav-links");

    if (!menuToggle || !navLinks || menuToggle.dataset.initialized) {
      return false;
    }

    menuToggle.dataset.initialized = "true";
    menuToggle.setAttribute("role", "button");
    menuToggle.setAttribute("tabindex", "0");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-controls", "case-study-navigation");
    menuToggle.setAttribute("aria-label", "Open navigation");
    navLinks.id = "case-study-navigation";

    const toggleNavigation = () => {
      const isOpen = navLinks.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    };

    menuToggle.addEventListener("click", toggleNavigation);
    menuToggle.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleNavigation();
      }
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
      });
    });

    return true;
  };

  if (!initializeNavigation() && header) {
    const observer = new MutationObserver(() => {
      if (initializeNavigation()) {
        observer.disconnect();
      }
    });
    observer.observe(header, { childList: true });
  }
});
