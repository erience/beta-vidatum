"use client";
import { useEffect, useRef, useState } from "react";
import { useBenposeStore } from "../../../../../../../store/benposeStore";

const ApprovalOutwardLetter = () => {
  const data = useBenposeStore((state) => state.formData);
  const [formData, setFormData] = useState(null);
  const hasPrintedRef = useRef(false);

  // Set data safely
  useEffect(() => {
    if (data?.data) {
      setFormData(data.data);
    }
  }, [data]);

  // Print logic that works even on refresh
  useEffect(() => {
    if (formData && !hasPrintedRef.current) {
      hasPrintedRef.current = true;

      // Ensure DOM is fully rendered before printing
      const timer = setTimeout(() => {
        window.print();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [formData]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const dateObj = new Date(dateString);
    return dateObj.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white text-black font-sans text-[14px] print:w-full print:h-full print:p-0 print:m-0">
      <div className="w-[210mm] min-h-[280mm] mx-auto p-6 print:p-4 overflow-hidden break-inside-avoid-page">
        {/* Header */}
        <div className="flex items-center mb-6">
          <div className="w-[15%] border-b-4 border-black pb-2">
            <img
              src="/assets/images/vidatum.png"
              alt="Logo"
              className="w-[140px]"
            />
          </div>
          <div className="w-[85%] border-b border-gray-400 pb-2 pl-4">
            <p className="text-lg font-semibold">
              Vidatum Solution Private Limited
            </p>
          </div>
        </div>

        {/* Date */}
        <div className="text-right mb-6">
          <span className="font-medium">Date: </span>
          <span>
            {formatDate(formData?.processDate) || formatDate(new Date())}
          </span>
        </div>

        {/* Recipient */}
        <div className="mb-6">
          <p className="mb-1 leading-tight">To,</p>
          <p className="mb-0 font-semibold uppercase text-[14px] leading-tight">
            {formData?.name}
          </p>
          {formData?.address?.split(", ").map((line, idx) => (
            <p key={idx} className="mb-0 uppercase text-[14px] leading-tight">
              {line}
            </p>
          ))}
        </div>

        {/* Subject */}
        <div className="text-center mb-6">
          <p className="uppercase font-bold">
            SUBJECT: APPROVAL OF {formData?.heading} REQUEST
          </p>
        </div>

        {/* Body */}
        <div className="mb-6">
          <p className="mb-4">Sir/ Madam,</p>
          <p>
            We have received your request for{" "}
            <span className="capitalize">{formData?.sub}</span> of{" "}
            <span className="capitalize">{formData?.name}</span>. Details of
            request submitted by you are here as under:
          </p>
        </div>

        {/* Table */}
        <table className="w-full border border-black text-left mb-6 text-[13px]">
          <tbody>
            {[
              ["First/Sole Holder", formData?.name],
              ["Second Holder", formData?.name1 || "No"],
              ["Third Holder", formData?.name2 || "No"],
              ["Company", formData?.cin],
              ["ISIN", formData?.isin],
              ["Type of ISIN", formData?.isinType],
              ["Registered Folio No", formData?.lf],
              ["Request Status", "Approved"],
            ].map(([label, value], index) => (
              <tr key={index}>
                <td className="border border-black p-2 w-1/2 font-medium">
                  {label}
                </td>
                <td className="border border-black p-2 w-1/2">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Closing */}
        <div className="mb-6 space-y-4">
          <p>
            In case of any clarification is required, you're requested to kindly
            email us on the aforementioned address with full details.
          </p>
          <p>Thanking you.</p>
          <p>For, Vidatum Solution Private Limited</p>
          <div className="mt-6">
            <p>(Nikita Sharma)</p>
            <p>Compliance Officer</p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t pt-6 text-sm">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <p className="font-semibold mb-1">Regd. Office:</p>
              <p> F.F.-19, Dev Auram,</p>
              <p>Anand Nagar Cross Road,</p>
              <p> Prahlad Nagar Road,</p>
              <p>Manekbag, Ahmedabad - 380015.</p>
            </div>

            <div className="text-center border border-black p-2">
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

            <div className="text-right">
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
        </div>
      </div>
    </div>
  );
};

export default ApprovalOutwardLetter;
