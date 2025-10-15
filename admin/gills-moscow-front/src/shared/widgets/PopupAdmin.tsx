import { Button } from "@shared/components/ui/button";
import { Dialog, DialogContent } from "@shared/components/ui/dialog";
import { FC } from "react";

interface PopupAdminProps {
  isOpen: boolean;
  onClose: () => void;
}

const PopupAdmin: FC<PopupAdminProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[295px]">
        <div>
          <p className="font-semibold  mb-[10px]">Администратор:</p>

          <p className="text-1">
            Плотникова Светлана
            <br />
            Алексеевна
          </p>

          <p className="text-1 font-semibold mt-[10px] mb-[20px]">
            +79126450818
          </p>

          <p className="text-1 font-semibold mb-[10px]">Ресторан:</p>

          <p className="text-1 mb-[10px]">Ресторан 64</p>

          <Button className="bg-1 text-3 font-extrabold mt-[32px] mb-[10px] w-[255px] h-[41px] text-sm">
            История бронирований
          </Button>
          <Button className="bg-9 font-extrabold text-1 w-[255px] h-[41px] mb-[10px] text-sm">
            Редактировать столы
          </Button>
          <Button className="bg-5 font-extrabold text-3 w-[255px] h-[41px] text-sm mb-[52px]">
            База данных
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PopupAdmin;
