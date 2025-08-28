"use client";
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { apiConnector } from "@/utils/apihelper";
import { formatDateLong } from "@/utils/helper";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const UserRemateHistory = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //----------------------fetch remat data-----------------------------

  const fetchRematData = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/user/reconciliation/remat`
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
    fetchRematData();
  }, []);

  //-------------------------------download function---------------------
  const stgFunction = async (encodedRef) => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/user/process/download-data-of-inward?id=${encodedRef}&table=b_inward&isin=b_isin&demattable=b_inward_info`
      );

      if (response.data.status === true) {
        window.location.href = `${apiUrl}/v2/user/process/download-data-of-inward-final?id=${encodedRef}&table=b_inward&isin=b_isin&demattable=b_inward_info`;
      } else {
        toast.error(response.data.message || "Unknown error occurred");
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Unexpected error occurred";
      toast.error(errorMsg);
      console.error("Error:", error);
    }
  };

  //---------------------------dynamic column---------------------------
  const columns = useMemo(
    () => [
      { header: "#", accessorKey: "index", cell: (info) => info.row.index + 1 },

      {
        header: "Type",
        accessorKey: "type",
        cell: (info) => info.row.original.type == 1,
      },
      {
        header: "ISIN",
        accessorKey: "isin",
        cell: (info) => info.row.original.isin,
      },
      {
        header: "Inward Date",
        accessorKey: "date",
        cell: (info) => formatDateLong(info.row.original.date),
      },

      {
        header: "Count",
        accessorKey: "count",
        cell: (info) => info.row.original.count,
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
                <span className=" text-yellow-500 bg-yellow-100  inline-block  text-xs font-semibold px-3 py-1 rounded-full">
                  InActive
                </span>
              );
            case 3:
              return (
                <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
                  Error
                </span>
              );
            default:
              return "Unknown";
          }
        },
      },
    ],
    [data]
  );

  return (
    <>
      <div className="card">
        <div className="card-body">
          <ViewDataTable
            title="Remat History"
            cardHeader="remat history data"
            columns={columns}
            data={data}
            isLoading={loading}
          />
        </div>
      </div>
    </>
  );
};

export default UserRemateHistory;
