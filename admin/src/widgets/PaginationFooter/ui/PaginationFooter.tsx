import Prev from "@assets/icons/pagination-prev.svg";
import Next from "@assets/icons/pagination-next.svg";
import { IPaginationParams } from "@shared/api/types/database";

interface PaginationFooterProps {
  paginationParams: IPaginationParams | undefined;
  onPageChange: (direction: string) => void;
}

const PaginationFooter: React.FC<PaginationFooterProps> = ({
  paginationParams,
  onPageChange,
}) => {
  return (
    <footer className="bg-[#F3F4F6] flex justify-between">
      <div className="container mx-auto p-4 flex">
        <Prev
          width={24}
          height={24}
          onClick={() => onPageChange("prev")}
          fill={paginationParams?.current_page === 1 ? "grey" : "black"}
        />
        <Next
          width={24}
          height={24}
          onClick={() => onPageChange("next")}
          fill={
            paginationParams?.current_page === paginationParams?.total_pages
              ? "grey"
              : "black"
          }
        />
        <div>
          {paginationParams?.current_page}/{paginationParams?.total_pages}
        </div>
      </div>
      <div className="container mx-auto p-4 text-right">
        Всего: {paginationParams?.total}
      </div>
    </footer>
  );
};

export default PaginationFooter;
