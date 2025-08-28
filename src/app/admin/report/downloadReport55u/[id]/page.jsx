"use client";
import { apiConnector } from "@/utils/apihelper";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const DownloadReport55u = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [isinData, setIsinData] = useState({});
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const downloadData = async () => {
      try {
        const responseData = await apiConnector(
          "GET",
          `${apiUrl}/v2/admin/report/download_report55u/${id}`
        );
        console.log({ responseData: responseData.data.result });
        const reportData = responseData.data.result;
        setData(reportData.data);
        setIsinData(reportData.isindata);
      } catch (error) {
        const errMsg = error.response.data.message;
        toast.error(
          errMsg || "An error occurred while processing the request."
        );
        console.error("Error fetching report data:", error);
      }
    };
    downloadData();
  }, [id]);

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
            <div className="container max-w-[1090px]">
              <div className="flex items-center py-2">
                <div className="w-[15%] border-b-[3px] border-b-black pb-1.5">
                  <img
                    src="/assets/images/vidatum.png"
                    alt=""
                    className="w-full max-w-[170px]"
                  />
                </div>
                <div className="w-[85%] border-b-[2px] border-[#e6e6e6] pl-4">
                  <p className="block text-lg leading-[2]">
                    Vidatum Solution Private Limited
                  </p>
                </div>
              </div>
            </div>
          </header>

          <p className="text-right">{`Date: ${formattedDate}`}</p>

          {/* Address section */}
          <div className="mb-6 mt-4">
            <p className="mb-1">To</p>
            <p className="font-medium">
              {isinData?.address && formatAddress(isinData.address)}
            </p>
          </div>

          {/* Subject */}
          <div className="text-center mb-4">
            <p className="font-medium">
              <strong>Subject:</strong> In the matter of Regulation 55A of SEBI
              (Depositories and Participants) Regulations, 1996
            </p>
          </div>

          {/* Period */}
          <div className="text-center mb-4">
            <p className="font-medium">
              <strong>Period:</strong> {data?.period}
            </p>
          </div>

          {/* ISIN & Face Value */}
          <div className="text-center mb-6">
            <p className="font-medium">
              <strong>ISIN:</strong> {data?.isin} | <strong>Face Value:</strong>{" "}
              Rs.{isinData?.facev} isin per Share
            </p>
          </div>

          {/* Letter Body */}
          <div className="text-justify leading-tight">
            <p className="mb-2">Sir/ Madam,</p>
            <p className="mb-4">
              In reference to the above captioned subject & regulations, please
              note the details pertaining to reconciliation statement during the
              captioned period under the SEBI (Depositories and Participants)
              Regulations, 1996. Please also note that the dematerialisation
              request lodged with us during the captioned period were processed
              (either accepted or rejected on technical grounds, as the case may
              be) within the stipulated time period specified under the SEBI
              (Depositories and Participants) Regulations, 1996.
            </p>

            {/* Table */}
            <table className="w-full border border-black text-left mb-6">
              <thead>
                <tr>
                  <th className="border border-black p-2">Particulars</th>
                  <th className="border border-black p-2">Total Shares</th>
                  <th className="border border-black p-2">
                    % of Total Issued Shares
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black p-2">Shares with CDSL</td>
                  <td className="border border-black p-2">{data?.cdsl || 0}</td>
                  <td className="border border-black p-2">{cdsl}%</td>
                </tr>
                <tr>
                  <td className="border border-black p-2">Shares with NSDL</td>
                  <td className="border border-black p-2">{data?.nsdl || 0}</td>
                  <td className="border border-black p-2">{nsdl}%</td>
                </tr>
                <tr>
                  <td className="border border-black p-2">Physical Shares</td>
                  <td className="border border-black p-2">{data?.phy || 0}</td>
                  <td className="border border-black p-2">{phy}%</td>
                </tr>
                <tr className="font-bold">
                  <td className="border border-black p-2">Total Shares</td>
                  <td className="border border-black p-2">{total}</td>
                  <td className="border border-black p-2">
                    {Math.round((cdsl + nsdl + phy) * 100) / 100}%
                  </td>
                </tr>
              </tbody>
            </table>

            <p className="mb-2">
              We request you to kindly take note of the above.
            </p>
            <p className="mb-2">Thanking You.</p>
            <p className="mb-2">For, Vidatum Solution Private Limited</p>

      
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
              <div className="w-1/3 border border-black p-1 text-sm">
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
              <div className="w-1/3">
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

export default DownloadReport55u;
