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
    // Evenly spaced ticks so labels never crowd together near the baseline.
    return [0, max / 4, max / 2, (max * 3) / 4, max];
  }

  /* ---------------- Bar chart ---------------- */
  function renderBarChart(container, { labels, values, yMax, barColor }) {
    container.innerHTML = "";
    const ticks = niceTicks(yMax);
    const width = 980;
    const height = 320;
    const padLeft = 56;
    const padBottom = 34;
    const padTop = 12;
    const plotW = width - padLeft - 16;
    const plotH = height - padTop - padBottom;

    const svg = el("svg", {
      viewBox: `0 0 ${width} ${height}`,
      preserveAspectRatio: "none",
      class: "asn-chart-svg",
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
    const barW = Math.min(64, bandW * 0.42);

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
    const width = 980;
    const height = 320;
    const padLeft = 56;
    const padBottom = 34;
    const padTop = 12;
    const plotW = width - padLeft - 20;
    const plotH = height - padTop - padBottom;

    const svg = el("svg", {
      viewBox: `0 0 ${width} ${height}`,
      preserveAspectRatio: "none",
      class: "asn-chart-svg",
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
      el("path", { d: path, fill: d.color, stroke: "rgba(0,0,0,0.08)", "stroke-width": "1" }, svg);

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
    barColor: "#637CEF",
  };

  const learnerActivity = {
    labels: ["May 20", "May 27", "June 03", "June 10", "June 17", "June 24", "Jun 30"],
    yMax: 20000,
    series: [
      { name: "Active learners", color: "#637CEF", values: [7000, 8000, 4500, 6000, 7000, 7500, 11000] },
      { name: "Engaged learners", color: "#E3008C", values: [5000, 5500, 1000, 6000, 3000, 2000, 2000] },
    ],
  };

  const playlistActivity = {
    labels: ["May 20", "May 25", "May 30", "June 5", "June 10", "Jun 15", "Jun 25", "Jun 30"],
    yMax: 20000,
    series: [
      { name: "Playlist created", color: "#E3008C", values: [8000, 9200, 12500, 700, 9800, 7000, 3000, 1300] },
      { name: "Active playlist", color: "#637CEF", values: [7000, 8300, 8600, 4300, 6300, 6700, 8500, 10800] },
      { name: "Inactive playlist", color: "#eaa300", values: [11300, 12000, 12700, 9000, 9800, 11300, 13300, 15500] },
    ],
  };

  const skillsPie = [
    { label: "36%", value: 36, color: "#637CEF" },
    { label: "20%", value: 20, color: "#E3008C" },
    { label: "14%", value: 14, color: "#2AA0A4" },
    { label: "9%", value: 9, color: "#9373C0" },
    { label: "6%", value: 6, color: "#699920" },
    { label: "16%", value: 16, color: "#F5F5F5" },
    { label: "20%", value: 20, color: "#E4E40C" },
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
    search:
      '<svg viewBox="0 0 24 24" fill="none"><path d="M16.1017 17.1624C14.717 18.3101 12.9391 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11C19 12.9391 18.3101 14.717 17.1624 16.1018L21.7803 20.7197C22.0732 21.0126 22.0732 21.4874 21.7803 21.7803C21.4874 22.0732 21.0125 22.0732 20.7196 21.7803L16.1017 17.1624ZM17.5 11C17.5 7.41015 14.5899 4.5 11 4.5C7.41015 4.5 4.5 7.41015 4.5 11C4.5 14.5899 7.41015 17.5 11 17.5C14.5899 17.5 17.5 14.5899 17.5 11Z" fill="#242424"/></svg>',
    list: '<svg viewBox="0 0 20 20" fill="none"><path d="M5.85355 4.35355C6.04882 4.15829 6.04882 3.84171 5.85355 3.64645C5.65829 3.45118 5.34171 3.45118 5.14645 3.64645L3.5 5.29289L2.85355 4.64645C2.65829 4.45118 2.34171 4.45118 2.14645 4.64645C1.95118 4.84171 1.95118 5.15829 2.14645 5.35355L3.14645 6.35355C3.34171 6.54882 3.65829 6.54882 3.85355 6.35355L5.85355 4.35355ZM8.5 5C8.22386 5 8 5.22386 8 5.5C8 5.77614 8.22386 6 8.5 6H17.5C17.7761 6 18 5.77614 18 5.5C18 5.22386 17.7761 5 17.5 5H8.5ZM8.5 10C8.22386 10 8 10.2239 8 10.5C8 10.7761 8.22386 11 8.5 11H17.5C17.7761 11 18 10.7761 18 10.5C18 10.2239 17.7761 10 17.5 10H8.5ZM8 15.5C8 15.2239 8.22386 15 8.5 15H17.5C17.7761 15 18 15.2239 18 15.5C18 15.7761 17.7761 16 17.5 16H8.5C8.22386 16 8 15.7761 8 15.5ZM5.85355 9.85355C6.04882 9.65829 6.04882 9.34171 5.85355 9.14645C5.65829 8.95118 5.34171 8.95118 5.14645 9.14645L3.5 10.7929L2.85355 10.1464C2.65829 9.95118 2.34171 9.95118 2.14645 10.1464C1.95118 10.3417 1.95118 10.6583 2.14645 10.8536L3.14645 11.8536C3.34171 12.0488 3.65829 12.0488 3.85355 11.8536L5.85355 9.85355ZM5.85355 14.1464C6.04882 14.3417 6.04882 14.6583 5.85355 14.8536L3.85355 16.8536C3.65829 17.0488 3.34171 17.0488 3.14645 16.8536L2.14645 15.8536C1.95118 15.6583 1.95118 15.3417 2.14645 15.1464C2.34171 14.9512 2.65829 14.9512 2.85355 15.1464L3.5 15.7929L5.14645 14.1464C5.34171 13.9512 5.65829 13.9512 5.85355 14.1464Z" fill="#424242"/></svg>',
    credentials: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 10h10M7 14h6"/></svg>',
    reporting: '<svg viewBox="0 0 24 24"><path d="M4 20V10M12 20V4M20 20v-7"/></svg>',
    training: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18z"/></svg>',
    collapse: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M10 4v16M6 9l-2 3 2 3"/></svg>',
    calendar: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>',
    chevronDown: '<svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>',
    info: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.01"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L19 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.4"/></svg>',
    playlists: '<svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h10M4 18h10"/><circle cx="19" cy="18" r="2"/></svg>',
    bar: '<svg viewBox="0 0 20 20" fill="none"><path d="M10 10C9.72386 10 9.5 10.2239 9.5 10.5V13.5C9.5 13.7761 9.72386 14 10 14C10.2761 14 10.5 13.7761 10.5 13.5V10.5C10.5 10.2239 10.2761 10 10 10ZM6 8.5C6 8.22386 6.22386 8 6.5 8C6.77614 8 7 8.22386 7 8.5V13.5C7 13.7761 6.77614 14 6.5 14C6.22386 14 6 13.7761 6 13.5V8.5ZM13.5 6C13.2239 6 13 6.22386 13 6.5V13.5C13 13.7761 13.2239 14 13.5 14C13.7761 14 14 13.7761 14 13.5V6.5C14 6.22386 13.7761 6 13.5 6ZM3 5C3 3.89543 3.89543 3 5 3H15C16.1046 3 17 3.89543 17 5V15C17 16.1046 16.1046 17 15 17H5C3.89543 17 3 16.1046 3 15V5ZM4 5V15C4 15.5523 4.44772 16 5 16H15C15.5523 16 16 15.5523 16 15V5C16 4.44772 15.5523 4 15 4H5C4.44772 4 4 4.44772 4 5Z" fill="#424242"/></svg>',
    completed: '<svg viewBox="0 0 20 20" fill="none"><path d="M6.5 6C6.22386 6 6 6.22386 6 6.5C6 6.77614 6.22386 7 6.5 7H13.5C13.7761 7 14 6.77614 14 6.5C14 6.22386 13.7761 6 13.5 6H6.5ZM6 9.5C6 9.22386 6.22386 9 6.5 9H10.5C10.7761 9 11 9.22386 11 9.5C11 9.77614 10.7761 10 10.5 10H6.5C6.22386 10 6 9.77614 6 9.5ZM6.5 12C6.22386 12 6 12.2239 6 12.5C6 12.7761 6.22386 13 6.5 13H9.20703C9.30564 12.6514 9.43777 12.3168 9.59971 12H6.5ZM5.5 16H9.20703C9.30564 16.3486 9.43777 16.6832 9.59971 17H5.5C4.11929 17 3 15.8807 3 14.5V5.5C3 4.11929 4.11929 3 5.5 3H14.5C15.8807 3 17 4.11929 17 5.5V9.59971C16.6832 9.43777 16.3486 9.30564 16 9.20703V5.5C16 4.67157 15.3284 4 14.5 4H5.5C4.67157 4 4 4.67157 4 5.5V14.5C4 15.3284 4.67157 16 5.5 16ZM19 14.5C19 16.9853 16.9853 19 14.5 19C12.0147 19 10 16.9853 10 14.5C10 12.0147 12.0147 10 14.5 10C16.9853 10 19 12.0147 19 14.5ZM16.1464 12.6464L13.5 15.2929L12.8536 14.6464C12.6583 14.4512 12.3417 14.4512 12.1464 14.6464C11.9512 14.8417 11.9512 15.1583 12.1464 15.3536L13.1464 16.3536C13.3417 16.5488 13.6583 16.5488 13.8536 16.3536L16.8536 13.3536C17.0488 13.1583 17.0488 12.8417 16.8536 12.6464C16.6583 12.4512 16.3417 12.4512 16.1464 12.6464Z" fill="#424242"/></svg>',
    activeBadge:
      '<svg viewBox="0 0 16 16" fill="none"><path d="M3.75 2C2.7835 2 2 2.7835 2 3.75V12.25C2 13.2165 2.7835 14 3.75 14H12.25C13.2165 14 14 13.2165 14 12.25V3.75C14 2.7835 13.2165 2 12.25 2H3.75ZM3 3.75C3 3.33579 3.33579 3 3.75 3H12.25C12.6642 3 13 3.33579 13 3.75V12.25C13 12.6642 12.6642 13 12.25 13H3.75C3.33579 13 3 12.6642 3 12.25V3.75ZM6 6.5C6 6.22386 5.77614 6 5.5 6C5.22386 6 5 6.22386 5 6.5V10.5C5 10.7761 5.22386 11 5.5 11C5.77614 11 6 10.7761 6 10.5V6.5ZM8 8C8.27614 8 8.5 8.22386 8.5 8.5V10.5C8.5 10.7761 8.27614 11 8 11C7.72386 11 7.5 10.7761 7.5 10.5V8.5C7.5 8.22386 7.72386 8 8 8ZM11 5.5C11 5.22386 10.7761 5 10.5 5C10.2239 5 10 5.22386 10 5.5V10.5C10 10.7761 10.2239 11 10.5 11C10.7761 11 11 10.7761 11 10.5V5.5Z" fill="black"/></svg>',
    completedBadge:
      '<svg viewBox="0 0 16 16" fill="none"><path d="M5.5 5C5.22386 5 5 5.22386 5 5.5C5 5.77614 5.22386 6 5.5 6H10.5C10.7761 6 11 5.77614 11 5.5C11 5.22386 10.7761 5 10.5 5H5.5ZM5.5 7.5C5.22386 7.5 5 7.72386 5 8C5 8.27614 5.22386 8.5 5.5 8.5H6.88947C7.12796 8.13421 7.40882 7.79856 7.72506 7.5H5.5ZM5.5 10H6.20703C6.11588 10.3223 6.05337 10.6566 6.02242 11H5.5C5.22386 11 5 10.7761 5 10.5C5 10.2239 5.22386 10 5.5 10ZM4.5 13H6.20703C6.30564 13.3486 6.43777 13.6832 6.59971 14H4.5C3.11929 14 2 12.8807 2 11.5V4.5C2 3.11929 3.11929 2 4.5 2H11.5C12.8807 2 14 3.11929 14 4.5V6.59971C13.6832 6.43777 13.3486 6.30564 13 6.20703V4.5C13 3.67157 12.3284 3 11.5 3H4.5C3.67157 3 3 3.67157 3 4.5V11.5C3 12.3284 3.67157 13 4.5 13ZM16 11.5C16 13.9853 13.9853 16 11.5 16C9.01472 16 7 13.9853 7 11.5C7 9.01472 9.01472 7 11.5 7C13.9853 7 16 9.01472 16 11.5ZM13.1464 9.64645L10.5 12.2929L9.85355 11.6464C9.65829 11.4512 9.34171 11.4512 9.14645 11.6464C8.95118 11.8417 8.95118 12.1583 9.14645 12.3536L10.1464 13.3536C10.3417 13.5488 10.6583 13.5488 10.8536 13.3536L13.8536 10.3536C14.0488 10.1583 14.0488 9.84171 13.8536 9.64645C13.6583 9.45118 13.3417 9.45118 13.1464 9.64645Z" fill="#180A1C"/></svg>',
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
        <button type="button" class="asn-btn-outline-sm">Export as CSV</button>
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

    /* ---------- Chart info tooltips ---------- */
    const infoButtons = Array.from(document.querySelectorAll(".asn-info-btn"));
    infoButtons.forEach((btn) => {
      const tooltip = document.createElement("div");
      tooltip.className = "asn-info-tooltip";
      if (btn.dataset.tooltipHtml) {
        tooltip.innerHTML = btn.dataset.tooltipHtml;
      } else {
        tooltip.textContent = btn.dataset.tooltip || "";
      }
      tooltip.hidden = true;
      btn.appendChild(tooltip);
      btn.setAttribute("aria-expanded", "false");
      btn.addEventListener("click", (event) => {
        event.stopPropagation();
        const isOpen = !tooltip.hidden;
        infoButtons.forEach((other) => {
          const otherTooltip = other.querySelector(".asn-info-tooltip");
          if (otherTooltip) otherTooltip.hidden = true;
          other.setAttribute("aria-expanded", "false");
          other.classList.remove("is-active");
        });
        tooltip.hidden = isOpen;
        btn.setAttribute("aria-expanded", String(!isOpen));
        btn.classList.toggle("is-active", !isOpen);
      });
    });
    document.addEventListener("click", () => {
      infoButtons.forEach((other) => {
        const otherTooltip = other.querySelector(".asn-info-tooltip");
        if (otherTooltip) otherTooltip.hidden = true;
        other.setAttribute("aria-expanded", "false");
        other.classList.remove("is-active");
      });
    });

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
          requestUnlockWithLoading();
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

    function openUnlockFlow() {
      // Reveal the org-reporting shell underneath, defaulted to the Learners
      // tab, then present the "access granted" modal on top of it.
      orgUnlocked = true;
      showScreen("org");
      if (modalOverlay) modalOverlay.hidden = false;
      activateTab("learners");
    }

    const loadingOverlay = document.getElementById("asnLoadingOverlay");
    function requestUnlockWithLoading() {
      // Show a brief loading widget before revealing org reporting access.
      if (loadingOverlay) loadingOverlay.hidden = false;
      setTimeout(() => {
        if (loadingOverlay) loadingOverlay.hidden = true;
        openUnlockFlow();
      }, 3000);
    }

    const goToPlaylistsBtn = document.getElementById("goToPlaylists");
    if (goToPlaylistsBtn) {
      goToPlaylistsBtn.addEventListener("click", () => {
        hasVisitedAssigned = true;
        showScreen("assigned");
        // Auto-unlock org reporting a couple seconds after landing here.
        setTimeout(requestUnlockWithLoading, 2000);
      });
    }


    function closeModal() {
      if (modalOverlay) modalOverlay.hidden = true;
      startLearnersSpinner();
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

    const learnersSpinner = document.getElementById("learnersSpinner");
    const learnersContent = document.getElementById("learnersContent");
    let learnersLoaded = false;

    function activateTab(name) {
      tabButtons.forEach((btn) => btn.classList.toggle("is-active", btn.dataset.tab === name));
      tabPanels.forEach((panel) => panel.classList.toggle("is-active", panel.dataset.panel === name));

      // Only kick off the Learners spinner once the tab is actually visible
      // (i.e. not while the access-granted modal still covers it).
      if (name === "learners" && !learnersLoaded && (!modalOverlay || modalOverlay.hidden)) {
        startLearnersSpinner();
      }
    }

    function startLearnersSpinner() {
      if (learnersLoaded) return;
      learnersLoaded = true;
      if (learnersContent) learnersContent.hidden = true;
      if (learnersSpinner) learnersSpinner.hidden = false;
      setTimeout(() => {
        if (learnersSpinner) learnersSpinner.hidden = true;
        if (learnersContent) learnersContent.hidden = false;
      }, 3000);
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
