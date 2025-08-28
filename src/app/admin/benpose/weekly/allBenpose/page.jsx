"use client";
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { apiConnector } from "@/utils/apihelper";
import { Edit, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const AllBenpose = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //----------------------fetch BensposeList data-----------------------------
  const fetchWeeklyBenposeData = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/benpose/benpose-index`
      );
      const responseData = response.data.data || [];
      console.log({ responseData });
      setData(responseData);
      setLoading(false);
    } catch (error) {
      const errMsg = error.response.data.error;
      toast.error(errMsg || "Error While fetching data");
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchWeeklyBenposeData();
  }, []);

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
        cell: (info) => info.row.original.date || "-",
      },
      {
        header: "Demate",
        accessorKey: "demat",
        cell: (info) => {
          const depository = info.row.original.demat;
          return depository == 1 ? "Yes" : "No";
        },
      },
      {
        header: "Physical",
        accessorKey: "physical",
        cell: (info) => (info.row.original.physical == 1 ? "Yes" : "No"),
      },
      {
        header: "Change",
        accessorKey: "change",
        cell: (info) => (info.row.original.change == 1 ? "Yes" : "No"),
      },
      {
        header: "Remarks",
        accessorKey: "remarks",
        cell: (info) => info.row.original.remarks || "-",
      },
      // {
      //   header: "Status",
      //   accessorKey: "status",
      //   cell: (info) => {
      //     const status = info.row.original.status;
      //     switch (status) {
      //       case 1:
      //         return <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">Active</span>;
      //       case 2:
      //         return (
      //               <span className=" text-yellow-500 bg-yellow-100  inline-block  text-xs font-semibold px-3 py-1 rounded-full">
      //             InActive
      //           </span>
      //         );
      //       case 3:
      //         return <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">Delete</span>;
      //       default:
      //         return "Unknown";
      //     }
      //   },
      // },
      {
        header: "Status",
        accessorKey: "status",
        cell: (info) => {
          const status = (info.row.original.status || "Unknown").toLowerCase();

          const getBadgeClasses = (status) => {
            switch (status) {
              case "active":
                return "bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm";
              case "inactive":
                return "bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm";
              case "delete":
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
        header: "Edit",
        accessorKey: "",
        cell: ({ row }) => {
          const rowData = row.original;
          return (
            <>
              <Link
                href={`/admin/benpose/weekly/editBenpose/${rowData.id}`}
                title="View ISIN Data"
              >
                <Edit className="text-yellow-500" size={20} />
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
        <div className="card-header">
          <h1 className="text-xl font-bold text-black">Benpose List</h1>
        </div>
        <div className="card-body">
          <div className="mb-4">
            The contents of this table are restricted to Active ISINs, which are
            billable and subject to quarterly maintenance fees. To qualify as
            active, an ISIN must possess an active status in either the CDSL or
            NSDL system.
          </div>
          <ViewDataTable
            columns={columns}
            data={data}
            isLoading={loading}
            headerIcons={
              <div className="flex items-center gap-1">
                <Link href="/admin/benpose/weekly/addBenpose">
                  <button type="button" title="">
                    <Plus size={25} />
                  </button>
                </Link>
              </div>
            }
          />
        </div>
      </div>
    </>
  );
};

export default AllBenpose;
