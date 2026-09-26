/* The Butcher's Block — shared site behaviour */
(function () {
  document.documentElement.classList.remove("no-js");

  // Business details used across the site. Edit here.
  var SITE = {
    whatsapp: "9609899981",
    // Opening hours in minutes from midnight, Maldives time (UTC+5). 0 = Sunday.
    hours: { 0: [720, 1380], 1: [720, 1380], 2: [720, 1380], 3: [720, 1380], 4: [720, 1380], 5: [720, 1380], 6: [720, 1380] }
  };
  var DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  function fmt(m) { var h = Math.floor(m / 60), mm = m % 60, ap = h >= 12 ? "pm" : "am", h12 = h % 12 || 12; return h12 + (mm ? ":" + String(mm).padStart(2, "0") : "") + ap; }
  function hhmm(m) { return String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0"); }
  function pad(n) { return String(n).padStart(2, "0"); }
  // Current time in the Maldives, whatever the visitor's time zone.
  var now = new Date(Date.now() + (new Date().getTimezoneOffset() + 300) * 60000);

  // Overlay navigation
  var body = document.body;
  document.querySelectorAll("[data-nav-open]").forEach(function (b) {
    b.addEventListener("click", function () { body.classList.add("nav-open"); b.setAttribute("aria-expanded", "true"); document.querySelector(".overlay-nav .close").focus(); });
  });
  document.querySelectorAll("[data-nav-close]").forEach(function (b) {
    b.addEventListener("click", function () { body.classList.remove("nav-open"); document.querySelectorAll("[data-nav-open]").forEach(function (o) { o.setAttribute("aria-expanded", "false"); }); });
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && body.classList.contains("nav-open")) document.querySelector("[data-nav-close]").click(); });


  // Single-page build: show one [data-page] section at a time, driven by the #hash.
  var pages = document.querySelectorAll("[data-page]");
  if (pages.length) {
    function route() {
      var h = (location.hash || "#home").slice(1), target = null, page = document.querySelector('[data-page="' + h + '"]');
      if (!page) { target = document.getElementById(h); page = target ? target.closest("[data-page]") : null; }
      if (!page) page = pages[0];
      var name = page.getAttribute("data-page");
      pages.forEach(function (p) { p.hidden = p !== page; });
      document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        if (a.closest("[data-page]")) return;
        if (a.getAttribute("href") === "#" + name) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
      });
      body.classList.remove("nav-open");
      var t = page.getAttribute("data-title"); if (t) document.title = t;
      if (target) target.scrollIntoView(); else window.scrollTo(0, 0);
    }
    window.addEventListener("hashchange", route);
    route();
  }

  // Hero slideshow with arrows and pause (as on the reference site)
  document.querySelectorAll(".hero").forEach(function (hero) {
    var slides = hero.querySelectorAll(".slide"), i = 0, timer = null, playing = true;
    if (!slides.length) return;
    slides[0].classList.add("on");
    function go(n) { slides[i].classList.remove("on"); i = (n + slides.length) % slides.length; slides[i].classList.add("on"); }
    function start() { stop(); if (slides.length > 1) timer = setInterval(function () { go(i + 1); }, 5500); }
    function stop() { if (timer) clearInterval(timer); timer = null; }
    var prev = hero.querySelector(".prev"), next = hero.querySelector(".next"), pause = hero.querySelector(".pause");
    if (slides.length < 2) { [prev, next, pause].forEach(function (b) { if (b) b.hidden = true; }); return; }
    prev && prev.addEventListener("click", function () { go(i - 1); if (playing) start(); });
    next && next.addEventListener("click", function () { go(i + 1); if (playing) start(); });
    pause && pause.addEventListener("click", function () {
      playing = !playing; playing ? start() : stop();
      pause.setAttribute("aria-label", playing ? "Pause slideshow" : "Play slideshow");
      pause.innerHTML = playing ? '<svg width="12" height="16" viewBox="0 0 12 16" fill="currentColor"><rect width="3" height="16"/><rect x="9" width="3" height="16"/></svg>' : '<svg width="14" height="16" viewBox="0 0 14 16" fill="currentColor"><path d="M0 0l14 8-14 8z"/></svg>';
    });
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { playing = false; } else start();
  });

  // Menu tabs
  var tabs = document.querySelectorAll(".menu-tabs button");
  tabs.forEach(function (t) {
    t.addEventListener("click", function () {
      tabs.forEach(function (o) { var on = o === t; o.setAttribute("aria-selected", on); document.getElementById(o.getAttribute("aria-controls")).hidden = !on; });
    });
  });

  // Year
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = now.getFullYear(); });

  // Open / closed status
  document.querySelectorAll("[data-open-status]").forEach(function (el) {
    var d = now.getDay(), mins = now.getHours() * 60 + now.getMinutes(), t = SITE.hours[d], txt, open = false;
    if (mins >= t[0] && mins < t[1]) { open = true; txt = "Open now · until " + fmt(t[1]); }
    else if (mins < t[0]) txt = "Closed · opens today at " + fmt(t[0]);
    else txt = "Closed · opens tomorrow at " + fmt(SITE.hours[(d + 1) % 7][0]);
    el.innerHTML = '<span class="dot' + (open ? " open" : "") + '"></span>' + txt;
    el.hidden = false;
  });

  // Hours tables
  document.querySelectorAll("[data-hours]").forEach(function (table) {
    var d = now.getDay(), rows = "";
    [6, 0, 1, 2, 3, 4, 5].forEach(function (k) {
      rows += "<tr" + (k === d ? ' class="today"' : "") + "><td>" + DAYS[k] + "</td><td>" + fmt(SITE.hours[k][0]) + " – " + fmt(SITE.hours[k][1]) + "</td></tr>";
    });
    table.innerHTML = rows;
  });

  // Reveal on scroll
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -6% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else reveals.forEach(function (el) { el.classList.add("in"); });

  // Gallery lightbox
  var lb = document.querySelector(".lightbox");
  if (lb) {
    var items = Array.prototype.slice.call(document.querySelectorAll(".gallery button")), idx = 0, img = lb.querySelector("img");
    function show(n) { idx = (n + items.length) % items.length; img.src = items[idx].getAttribute("data-full"); img.alt = items[idx].getAttribute("aria-label"); }
    items.forEach(function (b, n) { b.addEventListener("click", function () { show(n); lb.classList.add("open"); lb.querySelector(".lb-close").focus(); }); });
    function close() { lb.classList.remove("open"); items[idx].focus(); }
    lb.querySelector(".lb-close").addEventListener("click", close);
    lb.querySelector(".lb-prev").addEventListener("click", function () { show(idx - 1); });
    lb.querySelector(".lb-next").addEventListener("click", function () { show(idx + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
    });
  }

  // Forms: compose a WhatsApp message (reservations, events, contact)
  document.querySelectorAll("form[data-whatsapp]").forEach(function (form) {
    var kind = form.getAttribute("data-whatsapp");
    var dIn = form.querySelector('input[type="date"]'), tSel = form.querySelector("select[name=time]"), gSel = form.querySelector("select[name=guests]");
    var iso = now.getFullYear() + "-" + pad(now.getMonth() + 1) + "-" + pad(now.getDate());
    if (dIn) {
      var tmr = new Date(now.getTime() + 86400000);
      dIn.min = iso;
      dIn.value = tmr.getFullYear() + "-" + pad(tmr.getMonth() + 1) + "-" + pad(tmr.getDate());
    }
    function fillTimes() {
      if (!tSel || !dIn) return;
      var day = new Date(dIn.value + "T12:00:00").getDay(); if (isNaN(day)) day = 6;
      var cur = tSel.value, o = "";
      for (var m = SITE.hours[day][0]; m <= SITE.hours[day][1] - 60; m += 30) o += '<option value="' + hhmm(m) + '">' + fmt(m) + "</option>";
      tSel.innerHTML = o;
      tSel.value = cur && tSel.querySelector('option[value="' + cur + '"]') ? cur : "19:30";
      if (!tSel.value) tSel.selectedIndex = 0;
    }
    if (dIn) { dIn.addEventListener("change", fillTimes); fillTimes(); }
    if (gSel && !gSel.options.length) {
      var g = ""; for (var k = 1; k <= 12; k++) g += "<option" + (k === 2 ? " selected" : "") + ">" + k + "</option>";
      gSel.innerHTML = g + '<option value="13+">13 or more</option>';
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var err = form.querySelector(".err"), data = {};
      Array.prototype.forEach.call(form.elements, function (el) { if (el.name) data[el.name] = el.value.trim(); });
      var missing = Array.prototype.filter.call(form.querySelectorAll("[required]"), function (el) { return !el.value.trim(); });
      if (missing.length) { err.textContent = "Please fill in the required fields."; missing[0].focus(); return; }
      if (dIn && dIn.value < iso) { err.textContent = "Please pick today or a later date."; return; }
      err.textContent = "";
      var nice = dIn ? new Date(dIn.value + "T12:00:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" }) : "";
      var lines;
      if (kind === "reserve") {
        lines = ["Hi The Butcher's Block, I'd like to reserve a table.", "Name: " + data.name, "Date: " + nice, "Time: " + (tSel.options[tSel.selectedIndex] || {}).text, "Guests: " + data.guests];
        if (data.phone) lines.push("Phone: " + data.phone);
        if (data.occasion) lines.push("Occasion: " + data.occasion);
      } else if (kind === "event") {
        lines = ["Hi The Butcher's Block, I'd like to enquire about a private event.", "Name: " + data.name, "Event: " + data.type, "Date: " + nice, "Guests: " + data.guests];
        if (data.phone) lines.push("Phone: " + data.phone);
        if (data.email) lines.push("Email: " + data.email);
      } else {
        lines = ["Hi The Butcher's Block,", "", "Topic: " + data.topic, "", data.message, "", "— " + data.name];
        if (data.phone) lines.push(data.phone);
        if (data.email) lines.push(data.email);
      }
      if (data.note) lines.push("Note: " + data.note);
      var url = "https://wa.me/" + SITE.whatsapp + "?text=" + encodeURIComponent(lines.join("\n"));
      var ok = form.querySelector(".ok");
      ok.innerHTML = "Your message is ready. Tap the button to send it to us on WhatsApp.";
      var send = document.createElement("a");
      send.className = "btn btn-fill"; send.href = url; send.target = "_blank"; send.rel = "noopener"; send.textContent = "Send on WhatsApp";
      var wrap = document.createElement("div"); wrap.className = "btn-row"; wrap.appendChild(send); ok.appendChild(wrap);
      ok.hidden = false;
      send.focus();
    });
  });
})();
