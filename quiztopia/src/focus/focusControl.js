// src/focus/focusControl.js

// Global flags & history
window.focusTrackingEnabled = false;
window._focusHistory = [];

// Start tracking for a new game
window.enableFocusTracking = () => {
  window._focusHistory = []; // reset for each game
  window.focusTrackingEnabled = true;
  console.log("🎥 Focus tracking started");
};

// Stop tracking (but keep history so we can calculate final score)
window.disableFocusTracking = () => {
  window.focusTrackingEnabled = false;
  console.log("🛑 Focus tracking stopped");
};

// Called by our detector to add a single focus sample (0–100)
window._addFocusSample = (score) => {
  if (!window.focusTrackingEnabled) return;
  if (typeof score !== "number") return;
  // clamp to [0, 100]
  const clamped = Math.max(0, Math.min(100, score));
  window._focusHistory.push(clamped);
};

// Returns one final score (0–100)
window.getFinalFocusScore = () => {
  const history = window._focusHistory || [];
  if (!history.length) return 0;

  const avg =
    history.reduce((sum, value) => sum + value, 0) / history.length;

  const finalScore = Math.round(avg);
  console.log("📊 Final Focus Score:", finalScore);
  return finalScore;
};
