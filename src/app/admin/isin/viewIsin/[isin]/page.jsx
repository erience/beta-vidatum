"use client";
import { useEffect, useMemo, useState } from "react";
import { Download } from "lucide-react";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import { apiConnector } from "@/utils/apihelper";
import ViewDataTable from "@/components/dataTables/ViewDataTable";

const ViewIsin = () => {
  const [data, setData] = useState({});
  const [isinBalance, setIsinBalance] = useState([]);
  const [IDTHistory, setIDTHistory] = useState([]);
  const [demateHistory, setDemateHistory] = useState([]);
  const [remateHistory, setRemateHistory] = useState([]);
  const [corporateAction, setCorporateAction] = useState([]);
  const [inwardV1, setInwardV1] = useState([]);
  const [inwardApproved, setInwardApproved] = useState([]);
  const [inwardPending, setInwardPending] = useState([]);
  const [inwardRejected, setInwardRejected] = useState([]);
  const [outwardV1, setOutwardV1] = useState([]);
  const [outward, setOutward] = useState([]);
  const [isinPublic, setIsinPublic] = useState([]);
  const [isinPromoter, setIsinPromoter] = useState([]);
  const [agreementsLatter, setAgreementsLatter] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { isin } = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchIsinData = async () => {
      try {
        const response = await apiConnector(
          "GET",
          `${apiUrl}/v2/admin/isin/view-cisin/${isin}`
        );
        const result = response?.data?.result || {};
        setData(result);
        setIsinBalance(result.isinInfo || []);
        setIDTHistory(result.recoInfo || []);
        setDemateHistory(result.recoDematData || []);
        setRemateHistory(result.recoRematData || []);
        setCorporateAction(result.corporateAction || []);
        setInwardV1(result.inwardv1 || []);
        setInwardApproved(result.inwardActive || []);
        setInwardPending(result.inwardPending || []);
        setInwardRejected(result.inwardRejected || []);
        setOutward(result.outward || []);
        setOutwardV1(result.outward || []);
        setIsinPublic(result.publicClassificationData || []);
        setIsinPromoter(result.promoterClassificationData || []);
        setAgreementsLatter(result.isinMedia || []);
        setLoading(false);
      } catch (error) {
        const errMsg = error?.response?.data?.message;
        toast.error(
          errMsg || "An error occurred while processing the request."
        );
        console.error("Error fetching ISIN data:", error);
        setLoading(false);
      }
    };

    fetchIsinData();
  }, [isin]);

  const stgFunction = async (fileName) => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/file/${fileName}`,
        {
          responseType: "blob",
        }
      );
      const fileURL = window.URL.createObjectURL(new Blob([response.data]));
      window.open(fileURL);
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("File not found");
    }
  };

  const handleIdt = () => router.push("/admin/reconciliation/idtList");
  const handleDemat = () =>
    router.push("/admin/reconciliation/nsdlDematHistory");
  const handleRemat = () => router.push("/admin/reconciliation/rematHistory");
  const handleCa = () => router.push("/admin/reconciliation/corporateList");

  const balanceColumns = useMemo(
    () => [
      {
        header: "#",
        accessorKey: "index",
        cell: (info) => info?.row?.index + 1 || "-",
      },
      {
        header: "ISIN",
        accessorKey: "isin_id",
        cell: (info) => info?.row?.original?.isin_id,
      },
      {
        header: "CDSL Op. Balance",
        accessorKey: "c_shares",
        cell: (info) => info?.row?.original?.c_shares,
      },
      {
        header: "NSDL Op. Balance",
        accessorKey: "n_shares",
        cell: (info) => info?.row?.original?.n_shares,
      },
      {
        header: "PHY Op. Balance",
        accessorKey: "p_shares",
        cell: (info) => info?.row?.original?.p_shares,
      },
    ],
    []
  );

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  const isinData = data?.isin?.[0] || {};

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-4">
        {/* Left Column */}
        <div className="w-full xl:w-1/3 bg-white shadow rounded p-6">
          <div className="flex justify-center mb-4">
            {isinData?.status ? (
              <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                {isinData.status}
              </span>
            ) : (
              <span className="text-gray-500">Status Unknown</span>
            )}
          </div>

          <div className="mb-4">
            <h6 className="font-medium">Org. Name</h6>
            <p className="text-gray-700">{isinData?.cin || "N/A"}</p>
          </div>

          <div className="mb-4">
            <h6 className="font-medium">Org. Address</h6>
            <p className="text-gray-700 text-sm whitespace-pre-line">
              {isinData?.address || "N/A"}
            </p>
          </div>

          <div className="mb-4">
            <h6 className="font-medium">Org. Email</h6>
            <p className="text-gray-700">{isinData?.email || "N/A"}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            {[
              ["Org. Type", isinData?.type],
              ["Instrument", isinData?.instrument],
              ["CDSL", isinData?.cdsl === "Yes" ? "Yes" : "No"],
              ["NSDL", isinData?.nsdl === "Yes" ? "Yes" : "No"],
              ["CDSL Date", isinData?.c_date || "N/A"],
              ["NSDL Date", isinData?.n_date || "N/A"],
              ["Face Value", `Rs. ${isinData?.facev || "0"}`],
              ["Paid-up Value", `Rs. ${isinData?.paidv || "0"}`],
              ["Connectivity Type", isinData?.connect],
              ["Transfer Type", isinData?.transfer],
            ].map(([label, value], idx) => (
              <div key={idx}>
                <h6 className="font-medium">{label}</h6>
                <p className="text-gray-700">{value || "N/A"}</p>
              </div>
            ))}
          </div>

          <div>
            <h6 className="font-medium">Remarks</h6>
            <p className="text-gray-700">{isinData?.remarks || "N/A"}</p>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full xl:w-2/3 space-y-6">
          <div className="bg-white shadow rounded p-4">
            <ViewDataTable
              title="ISIN Balance"
              columns={balanceColumns}
              data={isinBalance}
              isLoading={loading}
            />
          </div>

          {(agreementsLatter?.cdsl_tagreement ||
            agreementsLatter?.b_agreement ||
            agreementsLatter?.nsdl_tagreement ||
            agreementsLatter?.n_agreement ||
            agreementsLatter?.c_agreement) && (
            <div className="bg-white shadow rounded p-4">
              <h5 className="text-lg font-semibold mb-2">
                ISIN Agreements & Letters
              </h5>
              {[
                [
                  "→ CDSL TriParty Agreement",
                  agreementsLatter?.cdsl_tagreement,
                ],
                ["→ BSE Agreement", agreementsLatter?.b_agreement],
                [
                  "→ NSDL TriParty Agreement",
                  agreementsLatter?.nsdl_tagreement,
                ],
                ["→ NSDL Agreement", agreementsLatter?.n_agreement],
                ["→ CDSL Activation Letter", agreementsLatter?.c_agreement],
              ].map(([label, file], idx) =>
                file?.length > 1 ? (
                  <div
                    key={idx}
                    className="text-sm text-gray-700 flex items-center space-x-2 mt-2"
                  >
                    <span>{label}</span>
                    <button onClick={() => stgFunction(file)}>
                      <Download className="text-orange-500" />
                    </button>
                  </div>
                ) : null
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mt-4">
        {[
          ["ISIN IDT History", handleIdt, "yellow"],
          ["ISIN Demate History", handleDemat, "green"],
          ["ISIN Remate History", handleRemat, "red"],
          ["ISIN Corporate Action History", handleCa, "gray"],
        ].map(([label, handler, color], idx) => (
          <div
            key={idx}
            className="bg-white shadow-lg rounded-lg border p-6 w-70"
          >
            <h4 className="text-lg font-semibold text-gray-700">{label}</h4>
            <button
              onClick={handler}
              className={`mt-4 w-full py-2 text-white bg-${color}-500 rounded-lg hover:bg-${color}-400`}
            >
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewIsin;
