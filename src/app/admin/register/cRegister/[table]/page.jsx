"use client";
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { apiConnector } from "@/utils/apihelper";
import { formatDMY } from "@/utils/helper";
import { Eye } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const CRegister = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { table } = useParams();

  // Fetch data
  const fetchListedRegisterData = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/register/viewc_register_data?data=${table}`
      );
      const responseData = response.data.result || [];
      console.log({ responseData });
      setData(responseData);
      setLoading(false);
    } catch (error) {
      const errMsg = error.response?.data?.message || "An error occurred.";
      toast.error(errMsg);
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListedRegisterData();
  }, []);

  // Define columns
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
        header: "Total Shares",
        accessorKey: "share",
        cell: (info) => info.row.original.share || "0",
      },
      {
        header: "Admission Date",
        accessorKey: "admission",
        cell: (info) => info.row.original.admission || "-",
      },
      {
        header: "Category",
        accessorKey: "category",
        cell: (info) => info.row.original.category || "-",
      },
      {
        header: "LF No",
        accessorKey: "lf",
        cell: (info) => info.row.original.lf || "-",
      },
      {
        header: "First Holder Name",
        accessorKey: "name",
        cell: (info) => info.row.original.name || "-",
      },
      {
        header: "First Holder PAN",
        accessorKey: "pan",
        cell: (info) => info.row.original.pan || "-",
      },
      {
        header: "Second Holder Name",
        accessorKey: "jt1",
        cell: (info) => info.row.original.jt1 || "-",
      },
      {
        header: "Second Holder PAN",
        accessorKey: "jt1pan",
        cell: (info) => info.row.original.jt1pan || "-",
      },
      {
        header: "Third Holder Name",
        accessorKey: "jt2",
        cell: (info) => info.row.original.jt2 || "-",
      },
      {
        header: "Third Holder PAN",
        accessorKey: "jt2pan",
        cell: (info) => info.row.original.jt2pan || "-",
      },
      {
        header: "Address",
        accessorKey: "address",
        cell: (info) => info.row.original.address || "-",
      },
      {
        header: "PIN",
        accessorKey: "pin",
        cell: (info) => info.row.original.pin || "-",
      },
      {
        header: "Phone",
        accessorKey: "cin",
        cell: (info) => info.row.original.cin || "-",
      },
      {
        header: "Email",
        accessorKey: "email",
        cell: (info) => info.row.original.email || "-",
      },
      {
        header: "Aadhaar",
        accessorKey: "uid",
        cell: (info) => info.row.original.uid || "-",
      },
      {
        header: "Father/ Mother/ Spouse Name",
        accessorKey: "fms",
        cell: (info) => info.row.original.fms || "-",
      },
      {
        header: "Occupation",
        accessorKey: "occupation",
        cell: (info) => info.row.original.occupation || "-",
      },
      {
        header: "Nationality",
        accessorKey: "nationality",
        cell: (info) => info.row.original.nationality || "-",
      },
      {
        header: "Cessation Date",
        accessorKey: "cessation",
        cell: (info) => info.row.original.cessation || "-",
      },
      {
        header: "Is Minor",
        accessorKey: "is_minor",
        cell: (info) => info.row.original.is_minor || "-",
      },
      {
        header: "Minor (Date of Birth)",
        accessorKey: "minor_dob",
        cell: (info) => info.row.original.minor_dob || "-",
      },
      {
        header: "Guardian Name",
        accessorKey: "guardian_name",
        cell: (info) => info.row.original.guardian_name || "-",
      },
      {
        header: "Nomination Date",
        accessorKey: "nomination_date",
        cell: (info) => info.row.original.nomination_date || "-",
      },
      {
        header: "Nominee Name",
        accessorKey: "nominee_name",
        cell: (info) => info.row.original.nominee_name || "-",
      },
      {
        header: "Nominee Address",
        accessorKey: "nominee_address",
        cell: (info) => info.row.original.nominee_address || "-",
      },
      {
        header: "Is SBO",
        accessorKey: "is_sbo",
        cell: (info) => info.row.original.is_sbo || "-",
      },
      {
        header: "SBO Reference No.",
        accessorKey: "sbo_ref",
        cell: (info) => info.row.original.sbo_ref || "-",
      },
      {
        header: "Lien",
        accessorKey: "lien",
        cell: (info) => info.row.original.lien || "-",
      },
      {
        header: "Lock-In",
        accessorKey: "lock",
        cell: (info) => info.row.original.lock || "-",
      },
      {
        header: "Dump",
        accessorKey: "dump",
        cell: (info) => info.row.original.dump || "-",
      },
      {
        header: "Remarks",
        accessorKey: "remarks",
        cell: (info) => info.row.original.remarks || "-",
      },

      {
        header: "Actions",
        accessorKey: "actions",
        cell: ({ row }) => {
          const rowData = row.original;
          const { isin, lf } = rowData;

          console.log("Row Data:", rowData); // Debug line
          return (
            <Link
              href={`/admin/register/register?isin=${isin}&lf=${lf}`}
              title="Reconciliation List"
            >
              <Eye className="text-green-500" />
            </Link>
          );
        },
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
    <div className="card">
      <div className="card-body">
        <ViewDataTable
          title="Listed Register of Members"
          cardHeader="ISIN wise Register of Members Data - Name File"
          columns={columns}
          data={data}
          isLoading={loading}
          columnFilter={true}
        />
      </div>
    </div>
  );
};

export default CRegister;
