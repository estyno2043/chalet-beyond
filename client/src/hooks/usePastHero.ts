import { useSyncExternalStore } from "react";

const subscribers = new Set<() => void>();
let past = false;
let frame = 0;
function check() {
  frame = 0;
  const sheet = document.getElementById("page-sheet");
  // Missing sheet means the hero has not mounted yet. Never flash the mobile
  // booking bar over a cold hero while the route is loading.
  const next = Boolean(sheet && sheet.getBoundingClientRect().top <= 100);
  if (past !== next) {
    past = next;
    subscribers.forEach(notify => notify());
  }
}
function schedule() {
  if (!frame) frame = requestAnimationFrame(check);
}
function subscribe(notify: () => void) {
  if (!subscribers.size) {
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    check();
  }
  subscribers.add(notify);
  return () => {
    subscribers.delete(notify);
    if (!subscribers.size) {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
      frame = 0;
    }
  };
}
/** Header and mobile action observe exactly the same sheet threshold. */
export function usePastHero() {
  return useSyncExternalStore(
    subscribe,
    () => past,
    () => false
  );
}
