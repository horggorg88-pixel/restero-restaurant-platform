import { Dialog, DialogContent } from "@shared/components/ui/dialog";
import { FC } from "react";
import Success from "@assets/icons/success.svg";
import { useModalStore } from "@shared/store";
import { DialogTitle } from "@radix-ui/react-dialog";

interface PopupSuccess {
  isOpen: boolean;
  onClose: () => void;
}

const PopupSuccess: FC<PopupSuccess> = ({ isOpen, onClose }) => {
  const { resetSuccessText, successText } = useModalStore();

  const handleClose = () => {
    onClose();
    resetSuccessText();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent noClose={true} className="w-[476px]">
      <DialogTitle></DialogTitle>
        <div>
          <p className="font-semibold text-center mb-[10px] text-[20px]">
            {successText}
          </p>
          <Success className="m-auto" />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PopupSuccess;
