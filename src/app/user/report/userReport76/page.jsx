"use client";
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { apiConnector } from "@/utils/apihelper";
import { Download, Upload } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const UserReport76 = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //----------------------fetch report data-----------------------------
  const fetchReportData = async () => {
    try {
      const responseData = await apiConnector(
        "GET",
        `${apiUrl}/v2/user/report/report-76`
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
        `${apiUrl}/v2/user/get-report-76/${id}`
      );
      const data = response.data;

      if (data.status == true) {
        const downloadUrl = `/user/report/userDownloadReport76/${id}`;
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
          return value
            ? new Date(value).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })
            : "";
        },
      },
      { header: "Isin", accessorKey: "isin_id" },
      { header: "Period", accessorKey: "period" },
      { header: "o_cdsl", accessorKey: "o_cdsl" },
      { header: "o_nsdl", accessorKey: "o_nsdl" },
      { header: "o_phy", accessorKey: "o_phy" },
      { header: "d_t_cdsl_count", accessorKey: "d_t_cdsl_count" },
      { header: "d_t_cdsl", accessorKey: "d_t_cdsl" },
      { header: "d_a_cdsl_count", accessorKey: "d_a_cdsl_count" },
      { header: "d_a_cdsl", accessorKey: "d_a_cdsl" },
      { header: "d_t_nsdl_count", accessorKey: "d_t_nsdl_count" },
      { header: "d_t_nsdl", accessorKey: "d_t_nsdl" },
      { header: "d_a_nsdl_count", accessorKey: "d_a_nsdl_count" },
      { header: "d_a_nsdl", accessorKey: "d_a_nsdl" },
      { header: "r_t_cdsl_count", accessorKey: "r_t_cdsl_count" },
      { header: "r_t_cdsl", accessorKey: "r_t_cdsl" },
      { header: "r_a_cdsl_count", accessorKey: "r_a_cdsl_count" },
      { header: "r_a_cdsl", accessorKey: "r_a_cdsl" },
      { header: "r_t_nsdl_count", accessorKey: "r_t_nsdl_count" },
      { header: "r_t_nsdl", accessorKey: "r_t_nsdl" },
      { header: "r_a_nsdl_count", accessorKey: "r_a_nsdl_count" },
      { header: "r_a_nsdl", accessorKey: "r_a_nsdl" },
      { header: "c_cdsl", accessorKey: "c_cdsl" },
      { header: "c_nsdl", accessorKey: "c_nsdl" },
      { header: "c_phy", accessorKey: "c_phy" },
      {
        header: "Action",
        accessorKey: "id",
        cell: ({ row }) => {
          const rowData = row.original;
          return (
            <button
              onClick={() => downloadReport(rowData.id)}
              className="position-relative mx-2"
            >
              <Download />
            </button>
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
            title="Report 76"
            cardHeader="report 76 data"
            columns={columns}
            data={data}
            isLoading={loading}
          />
        </div>
      </div>
    </>
  );
};

export default UserReport76;
