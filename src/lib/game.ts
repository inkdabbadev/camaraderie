export const MAZE = [
  "#########",
  "#...#...#",
  "#.#.#.#.#",
  "#.#...#.#",
  "#.###.#.#",
  "#...#...#",
  "###.#.#.#",
  "#.......#",
  "#########",
];
export const TOKENS = [
  { x: 3, y: 1, icon: "🍵" },
  { x: 7, y: 1, icon: "🌷" },
  { x: 7, y: 7, icon: "⭐" },
];
export const HAZARDS = [
  { x: 1, y: 5, label: "Boredom cloud" },
  { x: 5, y: 4, label: "Pointless meeting" },
  { x: 4, y: 7, label: "Monday morning" },
];
export const GOOD = [
  "Brilliant designer",
  "Certified icon",
  "Creative genius",
  "Excellent taste",
  "Muffy-approved",
  "Matcha royalty",
  "Very good human",
];
export const BAD = [
  "Bad briefs",
  "Unnecessary meetings",
  "Reply-all emails",
  "Unsolicited advice",
  "Pointless drama",
];
export function catches(x: number, y: number, basket: number) {
  return y >= 83 && y <= 94 && Math.abs(x - basket) < 14;
}
