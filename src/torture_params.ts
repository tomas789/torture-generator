export const PATTERNS = ["-", "|", "o", "/", "\\"] as const;
type PatternTuple = typeof PATTERNS;
export type Patterns = PatternTuple[number];

export interface TortureParams {
  bedSizeX: number,
  bedSizeY: number,
  homeAtStart: boolean,
  zOffset: number,
  pattern: Patterns,
  patternSize: number,
  initialAcceleration: number,
  finalAcceleration: number,
  initialSpeed: number,
  finalSpeed: number,
  steps: number
  repetitions: number,
  waitAfterStep: number | null
}