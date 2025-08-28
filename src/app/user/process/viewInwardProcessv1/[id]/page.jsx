"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiConnector } from "@/utils/apihelper";
import { toast } from "react-toastify";
import ViewDataTable from "@/components/dataTables/ViewDataTable";

const ViewInwardProcessv1 = () => {
  const { id } = useParams();
  const [inwardData, setInwardData] = useState(null);
  const [isin, setIsin] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchInwardData = async () => {
    try {
      const responseData = await apiConnector(
        "GET",
        `${apiUrl}/v2/user/process/viewinwardprocessv1/${id}`
      );
      const inward = responseData?.data?.inward || [];
      setInwardData(inward[0]);
      setIsin(responseData?.data?.isin);
      setLoading(false);
    } catch (error) {
      const errMsg = error?.response?.data?.message || "Something went wrong.";
      toast.error(errMsg);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInwardData();
  }, []);

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
        header: "Remarks",
        accessorKey: "remarks",
        cell: (info) => info.row.original.remarks,
      },

      {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => {
          const status = row.original.status;

          const getStatusBadge = (status) => {
            switch (status) {
              case 1:
                return <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">Approved</span>;
              case 2:
                return <span className="badge badge-warning">Pending</span>;
              case 3:
                return <span className="badge badge-error">Rejected</span>;

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

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section */}
        <div className="space-y-6">
          {/* Card 1 */}
          <div className="bg-white shadow rounded p-4 text-center">
            {isin && <h5 className="text-lg font-semibold">{isin}</h5>}
            {getStatusBadge(inwardData.status)}
            <p className="text-gray-500 mt-2">
              {inwardData.date === "0000-00-00"
                ? "---"
                : inwardData.date
                  ? new Date(inwardData.date).toLocaleDateString()
                  : "No Record."}
            </p>

            <div className="grid grid-cols-2 gap-4 mt-4 text-left text-sm">
              <div>
                <h6 className="font-semibold uppercase">Inward Mode:</h6>
                <p className="text-gray-500">
                  {inwardData.mode || "No Record."}
                </p>
                <h6 className="font-semibold uppercase">Sender:</h6>
                <p className="text-gray-500">
                  {inwardData.sender || "No Record."}
                </p>
              </div>
              <div>
                <h6 className="font-semibold uppercase">Inward No.:</h6>
                <p className="text-gray-500">
                  {inwardData.ref || "No Record."}
                </p>
                <h6 className="font-semibold uppercase">Type:</h6>
                <p className="text-gray-500">
                  {inwardData.type || "No Record."}
                </p>
                <h6 className="font-semibold uppercase">Location:</h6>
                <p className="text-gray-500">
                  {inwardData.location || "No Record."}
                </p>
              </div>
              <div className="col-span-2">
                <h6 className="font-semibold uppercase">Remarks:</h6>
                <p className="text-gray-500">
                  {inwardData.remarks || "No Record."}
                </p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white shadow rounded p-4">
            <div className="grid grid-cols-2 gap-4 text-left text-sm">
              <div>
                <h6 className="font-semibold uppercase">DP Id:</h6>
                <p className="text-gray-500">{inwardData.dp || "No Record."}</p>
                <h6 className="font-semibold uppercase">Ledger Folio:</h6>
                <p className="text-gray-500">{inwardData.lf || "No Record."}</p>
                <h6 className="font-semibold uppercase">Phone:</h6>
                <p className="text-gray-500">
                  {inwardData.mobile || "No Record."}
                </p>
              </div>
              <div>
                <h6 className="font-semibold uppercase">Client Id:</h6>
                <p className="text-gray-500">
                  {inwardData.client || "No Record."}
                </p>
                <h6 className="font-semibold uppercase">PAN:</h6>
                <p className="text-gray-500">
                  {inwardData.pan || "No Record."}
                </p>
                <h6 className="font-semibold uppercase">Email:</h6>
                <p className="text-gray-500">
                  {inwardData.email || "No Record."}
                </p>
              </div>
              <div className="col-span-2">
                <h6 className="font-semibold uppercase">Remarks:</h6>
                <p className="text-gray-500">
                  {inwardData.remarks || "No Record."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Inward + Master Data */}
          <div className="bg-white shadow rounded p-4">
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <h5 className="uppercase font-semibold text-lg mb-2">
                  Inward Data
                </h5>
                <p>
                  <strong>Name:</strong> {inwardData.name || "No Record."}
                </p>
                <p>
                  <strong>Address:</strong> {inwardData.address || "No Record."}
                </p>
              </div>
              <div>
                <h5 className="uppercase font-semibold text-lg mb-2">
                  Master Data
                </h5>
                <p>
                  <strong>Name:</strong> {inwardData.name || "No Record."}
                </p>
                <p>
                  <strong>Address:</strong> {inwardData.address || "No Record."}
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white shadow rounded p-4">
            <div className="flex space-x-4 border-b pb-2 mb-4">
              <button className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-1">
                Inward Data
              </button>
              <button className="text-gray-600 hover:text-blue-600">
                Master Data
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-body">

          <ViewDataTable
            title=""
            columns={columns}
            data={inwardData}
            isLoading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default ViewInwardProcessv1;
