/* The Butcher's Block — shared site behaviour */
(function () {
  document.documentElement.classList.remove("no-js");

  // Business details used across the site. Edit here.
  var SITE = {
    phone: "+960 989-9981",
    whatsapp: "9609899981",
    // Hours in minutes from midnight, Maldives time (UTC+5). 0 = Sunday.
    hours: { 0: [720, 1380], 1: [720, 1380], 2: [720, 1380], 3: [720, 1380], 4: [720, 1380], 5: [840, 1380], 6: [720, 1380] }
  };
  var DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  function fmt(m) { return String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0"); }
  function pad(n) { return String(n).padStart(2, "0"); }
  // Current time in the Maldives regardless of the visitor's time zone.
  var now = new Date(Date.now() + (new Date().getTimezoneOffset() + 300) * 60000);

  // Logo: show the image once assets/images/logo.png loads; otherwise keep the text wordmark.
  document.querySelectorAll(".logo img").forEach(function (img) {
    function ok() { if (img.naturalWidth) img.closest(".logo").classList.add("has-img"); }
    if (img.complete) ok(); else img.addEventListener("load", ok);
  });

  // Mobile nav
  var toggle = document.querySelector(".menu-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open);
    });
    document.querySelectorAll(".mobile-nav a").forEach(function (a) {
      a.addEventListener("click", function () { document.body.classList.remove("nav-open"); toggle.setAttribute("aria-expanded", "false"); });
    });
  }

  // Year
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = now.getFullYear(); });

  // Open / closed status
  document.querySelectorAll("[data-open-status]").forEach(function (el) {
    var d = now.getDay(), mins = now.getHours() * 60 + now.getMinutes(), t = SITE.hours[d], txt, open = false;
    if (mins >= t[0] && mins < t[1]) { open = true; txt = "Open now · until " + fmt(t[1]); }
    else if (mins < t[0]) txt = "Closed · opens today at " + fmt(t[0]);
    else txt = "Closed · opens tomorrow at " + fmt(SITE.hours[(d + 1) % 7][0]);
    el.innerHTML = '<span class="dot' + (open ? " open" : "") + '"></span>' + txt;
  });

  // Hours tables
  document.querySelectorAll("[data-hours]").forEach(function (table) {
    var d = now.getDay(), rows = "";
    [6, 0, 1, 2, 3, 4, 5].forEach(function (i) {
      rows += "<tr" + (i === d ? ' class="today"' : "") + "><td>" + DAYS[i] + (i === d ? " (today)" : "") + "</td><td>" + fmt(SITE.hours[i][0]) + " – " + fmt(SITE.hours[i][1]) + "</td></tr>";
    });
    table.innerHTML = rows;
  });

  // Reveal on scroll
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else reveals.forEach(function (el) { el.classList.add("in"); });

  // Menu page: highlight the tab for the section in view
  var tabs = document.querySelectorAll(".menu-tabs a");
  if (tabs.length && "IntersectionObserver" in window) {
    var mo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        tabs.forEach(function (t) {
          var on = t.getAttribute("href") === "#" + e.target.id;
          t.classList.toggle("active", on);
          if (on) t.scrollIntoView({ block: "nearest", inline: "center" });
        });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    document.querySelectorAll(".menu-section").forEach(function (s) { mo.observe(s); });
  }

  // Gallery lightbox
  var lb = document.querySelector(".lightbox");
  if (lb) {
    var items = Array.prototype.slice.call(document.querySelectorAll(".gallery button")), idx = 0;
    var view = lb.querySelector(".photo");
    function show(i) {
      idx = (i + items.length) % items.length;
      view.style.setProperty("--img", items[idx].querySelector(".photo").style.getPropertyValue("--img"));
      view.setAttribute("aria-label", items[idx].getAttribute("aria-label"));
    }
    items.forEach(function (b, i) { b.addEventListener("click", function () { show(i); lb.classList.add("open"); lb.querySelector(".lb-close").focus(); }); });
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

  // WhatsApp message composers (reservations, private events, contact)
  document.querySelectorAll("form[data-whatsapp]").forEach(function (form) {
    var kind = form.getAttribute("data-whatsapp");
    var dIn = form.querySelector('input[type="date"]'), tSel = form.querySelector("select[name=time]");
    var gSel = form.querySelector("select[name=guests]");
    var iso = now.getFullYear() + "-" + pad(now.getMonth() + 1) + "-" + pad(now.getDate());
    if (dIn) {
      var tmr = new Date(now.getTime() + 86400000);
      dIn.min = iso;
      dIn.value = tmr.getFullYear() + "-" + pad(tmr.getMonth() + 1) + "-" + pad(tmr.getDate());
    }
    function fillTimes() {
      if (!tSel) return;
      var day = new Date(dIn.value + "T12:00:00").getDay(); if (isNaN(day)) day = 6;
      var cur = tSel.value, o = "";
      for (var m = SITE.hours[day][0]; m <= SITE.hours[day][1] - 30; m += 30) o += "<option>" + fmt(m) + "</option>";
      tSel.innerHTML = o;
      tSel.value = cur && tSel.querySelector('option[value="' + cur + '"]') ? cur : "19:30";
      if (!tSel.value) tSel.selectedIndex = 0;
    }
    if (dIn) { dIn.addEventListener("change", fillTimes); fillTimes(); }
    if (gSel && !gSel.options.length) {
      var g = ""; for (var i = 1; i <= 12; i++) g += "<option" + (i === 2 ? " selected" : "") + ">" + i + "</option>";
      gSel.innerHTML = g + '<option value="13+">13 or more</option>';
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var err = form.querySelector(".err"), data = {};
      Array.prototype.forEach.call(form.elements, function (el) { if (el.name) data[el.name] = el.value.trim(); });
      if (!data.name) { err.textContent = "Please add your name."; return; }
      if (dIn && (!dIn.value || dIn.value < iso)) { err.textContent = "Pick today or a later date."; return; }
      if (kind === "contact" && !data.message) { err.textContent = "Please write a message."; return; }
      err.textContent = "";
      var nice = dIn ? new Date(dIn.value + "T12:00:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" }) : "";
      var lines;
      if (kind === "reserve") {
        lines = ["Hi The Butcher's Block, I'd like to reserve a table.", "Name: " + data.name, "Date: " + nice, "Time: " + data.time, "Guests: " + data.guests];
        if (data.occasion) lines.push("Occasion: " + data.occasion);
      } else if (kind === "event") {
        lines = ["Hi The Butcher's Block, I'd like to enquire about a private event.", "Name: " + data.name, "Event: " + (data.type || "—"), "Date: " + nice, "Guests: " + data.guests];
        if (data.email) lines.push("Email: " + data.email);
      } else {
        lines = ["Hi The Butcher's Block,", "", data.message, "", "— " + data.name];
        if (data.email) lines.push(data.email);
      }
      if (data.note) lines.push("Note: " + data.note);
      var text = lines.join("\n");
      form.querySelector(".preview").textContent = text;
      form.querySelector(".wa-link").href = "https://wa.me/" + SITE.whatsapp + "?text=" + encodeURIComponent(text);
      form.querySelector(".out").hidden = false;
      form.querySelector(".out").scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  });
})();
