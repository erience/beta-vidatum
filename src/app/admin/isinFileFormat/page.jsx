"use client";
import React, { useMemo } from "react";
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import FileFormateTable from "@/components/dataTables/FileFormateTable";
import Link from "next/link";
import { Download, DownloadCloud } from "react-feather";

const IsinFileFormat = () => {
  const tableData1 = [
    {
      description: "Add ISIN File Format",
      demoLink: "/assets/demo_format/isin/add_isin.csv",
      finalLink: "/assets/final_format/isin/add_isin.csv",
    },
    {
      description: "Add Full ISIN File Format",
      demoLink: "/assets/demo_format/isin/add-full-isin-data.csv",
      finalLink: "/assets/final_format/isin/add-full-isin-data.csv",
    },
    {
      description: "Update ISIN File Format",
      demoLink: "/assets/demo_format/isin/update_isin.csv",
      finalLink: "/assets/final_format/isin/update_isin.csv",
    },
    {
      description: "Delete ISIN File Format",
      demoLink: "/assets/demo_format/isin/delete_isin.csv",
      finalLink: "/assets/final_format/isin/delete_isin.csv",
    },
    {
      description: "ISIN Data File Format",
      demoLink: "/assets/demo_format/isin/isin_data.csv",
      finalLink: "/assets/final_format/isin/isin_data.csv",
    },
  ];

  const tableData2 = [
    {
      description: "Add ISIN Information File Format",
      demoLink: "/assets/demo_format/isin/add_isin_info.csv",
      finalLink: "/assets/final_format/isin/add_isin_info.csv",
    },
    {
      description: "Update ISIN Information File Format",
      demoLink: "/assets/demo_format/isin/update_isin_info.csv",
      finalLink: "/assets/final_format/isin/update_isin_info.csv",
    },
    {
      description: "Delete ISIN Information File Format",
      demoLink: "/assets/demo_format/isin/delete_isin_info.csv",
      finalLink: "/assets/final_format/isin/delete_isin_info.csv",
    },
  ];

  const columns = useMemo(
    () => [
      {
        header: "#",
        accessorKey: "index",
        cell: (info) => info.row.index + 1,
      },
      {
        header: "Particulars",
        accessorKey: "description",
        cell: (info) => info.row.original.description,
      },
      {
        header: "Demo File",
        accessorKey: "demoLink",
        cell: (info) => (
          <Link
            href={info.row.original.demoLink}
            className="text-orange-500  hover:text-gray-500"
            target="_blank"
            rel="noopener noreferrer"
            title="Download Demo File"
          >
            <DownloadCloud />
          </Link>
        ),
      },
      {
        header: "Format File",
        accessorKey: "finalLink",
        cell: (info) => (
          <Link
            href={info.row.original.finalLink}
            className="text-orange-500  hover:text-gray-500"
            target="_blank"
            rel="noopener noreferrer"
            title="Downlaod Format File"
          >
            <Download />
          </Link>
        ),
      },
    ],
    []
  );

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="text-xl font-semibold mb-2.5">
          ISIN Information Formats
        </h2>
      </div>
      <div className="sm:flex block ">
        <div className="card">
          <div className="card-body">
            <FileFormateTable
              title="ISIN File Formats"
              data={tableData1}
              columns={columns}
            />
          </div>
        </div>
        <div className="card ms-0 sm:ms-7">
          <div className="card-body">
            <FileFormateTable
              title="ISIN Information File Formats"
              data={tableData2}
              columns={columns}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IsinFileFormat;
