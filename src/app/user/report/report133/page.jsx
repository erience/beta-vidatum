"use client";
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { apiConnector } from "@/utils/apihelper";
import { Download, Upload } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const Report133 = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //----------------------fetch report data-----------------------------
  const fetchReportData = async () => {
    try {
      const responseData = await apiConnector(
        "GET",
        `${apiUrl}/v2/user/report/report-13-3`
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
        `${apiUrl}/v2/user/download-report-133/${id}`
      );
      const data = response.data;

      if (data.status == true) {
        const downloadUrl = `/user/report/userDownloadReport133/${id}`;
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
        header: "Open",
        accessorKey: "open",
        cell: (info) => info.row.original.open,
      },
      {
        header: "New",
        accessorKey: "new",
        cell: (info) => info.row.original.new,
      },
      {
        header: "Close",
        accessorKey: "close",
        cell: (info) => info.row.original.close,
      },
      {
        header: "Balance",
        accessorKey: "balance",
        cell: (info) => info.row.original.balance,
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
        <div className="card-body">
          <ViewDataTable
            title="Upload Report 133"
            cardHeader="upload-report-133 data"
            columns={columns}
            data={data}
            isLoading={loading}
          />
        </div>
      </div>
    </>
  );
};

export default Report133;
