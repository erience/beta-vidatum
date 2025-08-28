"use client";
import { apiConnector } from "@/utils/apihelper";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const DownloadReport409 = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [isinData, setIsinData] = useState({});
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const downloadData = async () => {
      try {
        const responseData = await apiConnector(
          "GET",
          `${apiUrl}/v2/admin/report/download_report409/${id}`
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
                    alt="logo"
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

          {/* Date */}
          <p className="text-right">{`Date: ${formattedDate}`}</p>

          {/* Issuer Info */}
          <div className="my-6">
            <p className="mb-1 font-medium">Issuer: {isinData?.cin}</p>
            <p className="font-medium">
              {isinData?.address && formatAddress(isinData.address)}
            </p>
          </div>

          {/* Subject & Period */}
          <div className="text-center mb-4">
            <p className="mb-1">
              <strong>Subject:</strong> In the matter of Regulation 40(9) of
              SEBI (Listing Obligations and Disclosure Requirement), 2015
            </p>
            <p>
              <strong>Period:</strong> {data?.period}
            </p>
          </div>

          {/* Letter Body */}
          <div className="text-justify leading-tight">
            <p className="mb-2">Sir/ Madam,</p>
            <p className="mb-2">
              Please further note that, security(ies) received from the
              holder(s) in respect of sub-division, consolidation, renewal,
              exchange, during the captioned period, were processed (either
              accepted or rejected on technical grounds, as the case may be)
              within the stipulated time limit specified under the SEBI (Listing
              Obligations and Disclosure Requirement), 2015.
            </p>
            <p className="mb-2">
              Please further note that, request(s) received from the holder(s)
              in respect of endorsement of calls/allotment monies, during the
              captioned period, were processed (either accepted or rejected on
              technical grounds, as the case may be) within the stipulated time
              limit specified under the SEBI (Listing Obligations and Disclosure
              Requirement), 2015.
            </p>
            <p className="mb-2">
              * The SEBI has mandated all listed companies that with effect from
              April 1, 2019, requests for effecting transfer of securities
              should not be processed in the physical form. [the SEBI (Listing
              Obligations and Disclosure Requirements) (Fourth Amendment)
              Regulations, 2018 & Press Release No. 49/2018]
            </p>
            <p className="mb-2">
              We request you to kindly take note of the above.
            </p>

            {data["note"] && (
              <p className="mb-2">
                <strong>Note:</strong> {data["note"]}
              </p>
            )}

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

export default DownloadReport409;
