"use client";
import React from "react";

const SkeletonRow = ({ columnsCount }) => {
  return (
    <tr className="animate-pulse">
      {[...Array(columnsCount)].map((_, idx) => (
        <td key={idx} className="p-3">
          <div className="h-4 bg-gray-300 rounded w-full" />
        </td>
      ))}
    </tr>
  );
};

export default SkeletonRow;
