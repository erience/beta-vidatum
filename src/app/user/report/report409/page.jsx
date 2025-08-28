"use client";
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { apiConnector } from "@/utils/apihelper";
import { Download, Upload } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const Report409 = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //----------------------fetch report data-----------------------------
  const fetchReportData = async () => {
    try {
      const responseData = await apiConnector(
        "GET",
        `${apiUrl}/v2/user/report/report-40-9`
      );
      const result = responseData.data.result || [];
      console.log({ result });
      setData(result);
      setLoading(false);
    } catch (error) {
      const errMsg = error.response.data.message;
      toast.error(errMsg || "An error occurred while processing the request.");
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  //--------------------------check address----------------------------
  const downloadReport = async (id) => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/user/download-report-409/${id}`
      );
      const data = response.data;

      if (data.status == true) {
        const downloadUrl = `/user/report/userDownloadReport409/${id}`;
        window.open(downloadUrl, "_blank");
        toast.success(data.result.message);
      } else {
        toast.error(data.result.message);
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.result?.message ||
        "An error occurred while processing the request.";
      toast.error(errorMessage);
      console.error("Download Report Error:", error);
    }
  };

  //---------------------------dynamic column---------------------------
  const columns = useMemo(
    () => [
      {
        header: "#",
        accessorKey: "index",
        cell: (info) => info.row.index + 1,
      },
      {
        header: "Date",
        accessorKey: "date",
        cell: (info) => {
          const value = info.row.original.date;
          return value ? new Date(value).toLocaleDateString("en-GB") : "";
        },
      },
      {
        header: "Period",
        accessorKey: "period",
        cell: (info) => info.row.original.period,
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: (info) => {
          const status = info.row.original.status;
          switch (status) {
            case 1:
              return <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">Active</span>;
            case 2:
              return <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">Inactive</span>;
            case 3:
              return <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">Delete </span>;
            default:
              return (
                <span className="px-2 py-1 text-white bg-black rounded-md">
                  Unknown
                </span>
              );
          }
        },
      },
      {
        header: "Actions",
        accessorKey: "is_download",
        cell: ({ row }) => {
          const rowData = row.original;

          return rowData.is_download === 1 ? (
            <button
              className="position-relative mx-3"
              onClick={() => downloadReport(rowData.id)}
            >
              <Download />
            </button>
          ) : null;
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
            title="Upload Report 409"
            cardHeader="upload report 409 data"
            columns={columns}
            data={data}
            isLoading={loading}
          />
        </div>
      </div>
    </>
  );
};

export default Report409;
