"use client";
import { apiConnector } from "@/utils/apihelper";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const ViewInwardv1 = () => {
  const [inward, setInward] = useState([]);
  const { id, isin } = useParams();
  const [activeTab, setActiveTab] = useState("inward");
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchInwardv1Data = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/process/viewinwardprocessv1/${id}/${isin}`
      );
      const result = response.data.result || [];
      console.log(response?.data?.result?.inward[0]?.status);
      console.log({ result });
      setInward(result);
      setLoading(false);
    } catch (error) {
      const errMsg = error.response.data.message;
      toast.error(errMsg || "An error occurred while processing the request.");
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchInwardv1Data();
  }, [id, isin]);

  const formatDate = (dateString) => {
    if (!dateString) return "No Record.";
    return new Date(dateString).toLocaleDateString();
  };


  const columns = useMemo(
    () => [
      { header: "#", accessorKey: "index", cell: (info) => info.row.index + 1 },
      {
        header: "From",
        accessorKey: "from",
        cell: (info) => info.row.original.from,
      },
      {
        header: "Remarks",
        accessorKey: "remarks",
        cell: (info) => info.row.original.remarks,
      },

      {
        header: "Status",
        accessorKey: "status",
        cell: (info) => info.row.original.status,
      },
    ],
    []
  );



  return (
    <div className="container mx-auto px-4">
      <div className="mb-4">
        <h2 className="text-xl">Inward File Upload</h2>
      </div>

      <h2 className="text-2xl font-semibold mb-4">View Inward v1.0</h2>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-4">
          <div className="grid gap-6">
            {/* Card 1: ISIN & Status */}
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <h5 className="text-xl font-bold">{atob(isin) || ""}</h5>

              {/* First make sure inward exists and has data */}
              {inward && inward.length > 0 && (
                <>
                  {inward?.inward[0].status === 1 ? (
                    <button className="bg-red-500 text-white px-3 py-1 rounded text-xs mb-1">
                      Approved
                    </button>
                  ) : inward?.inward[0].status === 2 ? (
                    <button className="bg-red-500 text-white px-3 py-1 rounded text-xs mb-1">
                      Pending
                    </button>
                  ) : inward?.inward[0].status === 3 ? (
                    <button className="bg-red-500 text-white px-3 py-1 rounded text-xs mb-1">
                      Rejected
                    </button>
                  ) : (
                    <button className="bg-gray-500 text-white px-3 py-1 rounded text-xs mb-1">
                      Unknown Status
                    </button>
                  )}
                </>
              )}

              <p className="text-gray-500 mb-2">
                {inward[0]?.date ? formatDate(inward[0].date) : "1/1/2022"}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-left">
                  <h5 className="font-medium text-sm uppercase">
                    Inward Mode:
                  </h5>
                  <p className="text-gray-500 mb-2">{inward[0]?.mode || ""}</p>

                  <h5 className="font-medium text-sm uppercase">Sender:</h5>
                  <p className="text-gray-500 mb-2">
                    {inward[0]?.sender || "Hem Securities Limited"}
                  </p>
                </div>

                <div className="text-left">
                  <h5 className="font-medium text-sm uppercase">Inward No.:</h5>
                  <p className="text-gray-500 mb-2">
                    {inward[0]?.ref || "ACC001399"}
                  </p>

                  <h5 className="font-medium text-sm uppercase">Type:</h5>
                  <p className="text-gray-500 mb-2">
                    {inward[0]?.type || "Demat"}
                  </p>

                  <h5 className="font-medium text-sm uppercase">Location:</h5>
                  <p className="text-gray-500 mb-2">
                    {inward[0]?.location || "Jaipur"}
                  </p>
                </div>

                <div className="col-span-2 text-left">
                  <h5 className="font-medium text-sm uppercase">Remarks:</h5>
                  <p className="text-gray-500 mb-2">
                    {inward[0]?.remarks || "Demat Request"}
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Account Details */}
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-left">
                  <h5 className="font-medium text-sm uppercase">DP Id:</h5>
                  <p className="text-gray-500 mb-2">
                    {inward[0]?.dp || "No Record."}
                  </p>

                  <h5 className="font-medium text-sm uppercase">
                    Ledger Folio:
                  </h5>
                  <p className="text-gray-500 mb-2">
                    {inward[0]?.lf || "No Record."}
                  </p>

                  <h5 className="font-medium text-sm uppercase">Phone:</h5>
                  <p className="text-gray-500 mb-2">
                    {inward[0]?.mobile || "No Record."}
                  </p>
                </div>

                <div className="text-left">
                  <h5 className="font-medium text-sm uppercase">Client Id:</h5>
                  <p className="text-gray-500 mb-2">
                    {inward[0]?.client || "No Record."}
                  </p>

                  <h5 className="font-medium text-sm uppercase">PAN:</h5>
                  <p className="text-gray-500 mb-2">
                    {inward[0]?.pan || "No Record."}
                  </p>

                  <h5 className="font-medium text-sm uppercase">Email:</h5>
                  <p className="text-gray-500 mb-2">
                    {inward[0]?.email || "No Record."}
                  </p>
                </div>

                <div className="col-span-2 text-left">
                  <h5 className="font-medium text-sm uppercase">Remarks:</h5>
                  <p className="text-gray-500 mb-2">
                    {inward[0]?.remarks || "Demat Request"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-8">
          <div className="grid gap-6">
            {/* Card 1: Name & Address */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium mb-4 uppercase">
                    <i className="fe-file mr-1"></i>Inward Data
                  </h5>
                  <div className="mt-3 text-left">
                    <h5 className="text-sm uppercase">Name:</h5>
                    <p className="text-gray-500 mb-2 text-sm">
                      {inward[0]?.name || "No Record."}
                    </p>

                    <h5 className="text-sm uppercase">Address:</h5>
                    <p className="text-gray-500 mb-2 text-sm">
                      {inward[0]?.address || "No Record."}
                    </p>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium mb-4 uppercase">
                    <i className="fe-file mr-1"></i>Master Data
                  </h5>
                  <div className="mt-3 text-left">
                    <h5 className="text-sm uppercase">Name:</h5>
                    <p className="text-gray-500 mb-2 text-sm">
                      {inward[0]?.name || "No Record."}
                    </p>

                    <h5 className="text-sm uppercase">Address:</h5>
                    <p className="text-gray-500 mb-2 text-sm">
                      {inward[0]?.address || "No Record."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Tabs */}

            <div className="bg-white rounded-lg shadow p-6">
              <div className="p-4">
                <h5 className="mb-4 text-left uppercase">
                  <i className="fe-file mr-1"></i>Inward
                </h5>
              </div>
              <div className="bg-white rounded-lg shadow border border-gray-200">
                <div className="flex border-b">
                  <button
                    className={`px-4 py-2 w-1/2 text-center font-medium ${
                      activeTab === "inward"
                        ? "bg-black text-white"
                        : "text-gray-700"
                    }`}
                    onClick={() => setActiveTab("inward")}
                  >
                    Inward Data
                  </button>
                  <button
                    className={`px-4 py-2 w-1/2 text-center font-medium ${
                      activeTab === "master"
                        ? "bg-black text-white"
                        : "text-gray-700"
                    }`}
                    onClick={() => setActiveTab("master")}
                  >
                    Master Data
                  </button>
                </div>

                <div className="p-4">
                  {activeTab === "inward" ? (
                    <ViewDataTable
                      title=""
                      columns={columns}
                      data=""
                      isLoading={loading}
                    />
                  ) : (
                    <div className="text-center py-12 text-xl font-medium text-gray-500">
                      Coming Soon
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewInwardv1;
