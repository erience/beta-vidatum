"use client";
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { apiConnector } from "@/utils/apihelper";
import axios from "axios";
import { Archive, Upload } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const GetDemateInwardMerge = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const getDemateMergeData = async () => {
    try {
      const responseData = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/actionHistory/get-demat-merge-inward`
      );
      console.log({ responseData: responseData.data.result });
      const result = responseData.data.result ? responseData.data.result : [];
      setData(result);
      setLoading(false);
    } catch (error) {
      const errMsg = error.response.data.message;
      toast.error(errMsg || "An error occurred while processing the request.");
      console.error("While error fetching data", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getDemateMergeData();
  }, []);

  //--------------------------------formate date-------------------------------------
  const formatDate = (date) => {
    const d = new Date(date);
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const year = d.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const accurateDate = (date) => {
    const d = new Date(date);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const day = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const columns = useMemo(
    () => [
      { header: "#", accessorKey: "index", cell: (info) => info.row.index + 1 },
      {
        header: "Date",
        accessorKey: "date",
        cell: (info) => formatDate(info.row.original.date),
      },
      {
        header: "RTA ID",
        accessorKey: "a",
        cell: (info) => info.row.original.a,
      },
      {
        header: "DP ID",
        accessorKey: "b",
        cell: (info) => info.row.original.b,
      },
      { header: "DRN", accessorKey: "c", cell: (info) => info.row.original.c },
      { header: "d", accessorKey: "d", cell: (info) => info.row.original.d },
      { header: "e", accessorKey: "e", cell: (info) => info.row.original.e },
      {
        header: "REQUEST QTY",
        accessorKey: "f",
        cell: (info) => Number(info.row.original.f),
      },
      {
        header: "ACCEPTED QTY",
        accessorKey: "g",
        cell: (info) => Number(info.row.original.g),
      },
      {
        header: "REJECT QTY",
        accessorKey: "h",
        cell: (info) => Number(info.row.original.h),
      },
      {
        header: "i",
        accessorKey: "i",
        cell: (info) => Number(info.row.original.i),
      },
      { header: "j", accessorKey: "j", cell: (info) => info.row.original.j },
      { header: "k", accessorKey: "k", cell: (info) => info.row.original.k },
      {
        header: "NO. OF CERTIFICATES",
        accessorKey: "l",
        cell: (info) => Number(info.row.original.l),
      },
      { header: "m", accessorKey: "m", cell: (info) => info.row.original.m },
      {
        header: "STATUS",
        accessorKey: "status",
        cell: (info) => {
          const status = info.row.original.status;
          switch (status) {
            case 1:
              return "Closed & Settled";
            case 2:
              return "Closed & Cancelled by Client";
            case 3:
              return "Closed & Cancelled by RTA";
            case 4:
              return "Partial Closed & Settled";
            default:
              return status;
          }
        },
      },
      {
        header: "ISIN",
        accessorKey: "isin",
        cell: (info) => info.row.original.isin_id,
      },
      {
        header: "P",
        accessorKey: "p",
        cell: (info) => info.row.original.p,
      },
      {
        header: "Q",
        accessorKey: "q",
        cell: (info) => info.row.original.q,
      },
      {
        header: "R",
        accessorKey: "r",
        cell: (info) => info.row.original.r,
      },

      {
        header: "System Setup Date",
        accessorKey: "s",
        cell: (info) => info.row.original.s,
      },
      {
        header: "Vidatum RECEIVE DATE",
        accessorKey: "binwarddate",
        cell: (info) => accurateDate(info.row.original.binwarddate),
      },
      {
        header: "SYSTEM RECEIVE DATE",
        accessorKey: "t",
        cell: (info) => info.row.original.t,
      },
      {
        header: "SYSTEM APPROVAL / REJ. DATE",
        accessorKey: "u",
        cell: (info) => info.row.original.u,
      },
      {
        header: "Vidatum APPROVAL DATE",
        accessorKey: "t",
        cell: (info) => accurateDate(info.row.original.p_date),
      },

      {
        header: "DPID AND CLIENT ID",
        accessorKey: "v",
        cell: (info) => info.row.original.v,
      },

      {
        header: "DRF NO.",
        accessorKey: "w",
        cell: (info) => info.row.original.w,
      },
      {
        header: "IN. REF NO",
        accessorKey: "x",
        cell: (info) => info.row.original.x,
      },
      {
        header: "Y",
        accessorKey: "y",
        cell: (info) => info.row.original.y,
      },
      {
        header: "Z",
        accessorKey: "z",
        cell: (info) => info.row.original.z,
      },
      {
        header: "Address",
        accessorKey: "",
        cell: (info) => (
          <>
            {info.row.original.aa}, {info.row.original.ab}{" "}
            {info.row.original.ac} {info.row.original.ad},{info.row.original.ae}
            , {info.row.original.af}, {info.row.original.ag},{" "}
            {info.row.original.ah},{info.row.original.ai},{" "}
            {info.row.original.aj}
          </>
        ),
      },
      {
        header: "Sender",
        accessorKey: "sender",
        cell: (info) => info.row.original.sender,
      },
      {
        header: "Type",
        accessorKey: "type",
        cell: (info) => info.row.original.type,
      },
      {
        header: "Location",
        accessorKey: "location",
        cell: (info) => info.row.original.location,
      },
      {
        header: "Remarks",
        accessorKey: "remarks",
        cell: (info) => info.row.original.remarks,
      },
      {
        header: "Created By",
        accessorKey: "username",
        cell: (info) => info.row.original.username,
      },
    ],
    []
  );
  return (
    <>
      <ViewDataTable
        title="CDSL Demat History"
        columns={columns}
        data={data}
        isLoading={loading}
        headerIcons={
          <div className="flex items-center gap-1">
            <Link href="/admin/reconciliation/uploadCdslDematHistory">
              <button type="button" title="Upload Demat CDSL">
                <Upload size={25} />
              </button>
            </Link>
            <Link href="/admin/reconciliation/nsdlDemateFilesUpload">
              <button type="button" title="Upload Demat CDSL">
                <Archive size={25} />
              </button>
            </Link>
          </div>
        }
      />
    </>
  );
};

export default GetDemateInwardMerge;
