import FingerprintJS from "@fingerprintjs/fingerprintjs";

// FingerprintJS's open-source build derives a visitorId from canvas
// rendering, WebGL renderer strings, audio-context output, installed fonts,
// and other hardware/browser signals. Unlike our old hand-rolled hash, this
// value is recomputed fresh each time — it does NOT depend on localStorage,
// so clearing site data alone no longer resets it. It's still not 100%
// unbeatable (a different browser or a spoofed environment can shift it),
// but it's meaningfully harder to dodge than a stored token.
let fpPromise;

const getFingerprintClient = () => {
  if (!fpPromise) fpPromise = FingerprintJS.load();
  return fpPromise;
};

export const getDeviceFingerprint = async () => {
  const fp = await getFingerprintClient();
  const result = await fp.get();
  return result.visitorId;
};

// Lightweight local flag kept alongside the fingerprint purely so the UI can
// skip an extra network round-trip on repeat visits. The real duplicate
// check always happens server-side against the fingerprint + IP hash + a
// submission cookie, so clearing this alone does not let someone resubmit.
export const markAsSubmitted = () => localStorage.setItem("hasSubmittedFeedback", "true");
export const hasAlreadySubmitted = () => localStorage.getItem("hasSubmittedFeedback") === "true";
