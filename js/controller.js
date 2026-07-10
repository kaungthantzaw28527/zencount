/* =========================================================
   ZenCount — Controller
   Wires DOM events to the Model and asks the View to re-render.
========================================================= */

(function (global) {
  "use strict";

  var CounterModel = global.ZenCount.CounterModel;
  var View = global.ZenCount.View;

  var ALLOWED_EXTENSIONS = ["pdf", "png", "jpg", "jpeg"];
  var ALLOWED_MIME = ["application/pdf", "image/png", "image/jpeg"];
  var MAX_FILE_BYTES = 30 * 1024 * 1024; // 30 MB — plenty for a scanned PDF/photo

  var currentObjectUrl = null;

  function getExtension(fileName) {
    var parts = fileName.split(".");
    return parts.length > 1 ? parts.pop().toLowerCase() : "";
  }

  function isAllowedFile(file) {
    var ext = getExtension(file.name);
    var extOk = ALLOWED_EXTENSIONS.indexOf(ext) !== -1;
    // Some browsers report an empty MIME type for certain files (e.g. some
    // Android PDFs); fall back to the extension check when that happens.
    var mimeOk = file.type === "" || ALLOWED_MIME.indexOf(file.type) !== -1;
    return extOk && mimeOk;
  }

  function revokeCurrentObjectUrl() {
    if (currentObjectUrl) {
      URL.revokeObjectURL(currentObjectUrl);
      currentObjectUrl = null;
    }
  }

  function bindCounterSession(prefix, model) {
    var countBtn = document.getElementById(prefix + "-count-btn");
    var pauseBtn = document.getElementById(prefix + "-pause-btn");
    var stopBtn = document.getElementById(prefix + "-stop-btn");
    var resetBtn = document.getElementById(prefix + "-reset-btn");

    model.subscribe(function (snapshot) {
      View.renderCounter(prefix, snapshot);
      View.setControlsDimmed(prefix, snapshot.state === "paused");
    });

    countBtn.onclick = function () { model.increment(); };
    pauseBtn.onclick = function () {
      if (model.state === "paused") model.resume(); else model.pause();
    };
    stopBtn.onclick = function () { model.stop(); };
    resetBtn.onclick = function () { model.reset(); };

    // Push the initial idle state so labels/disabled-states are correct
    // the moment a screen is shown.
    model.reset();
  }

  function App() {
    this.fileCountModel = new CounterModel();
    this.manualCountModel = new CounterModel();
    bindCounterSession("fc", this.fileCountModel);
    bindCounterSession("mc", this.manualCountModel);

    this._bindHome();
    this._bindBackButtons();
  }

  App.prototype._bindHome = function () {
    var self = this;
    var fileInput = document.getElementById("file-input");
    var dropzone = document.getElementById("dropzone");
    var uploadBtn = document.getElementById("btn-upload-file");
    var manualBtn = document.getElementById("btn-start-manual");

    uploadBtn.addEventListener("click", function () { fileInput.click(); });

    dropzone.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        fileInput.click();
      }
    });

    ["dragenter", "dragover"].forEach(function (evt) {
      dropzone.addEventListener(evt, function (e) {
        e.preventDefault();
        View.setDropzoneActive(true);
      });
    });
    ["dragleave", "drop"].forEach(function (evt) {
      dropzone.addEventListener(evt, function (e) {
        e.preventDefault();
        View.setDropzoneActive(false);
      });
    });
    dropzone.addEventListener("drop", function (e) {
      var files = e.dataTransfer && e.dataTransfer.files;
      if (files && files.length) self._handleFile(files[0]);
    });

    fileInput.addEventListener("change", function (e) {
      var files = e.target.files;
      if (files && files.length) self._handleFile(files[0]);
      fileInput.value = ""; // allow re-selecting the same file later
    });

    manualBtn.addEventListener("click", function () {
      self.manualCountModel.reset();
      View.showScreen("screen-manual-count");
    });
  };

  App.prototype._handleFile = function (file) {
    if (file.size > MAX_FILE_BYTES) {
      View.toast("File is too large. Please choose a file under 30 MB.", "error");
      return;
    }
    if (!isAllowedFile(file)) {
      View.toast("Unsupported file type. Please upload a PDF, PNG, or JPG file.", "error");
      return;
    }

    revokeCurrentObjectUrl();
    currentObjectUrl = URL.createObjectURL(file);

    View.setFileName(file.name);
    View.renderFilePreview(file, currentObjectUrl);
    this.fileCountModel.reset();
    View.showScreen("screen-file-count");
  };

  App.prototype._bindBackButtons = function () {
    var self = this;
    var backButtons = document.querySelectorAll("[data-back]");
    backButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        self.fileCountModel.reset();
        self.manualCountModel.reset();
        revokeCurrentObjectUrl();
        View.clearFilePreview();
        View.showScreen("screen-home");
      });
    });
  };

  global.ZenCount = global.ZenCount || {};
  global.ZenCount.App = App;
})(window);
