export interface ITable {
  number: number;
  count_people: number;
  room_id: string;
  comment: string;
}

export interface IDeleteTable {
  id: number;
  number: number;
  count_people: number;
  room_id: number;
  comment: string;
}
