"use client";

import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { useMemo } from "react";

const GenrateReportModal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data?.result) return null;

  const modalData = data.result.data || [];
  const title = data.result.message || "Report";

  const columns = useMemo(
    () => [
      { header: "#", accessorKey: "index", cell: (info) => info.row.index + 1 },
      {
        header: "Ref",
        accessorKey: "ref",
        cell: (info) => info.row.original.ref,
      },
    ],
    []
  );

  return (
    <div
      className="fixed inset-0 w-full h-full min-h-screen px-3 flex items-center justify-center bg-black/50 z-[9999] transition duration-300 modal-backdrop"
    >
      <div
        className="fixed inset-0 w-full h-full min-h-screen"
        onClick={onClose}
      ></div>

      <div
        className="relative w-full h-full max-w-3xl max-h-[90%] text-black bg-white shadow shadow-black/5 rounded-lg overflow-hidden z-[99999] transition duration-300 modal-animation"
      >
        <div className="w-full p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="p-2">✖</button>
        </div>

        <div className="px-4 pb-4 pt-2 max-h-[90%] overflow-y-auto">
          {Array.isArray(modalData) && modalData.length > 0 ? (
            <ViewDataTable title="REF DATA" data={modalData} columns={columns} />
          ) : (
            <p className="text-gray-500">No ISIN data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenrateReportModal;
