"use client";
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { apiConnector } from "@/utils/apihelper";
import formatPeriodToDMY from "@/utils/helper";
import { Download, Upload } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const Report76 = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //----------------------fetch report76 data-----------------------------

  const fetchReport76 = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/report/report76`
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
    fetchReport76();
  }, []);

  //--------------------------check address----------------------------
  const checkAddressFunction = async (isin, id) => {
    try {
      const response = await apiConnector(
        "POST",
        `${apiUrl}/v2/admin/report/checkAddress`,
        {
          isin,
        }
      );
      const data = response.data;
      if (data.status) {
        toast.success(response.data.result.message);
        const url = `/admin/report/downloadReport76/${btoa(id)}`;
        window.open(url, "_blank");
      } else {
        toast.error(response.data.result.message);
      }
    } catch (error) {
      toast.error(
        "Address is not avaiable",
        error.response.data.result.message
      );
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
        header: "ISIN",
        accessorKey: "isin_id",
        cell: (info) => info.row.original.isin_id,
      },

      {
        header: "Period",
        accessorKey: "period",
        cell: (info) => formatPeriodToDMY(info.row.original.period),
      },
      {
        header: "O_CDSL",
        accessorKey: "o_cdsl",
        cell: (info) => info.row.original.o_cdsl,
      },
      {
        header: "O_NSDL",
        accessorKey: "o_nsdl",
        cell: (info) => info.row.original.o_nsdl,
      },
      {
        header: "O_PHY",
        accessorKey: "o_phy",
        cell: (info) => info.row.original.o_phy,
      },
      {
        header: "D_T_CDSL_COUNT",
        accessorKey: "d_t_cdsl_count",
        cell: (info) => info.row.original.d_t_cdsl_count,
      },
      {
        header: "D_T_CDSL",
        accessorKey: "d_t_cdsl",
        cell: (info) => info.row.original.d_t_cdsl,
      },
      {
        header: "D_A_CDSL_COUNT",
        accessorKey: "d_a_cdsl_count",
        cell: (info) => info.row.original.d_a_cdsl_count,
      },
      {
        header: "D_A_CDSL",
        accessorKey: "d_a_cdsl",
        cell: (info) => info.row.original.d_a_cdsl,
      },
      {
        header: "D_T_NSDL_COUNT",
        accessorKey: "d_t_nsdl_count",
        cell: (info) => info.row.original.d_t_nsdl_count,
      },
      {
        header: "D_T_NSDL",
        accessorKey: "d_t_nsdl",
        cell: (info) => info.row.original.d_t_nsdl,
      },
      {
        header: "D_A_NSDL_COUNT",
        accessorKey: "d_a_nsdl_count",
        cell: (info) => info.row.original.d_a_nsdl_count,
      },
      {
        header: "D_A_NSDL",
        accessorKey: "d_a_nsdl",
        cell: (info) => info.row.original.d_a_nsdl,
      },
      {
        header: "R_T_CDSL_COUNT",
        accessorKey: "r_t_cdsl_count",
        cell: (info) => info.row.original.r_t_cdsl_count,
      },
      {
        header: "R_T_CDSL",
        accessorKey: "r_t_cdsl",
        cell: (info) => info.row.original.r_t_cdsl,
      },
      {
        header: "R_A_CDSL_COUNT",
        accessorKey: "r_a_cdsl_count",
        cell: (info) => info.row.original.r_a_cdsl_count,
      },
      {
        header: "R_A_CDSL",
        accessorKey: "r_a_cdsl",
        cell: (info) => info.row.original.r_a_cdsl,
      },
      {
        header: "R_T_NSDL_COUNT",
        accessorKey: "r_t_nsdl_count",
        cell: (info) => info.row.original.r_t_nsdl_count,
      },
      {
        header: "R_T_NSDL",
        accessorKey: "r_t_nsdl",
        cell: (info) => info.row.original.r_t_nsdl,
      },
      {
        header: "R_A_NSDL_COUNT",
        accessorKey: "r_a_nsdl_count",
        cell: (info) => info.row.original.r_a_nsdl_count,
      },
      {
        header: "R_A_NSDL",
        accessorKey: "r_a_nsdl",
        cell: (info) => info.row.original.r_a_nsdl,
      },
      {
        header: "C_CDSL",
        accessorKey: "c_cdsl",
        cell: (info) => info.row.original.c_cdsl,
      },
      {
        header: "C_NSDL",
        accessorKey: "c_nsdl",
        cell: (info) => info.row.original.c_nsdl,
      },
      {
        header: "C_PHY",
        accessorKey: "c_phy",
        cell: (info) => info.row.original.c_phy,
      },
      {
        header: "NOTE",
        accessorKey: "note",
        cell: (info) => info.row.original.note,
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
      {
        header: "Actions",
        accessorKey: "",
        cell: ({ row }) => {
          const rowData = row.original;
          return (
            <>
              <button
                className="position-relative mx-3"
                onClick={() =>
                  checkAddressFunction(rowData.isin_id, rowData.id)
                }
              >
                <Download className="text-green-500" />
              </button>
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
            title="Upload Report 76"
            cardHeader="Upload Report 76"
            columns={columns}
            data={data}
            isLoading={loading}
            // headerIcons={
            //   <div className="flex items-center gap-1">
            //     <Link href="/admin/report/add_report76">
            //       <button type="button" title="">
            //         <Upload size={25} />
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

export default Report76;
