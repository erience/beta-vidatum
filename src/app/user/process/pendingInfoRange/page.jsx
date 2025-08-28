"use client";
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { apiConnector } from "@/utils/apihelper";
import { formatDateLong } from "@/utils/helper";
import { Eye } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const PendingInfoRange = () => {
  const [data, setData] = useState([]);
  const [inwardData, setInwardData] = useState([]);
  const [rangeData, setRangeData] = useState([]);
  const [transmissionData, setTransmissionData] = useState([]);
  const [pendingOtherData, setPendingOtherData] = useState([]);
  const [duplicateData, setDuplicateData] = useState([]);
  const [kycData, setKycData] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //----------------------fetch panding info data-----------------------------

  const fetchPendingData = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/user/process/pending-info-range`
      );
      const responseData = response.data.result || [];
      console.log({ responseData });
      setData(responseData);
      setInwardData(responseData.inwardinfoData);
      setRangeData(responseData.inwardRangeData);
      setTransmissionData(responseData.transmissionData);
      setPendingOtherData(responseData.otherData);
      setDuplicateData(responseData.duplicateData);
      setKycData(responseData.kycData);
      setLoading(false);
    } catch (error) {
      const errMsg = error.response.data.message;
      toast.error(errMsg || "An error occurred while processing the request.");
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPendingData();
  }, []);

  //---------------------------Pending Demat Info---------------------------
  const columns = useMemo(
    () => [
      { header: "#", accessorKey: "index", cell: (info) => info.row.index + 1 },
      {
        header: "Inward Date",
        accessorKey: "date",
        cell: (info) => formatDateLong(info.row.original.date),
      },
      {
        header: "Process Date",
        accessorKey: "p_date",
        cell: (info) => formatDateLong(info.row.original.p_date),
      },

      {
        header: "Ref No.",
        accessorKey: "ref",
        cell: (info) => info.row.original.ref,
      },
      {
        header: "ISIN",
        accessorKey: "isin",
        cell: (info) => info.row.original.isin,
      },

      {
        header: "Mode",
        accessorKey: "mode",
        cell: (info) => info.row.original.mode,
      },
      {
        header: "Sender",
        accessorKey: "sender",
        cell: (info) => info.row.original.sender,
      },
      {
        header: "Type",
        accessorKey: "type",
        cell: (info) => info.row.original.type,
      },
      {
        header: "Location",
        accessorKey: "location",
        cell: (info) => info.row.original.location,
      },
      {
        header: "Sub Type",
        accessorKey: "sub_type",
        cell: (info) =>
          info.row.original.sub_type ? info.row.original.sub_type : "-",
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
                  Approve
                </span>
              );
            case 2:
              return (
                <span className="px-2 py-1 text-yellow-500 bg-yellow-100 rounded-md">
                  Pending
                </span>
              );
            case 3:
              return (
                <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
                  Rejected
                </span>
              );
            case 4:
              return (
                <span className="px-2 py-1 text-white bg-gray-500 rounded-md">
                  Deleted
                </span>
              );
            case 5:
              return (
                <span className=" inline-block text-white bg-blue-500  inline-block  text-xs font-semibold px-3 py-1 rounded-full">
                  Partial Approved
                </span>
              );
            default:
              return "Unknown";
          }
        },
      },

      {
        header: "Action",
        accessorKey: "",
        cell: ({ row }) => {
          const rowData = row.original;
          return (
            <>
              <Link
                href={`/user/process/userViewAllInward?ref=${btoa(
                  rowData.ref
                )}`}
                title="View ISIN Data"
              >
                <Eye />
              </Link>
            </>
          );
        },
      },
    ],
    []
  );
  //--------------------------------Pending Range Data-------------------------
  const pendingRange = useMemo(
    () => [
      { header: "#", accessorKey: "index", cell: (info) => info.row.index + 1 },
      {
        header: "Inward Date",
        accessorKey: "date",
        cell: (info) => formatDateLong(info.row.original.date),
      },
      {
        header: "Process Date",
        accessorKey: "p_date",
        cell: (info) => formatDateLong(info.row.original.p_date),
      },

      {
        header: "Ref No.",
        accessorKey: "ref",
        cell: (info) => info.row.original.ref,
      },
      {
        header: "ISIN",
        accessorKey: "isin",
        cell: (info) => info.row.original.isin,
      },

      {
        header: "Mode",
        accessorKey: "mode",
        cell: (info) => info.row.original.mode,
      },
      {
        header: "Sender",
        accessorKey: "sender",
        cell: (info) => info.row.original.sender,
      },
      {
        header: "Type",
        accessorKey: "type",
        cell: (info) => info.row.original.type,
      },
      {
        header: "Location",
        accessorKey: "location",
        cell: (info) => info.row.original.location,
      },
      {
        header: "Sub Type",
        accessorKey: "sub_type",
        cell: (info) =>
          info.row.original.sub_type ? info.row.original.sub_type : "-",
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
                  Approve
                </span>
              );
            case 2:
              return (
                <span className="px-2 py-1 text-yellow-500 bg-yellow-100 rounded-md">
                  Pending
                </span>
              );
            case 3:
              return (
                <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
                  Rejected
                </span>
              );
            case 4:
              return (
                <span className="px-2 py-1 text-white bg-gray-500 rounded-md">
                  Deleted
                </span>
              );
            case 5:
              return (
                <span className=" inline-block text-white bg-blue-500  inline-block  text-xs font-semibold px-3 py-1 rounded-full">
                  Partial Approved
                </span>
              );
            default:
              return "Unknown";
          }
        },
      },

      {
        header: "Action",
        accessorKey: "",
        cell: ({ row }) => {
          const rowData = row.original;
          return (
            <>
              <Link
                target="_blank"
                href={`/user/process/viewallinward?ref=${btoa(rowData.ref)}`}
                title="View ISIN Data"
              >
                <Eye />
              </Link>
            </>
          );
        },
      },
    ],
    []
  );
  //----------------------------------Pending Transmission Data----------------
  const transmissionCols = useMemo(
    () => [
      { header: "#", accessorKey: "index", cell: (info) => info.row.index + 1 },
      {
        header: "Inward Date",
        accessorKey: "date",
        cell: (info) => formatDateLong(info.row.original.date),
      },
      {
        header: "Process Date",
        accessorKey: "p_date",
        cell: (info) => formatDateLong(info.row.original.p_date),
      },

      {
        header: "Ref No.",
        accessorKey: "ref",
        cell: (info) => info.row.original.ref,
      },
      {
        header: "ISIN",
        accessorKey: "isin",
        cell: (info) => info.row.original.isin,
      },

      {
        header: "Mode",
        accessorKey: "mode",
        cell: (info) => info.row.original.mode,
      },
      {
        header: "Sender",
        accessorKey: "sender",
        cell: (info) => info.row.original.sender,
      },
      {
        header: "Type",
        accessorKey: "type",
        cell: (info) => info.row.original.type,
      },
      {
        header: "Location",
        accessorKey: "location",
        cell: (info) => info.row.original.location,
      },
      {
        header: "Sub Type",
        accessorKey: "sub_type",
        cell: (info) =>
          info.row.original.sub_type ? info.row.original.sub_type : "-",
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
                  Approve
                </span>
              );
            case 2:
              return (
                <span className="px-2 py-1 text-yellow-500 bg-yellow-100 rounded-md">
                  Pending
                </span>
              );
            case 3:
              return (
                <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
                  Rejected
                </span>
              );
            case 4:
              return (
                <span className="px-2 py-1 text-white bg-gray-500 rounded-md">
                  Deleted
                </span>
              );
            case 5:
              return (
                <span className=" inline-block text-white bg-blue-500  inline-block  text-xs font-semibold px-3 py-1 rounded-full">
                  Partial Approved
                </span>
              );
            default:
              return "Unknown";
          }
        },
      },

      {
        header: "Action",
        accessorKey: "",
        cell: ({ row }) => {
          const rowData = row.original;
          return (
            <>
              <Link
                target="_blank"
                href={`/user/process/viewallinward?ref=${btoa(rowData.ref)}`}
                title="View ISIN Data"
              >
                <Eye />
              </Link>
            </>
          );
        },
      },
    ],
    []
  );
  //--------------------------------Pending Other Data----------------------------
  const pendingOthercols = useMemo(
    () => [
      { header: "#", accessorKey: "index", cell: (info) => info.row.index + 1 },
      {
        header: "Inward Date",
        accessorKey: "date",
        cell: (info) => formatDateLong(info.row.original.date),
      },
      {
        header: "Process Date",
        accessorKey: "p_date",
        cell: (info) => formatDateLong(info.row.original.p_date),
      },

      {
        header: "Ref No.",
        accessorKey: "ref",
        cell: (info) => info.row.original.ref,
      },
      {
        header: "ISIN",
        accessorKey: "isin",
        cell: (info) => info.row.original.isin,
      },

      {
        header: "Mode",
        accessorKey: "mode",
        cell: (info) => info.row.original.mode,
      },
      {
        header: "Sender",
        accessorKey: "sender",
        cell: (info) => info.row.original.sender,
      },
      {
        header: "Type",
        accessorKey: "type",
        cell: (info) => info.row.original.type,
      },
      {
        header: "Location",
        accessorKey: "location",
        cell: (info) => info.row.original.location,
      },
      {
        header: "Sub Type",
        accessorKey: "sub_type",
        cell: (info) =>
          info.row.original.sub_type ? info.row.original.sub_type : "-",
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
                  Approve
                </span>
              );
            case 2:
              return (
                <span className=" text-yellow-500 bg-yellow-100 inline-block text-xs font-semibold px-3 py-1 rounded-full">
                  Pending
                </span>
              );
            case 3:
              return (
                <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
                  Rejected
                </span>
              );
            case 4:
              return (
                <span className="px-2 py-1 text-white bg-gray-500 rounded-md">
                  Deleted
                </span>
              );
            case 5:
              return (
                <span className=" inline-block text-white bg-blue-500  inline-block  text-xs font-semibold px-3 py-1 rounded-full">
                  Partial Approved
                </span>
              );
            default:
              return "Unknown";
          }
        },
      },

      {
        header: "Action",
        accessorKey: "",
        cell: ({ row }) => {
          const rowData = row.original;
          return (
            <>
              <Link
                target="_blank"
                href={`/user/process/viewallinward?ref=${btoa(rowData.ref)}`}
                title="View ISIN Data"
              >
                <Eye />
              </Link>
            </>
          );
        },
      },
    ],
    []
  );
  //--------------------------------Pending Duplicate Data------------------------
  const duplicateCols = useMemo(
    () => [
      { header: "#", accessorKey: "index", cell: (info) => info.row.index + 1 },
      {
        header: "Inward Date",
        accessorKey: "date",
        cell: (info) => formatDateLong(info.row.original.date),
      },
      {
        header: "Process Date",
        accessorKey: "p_date",
        cell: (info) => formatDateLong(info.row.original.p_date),
      },

      {
        header: "Ref No.",
        accessorKey: "ref",
        cell: (info) => info.row.original.ref,
      },
      {
        header: "ISIN",
        accessorKey: "isin",
        cell: (info) => info.row.original.isin,
      },

      {
        header: "Mode",
        accessorKey: "mode",
        cell: (info) => info.row.original.mode,
      },
      {
        header: "Sender",
        accessorKey: "sender",
        cell: (info) => info.row.original.sender,
      },
      {
        header: "Type",
        accessorKey: "type",
        cell: (info) => info.row.original.type,
      },
      {
        header: "Location",
        accessorKey: "location",
        cell: (info) => info.row.original.location,
      },
      {
        header: "Sub Type",
        accessorKey: "sub_type",
        cell: (info) =>
          info.row.original.sub_type ? info.row.original.sub_type : "-",
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
                  Approve
                </span>
              );
            case 2:
              return (
                <span className="px-2 py-1 text-yellow-500 bg-yellow-100 rounded-md">
                  Pending
                </span>
              );
            case 3:
              return (
                <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
                  Rejected
                </span>
              );
            case 4:
              return (
                <span className="px-2 py-1 text-white bg-gray-500 rounded-md">
                  Deleted
                </span>
              );
            case 5:
              return (
                <span className=" inline-block text-white bg-blue-500  inline-block  text-xs font-semibold px-3 py-1 rounded-full">
                  Partial Approved
                </span>
              );
            default:
              return "Unknown";
          }
        },
      },

      {
        header: "Action",
        accessorKey: "",
        cell: ({ row }) => {
          const rowData = row.original;
          return (
            <>
              <Link
                target="_blank"
                href={`/user/process/viewallinward?ref=${btoa(rowData.ref)}`}
                title="View ISIN Data"
              >
                <Eye />
              </Link>
            </>
          );
        },
      },
    ],
    []
  );
  //--------------------------------Pending Kyc Data------------------------------
  const kycCols = useMemo(
    () => [
      { header: "#", accessorKey: "index", cell: (info) => info.row.index + 1 },
      {
        header: "Inward Date",
        accessorKey: "date",
        cell: (info) => formatDateLong(info.row.original.date),
      },
      {
        header: "Process Date",
        accessorKey: "p_date",
        cell: (info) => formatDateLong(info.row.original.p_date),
      },

      {
        header: "Ref No.",
        accessorKey: "ref",
        cell: (info) => info.row.original.ref,
      },
      {
        header: "ISIN",
        accessorKey: "isin",
        cell: (info) => info.row.original.isin,
      },

      {
        header: "Mode",
        accessorKey: "mode",
        cell: (info) => info.row.original.mode,
      },
      {
        header: "Sender",
        accessorKey: "sender",
        cell: (info) => info.row.original.sender,
      },
      {
        header: "Type",
        accessorKey: "type",
        cell: (info) => info.row.original.type,
      },
      {
        header: "Location",
        accessorKey: "location",
        cell: (info) => info.row.original.location,
      },
      {
        header: "Sub Type",
        accessorKey: "sub_type",
        cell: (info) =>
          info.row.original.sub_type ? info.row.original.sub_type : "-",
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
                  Approve
                </span>
              );
            case 2:
              return (
                <span className="px-2 py-1 text-yellow-500 bg-yellow-100 rounded-md">
                  Pending
                </span>
              );
            case 3:
              return (
                <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
                  Rejected
                </span>
              );
            case 4:
              return (
                <span className="px-2 py-1 text-white bg-gray-500 rounded-md">
                  Deleted
                </span>
              );
            case 5:
              return (
                <span className=" inline-block text-white bg-blue-500  inline-block  text-xs font-semibold px-3 py-1 rounded-full">
                  Partial Approved
                </span>
              );
            default:
              return "Unknown";
          }
        },
      },

      {
        header: "Action",
        accessorKey: "",
        cell: ({ row }) => {
          const rowData = row.original;
          return (
            <>
              <Link
                target="_blank"
                href={`/user/process/viewallinward?ref=${btoa(rowData.ref)}`}
                title="View ISIN Data"
              >
                <Eye />
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
            title="Pending Demat Info"
            columns={columns}
            data={inwardData}
            isLoading={loading}
          />
          <ViewDataTable
            title="Pending Range Data"
            columns={pendingRange}
            data={rangeData}
            isLoading={loading}
          />
          <ViewDataTable
            title="Pending Transmission Data"
            columns={transmissionCols}
            data={transmissionData}
            isLoading={loading}
          />
          <ViewDataTable
            title="Pending Other Data"
            columns={pendingOthercols}
            data={pendingOtherData}
            isLoading={loading}
          />
          <ViewDataTable
            title="Pending Duplicate Data"
            columns={duplicateCols}
            data={duplicateData}
            isLoading={loading}
          />
          <ViewDataTable
            title="Pending Kyc Data"
            columns={kycCols}
            data={kycData}
            isLoading={loading}
          />
        </div>
      </div>
    </>
  );
};

export default PendingInfoRange;
