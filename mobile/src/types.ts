export type EventStatus = 'CONFIRMED' | 'CANCELLED';

export interface FestivalEvent {
  id: string;
  artist: string;
  space: string;
  time: string;
  status: EventStatus;
}
