import { deleteRoom } from "@shared/api/rooms";
import { deleteTables } from "@shared/api/tables";
import { Button } from "@shared/components/ui/button";
import { Dialog, DialogContent } from "@shared/components/ui/dialog";
import { useModalStore as useTablesModalStore } from "@pages/TablesList/store";
import { useModalStore } from "@shared/store";
import { useMutation } from "@tanstack/react-query";
import { FC } from "react";
import { DialogTitle } from "@radix-ui/react-dialog";

interface PopupDeleteProps {
  isOpen: boolean;
  onClose: () => void;
  id: string;
  refetch: () => void;
  type: "table" | "room";
}

const PopupDelete: FC<PopupDeleteProps> = ({
  isOpen,
  onClose,
  id,
  refetch,
  type,
}) => {
  const {
    closeDelete,
    openSuccess,
    closeSuccess,
    resetSuccessText,
    setSuccessText,
    openDeleteError,
    closeDeleteError,
  } = useModalStore();

  const { closeRoomModal, closeEditTable } = useTablesModalStore();
  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      if (type === "table") {
        return deleteTables(id);
      }
      return deleteRoom(id);
    },
    onSuccess: () => {
      if (type === "room") {
        closeRoomModal();
      } else {
        closeEditTable();
      }
      refetch();
      closeDelete();
      setSuccessText(
        type === "table" ? "Стол успешно удален" : "Помещение успешно удалено"
      );
      openSuccess();
      setTimeout(() => {
        closeSuccess();
        resetSuccessText();
      }, 1000);
    },
    onError: () => {
      closeDelete();
      if (type === "room") {
        closeRoomModal();
      } else {
        closeEditTable();
      }
      openDeleteError();
      setTimeout(() => {
        closeDeleteError();
      }, 1500);
    },
  });

  const handleDelete = () => {
    if (id) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[452px]">
      <DialogTitle></DialogTitle>
        <p className="font-semibold text-1 text-center text-xl">
          Удалить {type === "room" ? ` помещение` : ` стол`}?
        </p>

        <div className=" text-center ">
          Вы уверены, что хотите удалить
          {type === "room" ? ` это помещение` : ` этот стол`}?
        </div>

        <Button
          type="submit"
          className="bg-8 text-3 font-semibold mt-[15px] mb-[10px] w-[398px] h-[43px] rounded-[10px]"
          disabled={deleteMutation.isPending}
          onClick={handleDelete}
        >
          {deleteMutation.isPending
            ? "Удаление..."
            : `Удалить ${type === "table" ? " стол" : " помещение"}`}
        </Button>

        <Button
          type="button"
          className="bg-7 text-3 mt-[-10px] font-semibold mb-[10px] w-[398px] h-[43px] rounded-[10px]"
          onClick={closeDelete}
        >
          Отмена
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default PopupDelete;
