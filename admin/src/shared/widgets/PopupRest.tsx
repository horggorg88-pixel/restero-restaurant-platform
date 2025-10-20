import { DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "@shared/components/ui/button";
import { Dialog, DialogContent } from "@shared/components/ui/dialog";
import { useModalStore } from "@shared/store";
import { convertDate } from "@shared/utils/convertDate";
import { convertToValidFormat } from "@shared/utils/convertToValidFormat";
import { removeSeconds } from "@shared/utils/removeSeconds";

import { FC } from "react";
import { isAfter, isBefore, isToday } from "date-fns";

interface PopupRestProps {
  isOpen: boolean;
  onClose: () => void;
  refetch?: () => void;
  bookingData: {
    booking_time_from: string;
    booking_time_to: string;
    booking_date: string;
    client_name: string;
    client_phone: string;
    count_people: number;
    comment: string;
    administrator: {
      name: string;
    };
    created_at: string;
    id: string;
    table_number: string;
    room_name: string;
    histories: {
      data: { created_at: string }[];
    };
  };
}

const PopupRest: FC<PopupRestProps> = ({ isOpen, onClose, bookingData }) => {
  const handleCancelBooking = () => {
    openCancelReservation();
  };

  const { openBookingModal, openHistory, openCancelReservation } =
    useModalStore();

  const checkAdmin = () => {
    const name = bookingData?.administrator?.name;
    return typeof name === "string" ? name : "";
  };

  const handleClose = () => {
    onClose();
  };

  const shouldShowButtons = (): boolean => {
    const currentDateTime = new Date();

    const bookingEndDate = new Date(
      `${bookingData?.booking_date} ${bookingData?.booking_time_to}`
    );

    const bookingStartDate = new Date(
      `${bookingData?.booking_date} ${bookingData?.booking_time_from}`
    );

    const hasBookingNotEnded = isAfter(bookingEndDate, currentDateTime);

    const isBookingTodayAndNotStarted =
      isToday(bookingStartDate) && isBefore(currentDateTime, bookingStartDate);

    return hasBookingNotEnded || isBookingTodayAndNotStarted;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[389px]">
        <DialogTitle></DialogTitle>
        <div>
          <p className="font-semibold text-[#161616] text-[20px] text-center">
            Детали бронирования
          </p>

          <div className="flex gap-[10px] items-center justify-center mt-[20px] font-semibold">
            <p>{bookingData?.room_name}</p>
            <p className="font-semibold text-5">
              Стол {bookingData?.table_number}
            </p>
          </div>

          <div className="flex gap-[10px] items-center justify-center mt-[5px] font-semibold">
            <p>
              <span className="color-1">
                {convertDate(bookingData?.booking_date)}
              </span>
            </p>
            <p className="font-semibold text-[#C86162]">
              {removeSeconds(bookingData?.booking_time_from)} -
              {removeSeconds(bookingData?.booking_time_to)}
            </p>
          </div>

          <p className="text-1 text-center font-semibold mt-[10px] text-[#3D8B95]">
            {bookingData?.client_phone}
          </p>
          <p className="text-center mt-[4px] font-semibold">
            {bookingData?.client_name}
          </p>

          <p className="mt-[4px] text-[#3D8B95] text-center font-[500] italic">
            {bookingData?.comment}
          </p>

          {shouldShowButtons() && (
            <>
              <Button
                onClick={openBookingModal}
                className="bg-9 text-1 font-semibold mt-[15px] mb-[10px] w-[329px] h-[43px] rounded-[10px] text-[#FFFFFF]"
              >
                Редактировать бронь
              </Button>
              <Button
                onClick={handleCancelBooking}
                className="bg-7 font-semibold text-3 w-[329px] h-[43px] mb-[10px] rounded-[10px] text-[#FFFFFF]"
              >
                Отменить бронь
              </Button>
            </>
          )}

          <p className="text-center font-semibold mt-[10px]">
            от{" "}
            {convertToValidFormat(bookingData?.created_at?.split(" ")).join(
              " "
            )}
          </p>
          <span className="text-center font-semibold">{checkAdmin()}</span>
          <span className="text-center text-[#007aff]" onClick={openHistory}>
            Смотреть историю изменений
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PopupRest;
