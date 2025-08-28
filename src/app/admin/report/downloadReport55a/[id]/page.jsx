"use client";
import { apiConnector } from "@/utils/apihelper";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const DownloadReport55a = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [isinData, setIsinData] = useState({});
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const downloadData = async () => {
    try {
      const responseData = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/report/download_report55a/${id}`
      );
      console.log({ responseData: responseData.data.result });
      const reportData = responseData.data.result;
      setData(reportData.data);
      setIsinData(reportData.isindata);
    } catch (error) {
      const errMsg = error.response.data.message;
      toast.error(errMsg || "An error occurred while processing the request.");
      console.error("Error fetching report data:", error);
    }
  };

  useEffect(() => {
    downloadData();
  }, []);

  useEffect(() => {
    if (Object.keys(data).length > 0 && Object.keys(isinData).length > 0) {
      setTimeout(() => {
        window.print();
      }, 1000);
    }
  }, [data, isinData]);

  const formattedDate = data?.date
    ? new Date(data.date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  // Format address with line breaks if available
  const formatAddress = (address) => {
    if (!address) return "";
    return address.split(",").map((line, index) => (
      <span key={index}>
        {line.trim()}
        {index < address.split(",").length - 1 && <br />}
      </span>
    ));
  };
  const total = (data?.cdsl || 0) + (data?.nsdl || 0) + (data?.phy || 0);
  const cdsl = total
    ? Math.round(((data?.cdsl * 100) / total) * 10000) / 10000
    : 0;
  const nsdl = total
    ? Math.round(((data?.nsdl * 100) / total) * 10000) / 10000
    : 0;
  const phy = total
    ? Math.round(((data?.phy * 100) / total) * 10000) / 10000
    : 0;

  return (
    <>
      <div className="w-full flex justify-center print:text-[11px] print:leading-tight print:h-[1122px] print:w-[794px] print:overflow-hidden">
        <div className="w-full max-w-[794px] bg-white p-6 print:p-4 text-[13px] print:text-[10px]">
          {/* Header */}
          <header>
            <div className="flex items-center py-2">
              <div className="w-[15%] border-b-[3px] border-b-black pb-1.5">
                <img
                  src="/assets/images/vidatum.png"
                  alt="Logo"
                  className="w-full max-w-[170px]"
                />
              </div>
              <div className="w-[85%] border-b-[2px] border-[#e6e6e6] pl-4">
                <p className="block text-lg leading-[2]">
                  Vidatum Solution Private Limited
                </p>
              </div>
            </div>
          </header>

          <p className="text-right mb-4">{`Date: ${formattedDate}`}</p>

          {/* Address */}
          <div className="mb-6">
            <p className="mb-1">To</p>
            <p className="font-medium">
              {isinData?.address && formatAddress(isinData.address)}
            </p>
          </div>

          {/* Subject & References */}
          <div className="text-center mb-4">
            <p className="font-medium mb-1">
              <strong>Subject:</strong> In the matter of Reconciliation of Share
              Capital Audit Report (Half Yearly)
            </p>
            <p className="font-medium">
              <strong>References:</strong> SEBI Letter MRD/DOP2/OW/2019/2498/1
              dated January 24, 2019, NSDL/CIR/II/5/2019 dated January 25, 2019,
              CDSL/OPS/RTA/POLICY/2019/14 dated January 25, 2019
            </p>
            <p className="font-medium">
              <strong>Period:</strong> {data?.period}
            </p>
            <p className="font-medium">
              <strong>ISIN:</strong> {data?.isin} | <strong>Face Value:</strong>{" "}
              Rs.{isinData?.facev} per Share
            </p>
          </div>

          {/* Body */}
          <div className="text-justify mb-6">
            <p className="mb-2">Sir/ Madam,</p>
            <p className="mb-2">
              In reference to the above captioned subject, please note the
              details pertaining to reconciliation statement during the
              captioned period under the Companies Act, 2013 and Depositories
              Act, 1996.
            </p>

            {/* Table */}
            <table className="w-full border border-collapse mb-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Particulars</th>
                  <th className="border p-2 text-left">Total Shares</th>
                  <th className="border p-2 text-left">
                    % of Total Issued Shares
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">Shares with CDSL</td>
                  <td className="border p-2">{data?.cdsl || 0}</td>
                  <td className="border p-2">{cdsl}%</td>
                </tr>
                <tr>
                  <td className="border p-2">Shares with NSDL</td>
                  <td className="border p-2">{data?.nsdl || 0}</td>
                  <td className="border p-2">{nsdl}%</td>
                </tr>
                <tr>
                  <td className="border p-2">Physical Shares</td>
                  <td className="border p-2">{data?.phy || 0}</td>
                  <td className="border p-2">{phy}%</td>
                </tr>
                <tr className="font-bold">
                  <td className="border p-2">Total Shares</td>
                  <td className="border p-2">{total}</td>
                  <td className="border p-2">
                    {(
                      parseFloat(cdsl) +
                      parseFloat(nsdl) +
                      parseFloat(phy)
                    ).toFixed(2)}
                    %
                  </td>
                </tr>
              </tbody>
            </table>

            <p className="mb-2">
              Also, we hereby confirm that during the half year:
            </p>
            <ol className="list-decimal ml-6 mb-4">
              <li>The Register of Members is updated in our records.</li>
              <li>
                The dematerialisation request lodged with us during the
                captioned period were processed (either accepted or rejected)
                within the stipulated time period.
              </li>
            </ol>

            <p className="mb-2">
              We request you to kindly take note of the above.
            </p>
            <p className="mb-2">Thanking You.</p>
            <p className="mb-2">For, Vidatum Solution Private Limited</p>

            {/* Signature */}
      
          </div>

          {/* Footer */}
          <footer className="mt-6 text-[12px] print:text-[9px]">
            <div className="flex justify-between gap-4">
              <div className="w-1/3">
                <h6 className="font-bold">Regd. Office:</h6>
                <p>
                  F.F.-19, Dev Auram,
                  <br />
                  Anand Nagar Cross Road,
                  <br />
                  Prahlad Nagar Road,
                  <br />
                  Manekbag, Ahmedabad - 380015.
                </p>
              </div>
              <div className="w-1/3 border border-black p-1 text-sm text-center">
                <p>
                  <b>Working Days:</b> Monday to Friday
                </p>
                <p>
                  <b>Call Hours:</b> 11.30 AM to 5.00 PM
                </p>
                <p>
                  <b>Lunch Break:</b> 1.30 PM to 2.30 PM
                </p>
              </div>
              <div className="w-1/3 text-sm">
                <p>
                  <b>CIN:</b> U74900GJ2025PTC158439
                </p>
                <p>
                  <b>SEBI Regd. No.:</b> NA
                </p>
                <p>
                  <b>Phone:</b> +91 8780894961
                </p>
                <p>
                  <b>Email:</b> info@vidatum.in
                </p>
                <p>
                  <b>Website:</b> https://vidatum.in/
                </p>
              </div>
            </div>
           
          </footer>
        </div>
      </div>
    </>
  );
};

export default DownloadReport55a;
