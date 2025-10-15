import { Dialog, DialogContent } from "@shared/components/ui/dialog";
import { FC } from "react";
import DeleteError from "@assets/icons/error.svg";
import { DialogTitle } from "@radix-ui/react-dialog";

interface PopupDeleteErrorProps {
  isOpen: boolean;
  onClose: () => void;
  type: "room" | "table";
}

const PopupDeleteError: FC<PopupDeleteErrorProps> = ({
  isOpen,
  onClose,
  type,
}) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent noClose={true} className="w-[302px]">
      <DialogTitle></DialogTitle>
        <DeleteError className="m-auto" />
        <p className="font-semibold text-center text-[20px]">Ошибка</p>
        <p className="text-[#C86162] text-center">Есть будущие брони!</p>
        <p className="text-center">
          Нельзя удалить {type === "room" ? "помещение" : "стол"}
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default PopupDeleteError;
