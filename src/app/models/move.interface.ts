export interface Move {
  id: string;
  name: string;
  style: 'boxing' | 'muaythai' | 'mma';
  type: 'punch' | 'kick' | 'elbow' | 'knee';
  audioUrl: string;
  duration?: number; // duration in milliseconds
}