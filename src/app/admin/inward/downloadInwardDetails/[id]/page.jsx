"use client";
import FileFormateTable from "@/components/dataTables/FileFormateTable";
import { apiConnector } from "@/utils/apihelper";
import { formatDateLong, formatDMY } from "@/utils/helper";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const DownloadInwardDetails = () => {
  const [data, setData] = useState({});
  const [inwardInfoData, setInwardInfoData] = useState({});
  const [inwardRangeData, setInwardRangeData] = useState([]);
  const [inwardRegisterData, setInwardRegisterData] = useState([]);
  const [inwardRegisterShareData, setInwardRegisterShareData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //---------------------------------fetch inward data--------------------------------------
  const fetchInwardData = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/viewInward?id=${id}&table=b_inward&isin=b_isin&demattable=b_inward_info`
      );
      const responseData = response.data.result;
      console.log("responseData", responseData);
      const result = responseData.data;
      const inwardInfo = responseData.b_inward_info;
      const inwardRange = Array.isArray(responseData?.b_inward_range)
        ? responseData.b_inward_range
        : [];
      const inwardRegister = Array.isArray(responseData?.b_register)
        ? responseData.b_register
        : [];
      console.log({ inwardRegister });
      const inwardRegisterShare = Array.isArray(responseData?.b_register_share)
        ? responseData.b_register_share
        : [];
      setInwardInfoData(inwardInfo);
      setData(result);
      setInwardRangeData(inwardRange);
      setInwardRegisterData(inwardRegister);
      setInwardRegisterShareData(inwardRegisterShare);
      setLoading(false);
    } catch (error) {
      const errMsg = error.response.data.message;
      toast.error(errMsg || "An error occurred while processing the request.");
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchInwardData();
  }, [id]);

  //-----------------------------inward range column---------------------------------
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
                return (
                  <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                    Approved
                  </span>
                );
              case 2:
                return (
                  <span
                    className="
                   text-yellow-500 bg-yellow-100  inline-block  text-xs font-semibold px-3 py-1 rounded-full"
                  >
                    Pending
                  </span>
                );
              case 3:
                return (
                  <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
                    Rejected
                  </span>
                );
              case 4:
                return (
                  <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
                    Deleted
                  </span>
                );
              case 5:
                return (
                  <span className="  text-white bg-blue-500  inline-block  text-xs font-semibold px-3 py-1 rounded-full">
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
  //-----------------------------inward register column---------------------------------
  const registerColumns = useMemo(
    () => [
      { header: "#", accessorKey: "index", cell: (info) => info.row.index + 1 },
      {
        header: "isin",
        accessorKey: "isin",
        cell: (info) => info.row.original.isin || "-",
      },
      {
        header: "TShare",
        accessorKey: "t_share",
        cell: (info) => info.row.original.t_share || "-",
      },
      {
        header: "HShare",
        accessorKey: "h_share",
        cell: (info) => info.row.original.h_share || "-",
      },
      {
        header: "Admission",
        accessorKey: "admission",
        cell: (info) => formatDMY(info.row.original.admission),
      },

      {
        header: "Lf",
        accessorKey: "lf",
        cell: (info) => info.row.original.lf || "-",
      },
      {
        header: "Name",
        accessorKey: "name",
        cell: (info) => info.row.original.name || "-",
      },
      {
        header: "Pan",
        accessorKey: "pan",
        cell: (info) => info.row.original.pan || "-",
      },
      {
        header: "JT1",
        accessorKey: "jt1",
        cell: (info) => info.row.original.jt1 || "-",
      },
      {
        header: "JT1Pan",
        accessorKey: "jt1pan",
        cell: (info) => info.row.original.jt1pan || "-",
      },
      {
        header: "JT2",
        accessorKey: "jt2",
        cell: (info) => info.row.original.jt2 || "-",
      },
      {
        header: "Address",
        accessorKey: "address",
        cell: (info) => info.row.original.address || "-",
      },
      {
        header: "Pin",
        accessorKey: "pin",
        cell: (info) => info.row.original.pin || "-",
      },
      {
        header: "Email",
        accessorKey: "email",
        cell: (info) => info.row.original.email || "-",
      },
      {
        header: "UID",
        accessorKey: "uid",
        cell: (info) => info.row.original.uid || "-",
      },
    ],
    []
  );

  const otherCols = useMemo(
    () => [
      { header: "#", accessorKey: "index", cell: (info) => info.row.index + 1 },
      {
        header: "Cin",
        accessorKey: "cin	",
        cell: (info) => info.row.original.cin || "-",
      },
      {
        header: "FMS",
        accessorKey: "fms",
        cell: (info) => info.row.original.fms || "-",
      },
      {
        header: "Category	",
        accessorKey: "category	",
        cell: (info) => info.row.original.category || "-",
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
        header: "Cessation",
        accessorKey: "cessation	",
        cell: (info) => info.row.original.cessation || "-",
      },
      {
        header: "Is_minor",
        accessorKey: "is_minor",
        cell: (info) => info.row.original.is_minor || "-",
      },
      {
        header: "Minor_dob	",
        accessorKey: "minor_dob",
        cell: (info) => formatDMY(info.row.original.minor_dob),
      },
      {
        header: "Guardian_name",
        accessorKey: "guardian_name",
        cell: (info) => info.row.original.guardian_name || "-",
      },
      {
        header: "Nomination_date",
        accessorKey: "nomination_date",
        cell: (info) => formatDMY(info.row.original.nomination_date),
      },
      {
        header: "Nominee_name",
        accessorKey: "nominee_name",
        cell: (info) => info.row.original.nominee_name || "-",
      },
      {
        header: "Nominee_address	",
        accessorKey: "nominee_address	",
        cell: (info) => info.row.original.nominee_address || "-",
      },
      {
        header: "Is_sbo		",
        accessorKey: "is_sbo		",
        cell: (info) => info.row.original.is_sbo || "-",
      },
      {
        header: "Sbo_ref		",
        accessorKey: "sbo_ref		",
        cell: (info) => info.row.original.sbo_ref || "-",
      },
      {
        header: "Lien		",
        accessorKey: "lien		",
        cell: (info) => info.row.original.lien || "-",
      },
      {
        header: "Lock			",
        accessorKey: "lock			",
        cell: (info) => info.row.original.lock || "-",
      },
      {
        header: "Remarks				",
        accessorKey: "remarks				",
        cell: (info) => info.row.original.remarks || "-",
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
                return (
                  <span
                    className="
                 text-yellow-500 bg-yellow-100  inline-block  text-xs font-semibold px-3 py-1 rounded-full"
                  >
                    Pending
                  </span>
                );
              case 3:
                return (
                  <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
                    Rejected
                  </span>
                );
              case 4:
                return (
                  <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
                    Deleted
                  </span>
                );
              case 5:
                return (
                  <span className="  text-white bg-blue-500  inline-block  text-xs font-semibold px-3 py-1 rounded-full">
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

  const registerShareCols = useMemo(
    () => [
      { header: "#", accessorKey: "index", cell: (info) => info.row.index + 1 },
      {
        header: "ISIN",
        accessorKey: "isin	",
        cell: (info) => info.row.original.isin || "-",
      },
      {
        header: "Allotment Transfer Date",
        accessorKey: "a_date",
        cell: (info) => formatDMY(info.row.original.a_date),
      },
      {
        header: "Endorsement Date		",
        accessorKey: "i_date	",
        cell: (info) => formatDMY(info.row.original.i_date),
      },
      {
        header: "TShare",
        accessorKey: "t_share",
        cell: (info) => info.row.original.t_share || "-",
      },
      {
        header: "Certificate",
        accessorKey: "certi",
        cell: (info) => info.row.original.certi || "-",
      },
      {
        header: "From",
        accessorKey: "from	",
        cell: (info) => info.row.original.from || "-",
      },
      {
        header: "To",
        accessorKey: "to	",
        cell: (info) => info.row.original.to || "-",
      },
      {
        header: "Payable",
        accessorKey: "payable	",
        cell: (info) => info.row.original.payable || "-",
      },
      {
        header: "Paid",
        accessorKey: "paid	",
        cell: (info) => info.row.original.paid || "-",
      },
      {
        header: "Due",
        accessorKey: "due	",
        cell: (info) => info.row.original.due || "-",
      },
      {
        header: "Consideration",
        accessorKey: "consideration	",
        cell: (info) => info.row.original.consideration || "-",
      },
      {
        header: "Transfer Demat Data	",
        accessorKey: "t_date	",
        cell: (info) => info.row.original.t_date || "-",
      },
      {
        header: "Buyer LF	",
        accessorKey: "lf_buyer	",
        cell: (info) => info.row.original.lf_buyer || "-",
      },
      {
        header: "Buyer Name	",
        accessorKey: "t_name",
        cell: (info) => info.row.original.t_name || "-",
      },
      {
        header: "lock",
        accessorKey: "lock",
        cell: (info) => info.row.original.lock || "-",
      },
      {
        header: "Remarks",
        accessorKey: "remarks",
        cell: (info) => info.row.original.remarks || "-",
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
                    Active
                  </span>
                );
              case 2:
                return (
                  <span
                    className="
                 text-yellow-500 bg-yellow-100  inline-block  text-xs font-semibold px-3 py-1 rounded-full"
                  >
                    Pending
                  </span>
                );
              case 3:
                return (
                  <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
                    Rejected
                  </span>
                );
              case 4:
                return (
                  <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
                    Deleted
                  </span>
                );
              case 5:
                return (
                  <span className="  text-white bg-blue-500  inline-block  text-xs font-semibold px-3 py-1 rounded-full">
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

  return (
    <>
      <div className="col-span-1 lg:col-span-3 space-y-4">
        {/* Inward Header Block */}
        <div className=" bg-white shadow-md p-4 rounded-lg border border-gray-200 ">
          <div className="flex justify-between items-center mb-4">
            <h5 className="text-xl font-bold">Inward Details</h5>
            <span
              className={`text-xs font-medium px-3 py-1 rounded-full text-white ${
                data.status === 1
                  ? "bg-green-500"
                  : data.status === 2
                  ? "bg-yellow-500"
                  : data.status === 3
                  ? "bg-red-500"
                  : "bg-gray-400"
              }`}
            >
              {data.status === 1
                ? "Approved"
                : data.status === 2
                ? "Pending"
                : data.status === 3
                ? "Rejected"
                : "Unknown"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-700">
            <div className="space-y-1.5">
              <p>
                <span className="font-extrabold text-md">Inward Date:</span>{" "}
                {formatDateLong(data?.date)}
              </p>
              <p>
                <span className="font-extrabold text-md">Inward Mode:</span>{" "}
                {data?.mode}
              </p>
              <p>
                <span className="font-extrabold text-md">Sender:</span>{" "}
                {data?.sender}
              </p>
            </div>
            <div className="space-y-1.5">
              <p>
                <span className="font-extrabold text-md">Inward No:</span>{" "}
                {data?.ref}
              </p>
              <p>
                <span className="font-extrabold text-md">Type:</span>{" "}
                {data?.type}
              </p>
              <p>
                <span className="font-extrabold text-md">Location:</span>{" "}
                {data?.location}
              </p>
            </div>
            <div className="space-y-1.5">
              <p>
                <span className="font-extrabold text-md">Processing Date:</span>{" "}
                {data?.p_date ? formatDateLong(data.p_date) : "-"}
              </p>
              <p>
                <span className="font-extrabold text-md">Sub Type:</span>{" "}
                {data?.sub_type || "N/A"}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <h6 className="font-extrabold text-md mb-1">Remarks:</h6>
            {Array.isArray(data.remarks) ? (
              <ul className="list-disc ml-5 text-gray-600">
                {data.remarks.map((remark, idx) => (
                  <li key={idx}>{remark}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">{data.remarks}</p>
            )}
          </div>
        </div>

        {/* Inward Information Block */}
        <div className="bg-white shadow-md p-4 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h5 className="text-base font-semibold mb-3">Inward Information</h5>

            <button
              type="button"
              className="bg-cyan-100 text-cyan-800  text-xs font-semibold px-3 py-1 rounded mb-3"
            >
              {data?.type}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-700">
            {/* Only rendering Demat layout since that’s what your screenshot shows */}
            <div className="space-y-1.5">
              <p>
                <strong>DP ID:</strong> {inwardInfoData?.dp || "N/A"}
              </p>
              <p>
                <strong>DRN:</strong> {inwardInfoData?.drn || "N/A"}
              </p>
              <p>
                <strong>Name1:</strong> {inwardInfoData?.name || "N/A"}
              </p>
              <p>
                <strong>PAN1:</strong> {inwardInfoData?.pan || "N/A"}
              </p>
              <p>
                <strong>Phone:</strong> {inwardInfoData?.mobile || "N/A"}
              </p>
            </div>
            <div className="space-y-1.5">
              <p>
                <strong>Client ID:</strong> {inwardInfoData?.client || "N/A"}
              </p>
              <p>
                <strong>Name2:</strong> {inwardInfoData?.name1 || "N/A"}
              </p>
              <p>
                <strong>PAN2:</strong> {inwardInfoData?.pan1 || "N/A"}
              </p>
              <p>
                <strong>Email:</strong> {inwardInfoData?.email || "N/A"}
              </p>
            </div>
            <div className="space-y-1.5">
              <p>
                <strong>Ledger Folio:</strong> {inwardInfoData?.lf || "N/A"}
              </p>
              <p>
                <strong>Name3:</strong> {inwardInfoData?.name2 || "N/A"}
              </p>
              <p>
                <strong>PAN3:</strong> {inwardInfoData?.pan2 || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* inward range table */}
        <div className=" p-4 rounded-lg ">
          <h5 className="font-semibold text-base mb-3">Inward Range</h5>

          <div className="card">
            <div className="card-body">
              <FileFormateTable
                title=""
                columns={columns}
                data={inwardRangeData}
                isLoading={loading}
              />
            </div>
          </div>
        </div>

        {/* inward register table */}
        <div className=" p-4 rounded-lg ">
          <h5 className="font-semibold text-base mb-3">Inward Register</h5>

          <div className="card">
            <div className="card-body">
              <FileFormateTable
                title=""
                columns={registerColumns}
                data={inwardRegisterData}
                isLoading={loading}
              />
              <FileFormateTable
                title=""
                columns={otherCols}
                data={inwardRegisterData}
                isLoading={loading}
              />
            </div>
          </div>
        </div>

        {/* inward register Share table */}
        <div className=" p-4 rounded-lg ">
          <h5 className="font-semibold text-base mb-3">Inward Register</h5>

          <div className="card">
            <div className="card-body">
              <FileFormateTable
                title=""
                columns={registerShareCols}
                data={inwardRegisterShareData}
                isLoading={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DownloadInwardDetails;
