import { useState } from "react";
import PopupsTable from "@widgets/PopupsTable";
import HeaderTableList from "./HeaderTableList";
import { useModalStore } from "../store";
import { useModalStore as useGlobalModalStore } from "@shared/store";
import PopupsRoom from "@widgets/PopupsRoom";
import { getTables } from "@shared/api/tables";
import { useQuery } from "@tanstack/react-query";
import PopupsEditTable from "@widgets/PopupsEditTable";
import PopupEditRoom from "@widgets/PopupsRoom/ui/PopupEditRoom";
import Edit from "@assets/icons/edit.svg";
import PopupSuccess from "@shared/widgets/PopupSuccess";
import PopupError from "@shared/widgets/PopupError";
import PopupDelete from "@shared/widgets/PopupDelete";
import PopupDeleteError from "@shared/widgets/PopupDeleteError";
import { Helmet } from "react-helmet-async";

interface IRoomResp {
  id: string;
  name: string;
  room_id: string;
  comment: string;
  tables: {
    data: {
      id: string;
      object: string;
      count_people: string;
      number: number;
      comment: string;
      room_id: string;
    }[];
  };
}

interface InitialValues {
  id: string;
  name: string;
  comment: string;
}

interface TableInmitialValues {
  number: number;
  count_people: number;
  id: string;
  comment: string;
  room_id?: string;
}

const TablesList = () => {
  const {
    isOpenAddTable,
    isOpenAddRoom,
    openAddTable,
    closeAddTable,
    openAddRoom,
    closeAddRoom,
    isOpenEditTable,
    openEditTable,
    closeEditTable,
    closeRoomModal,
    isOpenRoomModal,
    openRoomModal,
  } = useModalStore();

  const [selectedTableId, setSelectedTableId] = useState<string | undefined>();
  const [selectedRoomId, setSelectedRoomeId] = useState<string | undefined>();
  const [initialValues, setInitialValues] = useState<
    InitialValues | undefined
  >();
  const [tableInitialValues, setTableInitialValues] = useState<
    TableInmitialValues | undefined
  >();

  const { data, refetch } = useQuery<IRoomResp[]>({
    queryKey: ["tables"],
    queryFn: getTables,
  });

  const {
    isSuccess,
    closeSuccess,
    isError,
    closeError,
    isDelete,
    closeDelete,
    isDeleteError,
    closeDeleteError,
  } = useGlobalModalStore();

  const [deletiontType, setDeletionType] = useState<"room" | "table">("room");
  const [deletionId, setDeletionId] = useState<string | undefined>();

  return (
    <>
      <Helmet>
        <title>Список столов</title>
      </Helmet>

      <PopupsTable isOpen={isOpenAddTable} onClose={closeAddTable} />

      <PopupDeleteError
        isOpen={isDeleteError}
        onClose={closeDeleteError}
        type={deletiontType}
      />

      <PopupDelete
        isOpen={isDelete}
        refetch={refetch}
        onClose={closeDelete}
        type={deletiontType}
        id={deletionId!}
      />

      <PopupsRoom
        isOpen={isOpenAddRoom}
        onClose={closeAddRoom}
        refetchTables={refetch}
      />

      <PopupsEditTable
        isOpen={isOpenEditTable}
        onClose={closeEditTable}
        selectedTableId={selectedTableId!}
        selectedRoomId={selectedRoomId}
        initialValues={tableInitialValues!}
      />

      <PopupEditRoom
        isOpen={isOpenRoomModal}
        onClose={closeRoomModal}
        refetchRooms={refetch}
        initialData={initialValues!}
      />

      <PopupSuccess isOpen={isSuccess} onClose={closeSuccess} />

      <PopupError isOpen={isError} onClose={closeError} />

      <div className="w-full">
        <HeaderTableList onOpenRoom={openAddRoom} onOpenTable={openAddTable} />

        <div className="p-[10px]">
          {data &&
            data.map((room) => (
              <div
                className="p-4 bg-2 rounded-[20px] mb-[20px] relative"
                key={room.id}
              >
                <div className="bg-white w-[40px] h-[40px] absolute right-[10px] top-[10px] cursor-pointer rounded-[50%]">
                  <Edit
                    className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
                    onClick={() => {
                      const data = {
                        id: room.id,
                        name: room.name,
                        comment: room.comment,
                      };

                      setInitialValues(data);
                      setDeletionType("room");
                      setDeletionId(room.id);
                      openRoomModal();
                    }}
                  />
                </div>
                <h3 className="font-bold mb-[10px]">{room.name}</h3>
                <div className="flex flex-wrap gap-[10px]">
                  {room.tables.data.sort((a, b) => {
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
                      className="mb-1 flex  w-[147px] h-[43px] bg-3 shadow-tableShadow rounded-[10px]  items-center"
                      onClick={() => {
                        setSelectedTableId(table.id);
                        setSelectedRoomeId(room.room_id);

                        const data = {
                          number: table.number,
                          count_people: +table.count_people,
                          id: table.id,
                          comment: table.comment,
                          room_id: table.room_id,
                        };

                        setTableInitialValues(data);
                        setDeletionType("table");
                        setDeletionId(table.id);
                        openEditTable();
                      }}
                    >
                      <p className="font-bold text-base text-1 flex justify-around w-full">
                        <span>{`Стол ${table.number}`}</span>
                        <span>{`${table.count_people} чел`}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default TablesList;
