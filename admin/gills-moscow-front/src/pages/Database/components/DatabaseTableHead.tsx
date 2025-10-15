import { FC } from "react";
import { databaseHeadingParams } from "../constants";

const DatabaseTableHead: FC = () => {
  return (
    <thead className="bg-gray-100">
      <tr>
        {databaseHeadingParams.map((param) => (
          <th
            key={param}
            className="p-3 text-left text-sm font-semibold text-gray-600"
            style={{
              width: `${100 / databaseHeadingParams.length}%`,
            }}
          >
            {param}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default DatabaseTableHead;
