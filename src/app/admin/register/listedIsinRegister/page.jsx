"use client";
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { apiConnector } from "@/utils/apihelper";
import { Archive, Eye, FileText, Upload } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const ListedIsinRegister = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //----------------------fetch ListedIsinRegister  data-----------------------------

  const fetchListedRegisterData = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/register/listed-isin-register`
      );
      const responseData = response.data.result || [];
      console.log({ responseData });
      setData(responseData);
      setLoading(false);
    } catch (error) {
      const errMsg = error.response.data.message;
      toast.error(errMsg || "An error occurred while processing the request.");
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListedRegisterData();
  }, []);

  //---------------------------dynamic column---------------------------
  const columns = useMemo(
    () => [
      {
        header: "#",
        accessorKey: "index",
        cell: (info) => info.row.index + 1,
      },
      {
        header: "Cin",
        accessorKey: "cin",
        cell: (info) => info.row.original.cin,
      },
      {
        header: "Type",
        accessorKey: "type",
        cell: (info) => info.row.original.type,
      },
      {
        header: "Isin",
        accessorKey: "isin",
        cell: (info) => info.row.original.isin,
      },
      {
        header: "Cdsl",
        accessorKey: "cdsl",
        cell: (info) => info.row.original.cdsl,
      },
      {
        header: "CDSL Date",
        accessorKey: "cdslDate",
        cell: (info) => {
          const value = info.row.original.cdslDate;
          return value ? new Date(value).toLocaleDateString("en-GB") : "";
        },
      },
      {
        header: "Nsdl",
        accessorKey: "nsdl",
        cell: (info) => info.row.original.nsdl,
      },
      {
        header: "NSDL Date",
        accessorKey: "nsdlDate",
        cell: (info) => {
          const value = info.row.original.nsdlDate;
          return value ? new Date(value).toLocaleDateString("en-GB") : "";
        },
      },
      {
        header: "Facev",
        accessorKey: "facev",
        cell: (info) => info.row.original.facev,
      },
      {
        header: "Paidv",
        accessorKey: "paidv",
        cell: (info) => info.row.original.paidv,
      },
      {
        header: "Instrument",
        accessorKey: "instrument",
        cell: (info) => info.row.original.instrument,
      },
      {
        header: "Connect",
        accessorKey: "connect",
        cell: (info) => info.row.original.connect,
      },
      {
        header: "Transfer",
        accessorKey: "transfer",
        cell: (info) => info.row.original.transfer,
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
              return (
                <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
                  Delete
                </span>
              );
            case 3:
              return (
                <span className=" text-yellow-500 bg-yellow-100  inline-block  text-xs font-semibold px-3 py-1 rounded-full">
                  InActive
                </span>
              );
            case 4:
              return (
                <span className=" text-white bg-gray-500  inline-block  text-xs font-semibold px-3 py-1 rounded-full">
                  Status 4
                </span>
              );
            default:
              return (
                <span className="inline-block bg-blue-400 text-black text-xs font-semibold px-3 py-1 rounded-full">
                  Unknown
                </span>
              );
          }
        },
      },
      {
        header: "Actions",
        accessorKey: "",
        cell: ({ row }) => {
          const rowData = row.original;
          return (
            <>
              <Link
                href={`/admin/register/viewSpecificRegister/${btoa(
                  rowData.id
                )}`}
                title="View ISIN Data"
              >
                <Eye className="text-green-500" />
              </Link>
            </>
          );
        },
      },
    ],
    []
  );

  return (
    <>
      <div className="card">
        <div className="card-body">
          <ViewDataTable
            title="Listed ISIN Register"
            cardHeader=" listed Isin Register data"
            columns={columns}
            data={data}
            isLoading={loading}
            columnFilter={true}
          />
        </div>
      </div>
    </>
  );
};

export default ListedIsinRegister;
