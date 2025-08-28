"use client";
import { useEffect, useState } from "react";
import { useBenposeStore } from "../../../../../../../store/benposeStore";

const OtherRejectionOutwardLetter = () => {
  const data = useBenposeStore((state) => state.formData);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (data?.data) {
      setFormData(data.data);
      setTimeout(() => window.print(), 300);
    }
  }, [data]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (!formData) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="w-full h-full bg-white text-black text-[14px] print:w-full print:h-full print:m-0 print:p-0 print:text-[14px] leading-tight">
      <div
        className="mx-auto p-4 print:p-4"
        style={{ width: "794px", minHeight: "1123px" }}
      >
        {/* Header */}
        <div className="flex justify-between items-start border-b border-black pb-2">
          <img
            src="/assets/images/vidatum.png"
            alt="Logo"
            className="w-[150px]"
          />
          <p className="text-right text-sm">
            Date: {formatDate(formData.processDate)}
          </p>
        </div>

        {/* TO/CC Box */}
        <div className="border border-black mt-2 break-inside-avoid">
          <div className="grid grid-cols-2">
            <div className="border-r border-black p-2">
              <p className="font-bold">To,</p>
              <p className="uppercase font-bold">
                {formData.name} (SHAREHOLDER)
              </p>
              <p className="uppercase">{formData.address}</p>
              {formData.mobile && <p>Phone: {formData.mobile}</p>}
            </div>
            <div className="p-2">
              <p className="font-bold">CC,</p>
              <p className="uppercase font-bold">{formData.cin} (ISSUER)</p>
              <p className="uppercase">{formData.issuerAddress}</p>
            </div>
          </div>
        </div>

        {/* Subject */}
        <div className="text-center mt-4 mb-2 font-bold uppercase">
          SUBJECT: {formData.rStatus === "Approved" ? "APPROVAL" : "REJECTION"}{" "}
          OF {formData.heading} REQUEST
        </div>

        {/* Letter Body */}
        <div className="mb-2">
          <p>Sir/ Madam,</p>
          <p>
            We have received your request for {formData.sub} of {formData.name}.
            Details of the request submitted by you are here as under:
          </p>
        </div>

        {/* Info Table */}
        <table className="w-full text-left border border-black border-collapse text-sm break-inside-avoid">
          <tbody>
            <tr>
              <td className="border border-black p-2 font-semibold">
                Company & ISIN
              </td>
              <td className="border border-black p-2">
                {formData.companyName} (ISIN: {formData.isin || "N/A"})
              </td>
            </tr>
            <tr>
              <td className="border border-black p-2 font-semibold">
                Name of First Holder
                <br />
                Joint holder 1<br />
                Joint holder 2
              </td>
              <td className="border border-black p-2">
                {formData.name}
                <br />
                {formData.name1 || "No"}
                <br />
                {formData.name2 || "No"}
              </td>
            </tr>
            <tr>
              <td className="border border-black p-2 font-semibold">
                Folio Number
              </td>
              <td className="border border-black p-2">{formData.lf}</td>
            </tr>
            <tr>
              <td className="border border-black p-2 font-semibold">
                Request Status
              </td>
              <td className="border border-black p-2">{formData.rStatus}</td>
            </tr>
            {formData.rStatus !== "Approved" && (
              <tr>
                <td className="border border-black p-2 font-semibold">
                  Additional documents required to Approve the Request
                </td>
                <td className="border border-black p-2">
                  {Array.isArray(formData.requiredDocs)
                    ? formData.requiredDocs.map((doc, i) => (
                        <p key={i}>{doc}</p>
                      ))
                    : typeof formData.requiredDocs === "string"
                    ? formData.requiredDocs
                        .split("^^")
                        .map((doc, i) => <p key={i}>{doc}</p>)
                    : "—"}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Important Note */}
        <div className="mt-3 text-sm break-inside-avoid">
          <p className="font-bold underline">Important Note:</p>
          <p>
            Honourable SEBI vide Circular
            SEBI/HO/MIRSD/MIRSD_RTAMB/P/CIR/2021/655 dated Nov 03, 2021 and
            Circular No. SEBI/HO/MIRSD/MIRSD_RTAMB/P/CIR/2021/687 dated Dec 14,
            2021. Please follow the guidelines mentioned in aforesaid Circulars
            including amendments thereof. You can find more details on our
            website at:{" "}
            <a href="https://vidatum.in/" className="underline">
              https://vidatum.in/
            </a>
          </p>
        </div>

        {/* Sign Off */}
        <div className="mt-4">
          <p>
            In case of any clarification is required, you're requested to kindly
            email us on the aforementioned address with full details.
          </p>
          <p className="mt-2">Thanking you.</p>
          <p>For, Vidatum Solution Private Limited</p>
          <p className="mt-6">(Nikita Sharma)</p>
          <p>Compliance Officer</p>
        </div>

        {/* Contact & Footer */}
        <div className="mt-6 flex justify-between text-sm border-t border-black pt-2 break-inside-avoid">
          <div>
            <p className="font-bold">Regd. Office:</p>
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
          <div>
            <p>CIN: U74900GJ2025PTC158439</p>
            <p>SEBI Regd. No.: NA</p>
            <p>Phone: +91 8780894961</p>
            <p>Email: info@vidatum.in</p>
            <p>Website: https://vidatum.in/</p>
          </div>
        </div>

      
      </div>
    </div>
  );
};

export default OtherRejectionOutwardLetter;
