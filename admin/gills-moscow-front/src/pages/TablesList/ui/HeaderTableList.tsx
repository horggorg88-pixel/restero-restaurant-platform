import ArrowLeft from "@assets/icons/arrow-left.svg";
import { Button } from "@shared/components/ui/button";
import { FC } from "react";
import { Link } from "react-router-dom";

interface HeaderTableListProps {
  onOpenTable: () => void;
  onOpenRoom: () => void;
}

const HeaderTableList: FC<HeaderTableListProps> = ({
  onOpenTable,
  onOpenRoom,
}) => {
  return (
    <>
      <header className="flex mb-4 rounded-[10px] px-5 py-[10px] justify-between w-full items-center h-[63px] bg-3 shadow-tableShadow">
        <div className="flex gap-5">
          <Link to="/gantt">
            <div className="flex items-center justify-center w-[41px] h-[41px] bg-[#F3F4F6] rounded-full">
              <ArrowLeft />
            </div>
          </Link>

          <Button
            className="w-[199px] h-[47px] bg-8 text-3 font-bold"
            onClick={onOpenTable}
          >
            Добавить стол +
          </Button>

          <Button
            className="w-[245px] h-[47px] bg-5 text-3 font-bold"
            onClick={onOpenRoom}
          >
            Добавить помещение +
          </Button>
        </div>
      </header>
    </>
  );
};

export default HeaderTableList;
