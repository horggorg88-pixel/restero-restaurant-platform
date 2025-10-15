export interface IDatabase {
  object: "Booking";
  id: string;
  booking_date: string;
  client_name: string;
  client_phone: string;
  count_booking: number;
  restaurant: {
    data: Restaurant;
  };
}

export interface IPaginationParams {
  count: number;
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
  links: {
    next: string;
    previous: string;
  };
}

export interface Restaurant {
  object: "Restaurant";
  id: string;
  name: string;
  start_time: string | null;
  end_time: string | null;
}

interface Meta {
  include: [];
  custom: [];
}

export interface RestaurantResponse {
  data: Restaurant[];
  meta: Meta;
}
