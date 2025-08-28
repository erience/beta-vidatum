"use client";
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { apiConnector } from "@/utils/apihelper";
import { formatDMY } from "@/utils/helper";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const RegisterShare = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { table } = useParams();

  //----------------------fetch ListedIsinRegister  data-----------------------------

  const fetchListedRegisterData = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/register/viewc_register_share_data?data=${table}`
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
        header: "Allotment Date",
        accessorKey: "a_date",
        cell: (info) => info.row.original.a_date || "-",
        // cell: (info) => {
        //   const value = info.row.original.a_date;
        //   return value ? new Date(value).toLocaleDateString("en-GB") : "";
        // },
      },
      {
        header: "Endorsement Date",
        accessorKey: "i_date",
        cell: (info) => info.row.original.i_date || "-",
        // cell: (info) => {
        //   const value = info.row.original.i_date;
        //   return value ? new Date(value).toLocaleDateString("en-GB") : "";
        // },
      },
      {
        header: "Seller LF No.",
        accessorKey: "lf",
        cell: (info) => info.row.original.lf || "-",
      },
      {
        header: "Buyer LF No.",
        accessorKey: "lf_buyer",
        cell: (info) => info.row.original.lf_buyer || "-",
      },
      {
        header: "Transfer Date",
        accessorKey: "t_date",
        cell: (info) => info.row.original.t_date || "-",
        // cell: (info) => {
        //   const value = info.row.original.t_date;
        //   return value ? new Date(value).toLocaleDateString("en-GB") : "";
        // },
      },
      {
        header: "Total Shares",
        accessorKey: "t_share",
        cell: (info) => info.row.original.t_share || "0",
      },
      {
        header: "Certificate No.",
        accessorKey: "certi",
        cell: (info) => info.row.original.certi || "-",
      },
      {
        header: "Form",
        accessorKey: "from",
        cell: (info) => info.row.original.from || "-",
      },
      {
        header: "To",
        accessorKey: "to",
        cell: (info) => info.row.original.to || "-",
      },
      {
        header: "Payable Amount",
        accessorKey: "payable",
        cell: (info) => info.row.original.payable,
      },
      {
        header: "Paid Amount",
        accessorKey: "paid",
        cell: (info) => info.row.original.paid || "-",
      },
      {
        header: "Due Amount",
        accessorKey: "due",
        cell: (info) => info.row.original.due,
      },
      {
        header: "Consideration",
        accessorKey: "consideration",
        cell: (info) => info.row.original.consideration || "-",
      },
      {
        header: "Lock In",
        accessorKey: "lock",
        cell: (info) => info.row.original.lock || "-",
      },
      {
        header: "Remarks",
        accessorKey: "remarks",
        cell: (info) => info.row.original.remarks || "-",
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
            title="C_Register Share Data"
            cardHeader=" listed Isin Register data"
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

export default RegisterShare;
