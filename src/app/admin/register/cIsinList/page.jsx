"use client";
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { apiConnector } from "@/utils/apihelper";
import { Archive, Eye, FileText, Upload } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const CIsinList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //----------------------fetch ListedIsinRegister  data-----------------------------

  const fetchListedRegisterData = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/isin/view-cisin_map`
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
        header: "ISIN",
        accessorKey: "isin",
        cell: (info) => info.row.original.isin || "-",
      },
      {
        header: "Signature Records",
        accessorKey: "signature",
        cell: (info) => info.row.original.signature || "-",
      },
      {
        header: "Shareholder List",
        accessorKey: "register",
        cell: ({ row }) => {
          const { register } = row.original;
          if (!register) {
            return "-";
          }
          return (
            <Link
              href={`/admin/register/cRegister/${encodeURIComponent(register)}`}
              title="View Shareholder List"
            >
              <Eye className="text-green-500" />
            </Link>
          );
        },
      },

      {
        header: "Certificate List",
        accessorKey: "share",
        cell: ({ row }) => {
          const { share } = row.original;
          // Check if share is null, undefined, or empty string
          if (!share) {
            return "-";
          }
          return (
            <Link
              href={`/admin/register/registerShare/${encodeURIComponent(
                share
              )}`}
              title="View Certificate List Data"
            >
              <Eye className="text-orange-500" />
            </Link>
          );
        },
      },

      {
        header: "Status",
        accessorKey: "status",
        cell: (info) => {
          const status = (info.row.original.status || "Unknown").toLowerCase();

          const getBadgeClasses = (status) => {
            switch (status) {
              case "active":
                return "bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm";
              case "pending":
                return "bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm";
              case "delete":
                return "bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm";
              case "rejected ":
                return "bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm";
              default:
                return "bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-sm";
            }
          };

          return (
            <span className={getBadgeClasses(status)}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
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
            title=" Listed ISINs"
            cardHeader="Listed ISINs Shareholder Master Data"
            columns={columns}
            data={data}
            isLoading={loading}
            columnFilter={true}
            // headerIcons={
            //   <div className="flex items-center gap-1">
            //     <Link href="/admin/register/add-register">
            //       <button type="button" title="">
            //         <Upload size={25} />
            //       </button>
            //     </Link>
            //     <Link href="/admin/isin/get-isin-info-data">
            //       <button type="button" title="">
            //         <Archive size={25} />
            //       </button>
            //     </Link>
            //     <Link href="/admin/isin/edit-isin-media">
            //       <button type="button" title="">
            //         <FileText size={25} />
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

export default CIsinList;
