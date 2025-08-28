"use client";
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { apiConnector } from "@/utils/apihelper";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const SpecialFullBenpose = () => {
  const [data, setData] = useState([]);
  const [isin, setIsin] = useState("");
  const [reportDate, setReportDate] = useState("");
  const [loading, setLoading] = useState(true);
  const { date } = useParams();
  const [cdslCount, setCdslCount] = useState(0);
  const [nsdlCount, setNsdlCount] = useState(0);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //----------------------fetch special benpose data-----------------------------
  const fetchSpecialBenposeData = async () => {
    try {
      const responseData = await apiConnector(
        "GET",
        `${apiUrl}/v2/user/benpose/special/full-benpose/${date}`
      );

      const result = responseData.data.data || {};
      console.log({ result });

      // Extract date and ISIN from the response
      setReportDate(result.date || "");
      setIsin(result.isin || "");
      setCdslCount(result.cdslCount || 0);
      setNsdlCount(result.nsdlCount || 0);
      setData(result.data || []);
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

  // Add ISIN and date to each data row for display in the table
  const processedData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      date: reportDate,
      isin: isin,
    }));
  }, [data, reportDate, isin]);

  //------------------------------------demate table columns-----------------------------
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
        header: "ISIN",
        accessorKey: "isin",
        cell: (info) => info.row.original.isin || "-",
      },
      {
        header: "Type",
        accessorKey: "type",
        cell: (info) => {
          if (info.row.original.type == 1) {
            return "NSDL";
          } else if (info.row.original.type == 2) {
            return "CDSL";
          } else if (info.row.original.type == 3) {
            return "Physical";
          }
          return "";
        },
      },
      {
        header: "Lf",
        accessorKey: "lf",
        cell: (info) => info.row.original.lf,
      },
      {
        header: "CATEGORY",
        accessorKey: "label",
        cell: (info) => info.row.original.label,
      },
      {
        header: "FIRST HOLDER NAME",
        accessorKey: "f_holder",
        cell: (info) => info.row.original.f_holder,
      },
      {
        header: "FIRST HOLDER PAN",
        accessorKey: "f_pan",
        cell: (info) => info.row.original.f_pan,
      },
      {
        header: "SECOND HOLDER NAME",
        accessorKey: "s_holder",
        cell: (info) => info.row.original.s_holder,
      },
      {
        header: "SECOND HOLDER PAN",
        accessorKey: "s_pan",
        cell: (info) => info.row.original.s_pan,
      },
      {
        header: "THIRD HOLDER NAME",
        accessorKey: "t_holder",
        cell: (info) => info.row.original.t_holder,
      },
      {
        header: "THIRD HOLDER PAN",
        accessorKey: "t_pan",
        cell: (info) => info.row.original.t_pan,
      },
      {
        header: "ADDRESS 1",
        accessorKey: "address1",
        cell: (info) => info.row.original.address1,
      },
      {
        header: "ADDRESS 2",
        accessorKey: "address2",
        cell: (info) => info.row.original.address2,
      },
      {
        header: "ADDRESS 3",
        accessorKey: "address3",
        cell: (info) => info.row.original.address3,
      },
      {
        header: "ADDRESS 4",
        accessorKey: "address4",
        cell: (info) => info.row.original.address4,
      },
      {
        header: "PIN",
        accessorKey: "pin",
        cell: (info) => info.row.original.pin,
      },
      {
        header: "PHONE",
        accessorKey: "phone",
        cell: (info) => info.row.original.phone,
      },
      {
        header: "EMAIL",
        accessorKey: "email",
        cell: (info) => info.row.original.email,
      },
      {
        header: "BANK NAME",
        accessorKey: "bank",
        cell: (info) => info.row.original.bank,
      },
      {
        header: "IFSC",
        accessorKey: "ifsc",
        cell: (info) => info.row.original.ifsc,
      },
      {
        header: "BANK ACCOUNT NO",
        accessorKey: "b_account",
        cell: (info) => info.row.original.b_account,
      },
      {
        header: "TOTAL SHARES",
        accessorKey: "total",
        cell: (info) => info.row.original.total,
      },
      {
        header: "PLEDGED SHARES",
        accessorKey: "pledge",
        cell: (info) => info.row.original.pledge,
      },
      {
        header: "LOCKED-IN SHARES",
        accessorKey: "lock",
        cell: (info) => info.row.original.lock,
      },
    ],
    []
  );

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Benpose Date Card */}
        <div className="bg-white rounded shadow">
          <div className="flex h-full">
            <div className="w-1/4 bg-blue-500 flex items-center justify-center text-white">
              {/* <Calendar size={40} /> */}
            </div>
            <div className="w-3/4 p-4 text-right">
              <h2 className="text-2xl font-normal mb-2">{reportDate || ""}</h2>
              <p className="text-gray-500 m-0">Benpose Date</p>
            </div>
          </div>
        </div>

        {/* ISIN Card */}
        <div className="bg-white rounded shadow">
          <div className="flex h-full">
            <div className="w-1/4 bg-green-500 flex items-center justify-center text-white">
              {/* <BookOpen size={40} /> */}
            </div>
            <div className="w-3/4 p-4 text-right">
              <h2 className="text-2xl font-normal mb-2">{isin || ""}</h2>
              <p className="text-gray-500 m-0">ISIN</p>
            </div>
          </div>
        </div>

        {/* CDSL Holders Card */}
        <div className="bg-white rounded shadow">
          <div className="flex h-full">
            <div className="w-1/4 bg-cyan-500 flex items-center justify-center text-white">
              {/* <UserCheck size={40} /> */}
            </div>
            <div className="w-3/4 p-4 text-right">
              <h2 className="text-2xl font-normal mb-2">{cdslCount || 0}</h2>
              <p className="text-gray-500 m-0">CDSL Holders</p>
            </div>
          </div>
        </div>

        {/* NSDL Holders Card */}
        <div className="bg-white rounded shadow">
          <div className="flex h-full">
            <div className="w-1/4 bg-yellow-500 flex items-center justify-center text-white">
              {/* <Users size={40} /> */}
            </div>
            <div className="w-3/4 p-4 text-right">
              <h2 className="text-2xl font-normal mb-2">{nsdlCount || 0}</h2>
              <p className="text-gray-500 m-0">NSDL Holders</p>
            </div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <ViewDataTable
            title="Demat"
            cardHeader="Special Full Benpose data"
            columns={columns}
            data={processedData}
            isLoading={loading}
          />
        </div>
      </div>
    </>
  );
};

export default SpecialFullBenpose;
