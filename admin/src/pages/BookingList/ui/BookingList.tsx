import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, parse } from "date-fns";
import {
  getBookingListWithPagination,
  getCurrentUser,
  cancelBooking,
} from "@shared/api/bookinglist";
import { IPaginationParams } from "@shared/api/types/database";
import {
  IBookingList,
  IRepeatReservation,
} from "@shared/api/types/bookinglist";
import PaginationFooter from "@widgets/PaginationFooter";
import "react-day-picker/dist/style.css";
import { Spinner } from "@shared/components/ui/Spinner";
import { usePagination } from "@shared/hooks/usePagination";
import BookingListHeader from "../components/BookingListHeader";
import { DateRange } from "react-day-picker";
import { defaultPaginationParams, tabs } from "../constants/tableParams";
import PopupCancelRest from "@shared/widgets/PopupCancelRest";
import { useModalStore } from "@shared/store";
import { calculateBookingTime } from "@shared/utils/calculateBookingTime";
import PopupAddBooking from "@shared/widgets/PopupAddBooking";
import PopupSuccess from "@shared/widgets/PopupSuccess";
import PopupError from "@shared/widgets/PopupError";
import { useDebounce } from "@shared/hooks/useDebounce";
import PopupRest from "@shared/widgets/PopupRest";
import PopupHistory from "@shared/widgets/PopupHistory";
import { IHistory } from "@pages/Gantt/ui/Gantt";
import { calculeItemsAmount } from "@shared/utils/calculeItemsAmount";
import TableBody from "../components/TableBody";
import TableHead from "../components/TableHead";
import FetchError from "@shared/components/ui/FetchError";
import EmptyReponse from "@shared/components/ui/EmptyResponse";
import { Helmet } from "react-helmet-async";

const BookingList = () => {
  const tableRef = useRef<HTMLElement | null>(null);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [selectedBooking, setSelectedBooking] = useState<IBookingList | null>(
    null
  );
  const [repeatBookingData, setRepeatBookingData] =
    useState<IRepeatReservation | null>(null);

  const {
    isOpenCancelReservation,
    closeCancelReservation,
    closeBookingModal,
    isOpenBookingModal,
    openBookingModal,
    isSuccess,
    closeSuccess,
    isError: popupErr,
    closeError,
    isOpenEdit,
    closeEdit,
    isOpenHistory,
    closeHistory,
  } = useModalStore();

  useEffect(() => {
    const dateStr = format(new Date(), "yyyy-MM-dd");
    const date = parse(dateStr, "yyyy-MM-dd", new Date());
    const formattedDate = format(
      date,
      "EEE MMM dd yyyy HH:mm:ss 'GMT'xxx (zzzz)"
    );
    const dateRange = {
      from: formattedDate,
      to: undefined,
    };
    //@ts-ignore
    setDateRange(dateRange);
  }, []);

  const [itemsAmount, setItemsAmount] = useState(15);
  useLayoutEffect(() => {
    if (tableRef.current) {
      setItemsAmount(calculeItemsAmount(tableRef.current));
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (tableRef.current) {
        setItemsAmount(calculeItemsAmount(tableRef.current));
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [search, setSearch] = useState("");
  const [username, setUsername] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const debouncedSearchName = useDebounce(username, 500);

  const [searchParams, setSearchParams] = useState({
    status: activeTab.id,
    booking_date_from: format(new Date(), "yyyy-MM-dd"),
    booking_date_to: format(new Date(), "yyyy-MM-dd"),
    page: 1,
    limit: itemsAmount,
  });

  useEffect(() => {
    setSearchParams((prevParams) => ({
      ...prevParams,
      status: activeTab.id,
      page: 1,
    }));
  }, [activeTab]);

  useEffect(() => {
    setSearchParams((prevParams) => ({
      ...prevParams,
      booking_date_from: dateRange?.from
        ? format(dateRange.from, "yyyy-MM-dd")
        : "",
      booking_date_to: dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : "",
      page: 1,
    }));
  }, [dateRange]);

  const { data = { data: [], meta: { pagination: { total: 0 } } }, isLoading, isError, refetch } = useQuery({
    queryKey: [
      "bookinglistWithPagination",
      searchParams,
      debouncedSearch,
      debouncedSearchName,
    ],
    queryFn: () =>
      getBookingListWithPagination({
        ...searchParams,
        booking_date_from:
          (debouncedSearch && debouncedSearch.trim() !== "") ||
            (debouncedSearchName && debouncedSearchName.trim() !== "")
            ? searchParams.booking_date_from || ""
            : searchParams.booking_date_from ||
            format(new Date(), "yyyy-MM-dd"),
        booking_date_to:
          (debouncedSearch && debouncedSearch.trim() !== "") ||
            (debouncedSearchName && debouncedSearchName.trim() !== "")
            ? searchParams.booking_date_to || ""
            : searchParams.booking_date_to ||
            searchParams.booking_date_from ||
            "",
        query:
          debouncedSearch && debouncedSearch.trim() !== ""
            ? debouncedSearch
            : undefined,
      }),
    refetchInterval: 10000
  });

  const bookingList: IBookingList[] = data?.data || [];
  const paginationParams: IPaginationParams =
    (data?.meta?.pagination as IPaginationParams) || defaultPaginationParams;

  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });

  const { handlePagination } = usePagination({
    paginationParams,
    onPageChange: (newPage: number) =>
      setSearchParams((prevParams) => ({
        ...prevParams,
        page: newPage,
      })),
  });

  useEffect(() => {
    setSearchParams((prevParams) => ({
      ...prevParams,
      limit: itemsAmount,
    }));
  }, [itemsAmount]);

  const [history, setHistory] = useState<IHistory | undefined>();

  const handleAction = async (reservation: IBookingList) => {

    try {
      const params: IRepeatReservation & {
        booking_time_from: string;
        booking_time_to: string;
        created_at: string;
        status: number
      } = {
        ...reservation,
        room_id: reservation.room_id,
        comment: reservation.comment || "",
        count_people: reservation.count_people.toString(),
        client_name: reservation.client_name,
        client_phone: reservation.client_phone,
        count_booking_time: calculateBookingTime(
          reservation.booking_time_from,
          reservation.booking_time_to
        ),
        booking_date: reservation.booking_date,
        booking_time: reservation.booking_time_from,
        id: reservation.id,
        booking_time_from: reservation.booking_time_from,
        booking_time_to: reservation.booking_time_to,
        created_at: reservation.created_at,
        status: reservation.status,
        table_ids: reservation.composite_tables.map((table) => table.number)
      };

      localStorage.setItem('isEdit', 'true')

      setRepeatBookingData(params);
      setTimeout(() => {
        openBookingModal();
      }, 300);


      const newParams = {
        ...params,
        room_name: reservation?.room_name,
        table_number: reservation?.table_number,
        histories: reservation?.histories,
        created_at: reservation.created_at,
        hasDate: true,
      };

      const historyData = {
        created_at: reservation?.created_at,
        administrator: reservation?.administrator.name,
        histories: reservation?.histories?.data,
      };

      setHistory(historyData);
      setRepeatBookingData(newParams);
      setSelectedBooking(reservation);

    } catch (error) {
      console.error("Произошла ошибка при выполнении действия:", error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Список бронирований</title>
      </Helmet>
      <PopupRest
        isOpen={isOpenEdit}
        onClose={closeEdit}
        refetch={refetch}
        //@ts-ignore
        bookingData={repeatBookingData}
      />

      <PopupHistory
        history={history!}
        isOpen={isOpenHistory}
        onClose={closeHistory}
      />

      <PopupAddBooking
        isOpen={isOpenBookingModal}
        onClose={closeBookingModal}
        bookingData={repeatBookingData}
        refetch={refetch}
      />
      <PopupSuccess isOpen={isSuccess} onClose={closeSuccess} />
      <PopupError isOpen={popupErr} onClose={closeError} />
      <PopupCancelRest<IBookingList>
        isOpen={isOpenCancelReservation}
        onClose={closeCancelReservation}
        bookingData={selectedBooking}
        onConfirm={async (data: IBookingList) => {
          if (data.id) {
            await cancelBooking(data.id).then(() => refetch());
          }
        }}
        confirmData={selectedBooking!}
      />
      <div className="min-w-[1200px]">
        <div className="p-4 flex flex-col h-screen">
          <BookingListHeader
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            dateRange={dateRange}
            setDateRange={setDateRange}
            user={user}
            search={search}
            setSearch={setSearch}
            setUsername={setUsername}
            username={username}
          />

          {isError ? (
            <FetchError />
          ) : (
            <main ref={tableRef} className="overflow-x-auto grow">
              {isLoading ? (
                <Spinner />
              ) : (
                <table className="min-w-full bg-white shadow-md rounded-lg">
                  <TableHead />
                  <TableBody
                    activeTab={activeTab}
                    bookingList={bookingList}
                    handleAction={handleAction}
                  />
                </table>
              )}
              {!isLoading && !bookingList.length && <EmptyReponse />}
            </main>
          )}
          {!isLoading && !isError && (
            <PaginationFooter
              onPageChange={handlePagination}
              paginationParams={paginationParams}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default BookingList;
