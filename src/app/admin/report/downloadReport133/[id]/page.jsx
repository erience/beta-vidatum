"use client";
import { apiConnector } from "@/utils/apihelper";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const DownloadReport133 = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [isinData, setIsinData] = useState({});
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const downloadData = async () => {
      try {
        const responseData = await apiConnector(
          "GET",
          `${apiUrl}/v2/admin/report/download_report133/${id}`
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
    // Trigger print dialog when data is loaded
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

  return (
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

        {/* Address */}
        <div className="mt-6 mb-4">
          <p className="mb-1">To</p>
          <p className="font-medium">
            {isinData?.address && formatAddress(isinData.address)}
          </p>
        </div>

        {/* Subject */}
        <div className="text-center mb-4 font-semibold text-[14px] print:text-[11px]">
          <strong>Subject:</strong> In the matter of Regulation 13(3) of SEBI
          (Listing Obligations and Disclosure Requirement) Regulations, 2015
        </div>

        {/* Period */}
        <div className="text-center mb-4">
          <p>
            <strong>Period:</strong> {data?.period}
          </p>
        </div>

        {/* Body */}
        <div className="text-justify leading-tight">
          <p className="mb-2">Sir/ Madam,</p>
          <p className="mb-2">
            In reference to the above captioned subject & regulations, please
            note the details pertaining to complaint(s) received &amp; disposed
            off during the captioned period within the stipulated time limit
            specified under the SEBI (Listing Obligations and Disclosure
            Requirement) Regulations, 2015.
          </p>

          {/* Table */}
          <div className="overflow-x-auto mb-4">
            <table className="w-full border-collapse border border-gray-300 text-[12px] print:text-[10px]">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 p-1 text-left">
                    Particulars
                  </th>
                  <th className="border border-gray-300 p-1 text-left">
                    Complaints pending at the beginning of the captioned period
                  </th>
                  <th className="border border-gray-300 p-1 text-left">
                    Complaints received during the captioned period
                  </th>
                  <th className="border border-gray-300 p-1 text-left">
                    Complaints disposed off/ resolved at the end of captioned
                    period
                  </th>
                  <th className="border border-gray-300 p-1 text-left">
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-1">
                    No. of Complaints
                  </td>
                  <td className="border border-gray-300 p-1">
                    {data?.open || 0}
                  </td>
                  <td className="border border-gray-300 p-1">
                    {data?.new || 0}
                  </td>
                  <td className="border border-gray-300 p-1">
                    {data?.close || 0}
                  </td>
                  <td className="border border-gray-300 p-1">
                    {data?.balance || 0}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mb-2">
            The word "complaint" with respect to the aforesaid report shall
            construed to mean, either a complaint lodged with us in the SCORES
            Portal or an official request and tagged as either "complaint" or
            "grievance" by a security holder(s) pertaining to unsatisfactory or
            unacceptable acts of the Issuer/ Us.
          </p>

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
  );
};

export default DownloadReport133;
