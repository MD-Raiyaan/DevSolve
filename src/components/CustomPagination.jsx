"use client";

import React, { useState, useEffect } from "react";
import { useRouter,useSearchParams,usePathname } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";

export function CustomPagination({
  totalItems = 0,
  itemsPerPage = 5,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const router=useRouter();
  const pathName=usePathname();
  const searchParams=useSearchParams();

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(()=>newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("page", newPage);
      router.push(`${pathName}?${newSearchParams}`);
    }
  };

  useEffect(() => {
    // Reset to page 1 if total items changes (e.g., after search)
    setCurrentPage(1);
  }, [totalItems]);

  return (
    <Pagination className="pt-4">
      <PaginationContent className="flex justify-center items-center flex-wrap gap-1">
        <PaginationItem>
          <PaginationPrevious
            onClick={() => handlePageChange(currentPage - 1)}
            className={
              currentPage === 1 ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>

        {Array.from({ length: totalPages }, (_, index) => (
          <PaginationItem key={index}>
            <PaginationLink
              isActive={currentPage === index + 1}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() => handlePageChange(currentPage + 1)}
            className={
              currentPage === totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
