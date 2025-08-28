"use client";
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { apiConnector } from "@/utils/apihelper";
import { Download, Eye, Upload } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const UserSpecialBenposeList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //----------------------fetch special benpose data-----------------------------
  const fetchSpecialBenposeData = async () => {
    try {
      const responseData = await apiConnector(
        "GET",
        `${apiUrl}/v2/user/benpose/special/benpose-index`
      );
      const result = responseData.data.data.post || [];
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
    fetchSpecialBenposeData();
  }, []);

  const handleShortBenpos = (date) => {
    router.push("/user/benpose/userBenposeData", {
      query: {
        date: date,
        benposType: "special",
        fullOrShort: "short",
      },
    });
  };

  const handleFullBenpos = (date) => {
    router.push("/user/benpose/userBenposeData", {
      query: {
        date: date,
        benposType: "special",
        fullOrShort: "full",
      },
    });
  };

  const handle31Benpos = (date) => {
    router.push("/user/benpose/reg31Benpose", {
      query: {
        date: date,
        benposType: "special",
      },
    });
  };

  const handleChangeBenpos = (date) => {
    router.push("/user/benpose/special/userChangeBenpose", {
      query: {
        date: date,
        benposType: "special",
      },
    });
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
        cell: (info) => info.row.original.date,
      },
      {
        header: "ISIN",
        accessorKey: "isin",
        cell: (info) => info.row.original.isin,
      },

      {
        header: "CDSL",
        accessorKey: "cdsl",
        cell: (info) => (info.row.original.cdsl == 1 ? "Yes" : "NO"),
      },
      {
        header: "NSDL",
        accessorKey: "nsdl",
        cell: (info) => (info.row.original.nsdl ? "Yes" : "No"),
      },
      {
        header: "Demate",
        accessorKey: "demat",
        cell: (info) => (info.row.original.demat ? "Yes" : "No"),
      },
      {
        header: "Physical",
        accessorKey: "physical",
        cell: (info) => (info.row.original.physical ? "Yes" : "No"),
      },
      {
        header: "Remarks",
        accessorKey: "remarks",
        cell: (info) => info.row.original.remarks,
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
        header: "FULL BENPOS",
        accessorKey: "",
        cell: ({ row }) => {
          return (
            <>
              <button
                target="_blank"
                onClick={() => handleFullBenpos(row.original.date)}
                className="position-relative mx-3"
                title="Full Benpos"
              >
                <Eye className="text-primary-color" />
              </button>
            </>
          );
        },
      },
      {
        header: "SHORT BENPOS",
        accessorKey: "",
        cell: ({ row }) => {
          return (
            <>
              <button
                onClick={() => handleShortBenpos(row.original.date)}
                className="position-relative mx-3"
                target="_blank"
                title="Short Benpos"
              >
                <Eye className="text-primary-color" />
              </button>
            </>
          );
        },
      },
      {
        header: "BENPOS ANALYTICS",
        accessorKey: "",
        cell: ({ row }) => {
          return (
            <>
              <Link
                target="_blank"
                to={`/user/benpose/analytics/${row.original.date}/special`}
                title="Analytics"
              >
                <Eye className="text-primary-color" />
              </Link>
            </>
          );
        },
      },
      {
        header: "REPORT 311",
        accessorKey: "",
        cell: ({ row }) => {
          return (
            <>
              <button
                target="_blank"
                onClick={() => handle31Benpos(row.original.date)}
                title="31(1)"
              >
                <Eye className="text-primary-color" />
              </button>
            </>
          );
        },
      },
      {
        header: "Report 250",
        accessorKey: "",
        cell: ({ row }) => {
          return (
            <>
              <Link
                target="_blank"
                href={`/user/benpose/report-250/${row.original.date}/special`}
                title="Report 250"
              >
                <Eye className="text-primary-color" />
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
        <div className="card-body">
          <ViewDataTable
            title="Special Benpose"
            cardHeader="special benpose list"
            columns={columns}
            data={data}
            isLoading={loading}
          />
        </div>
      </div>
    </>
  );
};

export default UserSpecialBenposeList;
