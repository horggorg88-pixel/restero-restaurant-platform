import { FC } from "react";
import { tableHeadingParams } from "../constants/tableParams";

const TableHead: FC = () => {
  return (
    <thead className="bg-gray-100">
      <tr>
        {tableHeadingParams.map((param) => (
          <th
            key={param}
            className="p-3 text-left text-sm font-semibold text-gray-600"
          >
            {param}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHead;
