/* Estetic Derm — before/after sliders and YouTube video player */
(function () {
  "use strict";

  // ---- Before / after drag sliders
  document.querySelectorAll(".ed-ba-card").forEach(function (card) {
    var ba = card.querySelector(".ed-ba");
    if (!ba) return;
    var dragging = false;

    function set(pct) {
      pct = Math.max(0, Math.min(100, pct));
      ba.style.setProperty("--pos", pct + "%");
      ba.setAttribute("aria-valuenow", Math.round(pct));
    }
    function fromEvent(ev) {
      var r = ba.getBoundingClientRect();
      set(((ev.clientX - r.left) / r.width) * 100);
    }

    card.addEventListener("pointerdown", function (ev) {
      dragging = true;
      fromEvent(ev);
      if (card.setPointerCapture) card.setPointerCapture(ev.pointerId);
    });
    card.addEventListener("pointermove", function (ev) {
      // Desktop: follow the mouse on hover; touch: only while dragging
      if (dragging || ev.pointerType === "mouse") fromEvent(ev);
    });
    ["pointerup", "pointercancel"].forEach(function (t) {
      card.addEventListener(t, function () { dragging = false; });
    });
    card.addEventListener("pointerleave", function (ev) {
      if (ev.pointerType === "mouse") set(50);
    });
    ba.addEventListener("keydown", function (ev) {
      var cur = parseFloat(ba.getAttribute("aria-valuenow")) || 50;
      if (ev.key === "ArrowLeft") { set(cur - 5); ev.preventDefault(); }
      if (ev.key === "ArrowRight") { set(cur + 5); ev.preventDefault(); }
    });
  });

  // ---- YouTube facade: loads the iframe only after a click
  var player = document.querySelector(".ed-video");
  if (!player) return;
  var titleEl = player.querySelector(".ed-video-title");
  var tabs = document.querySelectorAll(".ed-video-tab");

  function play(id) {
    var old = player.querySelector("iframe");
    if (old) old.remove();
    var f = document.createElement("iframe");
    f.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0";
    f.title = titleEl ? titleEl.textContent : "Відео Estetic Derm";
    f.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    f.allowFullscreen = true;
    player.appendChild(f);
    player.classList.add("is-playing");
  }

  player.querySelector(".ed-play").addEventListener("click", function () {
    play(player.getAttribute("data-video"));
  });

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) { t.classList.remove("is-active"); });
      tab.classList.add("is-active");
      player.setAttribute("data-video", tab.getAttribute("data-video"));
      if (titleEl) titleEl.textContent = tab.getAttribute("data-title");
      play(tab.getAttribute("data-video"));
    });
  });
})();
