import { FC, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@shared/components/ui/button";
import { Dialog, DialogContent } from "@shared/components/ui/dialog";
import { Label } from "@shared/components/ui/label";
import { Input } from "@shared/components/ui/input";
import { Textarea } from "@shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/components/ui/select";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addTables, getTables } from "@shared/api/tables";
import { useModalStore } from "@shared/store";
import { DialogTitle } from "@radix-ui/react-dialog";
import { cn } from "@shared/lib/utils";

interface FormValues {
  number: number;
  count_people: number;
  id: string;
  comment: string;
}

interface PopupsTableProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ITables {
  id: string;
  name: string;
  tables: {
    data: { number: number }[];
  };
}

const PopupsTable: FC<PopupsTableProps> = ({ isOpen, onClose }) => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setError,
    clearErrors,
    formState,
  } = useForm<FormValues>({
    defaultValues: {
      number: 1,
      count_people: 12,
      id: "",
      comment: "",
    },
  });

  const { openSuccess, setSuccessText, resetSuccessText, closeSuccess } =
    useModalStore();

  const { data, refetch } = useQuery<ITables[]>({
    queryKey: ["tables"],
    queryFn: getTables,
  });

  const mutation = useMutation({
    mutationFn: addTables,
    onSuccess: () => {
      setSuccessText("Стол успешно добавлен");
      openSuccess();
      onClose();
      reset();
      refetch();
      setTimeout(() => {
        resetSuccessText();
        closeSuccess();
      }, 1000);
    },
    onError: (error) => {
      console.error("Ошибка при добавлении стола:", error);
    },
  });

  const onSubmit = (data: FormValues) => {
    mutation.mutate({
      number: data.number,
      count_people: +data.count_people,
      room_id: data.id,
      comment: data.comment,
    });
  };

  const number = watch("number");
  const count_people = watch("count_people");
  const room_id = watch("id");

  const isDisabled = !number || !count_people || !room_id;

  useEffect(() => {
    if (room_id) {
      const currentTables = data?.find((room) => room.id === room_id)?.tables
        ?.data;

      if (currentTables?.length && number) {
        const tables: string[] = [];

        currentTables.forEach((table) => {
          tables.push(table.number.toString());
        });

        const isValid = !tables.includes(number.toString());

        if (!isValid) {
          setError("number", {
            message: "Стол с таким номером уже существует",
          });
        } else {
          clearErrors("number");
        }
      } else {
        clearErrors("number");
      }
    }
  }, [room_id, number]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[452px]">
        <DialogTitle></DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <p className="font-semibold text-1 text-center text-xl">
            Добавить cтол
          </p>

          <div className="flex gap-[15px]">
            <div>
              <Label htmlFor="tableNumber" className="text-1 text-[11px]">
                Номер стола
              </Label>
              <Controller
                name="number"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="tableNumber"
                    className={cn(
                      "w-[194px] rounded-[10px] bg-[#ffffff]",
                      formState.errors.number ? "border-red-500" : ""
                    )}
                    placeholder="1"
                  />
                )}
              />
            </div>

            <div>
              <Label htmlFor="numberOfPeople" className="text-1 text-[11px]">
                Кол-во человек
              </Label>
              <Controller
                name="count_people"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="numberOfPeople"
                    className="w-[194px] rounded-[10px] bg-[#ffffff] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="12"
                    type="number"
                    onKeyDown={(e) => {
                      if (["+", "-", "e", "E"].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                )}
              />
            </div>
          </div>
          {formState.errors.number && (
            <p className="text-red-500 mt-[3px]">
              {formState.errors.number.message}
            </p>
          )}

          <Label htmlFor="room" className="text-1 text-[11px]">
            Помещение
          </Label>
          <Controller
            name="id"
            control={control}
            render={({ field }) => (
              <Select
                value={String(field.value)}
                onValueChange={(value) => field.onChange(value)}
              >
                <SelectTrigger className="w-[398px] bg-[#ffffff]" id="room">
                  <SelectValue placeholder="Выберите помещение" />
                </SelectTrigger>
                <SelectContent className="rounded-[10px] bg-white">
                  {data?.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

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
              />
            )}
          />

          <Button
            type="submit"
            className="bg-8 text-3 font-semibold mt-[15px] w-[398px] h-[43px] rounded-[10px]"
            disabled={
              !!Object.keys(formState.errors).length ||
              isDisabled ||
              mutation.isPending
            }
          >
            {mutation.isPending ? "Сохранение..." : "Сохранить"}
          </Button>
        </form>
        <Button
          className="bg-7 text-3 font-semibold mb-[10px] w-[398px] h-[43px] rounded-[10px]"
          onClick={onClose}
        >
          Отмена
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default PopupsTable;
