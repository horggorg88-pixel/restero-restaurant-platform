import { DialogTitle } from "@radix-ui/react-dialog";
import { updateRoom } from "@shared/api/rooms";
import { getTables } from "@shared/api/tables";
import { Button } from "@shared/components/ui/button";
import { Dialog, DialogContent } from "@shared/components/ui/dialog";
import { Input } from "@shared/components/ui/input";
import { Label } from "@shared/components/ui/label";
import { Textarea } from "@shared/components/ui/textarea";
import { cn } from "@shared/lib/utils";
import { useModalStore } from "@shared/store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface PopupsEditRoomProps {
  isOpen: boolean;
  onClose: () => void;
  refetchRooms: () => void;
  initialData: {
    id: string;
    comment: string;
    name: string;
  };
}

interface FormValues {
  id: string;
  comment: string;
  name: string;
}

interface ITables {
  id: string;
  name: string;
  tables: {
    data: { number: number }[];
  };
}

const PopupsEditRoom: FC<PopupsEditRoomProps> = ({
  isOpen,
  onClose,
  refetchRooms,
  initialData,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    watch,
    formState,
    setError,
    clearErrors,
  } = useForm<FormValues>({});

  const { data } = useQuery<ITables[]>({
    queryKey: ["tables"],
    queryFn: getTables,
  });

  const roomName = watch("name");
  const [initialName, setInitialName] = useState<string | null>(null);

  useEffect(() => {
    if (initialData?.name) {
      setInitialName(initialData.name);
    }
  }, [initialData]);

  useEffect(() => {
    if (!roomName?.trim()) {
      setError("name", {
        message: "Введите название помещения",
      });
    } else {
      const rooms = data?.map((room) => room.name);
      const isCurrentName = roomName.trim() === initialName;
      const isValid = isCurrentName || !rooms?.includes(roomName.trim());

      if (!isValid) {
        setError("name", {
          message: "Помещение с таким названием уже существует",
        });
      } else {
        clearErrors("name");
      }
    }
  }, [roomName, data, initialName]);

  const {
    openSuccess,
    setSuccessText,
    setErrorText,
    openError,
    resetSuccessText,
    closeSuccess,
    openDelete,
  } = useModalStore();

  useEffect(() => {
    setValue("comment", initialData?.comment);
    setValue("id", initialData?.id);
    setValue("name", initialData?.name);
  }, [isOpen, initialData]);

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Omit<FormValues, "id">;
    }) => updateRoom(id, payload),
    onSuccess: () => {
      setSuccessText("Помещение успешно обновлено");
      openSuccess();
      onClose();
      reset();
      refetchRooms();
      setTimeout(() => {
        resetSuccessText();
        closeSuccess();
      }, 1000);
    },
    onError: (error) => {
      console.error("Ошибка при обновлении стола:", error);
      setErrorText("Ошибка при обновлении стола");
      openError();
    },
  });

  const onSubmit = (data: FormValues) => {
    updateMutation.mutate({
      id: data.id,
      payload: {
        name: data.name,
        comment: data.comment,
      },
    });
  };

  const handleDelete = () => {
    openDelete();
  };

  const [size, setSize] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setSize(getValues().comment?.length || 0);
    }
  }, [isOpen]);

  const changeFn = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setSize(e.target.value.length);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[452px]">
        <DialogTitle></DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <p className="font-semibold text-1 text-center text-xl">
            Редактировать помещение
          </p>

          <div className="flex gap-[15px]">
            <div>
              <Label htmlFor="tableName" className="text-1 text-[11px]">
                Название помещения
              </Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="tableName"
                    className={cn(
                      "w-[398px] rounded-[10px] bg-[#ffffff]",
                      formState.errors.name ? "border-red-500" : ""
                    )}
                    placeholder="1"
                  />
                )}
              />
            </div>
          </div>

          {formState.errors.name && (
            <p className="text-red-500 mt-[3px]">
              {formState.errors.name.message}
            </p>
          )}

          <div className="relative">
            <Label htmlFor="comment" className="text-1 text-[11px] mt-[10px]">
              Комментарии
            </Label>
            <Controller
              name="comment"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  className="resize-none w-[398px] bg-[#ffffff]"
                  id="comment"
                  placeholder="Комментарий"
                  maxLength={60}
                  onChange={(e) => {
                    field.onChange(e);
                    changeFn(e);
                  }}
                />
              )}
            />
            <span className="absolute bottom-[5px] right-[15px] ">
              {size}/60
            </span>
          </div>

          <Button
            type="submit"
            className="bg-8 text-3 font-semibold mt-[15px] mb-[10px] w-[398px] h-[43px] rounded-[10px]"
            disabled={
              !!Object.keys(formState.errors).length || updateMutation.isPending
            }
          >
            {updateMutation.isPending ? "Сохранение..." : "Сохранить"}
          </Button>

          <Button
            type="button"
            className="bg-7 text-3 font-semibold mb-[10px] w-[398px] h-[43px] rounded-[10px]"
            onClick={handleDelete}
          >
            Удалить помещение
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PopupsEditRoom;
