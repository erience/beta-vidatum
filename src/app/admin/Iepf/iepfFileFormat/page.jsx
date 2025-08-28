"use client";
import FileFormateTable from "@/components/dataTables/FileFormateTable";
import Link from "next/link";
import React, { useMemo } from "react";
import { Download } from "react-feather";

const IepfFileFormat = () => {
    const tableData = [
    {
      description: " Add New IEPF File Format",
      formateLink: "/assets/file_format/add_IEPF_Format.csv"
    },
  ]

    const columns = useMemo(
    () => [
      {
        header: "#",
        accessorKey: "index",
        cell: (info) => info.row.index + 1,
      },
      {
        header: "File Formate",
        accessorKey: "description",
        cell: (info) => info.row.original.description,
      },
      {
        header: "Link",
        accessorKey: "formateLink",
        cell: (info) => (
          <Link
            href={info.row.original.formateLink}
            className="text-orange-500  hover:text-gray-500"
            target="_blank"
            rel="noopener noreferrer"
            title="Download Demo File"
          >
            <Download />
          </Link>
        ),
      },
    ],
    []
  );
  return (
    <>
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold mb-2.5">
            IEPF File Format
          </h2>
        </div>

        <div className="card">
          <div className="card-body">
            <FileFormateTable
              title="ISIN File Formats"
              data={tableData}
              columns={columns}
            />
          </div>
        </div>
      </div>
    </>
  
  );
};

export default IepfFileFormat;
