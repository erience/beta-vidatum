"use client";
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { apiConnector } from "@/utils/apihelper";
import { Download, Eye } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const UserAllInward = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Fetching data for inward processing

  const fetchKycData = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/user/process/kyc`
      );
      const responseData = response.data.result.inward || [];
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
    fetchKycData();
  }, []);

  // Function for downloading data (similar to stgFunction)
  const stgFunction = async (x, y = false) => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/user/process/download-data-of-inward?id=${x}&table=b_inward&isin=b_isin&demattable=b_inward_info`
      );
      if (response.status === 200) {
        const result = response.data;
        toast.success(result.message);

        if (y) {
          window.location.href = `/user/process/download-data-of-annexure-final?id=${x}`;
        } else {
          window.location.href = `/user/process/download-data-of-inward-final?id=${x}&demattable=b_inward_info`;
        }
      } else {
        toast.error("Failed to process request.");
      }
    } catch (error) {
      toast.error("Error occurred while processing request.");
    }
  };

  // Columns configuration
  const columns = useMemo(
    () => [
      { header: "#", accessorKey: "index", cell: (info) => info.row.index + 1 },
      {
        header: "Inward Date",
        accessorKey: "date",
        cell: (info) => {
          const dateStr = info.row.original.date;
          const date = new Date(dateStr);
          return date.toLocaleDateString("en-GB");
        },
      },
      {
        header: "Process Date",
        accessorKey: "p_date",
        cell: (info) => {
          const dateStr = info.row.original.p_date;
          const date = new Date(dateStr);
          return date.toLocaleDateString("en-GB");
        },
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
        header: "Action",
        accessorKey: "",
        cell: ({ row }) => {
          const rowData = row.original;
          return (
            <>
              <Link
                target="_blank"
                href={`/user/process/userViewAllInward?ref=${btoa(rowData.ref)}`}
                title="View ISIN Data"
              >
                <Eye />
              </Link>
            </>
          );
        },
      },

      {
        header: "Action",
        accessorKey: "status",
        cell: ({ row }) => {
          const { status, ref } = row.original;

          return (
            <div>
              {status === 1 || status === 3 ? (
                <a
                  href="javascript:void(0)"
                  onClick={() => stgFunction(btoa(ref))}
                  className="action-icon"
                >
                  <Download />
                </a>
              ) : null}

              {status === 2 && (
                <>
                  <a
                    href="javascript:void(0)"
                    onClick={() => stgFunction(btoa(ref))}
                    className="action-icon"
                  >
                    <Download />
                  </a>
                  <a
                    href="javascript:void(0)"
                    onClick={() => stgFunction(btoa(ref), true)}
                    className="action-icon"
                  >
                    <Download />
                  </a>
                </>
              )}
              {status === 5 && (
                <a
                  href="javascript:void(0)"
                  onClick={() => stgFunction(btoa(ref), true)}
                  className="action-icon"
                >
                  <Download />
                </a>
              )}
              {status === 4 && (
                <span>Action not available for deleted status</span>
              )}
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <>
      <div className="card">
        <div className="card-body ">
          <ViewDataTable
            title="All KYC Inward"
            cardHeader="all kyc data"
            columns={columns}
            data={data}
            isLoading={loading}
            headerIcons={<div className="flex items-center gap-1"></div>}
          />
        </div>
      </div>
    </>
  );
};

export default UserAllInward;
