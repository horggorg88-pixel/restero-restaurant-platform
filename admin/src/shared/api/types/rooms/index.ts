export interface IRoom {
  name: string;
  comment: string;
  restaurant_id: string;
}

export interface IUpdaRoom {
  name: string;
  comment: string;
}

export interface IFreeTables {
  booking_date: string;
  room_id: string;
  count_people: number;
  count_booking_time: string;
  booking_time: string;
  booking_id?: string;
}

export interface IFreeTable {
  data: {
    orId: number;
    object: string;
    id: string;
    number: number;
    roomd_id: string;
    comment: string;
  }[];
}
