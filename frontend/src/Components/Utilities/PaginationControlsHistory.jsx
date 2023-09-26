import React from "react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

const PaginationControlsHistory = ({
  hasNextPage,
  hasPrevPage,
  totalItems,
}) => {
  const [searchParams, SetSearchParams] = useSearchParams({
    page: 1,
    per_page: 12,
  });
  const page = searchParams.get("page") || "1";
  const per_page = searchParams.get("per_page") || "12";
  const totalPages = Math.max(1, Math.ceil(totalItems / per_page));
  const handlePrevClick = () => {
    if (hasPrevPage) {
      SetSearchParams({
        page: String(Number(page) - 1),
      });
    }
  };

  const handleNextClick = () => {
    if (hasNextPage) {
      SetSearchParams({
        page: String(Number(page) + 1),
      });
    }
  };

  return (
    <div className="flex gap-2 justify-center items-center mb-3">
      <button
        className="bg-blue-500 text-white p-1"
        disabled={!hasPrevPage}
        onClick={handlePrevClick}
      >
        previus page
      </button>

      <div>
        {page} / {totalPages}
      </div>

      <button
        className="bg-blue-500 text-white p-1"
        disabled={!hasNextPage}
        onClick={handleNextClick}
      >
        next page
      </button>
    </div>
  );
};

export default PaginationControlsHistory;
