/** CSS mirrors these tokens in index.css. Durations here use seconds. */
export const EASE = {
  ui: [0.23, 1, 0.32, 1],
  enter: [0.16, 1, 0.3, 1],
  move: [0.77, 0, 0.175, 1],
  drawer: [0.32, 0.72, 0, 1],
} as const;
export const DUR = {
  ui: 0.16,
  state: 0.24,
  modal: 0.42,
  section: 0.52,
  cinematic: 1,
};
export const STAGGER = 0.06;
export const SPRING_GESTURE = {
  type: "spring",
  duration: 0.5,
  bounce: 0.2,
} as const;
