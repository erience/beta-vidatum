"use client";
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { apiConnector } from "@/utils/apihelper";
import { Eye } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const UserPhysicalViewRegister = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //----------------------fetch KYC data-----------------------------
  const fetchData = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/user/physical/viewspecificregsiter`
      );
      const responseData = response.data.result.data || [];
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
    fetchData();
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
        header: "T SHARE",
        accessorKey: "t_share",
        cell: (info) =>
          info.row.original.t_share !== undefined
            ? info.row.original.t_share
            : "-",
      },
      {
        header: "H SHARE",
        accessorKey: "h_share",
        cell: (info) =>
          info.row.original.h_share !== undefined
            ? info.row.original.h_share
            : "-",
      },
      {
        header: "Admission",
        accessorKey: "admission",
        cell: (info) => {
          const admission = info.row.original.admission;
          return admission && !isNaN(new Date(admission))
            ? new Date(admission).toLocaleDateString()
            : "-";
        },
      },
      {
        header: "Ledger Folio",
        accessorKey: "lf",
        cell: (info) => info.row.original.lf || "-",
      },
      {
        header: "Name",
        accessorKey: "name",
        cell: (info) => info.row.original.name || "-",
      },
      {
        header: "CATEGORY",
        accessorKey: "category",
        cell: (info) => {
          const cat = info.row.original.category;
          if (cat == 1) return "Promoter (Individual) Indian";
          if (cat == 11) return "Individual Indian";
          if (cat == 16) return "NRI";
          if (cat == 13) return "Body Corporate Indian";
          return "Not Defined";
        },
      },
      {
        header: "CIN",
        accessorKey: "cin",
        cell: (info) => info.row.original.cin || "-",
      },
      {
        header: "Unique Identification No",
        accessorKey: "uid",
        cell: (info) => info.row.original.uid || "-",
      },
      {
        header: "Father’s/ Mother’s/ Spouse’s name",
        accessorKey: "fms",
        cell: (info) => info.row.original.fms || "-",
      },
      {
        header: "Occupation",
        accessorKey: "occupation",
        cell: (info) => info.row.original.occupation || "-",
      },
      {
        header: "Cessation",
        accessorKey: "cessation",
        cell: (info) => {
          const cessation = info.row.original.cessation;
          return cessation && !isNaN(new Date(cessation))
            ? new Date(cessation).toLocaleDateString()
            : "-";
        },
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
          if (status === 1) {
            return (
              <span className="badge label-table badge-success">Active</span>
            );
          } else if (status === 2) {
            return (
                <span className=" text-yellow-500 bg-yellow-100  inline-block  text-xs font-semibold px-3 py-1 rounded-full">
                  InActive
                </span>
            );
          } else {
            return "Something went wrong";
          }
        },
      },
      {
        header: "Action",
        accessorKey: "action",
        cell: ({ row }) => {
          const rowData = row.original;
          return (
            <Link
              href={`/user/physical/viewRegister/${btoa(
                rowData.lf || ""
              )}`}
              title="View Share Register"
              className="action-icon"
            >
              <Eye className="text-3xl text-success" />
            </Link>
          );
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
            title="Register List"
            cardHeader="register list data"
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

export default UserPhysicalViewRegister;
