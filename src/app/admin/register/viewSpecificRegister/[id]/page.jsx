"use client";
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { apiConnector } from "@/utils/apihelper";
import { Eye, Upload } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const ViewSpecificRegister = () => {
  const [data, setData] = useState([]);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //----------------------fetch KYC data-----------------------------
  const fetchRegisterData = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/register/view-specific-register/${id}`
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
    fetchRegisterData();
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
        header: "Isin",
        accessorKey: "isin",
        cell: (info) => info.row.original.isin,
      },
      {
        header: "TShare",
        accessorKey: "t_share",
        cell: (info) =>
          info.row.original.t_share !== undefined
            ? info.row.original.t_share
            : "-",
      },
      {
        header: "Admission",
        accessorKey: "admission",
        cell: (info) => {
          const admission = new Date(info.row.original.admission);
          return !isNaN(admission) ? admission.toLocaleDateString() : "-";
        },
      },
      {
        header: "Ledger Folio",
        accessorKey: "lf",
        cell: (info) =>
          info.row.original.lf !== undefined && info.row.original.lf
            ? info.row.original.lf
            : "-",
      },
      {
        header: "Name",
        accessorKey: "name",
        cell: (info) =>
          info.row.original.name !== undefined && info.row.original.name
            ? info.row.original.name
            : "-",
      },
      {
        header: "Category",
        accessorKey: "category",
        cell: (info) => {
          const category = info.row.original.category;
          switch (category) {
            case "1":
              return "Promoter (Individual) Indian";
            case "11":
              return "Individual Indian";
            case "16":
              return "NRI";
            case "13":
              return "Body Corporate Indian";
            default:
              return "Not Defined";
          }
        },
      },
      {
        header: "Cin",
        accessorKey: "cin",
        cell: (info) =>
          info.row.original.cin !== undefined && info.row.original.cin
            ? info.row.original.cin
            : "-",
      },
      {
        header: "Unique Identification No",
        accessorKey: "uid",
        cell: (info) =>
          info.row.original.uid !== undefined && info.row.original.uid
            ? info.row.original.uid
            : "-",
      },
      {
        header: "Father’s/ Mother’s/ Spouse’s name",
        accessorKey: "fms",
        cell: (info) =>
          info.row.original.fms !== undefined && info.row.original.fms
            ? info.row.original.fms
            : "-",
      },
      {
        header: "Occupation",
        accessorKey: "occupation",
        cell: (info) =>
          info.row.original.occupation !== undefined &&
          info.row.original.occupation
            ? info.row.original.occupation
            : "-",
      },
      {
        header: "Cessation",
        accessorKey: "cessation",
        cell: (info) => {
          const cessation = new Date(info.row.original.cessation);
          return !isNaN(cessation) ? cessation.toLocaleDateString() : "-";
        },
      },
      {
        header: "Remarks",
        accessorKey: "remarks",
        cell: (info) =>
          info.row.original.remarks !== undefined && info.row.original.remarks
            ? info.row.original.remarks
            : "-",
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
                <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
                  Delete
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
      {
        header: "Actions",
        accessorKey: "",
        cell: ({ row }) => {
          const rowData = row.original;
          return (
            <Link
              href={`/admin/register/viewRegisterShare/${btoa(rowData.lf)}`}
              title="View ISIN Data"
            >
              <Eye className="text-green-500" />
            </Link>
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
            title="Register List"
            cardHeader="Register List data"
            columns={columns}
            data={data}
            isLoading={loading}
            // headerIcons={
            //   <div className="flex items-center gap-1">
            //     <Link href="/admin/register/add-register">
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

export default ViewSpecificRegister;
