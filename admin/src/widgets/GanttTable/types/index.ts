export interface Params {
  booking_date: string;
  room_id: string;
  table_ids: string[];
  count_people: string;
  client_phone: string;
  client_name: string;
  comment: string;
  count_booking_time: string;
  booking_time: string;
  id: string;
}

interface Table {
  id: string;
  number: number;
  count_people: number;
  room_id: string;
  comment?: string;
}

export interface Room {
  id: string;
  name: string;
  comment?: string;
  tables: {
    data: Table[];
  };
}

export interface Booking {
  id: string;
  room_id: string;
  table_ids: string[];
  booking_time_from: string;
  booking_time_to: string;
  status: number;
  booking_date: string;
}
