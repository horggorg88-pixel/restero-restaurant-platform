import { Dialog, DialogContent } from "@shared/components/ui/dialog";
import { FC } from "react";
import Success from "@assets/icons/success.svg";
import { useModalStore } from "@shared/store";
import { DialogTitle } from "@radix-ui/react-dialog";

interface PopupSuccess {
  isOpen: boolean;
  onClose: () => void;
}

const PopupError: FC<PopupSuccess> = ({ isOpen, onClose }) => {
  const { resetErrorText, errorText } = useModalStore();

  const handleClose = () => {
    onClose();
    resetErrorText();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[476px]">
      <DialogTitle></DialogTitle>
        <div>
          <p className="font-semibold text-center mb-[10px] text-[20px]">
            {errorText}
          </p>
          <Success className="m-auto rotate-[180deg]" />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PopupError;
