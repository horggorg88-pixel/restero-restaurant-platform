import { useState, useEffect, FC, useRef } from "react";
import { Dialog, DialogContent } from "@shared/components/ui/dialog";
import { Button } from "@shared/components/ui/button";
import { DatePicker } from "@shared/components/ui/datepicker";
import { Input } from "@shared/components/ui/input";
import { CustomSelect } from "@pages/Database/components/Select";
import { Spinner } from "@shared/components/ui/Spinner";
import {
  repeatReservation,
  getAvailableRooms,
  addedReservation,
  editBooking,
  getCurrentUser,
  updateBookingStatus
} from "@shared/api/bookinglist";
import { IRepeatReservation } from "@shared/api/types/bookinglist";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { useQuery } from "@tanstack/react-query";
import {
  useForm,
  Controller,
  SubmitHandler,
  FieldErrors,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Phone from "@assets/icons/phone.svg";
import Time from "@assets/icons/time.svg";
import Person from "@assets/icons/person.svg";
import Persons from "@assets/icons/persons.svg";
import { useModalStore } from "@shared/store";
import { calculateBookingTime } from "@shared/utils/calculateBookingTime";
import ArrowTime from "@assets/icons/timer_arrow.svg";
import { addTime } from "@shared/utils/addTime";
import { convertDateToDatepickerFormat } from "@shared/utils/convertDateToDatepickerFormat";
import { IRooms, PopupAddBookingProps } from "./types";
import { bookingSchema } from "./contants/bookingSchema";
import { getFreeTables } from "@shared/api/rooms";
import { cn } from "@shared/lib/utils";
import { getIntWorkingTime } from "@shared/utils/getIntWorkingTime";
import { getDatabaseData } from "@shared/api/database";
import { DialogTitle } from "@radix-ui/react-dialog";
import { isTimePassed } from "@shared/utils/isTimePassed";
import { parseTime } from "@shared/utils/setTimeValues";
import InputTime from "@widgets/InputTime";
import { MultiSelect } from "@shared/components/MultiSelect";
import { convertToValidFormat } from "@shared/utils/convertToValidFormat";

interface IErrorProps {
  errors: FieldErrors<IRepeatReservation>;
  userInfo?: boolean
}

const InvalidField: FC<IErrorProps> = ({ errors, userInfo }) => {
  const { booking_time, count_booking_time, count_people } = errors;

  if (userInfo) {
    const { client_phone, client_name } = errors;
    return <div className="text-red-500 text-left h-[24px]">
      {client_phone?.message || client_name?.message}
    </div>
  }

  return (
    <div className="text-red-500 text-left h-[24px]">
      {booking_time?.message ||
        count_booking_time?.message ||
        count_people?.message}
    </div>
  );
};

const PopupAddBooking: FC<PopupAddBookingProps> = ({
  isAdd = false,
  isOpen,
  onClose,
  bookingData,
  refetch,
}) => {
  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });

  const {
    openSuccess,
    setSuccessText,
    closeEdit,
    setErrorText,
    openError,
    closeSuccess,
    resetSuccessText,
    isEmpty,
    resetEmpty,
    openCancelReservation,
    openHistory
  } = useModalStore();

  const isEdit = localStorage.getItem('isEdit')

  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [selectedRoom, setSelectedRoom] = useState(bookingData?.room_id || "");
  const [selectedTable, setSelectedTable] = useState(
    bookingData?.table_ids || []
  );

  const [isEditClick, setIsEDitClick] = useState(false)

  const handleTimeSelect = (hour: number, minute: number) => {
    const bookingTime = `${String(hour).padStart(2, "0")}:${String(
      minute
    ).padStart(2, "0")}`;
    setValue("booking_time", bookingTime);

    const { start, end } = getIntWorkingTime(user);
    const startFromPicker = +bookingTime.split(":").join("");
    const amountFromPicker = getValues().count_booking_time
      ? +getValues().count_booking_time.split(":").join("")
      : 0;

    const isCrossMidnight = end < start;

    if (isCrossMidnight) {
      if (startFromPicker >= end && startFromPicker < start) {
        setError("booking_time", {
          message: "Ресторан закрыт",
        });
        return
      } else {
        clearErrors("booking_time");
      }
    } else {
      if (startFromPicker < start || startFromPicker >= end) {
        setError("booking_time", {
          message: "Ресторан закрыт",
        });
      } else {
        clearErrors("booking_time");
      }
    }

    if (amountFromPicker) {
      const totalTime = addTime(startFromPicker, amountFromPicker);

      if (isCrossMidnight) {
        if (totalTime > end && totalTime <= start) {

          setError("count_booking_time", {
            message: "Ресторан закроется",
          });
        } else {
          clearErrors("count_booking_time");
        }
      } else {
        if (totalTime > end) {
          setError("count_booking_time", {
            message: "Ресторан закроется",
          });
        } else {
          clearErrors("count_booking_time");
        }
      }
    }

    const startError = getFieldState("count_booking_time").error;

    if (!startError && amountFromPicker) {
      if (amountFromPicker < 100 || amountFromPicker > 400) {
        setError("count_booking_time", {
          message: "Установите время бронирования от 1 до 4 часов",
        });
      }
    }
  };

  useEffect(() => {
    if (isEdit) {
      clearErrors();
      sessionStorage.removeItem("booking");
    }

    if (
      bookingData &&
      "booking_time_to" in bookingData &&
      bookingData?.booking_time_to
    ) {
      //@ts-ignore

    }
  }, [bookingData, isEdit]);

  const handleTimeCountSelect = (hour: number, minute: number) => {
    setValue(
      "count_booking_time",
      `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
    );

    const { start, end } = getIntWorkingTime(user);

    const startFromPicker = +getValues().booking_time.split(":").join("");
    const amountFromPicker = getValues().count_booking_time
      ? +getValues().count_booking_time.split(":").join("")
      : 0;

    const isCrossMidnight = end < start;
    const totalTime = addTime(startFromPicker, amountFromPicker);

    if (isCrossMidnight) {
      if (getValues("count_booking_time") === "00:00") {
        setError("count_booking_time", {
          message: "Установите время бронирования от 1 до 4 часов",
        });
      } else if (totalTime > end && totalTime <= start) {
        setError("count_booking_time", {
          message: "Ресторан закроется",
        });
      } else {
        clearErrors("count_booking_time");
      }
    } else {
      if (totalTime > end) {
        setError("count_booking_time", {
          message: "Ресторан закроется",
        });
      } else {
        clearErrors("count_booking_time");
      }
    }

    const startError = getFieldState("count_booking_time").error;

    if (!startError && amountFromPicker) {
      if (amountFromPicker < 100 || amountFromPicker > 400) {
        setError("count_booking_time", {
          message: "Установите время бронирования от 1 до 4 часов",
        });
      }
    }
  };

  useEffect(() => {
    if (bookingData) {
      setSelectedRoom(bookingData.room_id);

      let tablesForSelect = [];

      if (bookingData?.composite_tables?.length) {

        bookingData.composite_tables.map((table) => {
          tablesForSelect.push(table.id)
        })

      } else {
        tablesForSelect.push(bookingData.table_id as string);
      }
      setSelectedTable(tablesForSelect)

    }
  }, [bookingData]);

  const { data: rooms = [], isLoading: roomsLoading } = useQuery<IRooms[]>({
    queryKey: ["availableRooms"],
    queryFn: getAvailableRooms,
  });

  const [tables, setTables] = useState([]);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    trigger,
    getValues,
    setError,
    clearErrors,
    getFieldState,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm<IRepeatReservation>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      room_id: bookingData?.room_id,
      table_ids: bookingData?.table_ids,
      comment: bookingData?.comment,
      count_people: bookingData?.count_people,
      client_name: bookingData?.client_name,
      client_phone: bookingData?.client_phone,
      count_booking_time: bookingData?.count_booking_time,
      booking_date: "",
      booking_time: "",
    },
    mode: "all",
  });

  const booking_date = watch("booking_date");
  const booking_time = watch("booking_time");
  const room_id = watch("room_id");
  const count_people = watch("count_people");
  const count_booking_time = watch("count_booking_time");
  const client_phone = watch("client_phone");
  const table_ids = watch("table_ids");
  const comment = watch("comment");
  const client_name = watch("client_name");

  useEffect(() => {
    const checkPhoneAndFetchData = async () => {
      if (client_phone) {
        const isValid = await trigger("client_phone");

        if (isValid && client_phone.length === 12) {
          getDatabaseData({
            limit: 20,
            //@ts-ignore
            query: client_phone.slice(1),
          }).then((res) => {
            const filtred = [
              ...new Set(
                res.data.map((item: IRepeatReservation) => item.client_name)
              ),
            ];

            if (filtred.length) {
              setValue("client_name", filtred[0] as string, {
                shouldValidate: true,
              });
            } else {
              if (isEmpty) {
              }
            }
          });
        }
      }
    };

    checkPhoneAndFetchData();
  }, [client_phone, trigger]);

  useEffect(() => {
    if (bookingData?.client_name) {
      setSelectedRoom(bookingData.room_id);
      setValue("room_id", bookingData.room_id);
      setValue("table_ids", bookingData.table_ids);
      if (isAdd && isEdit) {
        setValue("booking_date", bookingData?.booking_date!, {
          shouldValidate: true,
          shouldTouch: false,
        });
        const validDate = convertDateToDatepickerFormat(
          bookingData?.booking_date!
        );
        //@ts-ignore
        setDateRange(validDate);
      } else {
        if ("hasDate" in bookingData && bookingData.hasDate) {
          setValue("booking_date", bookingData?.booking_date!, {
            shouldValidate: true,
            shouldTouch: false,
          });
          const validDate = convertDateToDatepickerFormat(
            bookingData?.booking_date!
          );
          //@ts-ignore
          setDateRange(validDate);
        } else {
          setDateRange(undefined);
        }
      }
      setValue("comment", bookingData?.comment || "");
      setValue("client_phone", bookingData?.client_phone || "", {
        shouldValidate: !!bookingData?.client_phone,
      });
      setValue("client_name", bookingData?.client_name || "");
      setValue("count_people", bookingData?.count_people.toString() || "1");
      setValue(
        "booking_time",
        //@ts-ignore
        bookingData?.booking_time_from?.split(":")?.slice(0, 2).join(":") ||
        "10:00"
      );

      const t = bookingData?.composite_tables?.map((table) => table.id)

      if (t?.length) {
        setValue('table_ids', t!)
      }

      setValue(
        "count_booking_time",
        //@ts-ignore
        calculateBookingTime(
          //@ts-ignore
          bookingData?.booking_time_from,
          //@ts-ignore
          bookingData?.booking_time_to
        ) || "02:00"
      );
    }
  }, [bookingData, setValue, isEdit]);

  useEffect(() => {
    const t = bookingData?.composite_tables?.map((table) => table.id)
    if (t?.length) {
      setValue('table_ids', t!, {
        shouldValidate: true
      })
      return
    }

    const singleTable = bookingData?.table_id;
    setValue('table_ids', [singleTable!])
  }, [isEdit, bookingData?.composite_tables])

  useEffect(() => {
    if (isEmpty) {
      reset();
      setValue("client_name", "");
      setValue("client_phone", "");
      setValue("count_people", "1");
      setSelectedRoom("");
      setSelectedTable([]);
      setDateRange(undefined);
    }
  }, [isEmpty]);

  const onSubmit: SubmitHandler<IRepeatReservation> = async (data) => {
    try {
      setLoading(true);
      const updatedData = {
        ...data,
        booking_date: dateRange?.from
          ? format(dateRange.from, "yyyy-MM-dd")
          : "",
        table_ids: getValues('table_ids')
      };

      if (isAdd) {
        if (isEdit) {

          if (!isEditClick) {
            setTimeout(() => {
              setIsEDitClick(true);
            }, 300)
            return
          } else {
            setSuccessText("Бронирование успешно обновлено");
            const id = bookingData?.id;
            await editBooking(id!, updatedData);
            closeEdit();
          }



        } else {
          setSuccessText("Бронирование успешно добавлено");
          await addedReservation(updatedData);
        }
      } else {
        if (isEdit) {
          if (!isEditClick) {
            setTimeout(() => {
              setIsEDitClick(true);
            }, 300)
            return
          } else {
            setSuccessText("Бронирование успешно обновлено");
            const id = bookingData?.id;
            await editBooking(id!, updatedData);
            closeEdit();
          }
        } else {
          setSuccessText("Бронирование успешно добавлено");
          await repeatReservation(updatedData, bookingData?.id!);
        }
      }

      refetch();
      reset();

      setSelectedRoom("");
      setSelectedTable([]);
      setDateRange(undefined);
      onClose();
      sessionStorage.removeItem("booking");
      handleClose();
      setIsEDitClick(false);
      openSuccess();
      setTimeout(() => {
        resetSuccessText();
        closeSuccess();
      }, 1000);
    } catch (error) {
      console.error("Ошибка при сохранении бронирования:", error);
      setErrorText("Ошибка при сохранении бронирования");
      openError();
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetEmpty();
    onClose();
    clearErrors();

    if (isEdit) {
      localStorage.removeItem('booking');
      // setSelectedTable([]);
      setIsEDitClick(false);
    }

    localStorage.removeItem('isEdit');
  };

  useEffect(() => {
    const {
      booking_date,
      booking_time,
      count_booking_time,
      count_people,
      room_id,
    } = getValues();

    if (
      booking_date &&
      booking_time &&
      count_booking_time &&
      count_people &&
      room_id
    ) {
      const params = {
        booking_date,
        room_id,
        count_people: +count_people,
        count_booking_time,
        booking_time,
      };

      getFreeTables(
        bookingData?.id
          ? { ...params, booking_id: bookingData.id }
          : params
      ).then((res) => {
        if (!res.data || res.data.length === 0) {
          setTables([]);
        } else {
          const sortedTables = res.data.sort((a, b) => a.number - b.number);
          //@ts-ignore
          setTables(sortedTables);

        }
      });
    }
  }, [
    booking_date,
    room_id,
    count_people,
    count_booking_time,
    booking_time,
    isOpen,
  ]);

  const [dataForSave, setDataForSave] = useState(getValues());

  useEffect(() => {
    setDataForSave(getValues());
  }, [
    booking_date,
    room_id,
    count_people,
    count_booking_time,
    booking_time,
    client_phone,
    comment,
    client_name,
    table_ids,
  ]);

  useEffect(() => {
    if (isOpen && !isEdit) {
      const savedData = sessionStorage.getItem("booking");
      const parsed =
        savedData && savedData !== "undefined" ? JSON.parse(savedData) : {};

      const {
        booking_date = format(new Date(), "yyyy-MM-dd"),
        count_people,
        client_name,
        client_phone,
        comment,
        booking_time,
        count_booking_time,
        table_ids,
        room_id,
      } = parsed;

      room_id && (setValue("room_id", room_id), setSelectedRoom(room_id));
      count_people && setValue("count_people", count_people);
      client_name && setValue("client_name", client_name);
      client_phone && setValue("client_phone", client_phone);
      comment && setValue("comment", comment);
      table_ids && (setValue("table_ids", table_ids));
      setSelectedTable(table_ids);

      const parsedBookingTime = parseTime(booking_time);
      setValue(
        "booking_time",
        booking_time ||
        `${parsedBookingTime.hour}:${String(
          parsedBookingTime.minute
        ).padStart(2, "0")}`
      );

      const { hour, minute } = parsedBookingTime;

      handleTimeSelect(hour, minute);

      if (count_booking_time) {
        setValue("count_booking_time", count_booking_time);

        const parsedBookingCountTime = parseTime(count_booking_time);
        const { hour: hourCount, minute: mimuteCount } = parsedBookingCountTime;

        setTimeout(() => {
          handleTimeCountSelect(hourCount, mimuteCount);
        }, 0);
      } else {
        setValue("count_booking_time", "02:00");
        setTimeout(() => {
          handleTimeCountSelect(2, 0);
        }, 0);
      }
      const formattedDate = convertDateToDatepickerFormat(booking_date);
      setValue("booking_date", booking_date, { shouldValidate: true });
      //@ts-ignore
      setDateRange(formattedDate);
    }
  }, [isOpen]);

  useEffect(() => {
    if (booking_date && booking_time && dateRange?.from) {

      const isSameDate =
        format(dateRange.from, "yyyy-MM-dd") ===
        format(new Date(), "yyyy-MM-dd");

      const isPassed = isTimePassed(
        getValues("booking_time"),
        format(new Date(), "HH:mm")
      );

      if (isSameDate && isPassed) {
        setError("booking_time", {
          message: "Некорректное время начала бронирования",
        });
      } else {
        const err = errors.booking_time;
        if (
          err?.message &&
          err.message === "Некорректное время начала бронирования"
        ) {

          clearErrors("booking_time");
        }
        if (user) {
          const { start, end } = getIntWorkingTime(user);
          const isCrossMidnight = end < start;
          const startFromPicker = getValues("booking_time")
            ?.split(":")
            .join("");

          if (startFromPicker && +startFromPicker < start) {
            if (isCrossMidnight) {
            } else {
              setError("booking_time", {
                message: "Ресторан закрыт",
              });
            }
          }
        }
      }
    }
  }, [booking_date, booking_time]);

  useEffect(() => {
    window.addEventListener("beforeunload", () => {
      sessionStorage.removeItem("booking");
    });
    return () =>
      window.removeEventListener("beforeunload", () => {
        sessionStorage.removeItem("booking");
      });
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      (e.target as HTMLInputElement).blur();
    }
  };

  const formRef = useRef(null);

  const handleTouchOutside = (event: TouchEvent | MouseEvent) => {
    //@ts-ignore
    if (isOpen && formRef.current && !formRef.current.contains(event.target as Node)) {
      (document.activeElement as HTMLElement | null)?.blur();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('touchstart', handleTouchOutside);
      document.addEventListener('click', handleTouchOutside);
    } else {
      document.removeEventListener('touchstart', handleTouchOutside);
      document.removeEventListener('click', handleTouchOutside);
    }

    return () => {
      document.removeEventListener('touchstart', handleTouchOutside);
      document.removeEventListener('click', handleTouchOutside);
    };
  }, [isOpen]);


  const handleCancelBooking = () => {
    openCancelReservation();
  };

  const handleSelectTables = (value: string[]) => {
    setValue('table_ids', value, {
      shouldValidate: true
    })
  }

  const handleUpdateStatus = async (id: string, status: number) => {
    const data = {
      status
    }

    await updateBookingStatus(id, data);
    refetch();
    onClose();
    localStorage.removeItem('isEdit');
    localStorage.removeItem('booking');
    setSelectedTable([])
  }

  const hanleChangeCount = () => {
    if (selectedTable?.length === 1) {
      //@ts-ignore
      const t = tables?.find((table) => table.id === selectedTable[0]);
      //@ts-ignore
      if (+count_people > +t?.count_people) {
        setError('count_people', {
          message: 'Количество гостей превышает допустимое',
          type: "validate"
        });
      } else {
        clearErrors('count_people');
      }
    } else {
      clearErrors('count_people');
    }
  }

  useEffect(() => {
    if (selectedTable?.length === 1) {
      //@ts-ignore
      const t = tables?.find((table) => table.id === selectedTable[0]);
      //@ts-ignore
      if (+count_people > +t?.count_people) {
        setError('count_people', {
          message: 'Количество гостей превышает допустимое',
          type: "validate"
        });
      } else {
        clearErrors('count_people');
      }
    } else {
      clearErrors('count_people');
    }
  }, [selectedTable, count_people, tables, setError, clearErrors]);

  useEffect(() => {
    if (isEdit && (bookingData?.status === 1 || bookingData?.status === 2)) {
      clearErrors()
    }
  }, [bookingData?.status, isEdit])

  const savedData = sessionStorage.getItem("booking");
  const parsed =
    savedData && savedData !== "undefined" ? JSON.parse(savedData) : {};

  //@ts-ignore
  const { client_phone: phoneNumber } = parsed;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose} >
      <DialogContent
        data={dataForSave}
        className="w-[678px] max-w-full mx-auto p-[30px] box-border text-center overflow-scroll"
      >
        {/* @ts-ignore */}
        <form ref={formRef} onTouchStart={handleTouchOutside} onClick={handleTouchOutside} onSubmit={handleSubmit(onSubmit)} onKeyDown={handleKeyDown} >
          <div>
            <DialogTitle>
              <p className="font-semibold text-xl mb-2">Бронирование</p>
            </DialogTitle>

            {isEdit && bookingData?.status !== 1 && <p style={{ textAlign: "left", marginBottom: '5px', marginLeft: '5px', fontSize: '14px', fontWeight: '500' }}>Статус брони</p>}
            {isEdit && bookingData?.status !== 1 && <div className="status-tabs">
              <div onClick={() => handleUpdateStatus(bookingData?.id!, 0)} className={`status-tab ${bookingData?.status === 0 ? 'tabActive' : ''}`}>Запланирован</div>
              <div onClick={() => handleUpdateStatus(bookingData?.id!, 3)} className={`status-tab ${bookingData?.status === 3 ? 'tabActive' : ''}`}>Исполняется</div>
              <div onClick={() => handleUpdateStatus(bookingData?.id!, 2)} className={`status-tab ${bookingData?.status === 2 ? 'tabActive' : ''}`}>Завершен</div>
            </div>}

            <div className="flex space-x-2 text-left">


              <div className="text-left w-1/4">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="booking_date"
                >
                  Дата брони <span className="text-[red]">*</span>
                </label>
                <Controller
                  name="booking_date"
                  control={control}
                  render={
                    (/* { field } */) => (
                      <DatePicker
                        disabled={isEdit ? !isEditClick : false}
                        onlyFresh={true}
                        selectedRange={dateRange}
                        setSelectedRange={(range) => {
                          setDateRange(range);
                          setValue(
                            "booking_date",
                            range?.from ? format(range.from, "yyyy-MM-dd") : ""
                          );
                          trigger("booking_date");
                        }}
                        mode="single"
                        width="100%"
                        bgColor={true}
                        radius="5px"
                      />
                    )
                  }
                />
                {errors.booking_date && (
                  <p className="text-red-500">{errors.booking_date.message}</p>
                )}
              </div>

              <div className="w-1/4 w-1/4 flex flex-col justify-end">
                <label
                  className="block text-[12px] font-medium mb-1"
                  htmlFor="booking_time"
                >
                  Старт брони <span className="text-[red]">*</span>
                </label>
                <div className="relative">

                  {getValues().booking_time && <Controller
                    name="booking_time"
                    control={control}
                    render={({ field }) => (
                      <InputTime
                        disabled={isEdit ? !isEditClick : false}
                        {...field}
                        bookingTime={getValues().booking_time}
                        onTimeSelect={handleTimeSelect}
                        setValue={setValue}
                        field="booking_time"
                        isError={errors.booking_time?.message}

                      />
                    )}
                  />}
                  <Time className="absolute right-[12px] top-[50%] translate-y-[-50%]" />
                </div>
              </div>

              <div className="w-1/4 flex flex-col justify-end">
                <label
                  className="block text-[12px] font-medium mb-1"
                  htmlFor="count_booking_time"
                >
                  Кол-во чвсов <span className="text-[red]">*</span>
                </label>
                <div className="relative">
                  {getValues().count_booking_time && <Controller
                    name="count_booking_time"
                    control={control}
                    render={({ field }) => (
                      <InputTime
                        disabled={isEdit ? !isEditClick : false}
                        {...field}
                        bookingTime={getValues().count_booking_time}
                        onTimeSelect={handleTimeCountSelect}
                        isError={errors.count_booking_time?.message}
                        setValue={setValue}
                        field="count_booking_time"
                      />
                    )}
                  />}
                  {
                    <ArrowTime className="absolute right-[12px] top-[50%] translate-y-[-50%]" />
                  }
                </div>
              </div>

              <div className="w-1/4 flex flex-col justify-end">
                <label
                  className="block text-[12px] font-medium mb-1"
                  htmlFor="count_people"
                >
                  Число гостей <span className="text-[red]">*</span>
                </label>
                <div className="relative">
                  <Controller
                    name="count_people"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        className={cn(
                          "w-full box-border bg-white font-semibold text-base",
                          errors.count_people?.message ? "border-red-500" : ""
                        )}
                        placeholder="1"
                        type="number"
                        min={1}
                        disabled={isEdit ? !isEditClick : !booking_date}
                        onKeyDown={(e) => {
                          if (["+", "-", "e", "E"].includes(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        onBlur={hanleChangeCount}
                      />
                    )}
                  />
                  <Persons className="absolute right-[12px] top-[50%] translate-y-[-50%]" />
                </div>
              </div>
            </div>
            <InvalidField errors={errors} />

            <div className="flex space-x-2 mb-4 text-left">
              <div className="w-full">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="room_id"
                >
                  Зал <span className="text-[red]">*</span>
                </label>
                {roomsLoading ? (
                  <Spinner />
                ) : (
                  <Controller
                    name="room_id"
                    control={control}
                    render={
                      (/* { field } */) => (
                        <CustomSelect
                          items={rooms.map((room) => ({
                            value: room.id,
                            label: room.name,
                          }))}
                          value={selectedRoom}
                          onChange={(value) => {
                            setSelectedRoom(value);
                            setSelectedTable([]);
                            setValue("room_id", value);
                            setValue("table_ids", []);

                          }}
                          width="178px"
                          bgColor={true}
                          disabled={isEdit ? !isEditClick : !booking_date}
                          key={11}
                        />
                      )
                    }
                  />
                )}
                {errors.room_id && (
                  <p className="text-red-500">{errors.room_id.message}</p>
                )}
              </div>

              <div className="w-full">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="table_ids"
                >
                  Номер стола <span className="text-[red]">*</span>
                </label>
                <Controller
                  name="table_ids"
                  control={control}
                  render={
                    (/* { field } */) => (
                      <MultiSelect
                        disabled={isEdit ? !isEditClick : getValues('room_id') ? false : true}
                        options={tables.map(
                          (table: { id: string; number: number }) => ({
                            value: table.number.toString(),
                            label: `Стол ${table.number}`,
                            id: table.id
                          })
                        )}
                        onChange={handleSelectTables}
                        value={selectedTable}
                        setSelectedTable={setSelectedTable}
                      />
                    )
                  }
                />
                <div className="h-[1px]">
                  {errors.table_ids && (
                    <p className="text-red-500">{errors.table_ids.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex space-x-2 text-left">
              <div className="text-left w-1/2">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="client_phone"
                >
                  Телефон гостя <span className="text-[red]">*</span>
                </label>
                <div className="relative">
                  <Controller
                    name="client_phone"
                    control={control}
                    render={({ field }) => (
                      <Input
                        mask="+79999999999"
                        maskChar=""
                        placeholder="+79126450818"
                        className={cn(
                          "w-full box-border bg-white font-semibold text-base",
                          errors.client_phone?.message ? "border-red-500" : ""
                        )}
                        disabled={isEdit ? !isEditClick : !isEdit && !table_ids?.length}
                        isFocused={false}
                        {...field}
                        value={field.value || (isEdit ? getValues('client_phone') : phoneNumber ? phoneNumber : '')}
                      />
                    )}
                  />
                  <Phone className="absolute right-[12px] top-[50%] translate-y-[-50%]" />
                </div>
              </div>

              <div className="text-left w-1/2">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="client_name"
                >
                  ФИО гостя <span className="text-[red]">*</span>
                </label>
                <div className="relative">
                  <Controller
                    name="client_name"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="ФИО гостя"
                        className={cn(
                          "w-full box-border bg-white font-semibold text-base",
                          errors.client_name?.message ? "border-red-500" : ""
                        )}
                        disabled={isEdit ? !isEditClick : !isEdit && !client_phone || !table_ids?.length}
                      />
                    )}
                  />
                  <Person className="absolute right-[12px] top-[50%] translate-y-[-50%]" />
                </div>
              </div>
            </div>

            <InvalidField userInfo errors={errors} />

            <div className="mb-2 text-left">
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="comment"
              >
                Комментарий
              </label>
              <Controller
                name="comment"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Нужен стульчик для ребенка"
                    className="w-full box-border bg-white min-h-10 h-[68px] font-semibold text-base"
                    disabled={isEdit ? !isEditClick : !isEdit && !client_phone || !table_ids?.length}
                  />
                )}
              />
            </div>

            {
              !isEdit ? <Button
                className="bg-8 text-3 font-semibold mt-[5px]  w-full h-[41px]"
                type="submit"
                disabled={
                  !!Object.keys(errors).length ||
                  !isValid ||
                  isSubmitting ||
                  loading
                }
              >
                {loading ? <Spinner /> : "Сохранить"}
              </Button> : bookingData?.status !== 1 ? <div className="flex space-x-2">
                <Button
                  onClick={handleCancelBooking}
                  type="button"
                  className="bg-[#C86162] text-3 font-semibold mt-[5px]  w-full h-[41px]"
                >
                  Отменить бронь
                </Button>
                <Button
                  disabled={isSubmitting}
                  className="bg-[#FBAA4B] text-3 font-semibold mt-[5px]  w-full h-[41px]"
                >
                  {isEditClick ? 'Сохранить изменения' : 'Редактировать бронь'}
                </Button>
              </div> : <></>
            }

            {
              isEdit && <div className="flex gap-[10px] justify-center text-[14px] my-[12px]">
                {/* @ts-ignore */}
                <p>{bookingData?.administrator?.name}</p>
                {/* @ts-ignore */}
                <p> {convertToValidFormat(bookingData?.created_at?.split(" ")).join(
                  " "
                )}</p>
              </div>
            }

            {
              isEdit && <p onClick={openHistory} style={{ color: '#00617A' }} className="text-[14px]">Смотреть историю изменений</p>
            }

          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PopupAddBooking;
