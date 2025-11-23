export interface WorkoutSession {
  id: string;
  date: Date;
  style: 'boxing' | 'muaythai' | 'mma';
  type: 'random' | 'combos' | 'user-combos';
  rounds: number;
  duration: number; // in seconds
  usedCombos: string[]; // IDs of combos used in the session
}