import { ChangeEvent, FC, useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@shared/components/ui/button";
import { Dialog, DialogContent } from "@shared/components/ui/dialog";
import { Label } from "@shared/components/ui/label";
import { Input } from "@shared/components/ui/input";
import { Textarea } from "@shared/components/ui/textarea";
import { addRooms } from "@shared/api/rooms";
import { useModalStore } from "@shared/store";
import { getTables } from "@shared/api/tables";
import { cn } from "@shared/lib/utils";

interface PopupsRoomProps {
  isOpen: boolean;
  onClose: () => void;
  refetchTables: () => void;
}

interface FormValues {
  name: string;
  comment: string;
}

interface ITables {
  id: string;
  name: string;
  tables: {
    data: { number: number }[];
  };
}

const PopupsRoom: FC<PopupsRoomProps> = ({
  isOpen,
  onClose,
  refetchTables,
}) => {
  const {
    control,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      comment: "",
    },
  });

  const { data } = useQuery<ITables[]>({
    queryKey: ["tables"],
    queryFn: getTables,
  });

  const roomName = watch("name");

  useEffect(() => {
    if (roomName) {
      const rooms = data?.map((item) => item.name);

      const isValid = !rooms?.includes(roomName);

      if (!isValid) {
        setError("name", {
          message: "Помещение с таким названием уже существует",
        });
      } else {
        clearErrors("name");
      }
    }
  }, [roomName]);

  const mutation = useMutation({
    mutationFn: addRooms,
    onSuccess: () => {
      setSuccessText("Помещение успешно добавлено");
      openSuccess();
      refetchTables();
      onClose();
      setTimeout(() => {
        resetSuccessText();
        closeSuccess();
      }, 1000);
    },
    onError: (error) => {
      console.error("Ошибка при добавлении помещения:", error);
      setErrorText("Ошибка при добавлении помещения");
      openError();
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const newData = {
      ...data,
      restaurant_id: "jR",
    };

    mutation.mutate(newData);
  };

  const {
    openSuccess,
    setSuccessText,
    openError,
    setErrorText,
    closeSuccess,
    resetSuccessText,
  } = useModalStore();

  const [size, setSize] = useState(0);

  const changeFn = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setSize(e.target.value.length);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[452px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <p className="font-semibold text-1 text-center text-xl">
              Добавить помещение
            </p>

            <div>
              <Label htmlFor="room" className="text-1 text-[11px]">
                Название помещения
              </Label>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                rules={{ required: "Это поле обязательно" }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="room"
                    className={cn(
                      "w-[398px] rounded-[10px] bg-[#ffffff]",
                      errors?.name ? "border-red-500" : ""
                    )}
                    placeholder="Балкон"
                  />
                )}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="mt-[10px] relative">
              <Label htmlFor="comment" className="text-1 text-[11px]">
                Комментарий
              </Label>
              <Controller
                name="comment"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Textarea
                    {...field}
                    id="comment"
                    className="resize-none w-[398px] bg-[#ffffff]"
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
              className="bg-8 text-[#FFFFFF] font-semibold mt-[15px] mb-[10px] w-[398px] h-[47px] rounded-[10px]"
              disabled={
                !!Object.keys(errors).length ||
                mutation.isPending ||
                !roomName?.trim().length
              }
            >
              {mutation.isPending ? "Сохранение..." : "Сохранить"}
            </Button>

            {mutation.isError && (
              <p className="text-red-500 text-xs mt-2">
                Ошибка при сохранении данных
              </p>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PopupsRoom;
