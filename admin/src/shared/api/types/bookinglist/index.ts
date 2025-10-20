import { IPaginationParams } from "../database";

export interface IBookingList {
  booking_date: string;
  booking_time_from: string;
  booking_time_to: string;
  client_name: string;
  client_phone: string;
  comment: string;
  count_people: number;
  created_at: string;
  room_name: string;
  histories: {
    data: { created_at: string }[];
  };
  id: string;
  object: string;
  room_id: string;
  status: 0 | 1 | 2 | 3;
  table_ids: string[];
  administrator: {
    id: string;
    name: string;
  };
  table_number: string;
  composite_tables: CompositeTables[];
}

export interface CompositeTables {
  id: string;
  number: string;
}

export interface IBookingSearchParams {
  booking_date_from?: string;
  booking_date_to?: string;
  client_phone?: string;
  restaurant_id?: string;
  status?: number;
  page?: number;
  limit?: number;
  client_name?: string;
  query?: string;
}

export interface IRestaurant {
  object: string;
  id: string;
  name: string;
  start_time: string;
  end_time: string;
}

export interface IUser {
  object: string;
  id: string;
  name: string;
  email: string;
  email_verified_at: string;
  restaurant: {
    data: IRestaurant;
  };
}

export interface IBookingListResponse {
  data: IBookingList[];
  meta: {
    pagination: IPaginationParams;
  };
}

export interface IRepeatReservation {
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
  status?: number;
  composite_tables?: { id: string }[];
  table_id?: string;
}
