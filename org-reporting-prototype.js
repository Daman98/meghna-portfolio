// AI Skills Navigator — Reporting prototype interactions + hand-rolled SVG charts.
// No external chart library: everything below builds plain SVG nodes from
// hardcoded data points that mirror the reference screenshots.

(function () {
  "use strict";

  const svgNS = "http://www.w3.org/2000/svg";

  function el(tag, attrs, parent) {
    const node = document.createElementNS(svgNS, tag);
    for (const key in attrs) {
      node.setAttribute(key, attrs[key]);
    }
    if (parent) parent.appendChild(node);
    return node;
  }

  function niceTicks(max) {
    // Fixed tick sets matching the reference screenshots' y-axes.
    if (max <= 20000) return [0, 1000, 5000, 10000, 15000, 20000];
    return [0, max / 4, max / 2, (max * 3) / 4, max];
  }

  /* ---------------- Bar chart ---------------- */
  function renderBarChart(container, { labels, values, yMax, barColor }) {
    container.innerHTML = "";
    const ticks = niceTicks(yMax);
    const width = Math.max(720, labels.length * 108 + 80);
    const height = 320;
    const padLeft = 56;
    const padBottom = 34;
    const padTop = 12;
    const plotW = width - padLeft - 16;
    const plotH = height - padTop - padBottom;

    const svg = el("svg", {
      viewBox: `0 0 ${width} ${height}`,
      width: String(width),
      height: String(height),
      role: "img",
    });

    const scaleY = (v) => padTop + plotH - (v / yMax) * plotH;

    ticks.forEach((t) => {
      const y = scaleY(t);
      el("line", { x1: padLeft, x2: width - 8, y1: y, y2: y, stroke: "#efece4", "stroke-width": 1 }, svg);
      const label = el("text", { x: padLeft - 10, y: y + 4, "text-anchor": "end", "font-size": "11", fill: "#8a8781" }, svg);
      label.textContent = t.toLocaleString();
    });

    const bandW = plotW / labels.length;
    const barW = Math.min(46, bandW * 0.42);

    values.forEach((v, i) => {
      const cx = padLeft + bandW * i + bandW / 2;
      const barH = (v / yMax) * plotH;
      el(
        "rect",
        {
          x: cx - barW / 2,
          y: scaleY(v),
          width: barW,
          height: barH,
          rx: 4,
          fill: barColor,
        },
        svg
      );
      const label = el("text", { x: cx, y: height - padBottom + 20, "text-anchor": "middle", "font-size": "11", fill: "#4b4944" }, svg);
      label.textContent = labels[i];
    });

    container.appendChild(svg);
  }

  /* ---------------- Line chart (multi-series) ---------------- */
  function renderLineChart(container, { labels, series, yMax }) {
    container.innerHTML = "";
    const ticks = niceTicks(yMax);
    const width = Math.max(680, labels.length * 96 + 60);
    const height = 320;
    const padLeft = 56;
    const padBottom = 34;
    const padTop = 12;
    const plotW = width - padLeft - 20;
    const plotH = height - padTop - padBottom;

    const svg = el("svg", {
      viewBox: `0 0 ${width} ${height}`,
      width: String(width),
      height: String(height),
      role: "img",
    });

    const scaleY = (v) => padTop + plotH - (v / yMax) * plotH;
    const scaleX = (i) => padLeft + (plotW * i) / (labels.length - 1);

    ticks.forEach((t) => {
      const y = scaleY(t);
      el("line", { x1: padLeft, x2: width - 8, y1: y, y2: y, stroke: "#efece4", "stroke-width": 1 }, svg);
      const label = el("text", { x: padLeft - 10, y: y + 4, "text-anchor": "end", "font-size": "11", fill: "#8a8781" }, svg);
      label.textContent = t.toLocaleString();
    });

    labels.forEach((lab, i) => {
      const label = el("text", { x: scaleX(i), y: height - padBottom + 20, "text-anchor": "middle", "font-size": "11", fill: "#4b4944" }, svg);
      label.textContent = lab;
    });

    series.forEach((s) => {
      const points = s.values.map((v, i) => `${scaleX(i)},${scaleY(v)}`).join(" ");
      el("polyline", { points, fill: "none", stroke: s.color, "stroke-width": 2.5, "stroke-linejoin": "round", "stroke-linecap": "round" }, svg);
      s.values.forEach((v, i) => {
        el("circle", { cx: scaleX(i), cy: scaleY(v), r: 3, fill: s.color }, svg);
      });
    });

    container.appendChild(svg);
  }

  /* ---------------- Pie chart ---------------- */
  function renderPieChart(container, data) {
    container.innerHTML = "";
    const diameter = 240;
    const labelPad = 60;
    const size = diameter + labelPad * 2;
    const cx = size / 2;
    const cy = size / 2;
    const r = diameter / 2;
    const total = data.reduce((sum, d) => sum + d.value, 0);

    const svg = el("svg", {
      viewBox: `0 0 ${size} ${size}`,
      width: String(size),
      height: String(size),
      role: "img",
    });

    let angle = -Math.PI / 2;
    data.forEach((d) => {
      const slice = (d.value / total) * Math.PI * 2;
      const end = angle + slice;
      const x1 = cx + r * Math.cos(angle);
      const y1 = cy + r * Math.sin(angle);
      const x2 = cx + r * Math.cos(end);
      const y2 = cy + r * Math.sin(end);
      const largeArc = slice > Math.PI ? 1 : 0;
      const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
      el("path", { d: path, fill: d.color }, svg);

      const midAngle = angle + slice / 2;
      const labelR = r + labelPad * 0.6;
      const lx = cx + labelR * Math.cos(midAngle);
      const ly = cy + labelR * Math.sin(midAngle);
      const anchor = Math.cos(midAngle) > 0.15 ? "start" : Math.cos(midAngle) < -0.15 ? "end" : "middle";
      const label = el("text", { x: lx, y: ly, "text-anchor": anchor, "font-size": "12", fill: "#4b4944" }, svg);
      label.textContent = d.label;
      angle = end;
    });

    container.appendChild(svg);
  }

  /* ---------------- Data ---------------- */
  const onboardingGrowth = {
    labels: ["May 20", "May 27", "June 03", "June 10", "June 17", "June 24", "Jul 01"],
    values: [12300, 10200, 6800, 8300, 6800, 11400, 19500],
    yMax: 20000,
    barColor: "#5b6ef5",
  };

  const learnerActivity = {
    labels: ["May 20", "May 27", "June 03", "June 10", "June 17", "June 24", "Jun 30"],
    yMax: 20000,
    series: [
      { name: "Active learners", color: "#5b6ef5", values: [7000, 8000, 4500, 6000, 7000, 7500, 11000] },
      { name: "Engaged learners", color: "#d6249a", values: [5000, 5500, 1000, 6000, 3000, 2000, 2000] },
    ],
  };

  const playlistActivity = {
    labels: ["May 20", "May 25", "May 30", "June 5", "June 10", "Jun 15", "Jun 25", "Jun 30"],
    yMax: 20000,
    series: [
      { name: "Playlist created", color: "#d6249a", values: [8000, 9200, 12500, 700, 9800, 7000, 3000, 1300] },
      { name: "Active playlist", color: "#5b6ef5", values: [7000, 8300, 8600, 4300, 6300, 6700, 8500, 10800] },
      { name: "Inactive playlist", color: "#e08a1e", values: [11300, 12000, 12700, 9000, 9800, 11300, 13300, 15500] },
    ],
  };

  const skillsPie = [
    { label: "36%", value: 36, color: "#5b6ef5" },
    { label: "20%", value: 20, color: "#d6249a" },
    { label: "14%", value: 14, color: "#1f9e9e" },
    { label: "9%", value: 9, color: "#8a5fd6" },
    { label: "6%", value: 6, color: "#6d7a1e" },
    { label: "16%", value: 16, color: "#d8d3c6" },
    { label: "20%", value: 20, color: "#e0c928" },
  ];

  const assignedPlaylists = [
    { title: "From brief to impact", status: "active", joined: 18, completed: 9, progress: "35%" },
    { title: "Strategic priorities and planning", status: "completed", joined: 4, completed: 4, progress: "100%" },
    { title: "Copilot platform training", status: "active", joined: 3, completed: 1, progress: "66%" },
    { title: "Implement AI tools", status: "active", joined: 3, completed: 1, progress: "66%" },
    { title: "AI for educators", status: "active", joined: 3, completed: 1, progress: "66%" },
    { title: "Learning figma fundamentals", status: "active", joined: 3, completed: 1, progress: "66%" },
    { title: "AI prompt training", status: "active", joined: 3, completed: 1, progress: "66%" },
  ];

  const topPerformingPlaylists = [
    "AI learning",
    "Strategic priorities and planning",
    "Copilot platform training",
    "Implement AI tools",
    "AI for educators",
    "Implement AI tools",
    "AI learning",
  ];

  const topLearningContent = [...topPerformingPlaylists];

  /* ---------------- Icons ---------------- */
  const icon = {
    forYou: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 2"/></svg>',
    search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>',
    list: '<svg viewBox="0 0 24 24"><path d="M8 6h13M8 12h13M8 18h13"/><circle cx="3.5" cy="6" r="1.2"/><circle cx="3.5" cy="12" r="1.2"/><circle cx="3.5" cy="18" r="1.2"/></svg>',
    credentials: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 10h10M7 14h6"/></svg>',
    reporting: '<svg viewBox="0 0 24 24"><path d="M4 20V10M12 20V4M20 20v-7"/></svg>',
    training: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18z"/></svg>',
    collapse: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M10 4v16M6 9l-2 3 2 3"/></svg>',
    calendar: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>',
    chevronDown: '<svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>',
    info: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.01"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L19 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.4"/></svg>',
    playlists: '<svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h10M4 18h10"/><circle cx="19" cy="18" r="2"/></svg>',
    bar: '<svg viewBox="0 0 24 24"><path d="M5 20V10M12 20V4M19 20v-7"/></svg>',
    completed: '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="m8.5 12 2.3 2.3L16 9.5"/></svg>',
    activeBadge: '<svg viewBox="0 0 24 24"><path d="M5 20V10M12 20V4M19 20v-7"/></svg>',
    completedBadge: '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="m8.5 12 2.3 2.3L16 9.5"/></svg>',
    people: '<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5"/><circle cx="18" cy="9" r="2.4"/><path d="M15.5 14.5c2.5.2 4.5 2 4.5 5.5"/></svg>',
    assigned: '<svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h10M4 18h10"/><path d="M17 15l2 2 3-3"/></svg>',
  };

  function badgeMarkup(status) {
    if (status === "completed") {
      return `<span class="asn-badge is-completed">${icon.completedBadge}Completed</span>`;
    }
    return `<span class="asn-badge is-active">${icon.activeBadge}Active playlist</span>`;
  }

  function playlistRowsMarkup(rows) {
    return rows
      .map(
        (p) => `
      <article class="asn-playlist-row" data-title="${p.title.toLowerCase()}">
        <div class="asn-playlist-title-wrap">
          <span class="asn-playlist-title">${p.title}</span>
          ${badgeMarkup(p.status)}
        </div>
        <div class="asn-playlist-stats">
          <div class="asn-stat">
            <span class="asn-stat-value">${p.joined}</span>
            <span class="asn-stat-caption">Learners joined</span>
          </div>
          <div class="asn-stat">
            <span class="asn-stat-value">${p.completed}</span>
            <span class="asn-stat-caption">Completed playlists (by learner)</span>
          </div>
          <div class="asn-stat">
            <span class="asn-stat-value">${p.progress}</span>
            <span class="asn-stat-caption">Average playlist progress (per learner)</span>
          </div>
        </div>
        <button type="button" class="asn-btn-outline">Export as CSV</button>
      </article>`
      )
      .join("");
  }

  function tableRowsMarkup(titles, kind) {
    return titles
      .map((title) => {
        if (kind === "top-performing") {
          return `<tr><td>${title}</td><td>Evelyn Hayes</td><td>500</td><td>100%</td><td>6</td></tr>`;
        }
        return `<tr><td>${title}</td><td>Module</td><td>500</td></tr>`;
      })
      .join("");
  }

  /* ---------------- Wiring ---------------- */
  document.addEventListener("DOMContentLoaded", () => {
    const assignedListEl = document.getElementById("assignedPlaylistList");
    const nestedAssignedListEl = document.getElementById("nestedAssignedPlaylistList");
    if (assignedListEl) assignedListEl.innerHTML = playlistRowsMarkup(assignedPlaylists);
    if (nestedAssignedListEl) nestedAssignedListEl.innerHTML = playlistRowsMarkup(assignedPlaylists);

    const topPerformingBody = document.getElementById("topPerformingBody");
    if (topPerformingBody) topPerformingBody.innerHTML = tableRowsMarkup(topPerformingPlaylists, "top-performing");

    const topLearningBody = document.getElementById("topLearningBody");
    if (topLearningBody) topLearningBody.innerHTML = tableRowsMarkup(topLearningContent, "top-learning");

    // Charts
    const onboardingEl = document.getElementById("chartOnboardingGrowth");
    if (onboardingEl) renderBarChart(onboardingEl, onboardingGrowth);

    const learnerActivityEl = document.getElementById("chartLearnerActivity");
    if (learnerActivityEl) renderLineChart(learnerActivityEl, learnerActivity);

    const playlistActivityEl = document.getElementById("chartPlaylistActivity");
    if (playlistActivityEl) renderLineChart(playlistActivityEl, playlistActivity);

    const skillsPieEl = document.getElementById("chartSkillsPie");
    if (skillsPieEl) renderPieChart(skillsPieEl, skillsPie);

    /* ---------- Screen / flow state ---------- */
    const screenLocked = document.getElementById("screen-locked");
    const screenAssigned = document.getElementById("screen-assigned");
    const screenOrg = document.getElementById("screen-org");
    const modalOverlay = document.getElementById("unlockModal");

    let orgUnlocked = false;
    let hasVisitedAssigned = false;

    function showScreen(name) {
      [screenLocked, screenAssigned, screenOrg].forEach((s) => {
        if (s) s.hidden = true;
      });
      if (name === "locked" && screenLocked) screenLocked.hidden = false;
      if (name === "assigned" && screenAssigned) screenAssigned.hidden = false;
      if (name === "org" && screenOrg) screenOrg.hidden = false;
    }

    function setSidebarReportingBehavior() {
      const reportingNav = document.querySelector('[data-nav="reporting"]');
      if (!reportingNav) return;
      reportingNav.addEventListener("click", (event) => {
        event.preventDefault();
        if (orgUnlocked) {
          showScreen("org");
        } else if (hasVisitedAssigned) {
          showScreen("assigned");
        } else {
          showScreen("locked");
        }
      });
    }
    setSidebarReportingBehavior();

    // Non-functional decorative sidebar items (everything except Reporting).
    document.querySelectorAll(".asn-nav-item:not([data-nav='reporting'])").forEach((item) => {
      item.addEventListener("click", (event) => event.preventDefault());
    });

    const goToPlaylistsBtn = document.getElementById("goToPlaylists");
    if (goToPlaylistsBtn) {
      goToPlaylistsBtn.addEventListener("click", () => {
        hasVisitedAssigned = true;
        showScreen("assigned");
      });
    }

    function openUnlockFlow() {
      // Reveal the org-reporting shell underneath, defaulted to the Learners
      // tab, then present the "access granted" modal on top of it.
      orgUnlocked = true;
      showScreen("org");
      activateTab("learners");
      if (modalOverlay) modalOverlay.hidden = false;
    }

    const unlockLink = document.getElementById("unlockOrgReportingLink");
    if (unlockLink) unlockLink.addEventListener("click", openUnlockFlow);

    function closeModal() {
      if (modalOverlay) modalOverlay.hidden = true;
    }

    const modalCloseBtn = document.getElementById("modalCloseBtn");
    const modalViewBtn = document.getElementById("modalViewOrgReportingBtn");
    if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeModal);
    if (modalViewBtn) modalViewBtn.addEventListener("click", closeModal);
    if (modalOverlay) {
      modalOverlay.addEventListener("click", (event) => {
        if (event.target === modalOverlay) closeModal();
      });
    }

    /* ---------- Tabs ---------- */
    const tabButtons = Array.from(document.querySelectorAll(".asn-tab"));
    const tabPanels = Array.from(document.querySelectorAll(".asn-tab-panel"));

    function activateTab(name) {
      tabButtons.forEach((btn) => btn.classList.toggle("is-active", btn.dataset.tab === name));
      tabPanels.forEach((panel) => panel.classList.toggle("is-active", panel.dataset.panel === name));
    }

    tabButtons.forEach((btn) => {
      btn.addEventListener("click", () => activateTab(btn.dataset.tab));
    });

    /* ---------- Playlists toggle ---------- */
    const toggleButtons = Array.from(document.querySelectorAll(".asn-toggle"));
    const togglePanels = Array.from(document.querySelectorAll(".asn-toggle-panel"));

    function activateToggle(name) {
      toggleButtons.forEach((btn) => btn.classList.toggle("is-active", btn.dataset.toggle === name));
      togglePanels.forEach((panel) => panel.classList.toggle("is-active", panel.dataset.togglePanel === name));
    }

    toggleButtons.forEach((btn) => {
      btn.addEventListener("click", () => activateToggle(btn.dataset.toggle));
    });

    /* ---------- Search filter (both assigned-playlist lists) ---------- */
    document.querySelectorAll(".asn-search-input").forEach((input) => {
      input.addEventListener("input", () => {
        const query = input.value.trim().toLowerCase();
        const list = input.closest(".asn-screen, .asn-toggle-panel")?.querySelector(".asn-playlist-list");
        if (!list) return;
        list.querySelectorAll(".asn-playlist-row").forEach((row) => {
          const match = row.dataset.title.includes(query);
          row.classList.toggle("is-hidden", !match);
        });
      });
    });

    // Start on the locked/empty state.
    showScreen("locked");
  });
})();
