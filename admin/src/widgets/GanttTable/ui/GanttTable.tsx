import React, { useEffect, useState, useRef, FC } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  cancelBooking,
  getAvailableRooms,
  getBookingListWithPagination,
  getCurrentUser,
} from "@shared/api/bookinglist";
import PopupAddBooking from "@shared/widgets/PopupAddBooking";
import { useModalStore } from "@shared/store";
import PopupRest from "@shared/widgets/PopupRest";
import { IBookingList } from "@shared/api/types/bookinglist";
import PopupHistory from "@shared/widgets/PopupHistory";
import { DatePicker } from "@shared/components/ui/datepicker";
import { DateRange } from "react-day-picker";
import { format, subDays } from "date-fns";
import PopupSuccess from "@shared/widgets/PopupSuccess";
import PopupError from "@shared/widgets/PopupError";
import PopupCancelRest from "@shared/widgets/PopupCancelRest";
import { IHistory } from "@pages/Gantt/ui/Gantt";
import { defineBookingBg } from "@shared/utils/defineBookingStatus";
import { convertDateToDatepickerFormat } from "@shared/utils/convertDateToDatepickerFormat";
import { Booking, Params, Room } from "../types";
import Tooltip from "@pages/Gantt/components/Tooltip";
import { generateTimeArray } from "../utils/generateTimeArray";
import Clock from "@pages/Gantt/components/Clock";
import { calculateWidth } from "@shared/utils/calculateWidth";
import { calculateLeftPosition } from "@shared/utils/calculateLeftPosition";
import { formatTime } from "@shared/utils/formatTime";
import Persons from "@assets/icons/persons.svg"

interface IGantTable {
  setHistoryData: React.Dispatch<React.SetStateAction<IHistory | undefined>>;
  searchRes: {} | Params;
  historyData: IHistory | undefined;
}

export interface IGantBooking {
  start: string;
  end: string;
  current: string;
  status: number;
  left: number;
  width: number;
  start_old: string
  composite_tables: { number: string }[]
  client_name: string,
  client_phone: string,
  comment?: string
  booking_date: string
  onDoubleTap: () => void
}

export const GantBooking: FC<IGantBooking> = ({
  start,
  end,
  status,
  left,
  width,
  start_old,
  composite_tables,
  client_name,
  client_phone,
  comment,
  booking_date,
  onDoubleTap
}) => {

  const { background, color, icon: Icon, joinText } = defineBookingBg(start, status, booking_date);

  return <div onTouchEnd={onDoubleTap} style={{ background, color, left, width, overflow: "hidden" }} className="absolute h-full rounded flex flex-col py-[7px] px-[14px]">
    <div className="flex gap-[12px] items-center" ><p style={{ color, fontWeight: 700 }}>{formatTime(
      start_old ? (start_old!)
        : (start! as string)
    )}{" "}
      - {formatTime(end!)}</p>
      {composite_tables.length ? <Icon /> : <></>}
      {
        composite_tables.length ? <p style={{ color: joinText, marginLeft: '-9px' }}>{composite_tables.map(({ number }) => number).join('+')}</p> : <></>
      }
    </div>
    <div className="flex gap-[5px]">
      <p>{client_name.split(' ')[0]}</p>
      <p>*{client_phone.slice(-4)}</p>
      <p className="whitespace-nowrap overflow-hidden text-ellipsis">{comment ? `- ${comment}` : ''}</p>
    </div>
  </div>
}

const GanttTable: FC<IGantTable> = ({
  searchRes,
  setHistoryData,
  historyData,
}) => {
  const [timeArray, setTimeArray] = useState<string[]>([]);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [leftTime, setLeftTime] = useState<string>("");
  //@ts-ignore
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    return convertDateToDatepickerFormat(format(new Date(), "yyyy-MM-dd"));
  });
  const [startRestoraunt, setStartRestoraunt] = useState<number>(0);

  useEffect(() => {
    const hasReloaded = sessionStorage.getItem("hasReloaded");

    if (leftTime === "00:00" && !hasReloaded) {
      sessionStorage.setItem("hasReloaded", "true");
      window.location.reload();
    } else if (leftTime === "00:01" && hasReloaded) {
      sessionStorage.removeItem("hasReloaded");
    }
  }, [leftTime]);

  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    refetchInterval: 60000,
  });

  const [searchParams, setSearchParams] = useState({
    booking_date_from: format(subDays(new Date(), 1), "yyyy-MM-dd"),
    booking_date_to: format(new Date(), "yyyy-MM-dd"),
    limit: 300,
  });

  const [tooltip, setTooltip] = useState<{
    content: string;
    left: number;
    top: number;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);
  const doubleTapRef = useRef<number | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const closeTooltip = () => {
    setTooltip(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        closeTooltip();
      }
    };

    const handleScroll = () => {
      closeTooltip();
    };

    document.addEventListener("mousedown", handleClickOutside);
    containerRef.current?.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      containerRef.current?.removeEventListener("scroll", handleScroll);
    };
  }, [tooltipRef]);

  useEffect(() => {
    if (user) {
      const startRest = +user?.restaurant?.data?.start_time.split(":").shift();
      const times = generateTimeArray();

      setTimeArray(times);
      setStartRestoraunt(startRest);
    }

    const updateCurrentTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");

      const newTime = +`${hours}${minutes}`;

      if (user) {
        const start = +user?.restaurant?.data?.start_time
          .slice(0, 5)
          .split(":")
          .join("");
        const end = +user?.restaurant?.data?.end_time
          .slice(0, 5)
          .split(":")
          .join("");

        if (newTime < start || newTime > end) {
          const timeArray = start.toString().split("");

          let startTime = "";

          if (timeArray.length < 4) {
            startTime = `${timeArray[0]}:${timeArray.slice(1, 3).join("")}`;
          } else {
            startTime = `${timeArray.slice(0, 2).join("")}:${timeArray
              .slice(2, 4)
              .join("")}`;
          }

          setCurrentTime(startTime);
        } else {
          setCurrentTime(`${hours}:${minutes}`);
        }
      }
    };

    updateCurrentTime();
    const intervalId = setInterval(updateCurrentTime, 1000);

    scrollToCurrentTime();

    return () => clearInterval(intervalId);
  }, [user]);

  useEffect(() => {
    scrollToCurrentTime();
  }, [currentTime]);

  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");

      const time = `${hours}:${minutes}`;

      setLeftTime(time);
    };

    updateCurrentTime();
    const intervalId = setInterval(updateCurrentTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const { data: roomsData = [] } = useQuery<Room[]>({
    queryKey: ["availableRooms"],
    queryFn: getAvailableRooms,
    refetchInterval: 60000,
  });

  const { data: bookingDataResponse = { data: [] }, refetch } = useQuery<{
    data: Booking[];
  }>({
    queryKey: ["bookinglistWithPagination", searchParams],
    queryFn: () => getBookingListWithPagination(searchParams),
    refetchInterval: 60000,
  });

  const { isOpenBookingModal, closeBookingModal } = useModalStore();

  const bookingData = bookingDataResponse?.data
    ?.filter((booking) => booking.status !== 1)
    .map((booking) => {
      if (booking.booking_date === format(dateRange?.from!, "yyyy-MM-dd")) {
        return booking;
      } else {
        const start = +booking.booking_time_from
          .split(":")
          .join("")
          .slice(0, 4);
        const end = +booking.booking_time_to.split(":").join("").slice(0, 4);

        if (end < start && end !== 0) {
          const { booking_time_from } = booking;

          const newBooking = {
            ...booking,
            booking_time_from: "00:00:00",
            booking_time_from_old: booking_time_from,
          };
          return newBooking;
        }
      }
    });

  const [formData, setFormData] = useState<Params>({
    room_id: '',
    table_ids: [],
    comment: "",
    count_people: "",
    client_name: "",
    client_phone: "",
    count_booking_time: "",
    booking_date: "",
    booking_time: "",
    id: "",
  });

  const [modalParams, setModalParams] = useState<IBookingList | undefined>(
    undefined
  );

  const {
    isOpenHistory,
    closeHistory,
    isOpenEdit,
    closeEdit,
    closeSuccess,
    isSuccess,
    isError,
    closeError,
    isOpenCancelReservation,
    closeCancelReservation,
    openBookingModal
  } = useModalStore();

  const handleOpenRest = (params: IBookingList) => {
    const modalData = { ...params };

    if (
      "booking_time_from_old" in modalData &&
      modalData.booking_time_from_old
    ) {
      const oldTime = modalData.booking_time_from_old as string;
      modalData.booking_time_from = oldTime;
    }

    setModalParams(modalData);
    openBookingModal()

    const data = {
      created_at: params?.created_at,
      administrator: params?.administrator.name,
      histories: params?.histories?.data,
    };
    setHistoryData(data);

    // @ts-ignore
    setFormData(modalData);
  };

  const handleDoubleTap = (
    booking: IBookingList & {
      booking_time: string;
    }
  ) => {
    const currentTime = new Date().getTime();
    const previousTapTime = doubleTapRef.current;
    localStorage.setItem('isEdit', 'true');

    if (previousTapTime && currentTime - previousTapTime < 500) {
      setTimeout(() => {
        handleOpenRest(booking);
      }, 100);
    } else {
      doubleTapRef.current = currentTime;
    }
  };

  const scrollToCurrentTime = () => {
    if (timelineRef.current && containerRef.current) {
      try {
        const leftPosition = calculateCurrentTimePosition();
        const currentScrollPosition = containerRef.current.scrollLeft;

        if (leftPosition - currentScrollPosition > 10) {
          containerRef.current.scrollTo({
            left: leftPosition,
            behavior: "smooth",
          });
        }
      } catch (error) {
        console.error("Error scrolling to current time:", error);
      }
    }
  };

  const calculateCurrentTimePosition = (): number => {
    const startTime = user?.restaurant?.data?.start_time;
    const endTime = user?.restaurant?.data?.end_time;

    if (!startTime || !endTime) {
      return 0;
    }

    const currentHour = new Date().getHours();
    const currentMinute = new Date().getMinutes();
    const currentTime = `${currentHour
      .toString()
      .padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`;

    const [startHours /*startMinutes*/] = startTime.split(":").map(Number);

    const position = calculateLeftPosition(currentTime, startHours);
    return position;
  };

  const handleTableClick = (
    table: { number: number; comment?: string },
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    const { clientX, clientY } = event;
    const tooltipContent = {
      title: `Стол ${table.number}`,
      comment: table.comment || "Нет комментария",
    };

    setTooltip({
      content: JSON.stringify(tooltipContent),
      left: clientX,
      top: clientY,
    });
  };

  useEffect(() => {
    if (searchRes) {
      //@ts-ignore
      setModalParams(searchRes);

      if ("created_at" in searchRes && searchRes.created_at) {
        //ts-ignore
        setFormData(searchRes as Params);
      }
    }
  }, [searchRes]);

  useEffect(() => {
    if (!dateRange) {
      const date = convertDateToDatepickerFormat(
        format(new Date(), "yyyy-MM-dd")
      );
      //@ts-ignore
      setDateRange(date);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const line = lineRef.current;
      const rect = line!.getBoundingClientRect();
      const distanceFromDocumentLeft = rect.left;

      if (line) {
        if (distanceFromDocumentLeft <= 190) {
          line.style.visibility = "hidden";
        } else {
          line.style.visibility = "visible";
        }
      }
    };

    containerRef.current?.addEventListener("scroll", handleScroll);

    return () =>
      containerRef.current?.removeEventListener("scroll", handleScroll);
  }, []);


  const [lineHeight, setLineHeight] = useState(0);
  useEffect(() => {
    const calculateLineHeight = () => {
      let rect = containerRef.current?.getBoundingClientRect();
      return rect?.height! - 100;
    };

    const updateLineHeight = () => {
      setLineHeight(calculateLineHeight());
    };

    updateLineHeight();

    const observer = new MutationObserver(updateLineHeight);
    if (containerRef.current) {
      observer.observe(containerRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    }

    return () => observer.disconnect();
  }, []);


  return (
    <>
      <PopupCancelRest<IBookingList>
        isOpen={isOpenCancelReservation}
        onClose={closeCancelReservation}
        bookingData={formData}
        onConfirm={async (data: IBookingList) => {
          if (data.id) {
            await cancelBooking(data.id).then(() => {
              localStorage.removeItem('isEdit');
              refetch();
            });
          }
        }}
        confirmData={modalParams!}
      />

      {modalParams && (
        <PopupRest
          bookingData={modalParams!}
          isOpen={isOpenEdit}
          onClose={closeEdit}
          refetch={refetch}
        />
      )}

      <PopupHistory
        history={historyData!}
        isOpen={isOpenHistory}
        onClose={closeHistory}
      />

      <PopupAddBooking
        isAdd
        isOpen={isOpenBookingModal}
        onClose={closeBookingModal}
        refetch={refetch}
        bookingData={formData}
      />
      <PopupSuccess isOpen={isSuccess} onClose={closeSuccess} />
      <PopupError isOpen={isError} onClose={closeError} />
      <div className="flex flex-col w-full mb-[10px] mt-[-80px] ">
        <Clock time={leftTime} user={user} />
        <div
          className="relative top-[1px] left-[220px] bg-white ml-[-10px] pl-[10px]"
          style={{ zIndex: 30 }}
        >
          <DatePicker
            disabled={false}
            selectedRange={dateRange}
            setSelectedRange={(range) => {
              setDateRange(range);
              setSearchParams((prevData) => ({
                ...prevData,
                booking_date_to: range?.from
                  ? format(range.from, "yyyy-MM-dd")
                  : "",
                booking_date_from: range?.from
                  ? format(subDays(range.from, 1), "yyyy-MM-dd")
                  : "",
              }));
            }}
            mode="single"
          />
        </div>

        <div
          className="relative overflow-x-auto overscroll-contain"
          style={{ maxHeight: "calc(99dvh - 65px)", maxWidth: "2200px" }}
          ref={containerRef}
        >
          <div
            className="sticky top-0 bg-white z-10 ml-[210px] pl-[10px]"
            style={{ minWidth: `${timeArray.length * 90}px` }}
            ref={timelineRef}
          >
            <div className="ml-[10px] bg-white  h-[10px] w-full font-semibold"></div>

            <div
              className="flex bg-white"
              style={{ minWidth: `${timeArray.length * 90}px` }}
            >
              {timeArray.map((time, index) => {
                return (
                  <div
                    key={index}
                    className="px-2 py-1 text-center rounded-[10px] mb-[10px] mr-[5px] h-[44px] flex justify-center items-center font-semibold text-sm ml-[2px] bg-gray-100 shadow-md"
                    style={{ width: "90px", background: "#f3f4f6" }}
                  >
                    {time}
                  </div>
                );
              })}
            </div>

            <div
              ref={lineRef}
              className="absolute border border-[#C86162]"
              style={{
                left: calculateCurrentTimePosition(),
                height: lineHeight,
                width: "2px",
                backgroundColor: "#c86162",
                zIndex: 1,
                top: "80%",
              }}
            >
              <div
                style={{ zIndex: 30 }}
                className="absolute top-[0px] bg-[#C86162] w-[10px] h[10px] rounded-[50%] aspect-square translate-x-[-50%]"
              ></div>
            </div>
          </div>

          <div className="relative mb-[43px]">
            {(roomsData || []).map((room) => (
              <div
                key={room.id}
                className="bg-6 py-[2px]"
                style={{
                  minWidth: `${timeArray.length * 90 + 220}px`,
                }}
              >
                <div className="font-semibold my-2 h-[22px] pl-[60px] bg-[#3D8B95] text-[#ffffff]">
                  <h2
                    className="font-semibold my-2 h-[22px] pl-[30px] bg-[#3D8B95] text-[#ffffff] sticky left-[40px] z-[1] w-max"
                    style={{ zIndex: 1, backgroundColor: "#3D8B95" }}
                  >
                    {room.name}{" "}
                    <span className="ml-[75px]">{room.comment}</span>
                  </h2>
                </div>

                {(room.tables?.data || []).sort((a, b) => {
                  const numA = +a.number;
                  const numB = +b.number;

                  if (isNaN(numA)) {
                    return 1;
                  }
                  if (isNaN(numB)) {
                    return -1;
                  }

                  return numA - numB;
                }).map((table) => (
                  <div
                    key={table.id}
                    className="flex items-center gap-4 mb-2 pl-[10px]"
                  >
                    <div
                      className="w-[191px] p-2 bg-3 h-[60px] flex items-center justify-around rounded-[10px]  flex-shrink-0 sticky left-0"
                      style={{ zIndex: 1, backgroundColor: "#ffffff" }}
                      onClick={(e) => handleTableClick(table, e)}
                    >
                      <div className="flex justify-around w-[100%]">
                        <span className="font-bold">Стол {table.number}</span>
                        <span className="flex items-center gap-[3px] text-[#00617A]">{table.count_people} <Persons /></span>
                      </div>
                    </div>
                    <div
                      className="relative h-[60px] bg-[#f9f9fa] border rounded overflow-x-hidden	"
                      style={{ minWidth: `${timeArray.length * 90}px` }}
                    >
                      {bookingData
                        .filter(
                          (booking) =>
                            booking?.room_id === room.id &&
                            //@ts-ignore
                            booking?.table_id === table.id
                        )
                        .map((booking, idx) => (
                          <GantBooking
                            key={idx}
                            current={leftTime}
                            end={booking?.booking_time_to!}
                            start={booking?.booking_time_from!}
                            status={booking?.status!}
                            left={calculateLeftPosition(
                              booking?.booking_time_from!,
                              startRestoraunt
                            )}
                            width={calculateWidth(
                              booking?.booking_time_from!,
                              booking?.booking_time_to!
                            )}
                            //@ts-ignore
                            composite_tables={booking?.composite_tables}
                            //@ts-ignore
                            start_old={booking?.booking_time_from_old}
                            //@ts-ignore
                            client_name={booking.client_name}
                            //@ts-ignore
                            comment={booking?.comment}
                            //@ts-ignore
                            client_phone={booking?.client_phone}
                            //@ts-ignore
                            onDoubleTap={() => handleDoubleTap(booking)}
                            //@ts-ignore
                            booking_date={booking?.booking_date}
                          />
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {tooltip && (
          <Tooltip
            content={tooltip.content}
            left={tooltip.left}
            top={tooltip.top}
            tooltipRef={tooltipRef}
          />
        )}
      </div>
    </>
  );
};

export default GanttTable;
