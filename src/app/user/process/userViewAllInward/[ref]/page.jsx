"use client";
export const dynamic = "force-dynamic";

import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { apiConnector } from "@/utils/apihelper";
import { formatDateLong } from "@/utils/helper";
import { CircleX, CloudFog, Eye, File } from "lucide-react";
import Link from "next/link";
// import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import useQueryParams from "../../../../../../hook/useQueryParams";

const UserViewAllInward = () => {
  const [inwardData, setInwardData] = useState(null);
  const [oldLfData, setOldLfData] = useState([]);
  const [bInwardInfo, setBInwardInfo] = useState({});
  const [rangeCounts, setRangeCounts] = useState({});
  const [inwardRange, setInwardRange] = useState([]);
  // const searchParams = useSearchParams();
  const { ref } = useQueryParams();
  // const ref = searchParams.get("ref");
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState("");
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchInwardData = async () => {
    try {
      if (ref) {
        const responseData = await apiConnector(
          "GET",
          `${apiUrl}/v2/user/process/viewallinward?ref=${ref}`
        );
        const data = responseData.data;
        console.log({ data });

        setInwardData(data.result.data);
        setFiles(data.result);
        setOldLfData(data.result.oldLfData || []);
        setBInwardInfo(data.result.b_inward_info || {});
        setRangeCounts(data.result.range_counts || {});
        setInwardRange(data.result.b_inward_range || []);
        setLoading(false);
      }
    } catch (error) {
      const errMsg = error.response.data.message;
      toast.error(errMsg || "An error occurred while processing the request.");
      console.error("Error fetching data", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInwardData();
  }, [ref]);

  const columns = useMemo(
    () => [
      { header: "#", accessorKey: "index", cell: (info) => info.row.index + 1 },
      {
        header: "From",
        accessorKey: "from",
        cell: (info) => info.row.original.from,
      },
      {
        header: "To",
        accessorKey: "to",
        cell: (info) => info.row.original.to,
      },
      {
        header: "Count",
        accessorKey: "count",
        cell: (info) => info.row.original.count,
      },

      {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => {
          const status = row.original.status;

          const getStatusBadge = (status) => {
            switch (status) {
              case 1:
                return (
                  <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                    Approved
                  </span>
                );
              case 2:
                return <span className="badge badge-warning">Pending</span>;
              case 3:
                return <span className="badge badge-error">Rejected</span>;
              case 4:
                return (
                  <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
                    Deleted
                  </span>
                );
              case 5:
                return (
                  <span className=" inline-block text-white bg-blue-500  inline-block  text-xs font-semibold px-3 py-1 rounded-full">
                    Partial Approved
                  </span>
                );
              default:
                return <span className="badge badge-secondary">Unknown</span>;
            }
          };

          return getStatusBadge(status);
        },
      },
    ],
    []
  );
  const renderFileLink = (filePath) => {
    return filePath ? (
      <Link
        href={`/inwardpdfs/${filePath}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <File className="text-green-500" />
      </Link>
    ) : (
      <CircleX className="text-red-500" />
    );
  };
  const renderStatusButton = () => {
    const status = inwardData?.status;
    switch (status) {
      case 1:
        return (
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md">
            Approve
          </button>
        );
      case 2:
        return (
          <button className=" bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md">
            Pending
          </button>
        );
      case 3:
        return (
          <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md">
            Reject
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <div className="flex items-center text-sm mb-6">
        <span className="text-gray-600">Process</span>
        <span className="mx-2">{">"}</span>
        <span className="text-gray-600">Inward Process v2.0</span>
        <span className="mx-2">{">"}</span>
        <span className="font-medium">View Inward</span>
      </div>

      {/* Actions Section */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700">Actions</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Left Panel */}
          <div className="col-span-1">
            <div className="bg-white shadow p-4 rounded mb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-1">Particulars</th>
                    <th className="text-left py-1">Link</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2">Scanned Request</td>
                    <td>{renderFileLink(files?.filePath)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Past Requests */}
            {Array.isArray(oldLfData) && oldLfData.length > 0 && (
              <div className="bg-white shadow p-4 rounded">
                <h5 className="font-semibold mb-2">Past Request(s)</h5>
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th>Ref</th>
                      <th>Status</th>
                      <th>Link</th>
                    </tr>
                  </thead>
                  <tbody>
                    {oldLfData.map((item, index) => (
                      <tr key={index}>
                        <td>{item.ref}</td>
                        <td>{item.lf}</td>
                        <td>
                          <Link
                            href={`/user/process/userViewAllInward?ref=${btoa(
                              item.ref
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-500"
                          >
                            <Eye />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Inward Data Section */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-700">Inward</h2>
            {renderStatusButton()}
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  INWARD DATE:
                </p>
                <p className="text-sm text-gray-700">
                  {formatDateLong(inwardData?.date || "N/A")}
                </p>

                <p className="text-sm font-medium text-gray-500 mt-4 mb-1">
                  INWARD MODE:
                </p>
                <p className="text-sm text-gray-700">
                  {inwardData?.mode || "N/A"}
                </p>

                <p className="text-sm font-medium text-gray-500 mt-4 mb-1">
                  SENDER:
                </p>
                <p className="text-sm text-gray-700">
                  {inwardData?.sender || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  INWARD NO.:
                </p>
                <p className="text-sm text-gray-700">
                  {inwardData?.ref || "N/A"}
                </p>

                <p className="text-sm font-medium text-gray-500 mt-4 mb-1">
                  TYPE:
                </p>
                <p className="text-sm text-gray-700">
                  {inwardData?.type || "N/A"}
                </p>

                <p className="text-sm font-medium text-gray-500 mt-4 mb-1">
                  LOCATION:
                </p>
                <p className="text-sm text-gray-700">
                  {inwardData?.location || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  PROCESSING DATE:
                </p>
                <p className="text-sm text-gray-700">
                  {formatDateLong(inwardData?.p_date || "N/A")}
                </p>

                <p className="text-sm font-medium text-gray-500 mt-4 mb-1">
                  SUB TYPE:
                </p>
                <p className="text-sm text-gray-700">
                  {inwardData?.sub_type || "N/A"}
                </p>
              </div>
            </div>

            {inwardData?.remarks && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-500 mb-1">
                  REMARKS:
                </p>
                <p className="text-sm text-gray-700">
                  {inwardData?.remarks || "Demat"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Inward Information Section */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-700">
              Inward Information
            </h2>
            <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-md">
              Demat
            </button>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">DP ID:</p>
                <p className="text-sm text-gray-700">
                  {bInwardInfo?.dp || "N/A"}
                </p>

                <p className="text-sm font-medium text-gray-500 mt-4 mb-1">
                  DRN:
                </p>
                <p className="text-sm text-gray-700">
                  {bInwardInfo?.drn || "N/A"}
                </p>

                <p className="text-sm font-medium text-gray-500 mt-4 mb-1">
                  NAME1:
                </p>
                <p className="text-sm text-gray-700">
                  {bInwardInfo?.name || "N/A"}
                </p>

                <p className="text-sm font-medium text-gray-500 mt-4 mb-1">
                  PAN1:
                </p>
                <p className="text-sm text-gray-700">
                  {bInwardInfo?.pan || "N/A"}
                </p>

                <p className="text-sm font-medium text-gray-500 mt-4 mb-1">
                  PHONE:
                </p>
                <p className="text-sm text-gray-700">
                  {bInwardInfo?.mobile || "NA"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  CLIENT ID:
                </p>
                <p className="text-sm text-gray-700">
                  {bInwardInfo?.client || "N/A"}
                </p>

                <p className="text-sm font-medium text-gray-500 mt-4 mb-1">
                  NAME2:
                </p>
                <p className="text-sm text-gray-700">
                  {bInwardInfo?.name1 || "N/A"}
                </p>

                <p className="text-sm font-medium text-gray-500 mt-4 mb-1">
                  PAN2:
                </p>
                <p className="text-sm text-gray-700">
                  {bInwardInfo?.pan1 || "NA"}
                </p>

                <p className="text-sm font-medium text-gray-500 mt-4 mb-1">
                  EMAIL:
                </p>
                <p className="text-sm text-gray-700">
                  {bInwardInfo?.email || "NA"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  LEDGER FOLIO:
                </p>
                <p className="text-sm text-gray-700">
                  {bInwardInfo?.lf || "N/A"}
                </p>

                <p className="text-sm font-medium text-gray-500 mt-4 mb-1">
                  NAME3:
                </p>
                <p className="text-sm text-gray-700">
                  {bInwardInfo?.name2 || "N/A"}
                </p>

                <p className="text-sm font-medium text-gray-500 mt-4 mb-1">
                  PAN3:
                </p>
                <p className="text-sm text-gray-700">
                  {bInwardInfo?.pan2 || "NA"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Inward Range Section */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-700">
              Inward Range
            </h2>
          </div>
          <div className="p-4">
            <div className="flex flex-wrap gap-4 mb-4">
              <p className="text-sm">
                Total Count:{" "}
                <span className="font-semibold">
                  {rangeCounts.totalCount || 0}
                </span>
              </p>
              <p className="text-sm">
                Approved Count:{" "}
                <span className="font-semibold">
                  {rangeCounts.approveCount || 0}
                </span>
              </p>
              <p className="text-sm">
                Rejected Count:{" "}
                <span className="font-semibold">
                  {rangeCounts.rejectCount || 0}
                </span>
              </p>
            </div>
            <div className="card">
              <div className="card-body">
                <ViewDataTable
                  title=""
                  columns={columns}
                  data={inwardRange}
                  isLoading={loading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserViewAllInward;
