import { IDatabase } from "@shared/api/types/database";
import { convertDate } from "@shared/utils/convertDate";
import { FC } from "react";

interface IDatabaseTableBodyProps {
  databaseList: IDatabase[];
}

const DatabaseTableBody: FC<IDatabaseTableBodyProps> = ({ databaseList }) => {
  return (
    <tbody>
      {databaseList.map((reservation, index) => (
        <tr key={index} className="border-b hover:bg-gray-50">
          <td className="p-3 text-sm text-gray-700">
            {convertDate(reservation.booking_date)}
          </td>
          <td className="p-3 text-sm text-gray-700">
            {reservation.client_name}
          </td>
          <td className="p-3 text-sm text-gray-700">
            {reservation.client_phone}
          </td>
          <td className="p-3 text-sm text-gray-700">
            {reservation.restaurant.data.name}
          </td>
          <td className="p-3 text-sm text-gray-700">
            {reservation.count_booking}
          </td>
        </tr>
      ))}
    </tbody>
  );
};

export default DatabaseTableBody;
