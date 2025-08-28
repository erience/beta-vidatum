"use client";
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { apiConnector } from "@/utils/apihelper";
import { formatDateShort } from "@/utils/helper";
import { PencilLine, Upload } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const IepfRecord = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //----------------------fetch IepfRecord data-----------------------------
  const fetchIepfRecordData = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/register/iepf/iepf-records`
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
    fetchIepfRecordData();
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
        header: "ref",
        accessorKey: "ref",
        cell: (info) => info.row.original.ref || "-",
      },
      {
        header: "isin",
        accessorKey: "isin",
        cell: (info) => info.row.original.isin || "-",
      },
      {
        header: "lf",
        accessorKey: "lf",
        cell: (info) => info.row.original.lf || "-",
      },
      {
        header: "DPClient",
        accessorKey: "dpclient",
        cell: (info) => info.row.original.dpclient || "-",
      },
      {
        header: "tShares",
        accessorKey: "tShares",
        cell: (info) => info.row.original.tShares || "-",
      },
      {
        header: "fValue",
        accessorKey: "fValue",
        cell: (info) => info.row.original.fValue || "-",
      },
      {
        header: "iepfDate",
        accessorKey: "iepfDate",
        cell: (info) => {
          const value = info.row.original.iepfDate || "-";
          return value ? new Date(value).toLocaleDateString("en-GB") : "";
        },
      },
      {
        header: "Full Name",
        accessorKey: "fname",
        cell: (info) => {
          const { fName, mName, lName } = info.row.original || "-";
          return `${fName || ""} ${mName || ""} ${lName || ""}`.trim();
        },
      },
      {
        header: "Father/Husband Full Name",
        accessorKey: "fhfName",
        cell: (info) => {
          const { fhfName, fhmName, fhlName } = info.row.original || "-";
          return `${fhfName || ""} ${fhmName || ""} ${fhlName || ""}`.trim();
        },
      },
      {
        header: "Address",
        accessorKey: "address",
        cell: (info) => {
          const { address, district, state, country, pin } =
            info.row.original || "-";
          return `${
            [address, district, state, country, pin].join(" ") || ""
          }`.trim();
        },
      },
      {
        header: "Pan",
        accessorKey: "pan",
        cell: (info) => info.row.original.pan || "-",
      },
      {
        header: "DOB",
        accessorKey: "dob",
        cell: (info) => formatDateShort(info.row.original.dob || "-"),
      },
      {
        header: "Aadhar",
        accessorKey: "aadhar",
        cell: (info) => info.row.original.aadhar || "-",
      },
      {
        header: "Nominee Name",
        accessorKey: "nName",
        cell: (info) => info.row.original.nName || "-",
      },
      {
        header: "Joint Holder Name",
        accessorKey: "sName",
        cell: (info) => info.row.original.sName || "-",
      },
      {
        header: "Litigation",
        accessorKey: "isLitigation",
        cell: (info) => (info.row.original.isLitigation === 1 ? "Yes" : "No"),
      },
      {
        header: "Suspense",
        accessorKey: "isSuspense",
        cell: (info) => (info.row.original.isSuspense === 1 ? "Yes" : "No"),
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
            title="IEPF Records"
            cardHeader="IEPF Records"
            columns={columns}
            data={data}
            isLoading={loading}
            // headerIcons={
            //   <div className="flex items-center gap-1">
            //     <Link href="/admin/register/iepf/add-iepf">
            //       <button type="button" title="">
            //         <Upload size={25} />
            //       </button>
            //     </Link>
            //     <Link href="/admin/register/iepf/update-iepf-info">
            //       <button type="button" title="">
            //         <PencilLine size={20} />
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

export default IepfRecord;
