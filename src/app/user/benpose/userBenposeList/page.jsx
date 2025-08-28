"use client";
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { apiConnector } from "@/utils/apihelper";
import { Eye } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const UserBenposeList = () => {
  const [data, setData] = useState([]);
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchUserBenposeData = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/user/benpose/weekly/benpose-index`
      );
      const responseData = response?.data?.data;
      setData(responseData?.benposev2 || []);
      setCompanyData(responseData?.companyData || null);
      setLoading(false);
    } catch (error) {
      const errMsg = error?.response?.data?.message;
      toast.error(errMsg || "An error occurred while processing the request.");
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUserBenposeData();
  }, []);

  const handleShortBenpos = (date) => {
    router.push({
      pathname: "/user/benpose/userBenposeData",
      query: {
        date: date,
        benposType: "weekly",
        fullOrShort: "short",
      },
    });
  };

  const handleFullBenpos = (date) => {
    router.push("/user/benpose/userBenposeData", {
      query: {
        date: date,
        benposType: "weekly",
        fullOrShort: "full",
      },
    });
  };

  const handle31Benpos = (date) => {
    router.push("/user/benpose/reg31Benpose", {
      query: {
        date: date,
        benposType: "weekly",
      },
    });
  };

  const handleChangeBenpos = (date) => {
    router.push("/user/benpose/userChangeBenpose", {
      query: {
        date: date,
        benposType: "weekly",
      },
    });
  };

  const columns = useMemo(() => {
    if (!companyData) return [];

    const cols = [
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
        header: "Full Benpose",
        accessorKey: "",
        cell: ({ row }) => (
          <button
            target="_blank"
            onClick={() => handleFullBenpos(row.original.date)}
            title="Full Benpos"
          >
            <Eye className="text-green-500" />
          </button>
        ),
      },
      {
        header: "Short Benpose",
        accessorKey: "",
        cell: ({ row }) => (
          <button
            target="_blank"
            onClick={() => handleShortBenpos(row.original.date)}
            title="Short Benpos"
          >
            <Eye className="text-green-500" />
          </button>
        ),
      },
      {
        header: "31(1)",
        accessorKey: "",
        cell: ({ row }) => (
          <button
            target="_blank"
            onClick={() => handle31Benpos(row.original.date)}
            title="31(1)"
          >
            <Eye className="text-green-500" />
          </button>
        ),
      },
      {
        header: "Change Report",
        accessorKey: "",
        cell: ({ row }) => (
          <button
            target="_blank"
            onClick={() => handleChangeBenpos(row.original.date)}
            title="31(1)"
          >
            <Eye className="text-green-500" />
          </button>
        ),
      },
      {
        header: "Benpose Analytics",
        accessorKey: "",
        cell: ({ row }) => (
          <Link
            target="_blank"
            href={`/user/benpose/analytics/${row.original.date}/weekly`}
            title="Analytics"
          >
            <Eye className="text-green-500" />
          </Link>
        ),
      },
      {
        header: "Report 250",
        accessorKey: "",
        cell: ({ row }) => (
          <Link
            target="_blank"
            href={`/user/benpose/report-250/${row.original.date}/weekly`}
            title="Report 250"
          >
            <Eye className="text-green-500" />
          </Link>
        ),
      },
    ];

    return cols;
  }, [companyData]);

  return (
    <div className="card">
      <div className="card-body">
        <ViewDataTable
          title="Weekly Benpose"
          cardHeader="Weekly Benpose data"
          columns={columns}
          data={data}
          isLoading={loading}
        />
      </div>
    </div>
  );
};

export default UserBenposeList;
