import { DialogTitle } from "@radix-ui/react-dialog";
import { getTables, updateTables } from "@shared/api/tables";
import { Button } from "@shared/components/ui/button";
import { Dialog, DialogContent } from "@shared/components/ui/dialog";
import { Input } from "@shared/components/ui/input";
import { Label } from "@shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/components/ui/select";
import { cn } from "@shared/lib/utils";
import { useModalStore } from "@shared/store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FC, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

interface PopupsEditTableProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTableId: string;
  selectedRoomId?: string;
  initialValues: InitialValues;
}

interface FormValues {
  number: number;
  count_people: number;
  id: string;
  comment: string;
  restaurant: string;
}

interface ITable {
  number: number;
  count_people: number;
  id: string;
  comment: string;
  name: string;
  restaurant: {
    data: {
      id: string;
    };
  };
  tables: {
    data: { number: number }[];
  };
}

interface InitialValues {
  number: number;
  count_people: number;
  id: string;
  comment: string;
  room_id?: string;
}

const PopupsEditTable: FC<PopupsEditTableProps> = ({
  isOpen,
  onClose,
  selectedTableId,
  selectedRoomId,
  initialValues,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState,
    setError,
    clearErrors,
  } = useForm<FormValues>({});
  const {
    openSuccess,
    setSuccessText,
    setErrorText,
    openError,
    closeSuccess,
    resetSuccessText,
    openDelete,
  } = useModalStore();

  const { data: tablesData = [], refetch } = useQuery<ITable[]>({
    queryKey: ["tables"],
    queryFn: getTables,
  });

  const number = watch("number");
  const roomId = watch("id");

  const requiredFields = watch(["number", "count_people", "id"]);

  useEffect(() => {
    if (tablesData && selectedRoomId) {
      const table = tablesData.find((item) => item.id === selectedRoomId);

      if (table) {
        setValue("number", table.number);
        setValue("count_people", table.count_people);
        setValue("id", table.id);
        setValue("comment", table.comment);
        setValue("restaurant", table.id);
      }
    }
  }, [tablesData, selectedTableId, setValue]);

  useEffect(() => {
    if (initialValues) {
      setValue("comment", initialValues.comment);
      setValue("count_people", +initialValues.count_people);
      setValue("number", initialValues.number);

      const table = tablesData?.find(
        (item) => item.id === initialValues.room_id
      );

      if (table) {
        setValue("id", table.id);
      }
    }
  }, [initialValues]);

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Omit<FormValues, "id" | "restaurant"> & { room_id: string };
    }) => updateTables(id, payload),
    onSuccess: () => {
      setSuccessText("Стол успешно обновлен");
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
      console.error("Ошибка при обновлении стола:", error);
      setErrorText("Ошибка при обновлении стола");
      openError();
    },
  });

  useEffect(() => {
    if (number && roomId && tablesData) {
      const currentTables =
        tablesData
          .find((room) => room.id === roomId)
          ?.tables.data.map((table) => table.number.toString()) || [];

      const isDuplicate = currentTables.includes(number.toString());

      const isSameAsInitial =
        number == initialValues.number && roomId === initialValues.room_id;

      if (isDuplicate && !isSameAsInitial) {
        setError("number", {
          message: "Стол с таким номером уже существует",
        });
      } else {
        clearErrors("number");
      }
    }
  }, [number, roomId, tablesData, initialValues]);

  const onSubmit = (data: FormValues) => {
    updateMutation.mutate({
      id: selectedTableId,
      payload: {
        number: data.number,
        count_people: data.count_people,
        comment: data.comment,
        room_id: data.id,
      },
    });
  };

  const isSaveDisabled =
    !!Object.keys(formState.errors).length ||
    updateMutation.isPending ||
    requiredFields.some((field) => !field);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[452px]">
        <DialogTitle></DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <p className="font-semibold text-1 text-center text-xl">
            Редактировать стол
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
                value={field.value}
                onValueChange={(value) => field.onChange(value)}
              >
                <SelectTrigger className="w-[398px] bg-[#ffffff]" id="room">
                  <SelectValue placeholder="Выберите комнату" />
                </SelectTrigger>
                <SelectContent className="rounded-[10px] bg-white">
                  {tablesData?.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.number} {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          <Label
            htmlFor="comment"
            className="text-1 text-[11px] mt-[10px] w-[398px]"
          >
            Комментарии
          </Label>
          <Controller
            name="comment"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                className="resize-none bg-[#ffffff]"
                id="comment"
              />
            )}
          />

          <Button
            type="submit"
            className="bg-8 text-3 font-semibold mt-[15px] mb-[10px] w-[398px] h-[43px] rounded-[10px]"
            disabled={isSaveDisabled}
          >
            {updateMutation.isPending ? "Сохранение..." : "Сохранить"}
          </Button>

          <Button
            type="button"
            className="bg-7 text-3 font-semibold mb-[10px] w-[398px] h-[43px] rounded-[10px]"
            onClick={openDelete}
          >
            Удалить стол
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PopupsEditTable;
