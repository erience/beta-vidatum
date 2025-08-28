"use client";
import { apiConnector } from "@/utils/apihelper";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const DownloadReport745 = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [isinData, setIsinData] = useState({});
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const downloadData = async () => {
      try {
        const responseData = await apiConnector(
          "GET",
          `${apiUrl}/v2/admin/report/download_report745/${id}`
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
      <div className="w-full flex justify-center print:text-[10px] print:leading-tight print:h-[1122px] print:w-[794px] print:overflow-hidden">
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

          {/* Issuer Info */}
          <div className="mb-6">
            <p className="font-medium">Issuer: {isinData?.cin}</p>
          </div>

          {/* Address */}
          <div className="mb-6">
            <p className="mb-1">To</p>
            <p className="font-medium">{formatAddress(isinData?.address)}</p>
          </div>

          {/* Subject */}
          <div className="text-center mb-4">
            <p className="font-medium">
              <strong>Subject:</strong> In the matter of Regulation 74(5) of
              SEBI (Depositories and Participants) Regulations, 2018
            </p>
          </div>

          {/* Reference */}
          <div className="text-center mb-4">
            <p className="font-medium">
              <strong>References:</strong> SEBI Letter MRD/ DOP2/OW/2019/2498/1
              dated January 24, 2019 | NSDL/CIR/II/5/2019 dated January 25, 2019
              | CDSL/OPS/RTA/POLICY/2019/14 dated January 25, 2019
            </p>
          </div>

          {/* Period */}
          <div className="text-center mb-6">
            <p className="font-medium">
              <strong>Period:</strong> {data?.period}
            </p>
          </div>

          {/* Letter Body */}
          <div className="text-justify leading-tight">
            <h6 className="font-medium mb-2">Sir/ Madam,</h6>
            <p className="mb-2">
              In reference to the above captioned subject &amp; regulations,
              please note that the security(ies) received from the depository
              participant(s) for dematerialisation during the captioned period,
              were processed (either accepted or rejected on technical grounds,
              as the case may be) within the stipulated time limit specified
              under the SEBI (Depositories and Participants) Regulations, 2018
              and that the security(ies) comprised in the said certificate(s)
              have been listed on the stock exchanges, where the earlier issued
              security(ies) are listed.
            </p>
            <p className="mb-2">
              Please further note that the security(ies) received for
              dematrialisation have been mutilated/ cancelled after due
              verification by us (as per our operational procedure) and the name
              of the depository(ies) have been substituted in security holder's
              list as the registered owner within the stipulated time limit
              specified under the SEBI (Depositories and Participants)
              Regulations, 2018.
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

export default DownloadReport745;
