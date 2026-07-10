/* =========================================================
   ZenCount — View
   All DOM reads/writes live here. Controller calls into this
   module; this module never calls back into the model.
========================================================= */

(function (global) {
  "use strict";

  var SCREENS = ["screen-home", "screen-file-count", "screen-manual-count"];

  function pad2(n) { return String(n).padStart(2, "0"); }

  function formatTimer(totalSeconds) {
    var h = Math.floor(totalSeconds / 3600);
    var m = Math.floor((totalSeconds % 3600) / 60);
    var s = totalSeconds % 60;
    return pad2(h) + ":" + pad2(m) + ":" + pad2(s);
  }

  function formatCount(n) {
    return String(n).padStart(4, "0");
  }

  function statusLabel(state) {
    switch (state) {
      case "running": return "Counting…";
      case "paused": return "Paused";
      case "stopped": return "Stopped";
      default: return "Waiting…";
    }
  }

  var View = {
    formatTimer: formatTimer,
    formatCount: formatCount,

    showScreen: function (id) {
      for (var i = 0; i < SCREENS.length; i++) {
        var el = document.getElementById(SCREENS[i]);
        if (el) el.classList.toggle("active", SCREENS[i] === id);
      }
      window.scrollTo(0, 0);
    },

    // Renders count/timer/status plus the enabled/disabled state of the
    // control buttons for one counting session (file-count or manual).
    renderCounter: function (prefix, snapshot) {
      var countEl = document.getElementById(prefix + "-count");
      var statusEl = document.getElementById(prefix + "-status");
      var timerEl = document.getElementById(prefix + "-timer");
      var countBtn = document.getElementById(prefix + "-count-btn");
      var pauseBtn = document.getElementById(prefix + "-pause-btn");
      var stopBtn = document.getElementById(prefix + "-stop-btn");
      var resetBtn = document.getElementById(prefix + "-reset-btn");

      if (countEl) countEl.textContent = formatCount(snapshot.count);
      if (statusEl) statusEl.textContent = statusLabel(snapshot.state);
      if (timerEl) timerEl.textContent = formatTimer(snapshot.seconds);

      var isPaused = snapshot.state === "paused";
      var isStopped = snapshot.state === "stopped";

      if (countBtn) countBtn.disabled = isPaused || isStopped;
      if (stopBtn) stopBtn.disabled = isPaused || isStopped || snapshot.state === "idle";
      if (resetBtn) resetBtn.disabled = false; // Reset always available

      if (pauseBtn) {
        pauseBtn.disabled = isStopped || snapshot.state === "idle";
        var label = isPaused ? "Resume" : "Pause";
        var icon = isPaused
          ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 3 20 12 6 21 6 3"/></svg>'
          : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
        pauseBtn.innerHTML = icon + " " + label;
      }
    },

    // Dims count/pause/stop while paused or stopped (per spec: pausing
    // fades out the other controls; resuming brings them back).
    setControlsDimmed: function (prefix, dimmed) {
      var row = document.querySelector("#" + (prefix === "fc" ? "screen-file-count" : "screen-manual-count") + " .btn-row");
      if (row) row.classList.toggle("dimmed", dimmed);
    },

    setFileName: function (name) {
      var el = document.getElementById("file-name-label");
      if (el) el.textContent = name;
    },

    renderFilePreview: function (file, objectUrl) {
      var body = document.getElementById("file-viewer-body");
      if (!body) return;
      body.innerHTML = "";

      if (file.type === "application/pdf" || /\.pdf$/i.test(file.name)) {
        var embed = document.createElement("embed");
        embed.src = objectUrl;
        embed.type = "application/pdf";
        body.appendChild(embed);
      } else {
        var img = document.createElement("img");
        img.src = objectUrl;
        img.alt = file.name;
        body.appendChild(img);
      }
    },

    clearFilePreview: function () {
      var body = document.getElementById("file-viewer-body");
      if (body) body.innerHTML = "";
    },

    toast: function (message, type) {
      var stack = document.getElementById("toast-stack");
      if (!stack) return;
      var el = document.createElement("div");
      el.className = "zen-toast zen-toast-" + (type || "error");
      el.textContent = message; // textContent only — never innerHTML with user input
      stack.appendChild(el);
      requestAnimationFrame(function () { el.classList.add("show"); });
      setTimeout(function () {
        el.classList.remove("show");
        setTimeout(function () { el.remove(); }, 250);
      }, 3200);
    },

    setDropzoneActive: function (active) {
      var dz = document.getElementById("dropzone");
      if (dz) dz.classList.toggle("dragover", active);
    }
  };

  global.ZenCount = global.ZenCount || {};
  global.ZenCount.View = View;
})(window);
