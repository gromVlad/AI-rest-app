export interface Combo {
  id: string;
  name: string;
  style: 'boxing' | 'muaythai' | 'mma';
  moves: string[]; // array of move IDs
}