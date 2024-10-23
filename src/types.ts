export interface Player {
  x: number;
  y: number;
  color: string;
}

export interface WorldState {
  players: { [key: string]: Player };
}