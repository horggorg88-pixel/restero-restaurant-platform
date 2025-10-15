import { DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "@shared/components/ui/button";
import { Dialog, DialogContent } from "@shared/components/ui/dialog";
import { useModalStore } from "@shared/store";

interface PopupCancelRestProps<T> {
  isOpen: boolean;
  bookingData?:
  | {
    booking_date?: string | undefined;
    booking_time_from?: string | undefined;
    booking_time_to?: string | undefined;
    table_number?: string | undefined;
    room?: string | undefined;
    comment: string | undefined;
    client_phone: string | undefined;
    client_name: string | undefined;
  }
  | undefined
  | null;
  onClose: () => void;
  onConfirm: (data: T) => Promise<void>;
  confirmData: T;
}

const PopupCancelRest = <T,>({
  isOpen,
  onClose,
  onConfirm,
  confirmData,
}: PopupCancelRestProps<T>) => {
  const {
    setErrorText,
    openError,
    setSuccessText,
    resetSuccessText,
    openSuccess,
    closeSuccess,
    closeBookingModal
  } = useModalStore();

  const handleConfirm = async () => {
    try {
      await onConfirm(confirmData);
      onClose();
      setSuccessText("Бронирование успешно отменено");
      openSuccess();
      closeBookingModal()
      sessionStorage.removeItem('booking')
      setTimeout(() => {
        closeSuccess();
        resetSuccessText();
      }, 1000);
    } catch (error) {
      console.error("Error while confirming:", error);
      setErrorText("Ошибка при удалении бронирования");
      openError();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[425px] bg-[#EDF3F3] text-center font-semibold">
        <DialogTitle></DialogTitle>
        <div className="text-[#161616]">
          <p className="font-semibold text-xl mb-[15px] ">
            Вы точно хотите отменить
            <br />
            это бронирование?
          </p>

          {/* <div className="flex justify-center items-center	text-[14px] gap-[10px]">
            <p className="font-semibold">Помещение</p>
            <p className="font-semibold">Стол {bookingData?.table_number}</p>
          </div>

          <div className="flex justify-center items-center	text-[14px] gap-[10px] my-[5px]">
            <p className="font-semibold">
              {convertDate(bookingData?.booking_date!)}
            </p>
            <p className="text-[#C86162]">
              {removeSeconds(bookingData?.booking_time_from)} -
              {removeSeconds(bookingData?.booking_time_to)}
            </p>
          </div>

          <p className="text-center text-[#3D8B95] mt-[15px]">
            {bookingData?.client_phone}
          </p>
          <p className="text-center  mt-[5px]">{bookingData?.client_name}</p>
          <p className="text-center text-[#3D8B95] italic mt-[5px]">
            {bookingData?.comment}
          </p> */}
          <div className="flex space-x-2">
            <Button
              className="bg-7 font-semibold text-3 w-1/2 h-[41px]  rounded-[10px]"
              onClick={onClose}
            >
              Нет
            </Button>
            <Button
              className="bg-8 text-3 font-semibold  w-1/2 h-[41px] rounded-[10px]"
              onClick={handleConfirm}
            >
              Да
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PopupCancelRest;
