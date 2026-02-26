// =============================================================================
// Freeze Animations
// =============================================================================
//
// Monkey-patches setTimeout, setInterval, and requestAnimationFrame so that
// callbacks are silently skipped while frozen. Also injects CSS to pause
// CSS animations/transitions, pauses WAAPI animations, and pauses videos.
//
// Toolbar/popup code must import `originalSetTimeout` etc. to bypass the patch.
//
// Patches are installed as a side effect of importing this module.
// =============================================================================

const EXCLUDE_ATTRS = [
  "data-feedback-toolbar",
  "data-annotation-popup",
  "data-annotation-marker",
];
const NOT_SELECTORS = EXCLUDE_ATTRS
  .flatMap((a) => [`:not([${a}])`, `:not([${a}] *)`])
  .join("");

const STYLE_ID = "feedback-freeze-styles";
const STATE_KEY = "__agentation_freeze";

// ---------------------------------------------------------------------------
// Shared mutable state on window (survives HMR module re-execution)
// ---------------------------------------------------------------------------
interface FreezeState {
  frozen: boolean;
  installed: boolean;
  origSetTimeout: typeof setTimeout;
  origSetInterval: typeof setInterval;
  origRAF: typeof requestAnimationFrame;
  pausedAnimations: Animation[];
  frozenTimeoutQueue: Array<() => void>;
  frozenRAFQueue: FrameRequestCallback[];
}

function getState(): FreezeState {
  if (typeof window === "undefined") {
    return {
      frozen: false,
      installed: true,
      origSetTimeout: setTimeout,
      origSetInterval: setInterval,
      origRAF: (cb: FrameRequestCallback) => 0 as any,
      pausedAnimations: [],
      frozenTimeoutQueue: [],
      frozenRAFQueue: [],
    };
  }
  const w = window as any;
  if (!w[STATE_KEY]) {
    w[STATE_KEY] = {
      frozen: false,
      installed: false,
      origSetTimeout: null,
      origSetInterval: null,
      origRAF: null,
      pausedAnimations: [],
      frozenTimeoutQueue: [],
      frozenRAFQueue: [],
    };
  }
  return w[STATE_KEY];
}

const _s = getState();

// ---------------------------------------------------------------------------
// Install patches (once — survives HMR because `installed` lives on window)
// ---------------------------------------------------------------------------
if (typeof window !== "undefined" && !_s.installed) {
  _s.origSetTimeout = window.setTimeout.bind(window);
  _s.origSetInterval = window.setInterval.bind(window);
  _s.origRAF = window.requestAnimationFrame.bind(window);

  (window as any).setTimeout = (
    handler: TimerHandler,
    timeout?: number,
    ...args: any[]
  ): ReturnType<typeof setTimeout> => {
    if (typeof handler === "string") {
      return _s.origSetTimeout(handler, timeout);
    }
    return _s.origSetTimeout(
      (...a: any[]) => {
        if (_s.frozen) {
          _s.frozenTimeoutQueue.push(() => (handler as Function)(...a));
        } else {
          (handler as Function)(...a);
        }
      },
      timeout,
      ...args,
    );
  };

  (window as any).setInterval = (
    handler: TimerHandler,
    timeout?: number,
    ...args: any[]
  ): ReturnType<typeof setInterval> => {
    if (typeof handler === "string") {
      return _s.origSetInterval(handler, timeout);
    }
    return _s.origSetInterval(
      (...a: any[]) => {
        if (!_s.frozen) (handler as Function)(...a);
      },
      timeout,
      ...args,
    );
  };

  (window as any).requestAnimationFrame = (
    callback: FrameRequestCallback,
  ): number => {
    return _s.origRAF((timestamp: number) => {
      if (_s.frozen) {
        _s.frozenRAFQueue.push(callback);
      } else {
        callback(timestamp);
      }
    });
  };

  _s.installed = true;
}

// ---------------------------------------------------------------------------
// Exports — original (unpatched) timing functions for toolbar/popup use
// ---------------------------------------------------------------------------
export const originalSetTimeout = _s.origSetTimeout;
export const originalSetInterval = _s.origSetInterval;

// ---------------------------------------------------------------------------
// Freeze / Unfreeze
// ---------------------------------------------------------------------------

function isAgentationElement(el: Element | null): boolean {
  if (!el) return false;
  return EXCLUDE_ATTRS.some((attr) => !!el.closest?.(`[${attr}]`));
}

export function freeze(): void {
  if (typeof document === "undefined") return;
  if (_s.frozen) return;
  _s.frozen = true;
  _s.frozenTimeoutQueue = [];
  _s.frozenRAFQueue = [];

  let style = document.getElementById(STYLE_ID);
  if (!style) {
    style = document.createElement("style");
    style.id = STYLE_ID;
  }
  style.textContent = `
    *${NOT_SELECTORS},
    *${NOT_SELECTORS}::before,
    *${NOT_SELECTORS}::after {
      animation-play-state: paused !important;
      transition: none !important;
    }
  `;
  document.head.appendChild(style);

  _s.pausedAnimations = [];
  try {
    document.getAnimations().forEach((anim) => {
      if (anim.playState !== "running") return;
      const target = (anim.effect as KeyframeEffect)?.target as Element | null;
      if (!isAgentationElement(target)) {
        anim.pause();
        _s.pausedAnimations.push(anim);
      }
    });
  } catch {
    // getAnimations may not be available in all environments
  }

  document.querySelectorAll("video").forEach((video) => {
    if (!video.paused) {
      video.dataset.wasPaused = "false";
      video.pause();
    }
  });
}

export function unfreeze(): void {
  if (typeof document === "undefined") return;
  if (!_s.frozen) return;
  _s.frozen = false;

  const timeoutQueue = _s.frozenTimeoutQueue;
  _s.frozenTimeoutQueue = [];
  for (const cb of timeoutQueue) {
    _s.origSetTimeout(() => {
      if (_s.frozen) {
        _s.frozenTimeoutQueue.push(cb);
        return;
      }
      try {
        cb();
      } catch (e) {
        console.warn("[agentation] Error replaying queued timeout:", e);
      }
    }, 0);
  }

  const rafQueue = _s.frozenRAFQueue;
  _s.frozenRAFQueue = [];
  for (const cb of rafQueue) {
    _s.origRAF((ts: number) => {
      if (_s.frozen) {
        _s.frozenRAFQueue.push(cb);
        return;
      }
      cb(ts);
    });
  }

  for (const anim of _s.pausedAnimations) {
    try {
      anim.play();
    } catch (e) {
      console.warn("[agentation] Error resuming animation:", e);
    }
  }
  _s.pausedAnimations = [];

  document.getElementById(STYLE_ID)?.remove();

  document.querySelectorAll("video").forEach((video) => {
    if (video.dataset.wasPaused === "false") {
      video.play().catch(() => {});
      delete video.dataset.wasPaused;
    }
  });
}
