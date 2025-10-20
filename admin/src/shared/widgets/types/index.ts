import { IRepeatReservation } from "@shared/api/types/bookinglist";

export interface PopupAddBookingProps {
  isOpen: boolean;
  isAdd?: boolean;
  onClose: () => void;
  bookingData?: IRepeatReservation | null;
  refetch: () => void;
}

export interface IRooms {
  name: string;
  id: string;
  tables: {
    data: {
      number: number;
      id: string;
    }[];
  };
}
