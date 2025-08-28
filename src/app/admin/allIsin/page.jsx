"use client";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { apiConnector } from "@/utils/apihelper";
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { Download, Eye } from "lucide-react";
import { toast } from "react-toastify";

// AllIsin Component
const AllIsin = () => {
  const [data, setData] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Active");
  const categories = ["Active", "Delete"];
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //--------------- fetch all isin ----------------
  const fetchAllisin = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/isin/type/all-isin`
      );
      const responseData = Array.isArray(response.data.result)
        ? response.data.result
        : [];
      setData(responseData);
      setLoading(false);
    } catch (error) {
      const errMsg = error.response?.data?.message;
      toast.error(errMsg || "An error occurred while processing the request.");
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllisin();
  }, []);

  const columns = useMemo(
    () => [
      { header: "#", accessorKey: "index", cell: (info) => info.row.index + 1 },
      {
        header: "Org. Name",
        accessorKey: "cin",
        cell: (info) => info.row.original.cin,
      },
      {
        header: "Type",
        accessorKey: "type",
        cell: (info) => info.row.original.type,
      },
      {
        header: "ISIN",
        accessorKey: "isin",
        cell: (info) => info.row.original.isin,
      },
      {
        header: "CDSL Date",
        accessorKey: "c_date",
        cell: (info) => {
          const cDate = info.row.original.c_date;
          return cDate?.startsWith("00") || !cDate ? "-" : cDate;
        },
      },
      {
        header: "NSDL Date",
        accessorKey: "n_date",
        cell: (info) => {
          const nDate = info.row.original.n_date;
          return nDate?.startsWith("00") || !nDate ? "-" : nDate;
        },
      },
      {
        header: "Face Value",
        accessorKey: "facev",
        cell: (info) => info.row.original.facev,
      },
      {
        header: "Paid Value",
        accessorKey: "paidv",
        cell: (info) => info.row.original.paidv,
      },
      {
        header: "Instrument",
        accessorKey: "instrument",
        cell: (info) => info.row.original.instrument,
      },
      {
        header: "Transfer Rights",
        accessorKey: "transfer",
        cell: (info) => info.row.original.transfer,
      },
      {
        header: "Connectivity",
        accessorKey: "connect",
        cell: (info) => info.row.original.connect,
      },
      {
        header: "Email",
        accessorKey: "email",
        cell: (info) =>
          info.row.original.email?.length > 1 ? info.row.original.email : "-",
      },
      {
        header: "Secondary Email",
        accessorKey: "s_email",
        cell: (info) =>
          info.row.original.s_email?.length > 1
            ? info.row.original.s_email
            : "-",
      },
      {
        header: "Primary Phone",
        accessorKey: "p_phone",
        cell: (info) =>
          info.row.original.p_phone?.length > 1
            ? info.row.original.p_phone
            : "-",
      },
      {
        header: "Secondary Phone",
        accessorKey: "s_phone",
        cell: (info) =>
          info.row.original.s_phone?.length > 1
            ? info.row.original.s_phone
            : "-",
      },
      {
        header: "Remarks",
        accessorKey: "remarks",
        cell: (info) => info.row.original.remarks,
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: (info) => {
          const status = info.row.original.status;
          switch (status) {
            case 1:
              return (
                <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                  Active
                </span>
              );
            case 2:
              return <span className="badge badge-warning">Pending</span>;
            case 3:
              return <span className="badge badge-error">Rejected</span>;
            case 4:
              return <span className="badge badge-error">Deleted</span>;
            case 5:
              return (
                <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                  Partial Approved
                </span>
              );
            default:
              return "Unknown";
          }
        },
      },
      {
        header: "Actions",
        accessorKey: "view",
        cell: ({ row }) => {
          const rowData = row.original;
          return (
            <Link
              href={`/admin/isin/viewIsin/${rowData.isin}`}
              title="View ISIN Data"
            >
              <Eye className="text-green-500" />
            </Link>
          );
        },
      },
      {
        header: "Download",
        accessorKey: "download",
        cell: ({ row }) => {
          const rowData = row.original;
          return (
            <button
              onClick={() => checkAddressFunction(rowData.isin, rowData.id)}
              title="Download"
            >
              <Download className="text-green-500" />
            </button>
          );
        },
      },
    ],
    []
  );

  useEffect(() => {
    if (activeTab == categories[0]) {
      setDisplayData(data.filter((i) => i.status == 1));
    } else if (activeTab == categories[1]) {
      setDisplayData(data.filter((i) => i.status == 4));
    } else {
      setDisplayData([]);
    }
  }, [activeTab, data]);

  const checkAddressFunction = async (x, id) => {
    try {
      const response = await apiConnector(
        "POST",
        `${apiUrl}/v2/admin/report/checkAddress`,
        {
          isin: x,
        }
      );

      toast.success(response.data.result.message);
    } catch (error) {
      const errMsg = error.response.data.message;
      toast.error(errMsg || `Error: Address is not available for isin ${x}`);
      console.error(`Error: Address is not available for isin ${x}`);
    }
  };

  return (
    <>
      <div className="card">
        <div className="card-header">
          <h1 className="text-xl font-bold text-black">All ISINs</h1>
        </div>
        <div className="mt-4">
          The contents of this table are restricted to Active ISINs, which are
          billable and subject to quarterly maintenance fees. To qualify as
          active, an ISIN must possess an active status in either the CDSL or
          NSDL system.
        </div>
        <div className="card-body ">
          {categories && (
            <div className="flex space-x-8 border-b border-gray-200 mb-4">
              {categories.map((tab) => {
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`p-2 text-[13px] font-medium transition-colors
                ${
                  activeTab === tab
                    ? "border-b-2 border-orange-500 text-orange-500"
                    : "text-black"
                }
              `}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          )}

          <ViewDataTable
            columns={columns}
            data={displayData}
            isLoading={loading}
            columnFilter={true}
            // headerIcons={
            //   <div className="flex items-center gap-1">
            //     <Link href="/admin/isin/get-full-isin-data">
            //       <button type="button" title="">
            //         <FilePlus size={20} />
            //       </button>
            //     </Link>
            //     <Link href="/admin/isin/get-isin-data">
            //       <button type="button" title="">
            //         <Upload size={20} />
            //       </button>
            //     </Link>
            //     <Link href="/admin/isin/get-isin-info-data">
            //       <button type="button" title="">
            //         <Archive size={20} />
            //       </button>
            //     </Link>
            //     <Link href="/admin/isin/edit-isin-media">
            //       <button type="button" title="">
            //         <FileText size={20} />
            //       </button>
            //     </Link>
            //     <Link href="/admin/isin/uploadbenposdata">
            //       <button type="button" title="">
            //         <FileText size={20} />
            //       </button>
            //     </Link>
            //     <Link href="/admin/isin/uploadbenpostrackdata">
            //       <button type="button" title="">
            //         <FileText size={20} />
            //       </button>
            //     </Link>
            //   </div>
            // }
          />
        </div>
      </div>
    </>
  );
};
export default AllIsin;
