export interface WorkoutConfig {
  style: 'boxing' | 'muaythai' | 'mma';
  rounds: number;
  roundDuration: number; // in seconds
  restDuration: number; // in seconds
  speed: 'slow' | 'medium' | 'fast';
  mode: 'random' | 'combos' | 'user-combos';
}