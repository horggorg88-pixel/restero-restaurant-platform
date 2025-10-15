import { zodResolver } from "@hookform/resolvers/zod";
import { updateRestaurant } from "@shared/api/admin";
import { Button } from "@shared/components/ui/button";
import { Dialog, DialogContent } from "@shared/components/ui/dialog";
import { Input } from "@shared/components/ui/input";
import { cn } from "@shared/lib/utils";
import { useModalStore } from "@shared/store";
import TimePicker from "@widgets/TimePicker";
import { FC, useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import ArrowTime from "@assets/icons/timer_arrow.svg";
import { DialogTitle } from "@radix-ui/react-dialog";
import InputTime from "@widgets/InputTime";

export type IOldParams = {
  end_time: string;
  name: string;
  start_time: string;
  id: string;
};

export type RestParams = Omit<IOldParams, "id">;

interface IEditRestProps {
  isOpen: boolean;
  onClose: () => void;
  oldParams: IOldParams;
}

export const editSchema = z.object({
  name: z.string().min(1, "Введите название"),
  start_time: z.string().min(1, "формат 10:00"),
  end_time: z.string().min(1, "формат 10:00"),
});

const EditRestaurant: FC<IEditRestProps> = ({ isOpen, onClose, oldParams }) => {
  const { closeEditRestaurant } = useModalStore();

  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showTimePickerEnd, setShowTimePickerEnd] = useState(false);
  const [selectedTime, setSelectedTime] = useState({ hour: 10, minute: 0 });
  const [selectedTimeEnd, setSelectedTimeEnd] = useState({
    hour: 10,
    minute: 0,
  });

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<RestParams>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      name: oldParams?.name,
      start_time: oldParams?.start_time,
      end_time: oldParams?.end_time,
    },
    mode: "all",
  });

  const { id, end_time, start_time, name: initialName } = oldParams;

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(initialName);

    if (start_time) {
      const [hour, minute] = start_time.slice(0, 5).split(":").map(Number);

      setValue("start_time", start_time.slice(0, 5), {
        shouldValidate: true,
      });
      setSelectedTime({ hour, minute });
    }

    if (end_time) {
      const [hour, minute] = end_time.slice(0, 5).split(":").map(Number);

      setValue("end_time", end_time.slice(0, 5), {
        shouldValidate: true,
      });
      setSelectedTimeEnd({ hour, minute });
    }

    if (name) {
      setValue("name", name, {
        shouldValidate: true,
      });
    }
  }, [isOpen, start_time, end_time, name]);

  // const isStartTimeBeforeEndTime = () => {
  //   const startTotalMinutes = selectedTime.hour * 60 + selectedTime.minute;
  //   const endTotalMinutes = selectedTimeEnd.hour * 60 + selectedTimeEnd.minute;

  //   if (selectedTime.hour === 0 && selectedTime.minute === 0) {
  //     return false;
  //   }

  //   if (selectedTimeEnd.hour === 0 && selectedTimeEnd.minute === 0) {
  //     return startTotalMinutes !== endTotalMinutes;
  //   }

  //   return (
  //     startTotalMinutes < endTotalMinutes &&
  //     startTotalMinutes !== endTotalMinutes
  //   );
  // };

  const handleTimeSelect = (hour: number, minute: number) => {
    setSelectedTime({ hour, minute });
    setShowTimePicker(false);
    const bookingTime = `${String(hour).padStart(2, "0")}:${String(
      minute
    ).padStart(2, "0")}`;
    setValue("start_time", bookingTime);
  };

  const handleTimeSelectEnd = (hour: number, minute: number) => {
    setSelectedTimeEnd({ hour, minute });
    setShowTimePickerEnd(false);
    const bookingTime = `${String(hour).padStart(2, "0")}:${String(
      minute
    ).padStart(2, "0")}`;
    setValue("end_time", bookingTime);
  };

  const onSubmit: SubmitHandler<RestParams> = async () => {
    handleUpdateRest();
  };

  const handleUpdateRest = async () => {
    const params = getValues();

    try {
      setLoading(true);
      await updateRestaurant(id, params);
      closeEditRestaurant();
      location.reload();
    } catch (error) {
      console.error("Ошибка при обновлении ресторана:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowTimePicker(false);
    setShowTimePickerEnd(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[395px]">
        <DialogTitle></DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <h3 className="mb-[25px]">Редактирование ресторана</h3>

            <div className="mb-4 text-left">
              <label className="block text-sm font-medium mb-1" htmlFor="name">
                Название ресторана
              </label>
              <div className="relative">
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Название ресторана"
                      className={cn(
                        "w-full box-border bg-white font-semibold text-base",
                        errors.name?.message ? "border-red-500" : ""
                      )}
                    />
                  )}
                />
              </div>
              <div>
                {errors.name && (
                  <p className="text-red-500">{errors.name.message}</p>
                )}
              </div>
            </div>

            <div className="relative">
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="start_time"
              >
                Начало работы
              </label>
            </div>
            <div className="relative">
              <Controller
                name="start_time"
                control={control}
                render={({ field }) => (
                  <InputTime
                    wfull
                    {...field}
                    bookingTime={getValues().start_time}
                    onTimeSelect={handleTimeSelect}
                    //@ts-ignore
                    setValue={setValue}
                    field="booking_time"
                  />
                )}
              />
              {showTimePicker && (
                <div className="absolute right-[3.5%] bottom-[-180px] z-50 shadow-lightGray">
                  <TimePicker
                    initialHour={selectedTime.hour}
                    initialMinute={selectedTime.minute}
                    onTimeSelect={handleTimeSelect}
                  />
                </div>
              )}
              {
                <ArrowTime className="absolute right-[12px] top-[50%] translate-y-[-50%]" />
              }
            </div>
            <div>
              {errors.start_time && (
                <p className="text-red-500">{errors.start_time.message}</p>
              )}
            </div>

            <div className="relative">
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="end_time"
              >
                Конец работы
              </label>
              <div className="relative">
                <Controller
                  name="end_time"
                  control={control}
                  render={({ field }) => (
                    <InputTime
                      wfull
                      {...field}
                      bookingTime={getValues().end_time}
                      onTimeSelect={handleTimeSelectEnd}
                      //@ts-ignore
                      setValue={setValue}
                      field="booking_time"
                    />
                  )}
                />
                {showTimePickerEnd && (
                  <div className="absolute right-[3.5%] bottom-[-130px] z-50 shadow-lightGray">
                    <TimePicker
                      initialHour={selectedTimeEnd.hour}
                      initialMinute={selectedTimeEnd.minute}
                      onTimeSelect={handleTimeSelectEnd}
                    />
                  </div>
                )}
                {
                  <ArrowTime className="absolute right-[12px] top-[50%] translate-y-[-50%]" />
                }
              </div>
              <div>
                {errors.end_time && (
                  <p className="text-red-500">{errors.end_time.message}</p>
                )}
              </div>
            </div>

            <div className="mt-[30px]">
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {loading ? "Сохранение..." : "Сохранить"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditRestaurant;
