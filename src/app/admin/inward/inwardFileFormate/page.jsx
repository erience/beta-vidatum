"use client";
import FileFormateTable from "@/components/dataTables/FileFormateTable";
import Link from "next/link";
import React, { useMemo } from "react";
import { Download } from "react-feather";

const InwardFileFormat = () => {
  const links = [
    {
      text: "Add New Inward File Format Download Here",
      href: "/assets/file_format/add_inward.csv",
    },
    {
      text: "Edit Inward File Format Download Here",
      href: "/assets/file_format/edit_inward.csv",
    },
    {
      text: "Add/Edit Inward Info File Format Download Here",
      href: "/assets/file_format/inward_info.csv",
    },
    {
      text: "Add Inward Range File Format Download Here",
      href: "/assets/file_format/Inward_range.csv",
    },
    {
      text: "Add Inward KYC INFO",
      href: "/assets/file_format/kyc_info.csv",
    },
    {
      text: "Add Transmission INFO",
      href: "/assets/file_format/add_transmission_info.csv",
    },
    {
      text: "Add Duplicate INFO",
      href: "/assets/file_format/add_duplicate_info.csv",
    },
    {
      text: "Add Other INFO",
      href: "/assets/file_format/other_inward_info.csv",
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
        header: "File Formate",
        accessorKey: "text",
        cell: (info) => info.row.original.text,
      },
      {
        header: "Link",
        accessorKey: "href",
        cell: (info) => (
          <Link
            href={info.row.original.href}
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
    <div className="card">
      <div className="card-header">
        <h2 className="text-xl font-semibold mb-2.5">
          Reconciliation File Format
        </h2>
      </div>

      <div className="card">
        <div className="card-body">
          <FileFormateTable
            title="ISIN File Formats"
            data={links}
            columns={columns}
          />
        </div>
      </div>
    </div>
  );
};

export default InwardFileFormat;
