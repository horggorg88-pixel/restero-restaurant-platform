import { checkAdmin } from "@shared/utils/checkAdmin";
import { convertDate } from "@shared/utils/convertDate";
import { removeSeconds } from "@shared/utils/removeSeconds";
import { FC } from "react";
import { IBookingList } from "@shared/api/types/bookinglist";
import { cn } from "@shared/lib/utils";
import { isAfter, isToday, parse } from "date-fns";

interface ITableBodyProps {
  bookingList: IBookingList[];
  handleAction: (reservation: IBookingList) => Promise<void>;
  activeTab: {
    text: string;
    id: number;
  } | {
    text: string;
    id?: undefined;
  }
}

const defineRowBackground = (status: number, day: string, time: string) => {
  const inputDateTime = parse(`${day} ${time}`, 'yyyy-MM-dd HH:mm:ss', new Date());
  const now = new Date();
  const isNow = isToday(inputDateTime) && isAfter(now, inputDateTime);

  if (status === 0 && isNow) {
    return '#EFC4C4'
  }

  return '#FFFFFF'
}

const defineBookingColor = (activeTab: string, status: number): string => {
  return activeTab === 'Все' && (status === 1 || status === 2) ? '#C0C0C0 ' : ''
}

const TableBody: FC<ITableBodyProps> = ({ bookingList, handleAction, activeTab }) => {
  return (
    <tbody>
      {bookingList
        .sort((a, b) => {
          const dateA = new Date(`${a.booking_date}T${a.booking_time_from}`);
          const dateB = new Date(`${b.booking_date}T${b.booking_time_from}`);
          //@ts-ignore
          return dateA - dateB;
        })
        .map((reservation, index) => (
          <tr
            style={{ background: defineRowBackground(reservation.status, reservation.booking_date, reservation.booking_time_from) }}
            key={index}
            className={cn("border-b hover:bg-gray-50")}
            onClick={() => handleAction(reservation)}
          >
            <td className="p-3 text-sm text-gray-700" style={{ color: defineBookingColor(activeTab.text, reservation.status) }}>
              {convertDate(reservation.booking_date)}
            </td>
            <td className="p-3 text-sm text-gray-700" style={{ color: defineBookingColor(activeTab.text, reservation.status) }}>
              {removeSeconds(reservation.booking_time_from)}
              -
              {removeSeconds(reservation.booking_time_to)}
            </td>
            <td className="p-3 text-sm text-gray-700" style={{ color: defineBookingColor(activeTab.text, reservation.status) }}>
              {reservation.room_name}
            </td>
            <td className="p-3 text-sm text-gray-700" style={{ color: defineBookingColor(activeTab.text, reservation.status) }}>
              {reservation.composite_tables.length ? reservation.composite_tables.map((table) => table.number).join('+') : reservation.table_number}
            </td>
            <td className="p-3 text-sm text-gray-700 max-w-[150px]" style={{ color: defineBookingColor(activeTab.text, reservation.status) }}>
              {reservation.client_name}
            </td>
            <td className="p-3 text-sm text-gray-700" style={{ color: defineBookingColor(activeTab.text, reservation.status) }}>
              {reservation.client_phone}
            </td>
            <td className="p-3 text-sm text-gray-700" style={{ color: defineBookingColor(activeTab.text, reservation.status) }}>
              {convertDate(reservation.created_at)}
            </td>
            <td className="p-3 text-sm text-gray-700" style={{ color: defineBookingColor(activeTab.text, reservation.status) }}>
              {removeSeconds(reservation.created_at.split(' ').pop())}
            </td>
            <td className="p-3 text-sm text-gray-700" style={{ color: defineBookingColor(activeTab.text, reservation.status) }}>
              {checkAdmin(reservation)}
            </td>
          </tr>
        ))}
    </tbody>
  );
};

export default TableBody;
