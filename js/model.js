/* =========================================================
   ZenCount — Model
   Pure state/data logic for a single counting session.
   No DOM access happens in this file.
========================================================= */

(function (global) {
  "use strict";

  // Possible states: 'idle' -> 'running' -> 'paused' -> 'running' ...
  //                                     \-> 'stopped'
  //  'idle'/'stopped' both reset back to 'idle' via reset().
  function CounterModel() {
    this.count = 0;
    this.seconds = 0;
    this._timerId = null;
    this.state = "idle";
    this._listeners = [];
  }

  CounterModel.prototype.subscribe = function (fn) {
    this._listeners.push(fn);
  };

  CounterModel.prototype._emit = function () {
    var snapshot = this.snapshot();
    for (var i = 0; i < this._listeners.length; i++) {
      this._listeners[i](snapshot);
    }
  };

  CounterModel.prototype.snapshot = function () {
    return {
      count: this.count,
      seconds: this.seconds,
      state: this.state
    };
  };

  CounterModel.prototype._tickEverySecond = function () {
    var self = this;
    if (this._timerId) return;
    this._timerId = setInterval(function () {
      self.seconds += 1;
      self._emit();
    }, 1000);
  };

  CounterModel.prototype._stopTicking = function () {
    if (this._timerId) {
      clearInterval(this._timerId);
      this._timerId = null;
    }
  };

  // +1 Count. Starts the timer automatically on the very first press.
  CounterModel.prototype.increment = function () {
    if (this.state === "stopped" || this.state === "paused") return;
    if (this.state === "idle") {
      this.state = "running";
      this._tickEverySecond();
    }
    this.count += 1;
    this._emit();
  };

  CounterModel.prototype.pause = function () {
    if (this.state !== "running") return;
    this._stopTicking();
    this.state = "paused";
    this._emit();
  };

  CounterModel.prototype.resume = function () {
    if (this.state !== "paused") return;
    this.state = "running";
    this._tickEverySecond();
    this._emit();
  };

  CounterModel.prototype.stop = function () {
    if (this.state === "idle" || this.state === "stopped") return;
    this._stopTicking();
    this.state = "stopped";
    this._emit();
  };

  CounterModel.prototype.reset = function () {
    this._stopTicking();
    this.count = 0;
    this.seconds = 0;
    this.state = "idle";
    this._emit();
  };

  global.ZenCount = global.ZenCount || {};
  global.ZenCount.CounterModel = CounterModel;
})(window);
