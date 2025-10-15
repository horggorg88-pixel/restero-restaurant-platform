import { useState } from "react";
import { IPaginationParams } from "@shared/api/types/database";

interface PaginationProps {
  paginationParams: IPaginationParams;
  onPageChange: (newPage: number) => void;
}

export const usePagination = ({
  paginationParams,
  onPageChange,
}: PaginationProps) => {
  const [currentPage, setCurrentPage] = useState(paginationParams.current_page);

  const handlePagination = (direction: string) => {
    let newPage = currentPage;

    if (direction === "prev" && currentPage > 1) {
      newPage -= 1;
    } else if (
      direction === "next" &&
      currentPage < paginationParams.total_pages
    ) {
      newPage += 1;
    }

    if (newPage !== currentPage) {
      setCurrentPage(newPage);
      onPageChange(newPage);
    }
  };

  return { currentPage, handlePagination };
};
