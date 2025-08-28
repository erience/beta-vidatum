"use client";
import { useEffect, useState, useMemo } from "react";
import { Upload } from "lucide-react";
import { useParams } from "next/navigation";
import { apiConnector } from "@/utils/apihelper";
import Link from "next/link";
import { toast } from "react-toastify";
import ViewDataTable from "@/components/dataTables/ViewDataTable";

const ViewRegisterShare = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //----------------------fetch view register share data-----------------------------

  const fetchViewRegisterShareData = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/register/view-resgister-share/${id}`
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
    fetchViewRegisterShareData();
  }, [id]);

  //---------------------------dynamic column---------------------------
  const columns = useMemo(
    () => [
      {
        header: "Number",
        accessorKey: "index",
        cell: (info) => info.row.index + 1,
      },
      {
        header: "LF",
        accessorKey: "lf",
        cell: (info) => info.row.original.lf,
      },
      {
        header: "Allotment Date",
        accessorKey: "a_date",
        cell: (info) => {
          const aDate = new Date(info.row.original.a_date);
          return !isNaN(aDate) ? aDate.toLocaleDateString() : "-";
        },
      },
      {
        header: "Endorsement Date",
        accessorKey: "c_date",
        cell: (info) => {
          const cDate = new Date(info.row.original.c_date);
          return !isNaN(cDate) ? cDate.toLocaleDateString() : "-";
        },
      },
      {
        header: "Transfer Share",
        accessorKey: "t_share",
        cell: (info) => info.row.original.t_share || "-",
      },
      {
        header: "Certificate",
        accessorKey: "certi",
        cell: (info) => info.row.original.certi || "-",
      },
      {
        header: "From",
        accessorKey: "from",
        cell: (info) => info.row.original.from || "-",
      },
      {
        header: "To",
        accessorKey: "to",
        cell: (info) => info.row.original.to || "-",
      },
      {
        header: "Payable",
        accessorKey: "payable",
        cell: (info) => info.row.original.payable || "-",
      },
      {
        header: "Paid",
        accessorKey: "paid",
        cell: (info) => info.row.original.paid || "-",
      },
      {
        header: "Due",
        accessorKey: "due",
        cell: (info) => info.row.original.due || "-",
      },
      {
        header: "Consideration",
        accessorKey: "consideration",
        cell: (info) => info.row.original.consideration || "-",
      },
      {
        header: "Transfer Date",
        accessorKey: "t_date",
        cell: (info) => {
          const tDate = new Date(info.row.original.t_date);
          return !isNaN(tDate) ? tDate.toLocaleDateString() : "-";
        },
      },
      {
        header: "Ledger Folio Buyer",
        accessorKey: "lf_buyer",
        cell: (info) => info.row.original.lf_buyer || "-",
      },
      {
        header: "Transfer Name",
        accessorKey: "t_name",
        cell: (info) => info.row.original.t_name || "-",
      },
      {
        header: "Lock",
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
          const status = info.row.original.status;
          switch (status) {
            case "1":
              return <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">Active</span>;
            case "2":
              return <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">Inactive</span>;
            case "3":
              return (
                <span className="px-2 py-1 text-yellow-500 bg-yellow-100 rounded-md">
                  Deleted
                </span>
              );
            default:
              return (
                <span className="inline-block bg-blue-400 text-black text-xs font-semibold px-3 py-1 rounded-full">
                  Unknown
                </span>
              );
          }
        },
      },
    ],
    []
  );

  // Calculate total t_share
  const totalCount = data.reduce((acc, item) => acc + item.t_share, 0);

  return (
    <>
      <div className="flex flex-wrap gap-4 mb-7">
        {/* Card 1 */}
        <div className="w-full md:w-1/2 xl:w-1/4">
          <div className="bg-white shadow rounded overflow-hidden flex">
            <div className="bg-orange-500 w-1/3 flex items-center justify-center">
              <i className="fas fa-calendar-alt text-white text-3xl"></i>
            </div>
            <div className="w-2/3 p-4 text-right">
              <h2 className="text-2xl font-semibold">{data[0]?.isin || "-"}</h2>
              <p className="text-gray-500 text-sm">ISIN</p>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="w-full md:w-1/2 xl:w-1/4">
          <div className="bg-white shadow rounded overflow-hidden flex">
            <div className="bg-orange-500 w-1/3 flex items-center justify-center">
              <i className="fas fa-calendar-alt text-white text-3xl"></i>
            </div>
            <div className="w-2/3 p-4 text-right">
              <h2 className="text-2xl font-semibold">{totalCount || 0}</h2>
              <p className="text-gray-500 text-sm">COUNT</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card mt-2.5">
        <div className="card-body">
          <ViewDataTable
            title="Register Share List"
            cardHeader="Register Share List data"
            columns={columns}
            data={data}
            isLoading={loading}
            // headerIcons={
            //   <div className="flex items-center gap-1">
            //     <Link href="/admin/register/add-register-share">
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

export default ViewRegisterShare;
