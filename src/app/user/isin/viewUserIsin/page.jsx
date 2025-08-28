"use client";
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { apiConnector } from "@/utils/apihelper";
import { Download } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const ViewUserIsin = () => {
  const [data, setData] = useState([]);
  const [idtData, setIdtData] = useState([]);
  const [corporateData, setCorporateData] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Function to fetch ISIN data
  const fetchIsinData = async () => {
    try {
      const responseData = await apiConnector("GET", `${apiUrl}/v2/user/isin/type/view-isin`);
      console.log(responseData.data.result.data.isin);
      console.log("isin", responseData.data.result.data);
      const isinInfo = responseData.data.result.data || [];
      const IdtInfo = responseData.data.result.data.recoInfo || [];
      const corporateInfo = responseData.data.result.data.corporateAction || [];
      setData(isinInfo);
      setIdtData(IdtInfo);
      setCorporateData(corporateInfo);
      setLoading(false);
    } catch (error) {
      const errMsg = error.response.data.message;
      toast.error(errMsg || "An error occurred while processing the request.");
      console.error("fetching data error", error);
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchIsinData();
  }, []);

  const formatAllotmentDate = (dateStr) => {
    if (!dateStr || typeof dateStr !== "string") return "-";
    if (dateStr.startsWith("00")) return "-";

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "-";

    // Format as YYYY-MM-DD
    return date.toISOString().split("T")[0];
  };

  //---------------------------------------file download----------------------------------

  const fileDownload = (fileName) => {
    apiConnector("GET", `${apiUrl}/v2/user/file/${fileName}`)
      .then(() => {
        window.open(`/user/file/${fileName}`, "_blank");
      })
      .catch((error) => {
        console.error("Error downloading file:", error);
        alert("File not found");
      });
  };
  const isinBalance = useMemo(
    () => [
      { header: "#", accessorKey: "index", cell: (info) => info.row.index + 1 },
      {
        header: "ISIN",
        accessorKey: "isin_id",
        cell: (info) => info.row.original.isin_id,
      },
      {
        header: "CDSL Op. Balance",
        accessorKey: "c_shares",
        cell: (info) => info.row.original.c_shares,
      },

      {
        header: "NSDL Op. Balance",
        accessorKey: "n_shares",
        cell: (info) => info.row.original.n_shares,
      },
      {
        header: "PHY Op. Balance",
        accessorKey: "p_shares",
        cell: (info) => info.row.original.p_shares,
      },
      {
        header: "Total Op. Balance",
        accessorKey: "totalShares",
        cell: (info) => {
          const { c_shares, n_shares, p_shares } = info.row.original;
          return c_shares + n_shares + p_shares;
        },
      },
    ],
    []
  );

  const isinIdt = useMemo(
    () => [
      {
        header: "#",
        accessorKey: "index",
        cell: (info) => info.row.index + 1,
      },
      {
        header: "ISIN",
        accessorKey: "d",
        cell: (info) => info.row.original.d,
      },
      {
        header: "Date",
        accessorKey: "date",
        cell: (info) => {
          const dateStr = info.row.original.date;
          const date = new Date(dateStr);
          const formatOptions = {
            year: "numeric",
            month: "long",
            day: "numeric",
          };
          return date.toLocaleDateString("en-US", formatOptions);
        },
      },
      {
        header: "IDT Quantity",
        accessorKey: "e",
        cell: (info) => info.row.original.e / 1000,
      },
      {
        header: "Type",
        accessorKey: "n",
        cell: (info) =>
          info.row.original.n === 90 ? "NSDL CREDIT" : "NSDL DEBIT",
      },
    ],
    []
  );

  const corporateActionData = useMemo(
    () => [
      { header: "#", accessorKey: "index", cell: (info) => info.row.index + 1 },
      {
        header: "ISIN",
        accessorKey: "isin_id",
        cell: (info) => info.row.original.isin_id,
      },
      {
        header: "Depository",
        accessorKey: "depository",
        cell: (info) => (info.row.original.depository === 1 ? "NSDL " : "CDSL"),
      },
      {
        header: "Allotment Date",
        accessorKey: "a_date",
        cell: (info) => {
          const dateStr = info.row.original.a_date;
          return formatAllotmentDate(dateStr);
        },
      },
      {
        header: "Credit Date",
        accessorKey: "c_date",
        cell: (info) => {
          const dateStr = info.row.original.c_date;
          return formatAllotmentDate(dateStr);
        },
      },

      {
        header: "Type",
        accessorKey: "type",
        cell: (info) => info.row.original.type,
      },
      {
        header: "Description",
        accessorKey: "des",
        cell: (info) => info.row.original.des,
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
              return (
                      <span className=" text-yellow-500 bg-yellow-100  inline-block  text-xs font-semibold px-3 py-1 rounded-full">
                  InActive
                </span>
              );
            default:
              return "Unknown";
          }
        },
      },
    ],
    []
  );

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* ISIN Information Section */}
        <div className="col-span-1">
          <div className="card p-6 border rounded-lg shadow-sm">
            <h5 className="text-lg font-semibold">ISIN Information</h5>
            <div className="alert bg-red-100 text-red-800 p-4 mt-2 rounded-md">
              ISIN information is available as per the Depository's records. In
              case of any discrepancies, please send an email to
              info@vidatum.in.
            </div>
            <div className="mt-4">
              <h6 className="font-semibold">Org. Name & Address</h6>
              <p className="text-gray-600">{data?.address}</p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <h6 className="font-semibold">Org. Type</h6>
                <p className="text-gray-600">{data?.isin?.type}</p>
              </div>
              <div>
                <h6 className="font-semibold">CDSL</h6>
                <p className="text-gray-600">{data?.isin?.cdsl}</p>
                <h6 className="font-semibold">CDSL Date</h6>
                <p className="text-gray-600">{data?.isin?.c_date || "---"}</p>
              </div>
              <div>
                <h6 className="font-semibold">Instrument</h6>
                <p className="text-gray-600">{data?.isin?.instrument}</p>
              </div>
              <div>
                <h6 className="font-semibold">NSDL</h6>
                <p className="text-gray-600">{data?.isin?.nsdl}</p>
                <h6 className="font-semibold">NSDL Date</h6>
                <p className="text-gray-600">{data?.isin?.n_date || "---"}</p>
              </div>
            </div>
            <div className="mt-4">
              <h6 className="font-semibold">Face Value</h6>
              <p className="text-gray-600">Rs. {data?.isin?.facev}</p>
              <h6 className="font-semibold">Paid-up Value</h6>
              <p className="text-gray-600">Rs. {data?.isin?.paidv}</p>
              <h6 className="font-semibold">Connectivity Type</h6>
              <p className="text-gray-600">{data?.isin?.connect}</p>
              <h6 className="font-semibold">Transfer Type</h6>
              <p className="text-gray-600">{data?.isin?.transfer}</p>
            </div>
          </div>
        </div>

        {/* ISIN Balance Section */}
        <div className="col-span-2">
          <div className="card p-6 border rounded-lg shadow-sm">
            <h5 className="text-lg font-semibold">ISIN Balance</h5>
            <div className="alert bg-gray-800 text-white p-4 mt-2 rounded-md">
              ISIN Balance as of the Admission Date or April 1, 2022, whichever
              is later.
            </div>
            <div className="card">
              <div className="card-body">

                <ViewDataTable
                  title=""
                  cardHeader="ISIN Balance data"
                  columns={isinBalance}
                  data={data}
                  isLoading={loading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ISIN Agreements & Letters Section */}
      <div className="mt-6">
        <div className="card p-6 border rounded-lg shadow-sm">
          <h5 className="text-lg font-semibold">ISIN Agreements & Letters</h5>
          {data?.isinMedia?.cdsl_tagreement && (
            <div className="mt-4 text-gray-700">
              <h6 className="font-semibold">CDSL TriParty Agreement</h6>
              <button
                onClick={() => fileDownload(data.isinMedia.cdsl_tagreement)}
                className="text-blue-600 flex items-center gap-1 hover:underline"
              >
                Download <Download />
              </button>
            </div>
          )}

          {data?.isinMedia?.b_agreement && (
            <div className="mt-4 text-gray-700">
              <h6 className="font-semibold">BiParty Agreement</h6>
              <button
                onClick={() => fileDownload(data?.isinMedia?.b_agreement)}
                className="text-blue-600 flex items-center gap-1 hover:underline"
              >
                Download <Download />
              </button>
            </div>
          )}
          {data?.isinMedia?.nsdl_tagreement && (
            <div className="mt-4 text-gray-700">
              <h6 className="font-semibold">NSDL TriParty Agreement</h6>
              <button
                onClick={() => fileDownload(data?.isinMedia?.nsdl_tagreement)}
                className="text-blue-600 flex items-center gap-1 hover:underline"
              >
                Download <Download />
              </button>
            </div>
          )}
          {data?.isinMedia?.n_agreement && (
            <div className="mt-4 text-gray-700">
              <h6 className="font-semibold">NSDL Activation Letter</h6>
              <button
                onClick={() => fileDownload(data?.isinMedia?.n_agreement)}
                className="text-blue-600 flex items-center gap-1 hover:underline"
              >
                Download <Download />
              </button>
            </div>
          )}
          {data?.isinMedia?.c_agreement && (
            <div className="mt-4 text-gray-700">
              <h6 className="font-semibold">CDSL Activation Letter</h6>
              <a
                onClick={() => fileDownload(data?.isinMedia?.c_agreement)}
                className="text-blue-600 flex items-center gap-1 hover:underline"
              >
                Download <Download />
              </a>
            </div>
          )}
        </div>
      </div>
      {/* ISIN IDT History */}
      <div className="col-span-2">
        <div className="card p-6 border rounded-lg shadow-sm">
          <h5 className="text-lg font-semibold">ISIN IDT History</h5>
          <div className="alert bg-gray-800 text-white p-4 mt-2 rounded-md">
            ISIN IDT History refers to the Inter-Depository Transfer history,
            which involves transfers of securities between CDSL and NSDL from
            April 1, 2022, onwards.
          </div>
          <div className="card">
            <div className="card-body">

              <ViewDataTable
                title=""
                cardHeader=""
                columns={isinIdt}
                data={idtData}
                isLoading={loading}
              />
            </div>
          </div>
        </div>
      </div>
      {/* ISIN Corporate Action History */}
      <div className="col-span-2">
        <div className="card p-6 border rounded-lg shadow-sm">
          <h5 className="text-lg font-semibold">
            ISIN Corporate Action History
          </h5>
          <div className="card">
            <div className="card-body">
              <ViewDataTable
                title=""
                columns={corporateActionData}
                data={corporateData}
                isLoading={loading}
              />

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewUserIsin;
