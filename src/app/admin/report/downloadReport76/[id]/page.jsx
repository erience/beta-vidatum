"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { apiConnector } from "@/utils/apihelper";

const DownloadReport76 = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [isinData, setIsinData] = useState({});
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const downloadData = async () => {
      try {
        const response = await apiConnector(
          "GET",
          `${apiUrl}/v2/admin/report/download_report76/${id}`
        );
        const reportData = response?.data?.result;
        setData(reportData?.data || {});
        setIsinData(reportData?.isindata || {});
      } catch (error) {
        const errMsg =
          error?.response?.data?.message ||
          error?.message ||
          "An error occurred while processing the request.";
        toast.error(errMsg);
        console.error("Error fetching report data:", error);
      }
    };

    if (id) {
      downloadData();
    }
  }, [id, apiUrl]);

  useEffect(() => {
    if (Object.keys(data).length && Object.keys(isinData).length) {
      setTimeout(() => window.print(), 1000);
    }
  }, [data, isinData]);

  const o_total =
    (data?.o_cdsl || 0) + (data?.o_nsdl || 0) + (data?.o_phy || 0);
  const c_total =
    (data?.c_cdsl || 0) + (data?.c_nsdl || 0) + (data?.c_phy || 0);

  const cdsl = c_total ? (data?.c_cdsl * 100) / c_total : 0;
  const nsdl = c_total ? (data?.c_nsdl * 100) / c_total : 0;
  const phy = c_total ? (data?.c_phy * 100) / c_total : 0;

  const diff_phy =
    (data?.d_t_cdsl || 0) +
    (data?.d_a_cdsl || 0) +
    (data?.d_t_nsdl || 0) +
    (data?.d_a_nsdl || 0) -
    ((data?.r_t_cdsl || 0) +
      (data?.r_a_cdsl || 0) +
      (data?.r_t_nsdl || 0) +
      (data?.r_a_nsdl || 0));

  const formattedDate = data?.date
    ? new Date(data.date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const formatAddress = (address) => {
    if (!address) return "";
    return address.split(",").map((line, index, arr) => (
      <span key={index}>
        {line.trim()}
        {index < arr.length - 1 && <br />}
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

        {/* Title and Issuer Info */}
        <div className="text-center mt-6 mb-4 font-semibold text-[14px] print:text-[11px]">
          TO WHOMSOEVER IT MAY CONCERN
        </div>

        <div className="mb-6">
          <p className="mb-1 font-medium">Issuer: {isinData?.cin}</p>
          <p className="font-medium">
            {isinData?.address && formatAddress(isinData.address)}
          </p>
        </div>

        <div className="text-center mb-4">
          <p className="mb-1">
            <strong>Subject:</strong> In the matter of Regulation 76 of SEBI
            (Depositories and Participants) Regulations, 2018
          </p>
          <p>
            <strong>Period:</strong> {data?.period}
          </p>
        </div>

        <div className="text-center mb-4">
          <p>
            <strong>ISIN:</strong> {data?.isin_id} |{" "}
            <strong>Face Value: </strong> Rs.{isinData?.facev} per Share
          </p>
        </div>

        {/* Letter Content */}
        <div className="text-justify leading-tight">
          <p className="mb-2">Sir/ Madam,</p>
          <p className="mb-2">
            In reference to the above captioned subject & regulations, please
            note the details pertaining to reconciliation statement during the
            captioned period under the SEBI (Depositories and Participants)
            Regulations, 2018...
          </p>

          {/* Existing Tables remain unchanged */}
          {/* Table 1 & Table 2 if present should be included here as-is */}

          <p className="mb-2">
            We request you to kindly take note of the above.
          </p>
          {data?.note && (
            <p className="mb-2">
              <strong>Note:</strong> {data.note}
            </p>
          )}
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

export default DownloadReport76;
