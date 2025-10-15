import { DialogTitle } from "@radix-ui/react-dialog";
import { Dialog, DialogContent } from "@shared/components/ui/dialog";
import { convertToValidFormat } from "@shared/utils/convertToValidFormat";
import { FC, useEffect, useState } from "react";

interface IHistories {
  created_at: string;
}

interface PopupHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  history: {
    administrator: string;
    created_at: string;
    histories: IHistories[];
  };
}

const PopupHistory: FC<PopupHistoryProps> = ({ isOpen, onClose, history }) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");

  const checkIsAdmin = () => {
    if (typeof history?.administrator === "string") {
      return history.administrator;
    }

    return "";
  };

  useEffect(() => {
    if (history) {
      const createdAt = history?.created_at?.split(" ");

      const [createdDate, createdTime] = convertToValidFormat(createdAt);
      const lastUpdate =
        history.histories[history.histories.length - 1]?.created_at?.split(" ");

      setDate(createdDate);
      setTime(createdTime);

      if (!lastUpdate.length) {
        setEditDate(createdDate);
        setEditTime(createdTime);
      } else {
        const [editDate, editTime] = convertToValidFormat(lastUpdate);
        setEditDate(editDate);
        setEditTime(editTime);
      }
    }
  }, [history]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[389px]">
      <DialogTitle></DialogTitle>
        <div>
          <p className="font-semibold text-1 text-[15px] text-center">
            История изменений:
          </p>

          <p className="mt-[10px] text-[#3D8B95] text-[14px] text-center font-semibold">
            Последние изменения
          </p>

          <div className="flex gap-[10px] align-center justify-center font-semibold mt-[5px]">
            <p className="text-1 ">{editDate}</p>
            <p className=" text-1">{editTime}</p>
          </div>

          <p className="text-1 font-semibold mt-[15px] text-[#3D8B95] text-center">
            Дата создания
          </p>

          <div className="flex gap-[10px] align-center justify-center font-semibold mt-[5px]">
            <p className="text-1 ">{date}</p>
            <p className="text-1">{time}</p>
          </div>

          <p className="text-1 font-semibold mt-[15px] text-[#3D8B95] text-center">
            Администратор:
          </p>

          <p className="mt-[5px] font-semibold text-center mb-[15px]">
            {checkIsAdmin()}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PopupHistory;
