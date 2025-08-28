"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const InwardRequestDownload = () => {
  const { id } = useParams();
  const [formState, setFormState] = useState({ type: null, data: null });

  useEffect(() => {
    const stored = sessionStorage.getItem("inwardDownload");
    if (stored) {
      const parsed = JSON.parse(stored);
      setFormState({ type: parsed.type, data: parsed.data });
    }
  }, []);

  const { type, data } = formState;

  useEffect(() => {
    if (type && data && Object.keys(data).length > 0) {
      setTimeout(() => {
        window.print();
      }, 1000);
    }
  }, [type, data]);

  const renderHeader = (title) => (
    <div className="w-full flex justify-center px-0 print:text-[11px]">
      <div className="w-full max-w-[794px] bg-white pt-[10px] pr-[30px] pb-[0px] pl-[30px] no-print-break">
        <header className="mb-6 border-b border-black pb-2">
          <div className="flex items-center justify-between">
            <img
              src="/assets/images/vidatum.png"
              alt="Company Logo"
              className="h-12"
            />
            <div>
              <p className="text-lg font-semibold text-right">
                Vidatum Solution Private Limited
              </p>
            </div>
          </div>
          <h2 className="text-center text-xl font-bold mt-4">{title}</h2>
        </header>
      </div>
    </div>
  );

  const renderTopFields = () => (
    <div className="grid grid-cols-2 gap-6 text-base mb-6">
      <div>
        <p>
          <strong>Sender's Name:</strong> {data?.sender || "-"}
        </p>
        <p>
          <strong>Shareholder's Name:</strong> {data?.shareholder || "-"}
        </p>
        <p>
          <strong>Issuer Type:</strong> {data?.type || "-"}
        </p>
        <p>
          <strong>Company:</strong> {data?.cin || "-"}
        </p>
      </div>
      <div>
        <p>
          <strong>Inward No.:</strong> {data?.ref || id || "-"}
        </p>
        <p>
          <strong>Inward Date:</strong> {data?.date || "-"}
        </p>
        <p>
          <strong>Value of Shares:</strong> {data?.value || "-"}
        </p>
        <p>
          <strong>KYC Inward No(s):</strong> {data?.kyc || "-"}
        </p>
      </div>
    </div>
  );

  const yesNoNAList = (items) => (
    <table className="table-auto w-full border border-collapse border-gray-400 text-sm mb-6">
      <thead>
        <tr className="bg-gray-100">
          <th className="border p-2 w-12">#</th>
          <th className="border p-2 text-left">Checklist</th>
          <th className="border p-2 w-28 text-center">Yes/No/NA</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, idx) => (
          <tr key={idx}>
            <td className="border p-2 text-center">{idx + 1}</td>
            <td className="border p-2">{item}</td>
            <td className="border p-2 text-center">Yes/ No/ NA</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderFormByType = () => {
    if (!type) {
      return (
        <div className="text-red-500 p-4 text-center">
          <h2 className="text-xl font-bold mb-4">Invalid Request</h2>
          <p>No request type provided. Please go back and try again.</p>
        </div>
      );
    }

    switch (type) {
      case "demat":
        return (
          <>
            {renderHeader("DEMAT REQUEST")}
            {renderTopFields()}
            {yesNoNAList([
              "Prior demat request from the same LF Number",
              "Prior stop request/ regulatory orders for the same LF Number",
              "No discrepancy in Shareholder Name as per RTA Records",
              "Minor discrepancy in Shareholder Name as per RTA Records",
              "Major discrepancy in Shareholder Name as per RTA Records",
              "No discrepancy in Name but missing/ incomplete Joint Shareholder Name(s)",
              "Minor discrepancy in Signature as per RTA Records",
              "Major discrepancy in Signature as per RTA Records",
              "LF Number matches as per RTA Records, DRF and Depository System",
              "Number of Shares matches as per RTA Records, DRF and Depository System",
              "DN Range details match as per RTA Records, DRF and Depository System",
              "Certificate Number matches as per RTA Records, DRF and Depository System",
              "DRN Number matches as per DRF and Depository System",
              "DP ID/ Client ID matches as per DRF and Depository System",
              "ISIN matches as per DRF and Depository System",
              "Beneficial Owner status matches (i.e. NRI and Minor/ Major)",
              "Demat Request is Signed and Stamped by Depository Participant",
              "Surrendered for Dematerialisation Stamp is affixed",
              "21 days elapsed from date of DRN Setup",
              "30 days elapsed from date of DRN Setup",
              "120 days elapsed from Issue of Letter of Confirmation",
              "Signature of at least 2 Directors on Share Certificates",
              "In case of Transposition: Transposition form attached?",
              "In case of Transmission: Transmission form attached?",
              "Notarised Death Certificate attached?",
            ])}
          </>
        );
      case "transmission":
        return (
          <>
            {renderHeader("TRANSMISSION REQUEST")}
            {renderTopFields()}
            {yesNoNAList([
              "Name of the Shareholder is same with Accurate Data",
              "LF No is same or not with Accurate Data",
              "No of shares is same or not with Accurate Data",
              "Check if any prior request has been received",
              "Is KYC Done? (If not, add checklist)",
              "Is duly filled transmission request attached?",
              "Original/notarized Death Certificate attached",
              "Original Share Certificates attached",
              "Duly filled ISR 4 attached",
              "Self-attested copy of PAN of nominee attached",
              "Birth Certificate if Claimant is minor",
              "Succession/Probate/Will/Legal Heirship/Court Decree attached",
              "Legal Heir Affidavit (Annexure D)",
              "Affidavit of All Legal Heirs (Annexure D)",
              "For shares <5L (phy) or <15L (demat) – all indemnity documents attached",
            ])}
          </>
        );
      case "kyc":
        return (
          <>
            {renderHeader("KYC REQUEST")}
            {renderTopFields()}
            {yesNoNAList([
              "Previous KYC request from the same LF Number",
              "Prior stop request/ regulatory orders for the same LF Number",
              "No discrepancy in Shareholder Name as per RTA Records",
              "Minor discrepancy in Shareholder Name as per RTA Records",
              "Major discrepancy in Shareholder Name as per RTA Records",
              "Missing/ incomplete Joint Shareholder Name(s)",
              "LF Number matches RTA Records",
              "Number of Shares matches RTA Records",
              "DN Range matches RTA Records",
              "Certificate Number matches RTA Records",
              "Is Aadhar connected to PAN?",
              "ISR 1 attached",
              "ISR 2 attached with Employee Code",
              "ISR 3 or SH 13 attached",
              "Proof of identity included",
              "Proof of address included",
              "Cancelled cheque/passbook attached",
              "Email provided",
              "Mobile number provided",
              "Bank details provided",
              "Pending dividend as per RTA Records",
            ])}
          </>
        );
      case "duplicate":
        return (
          <>
            {renderHeader("DUPLICATE REQUEST")}
            {renderTopFields()}
            {yesNoNAList([
              "Previous KYC request from same LF Number",
              "Prior duplicate request from same LF Number",
              "Prior transmission request",
              "Prior stop request/ regulatory orders",
              "ISR 4 form is properly completed",
              "No discrepancy in Shareholder Name",
              "Minor discrepancy in Shareholder Name",
              "Major discrepancy in Shareholder Name",
              "Incomplete Joint Shareholder Name(s)",
              "LF Number matches RTA",
              "Number of Shares matches",
              "DN Range matches",
              "Certificate Number matches",
              "Notarized Affidavit (Appendix A) attached",
              "Indemnity bond (Appendix B) attached",
              "FIR and Newspaper Ad included",
            ])}
          </>
        );
      case "exchange":
        return (
          <>
            {renderHeader("KYC + NEW SHARE CERTIFICATE REQUEST")}
            {renderTopFields()}
            {yesNoNAList([
              "Previous KYC request from the same LF Number",
              "Prior stop request/ regulatory orders",
              "No discrepancy in Shareholder Name",
              "Minor discrepancy in Shareholder Name",
              "Major discrepancy in Shareholder Name",
              "Missing Joint Shareholder Name(s)",
              "LF Number matches RTA",
              "Number of Shares matches",
              "DN Range matches",
              "Certificate Number matches",
              "Aadhar linked to PAN",
              "ISR 1 attached",
              "ISR 2 attached",
              "ISR 3 / SH 13 attached",
              "Proof of identity",
              "Proof of address",
              "Cancelled cheque/passbook",
              "Email provided",
              "Mobile number provided",
              "Bank details provided",
              "Pending dividend exists",
              "Original Share Certificates attached",
              "ISR 4 attached",
            ])}
          </>
        );
      case "others":
        return (
          <>
            {renderHeader("OTHER REQUEST")}
            {renderTopFields()}
            <div className="mt-8 border border-gray-400 p-4">
              <p className="text-lg font-semibold mb-2">Remark</p>
              <div className="min-h-[200px] border border-gray-400 p-3">
                {data?.remark || "N/A"}
              </div>
            </div>
          </>
        );
      default:
        return (
          <div className="text-red-500 p-4 text-center">
            <h2 className="text-xl font-bold mb-4">Invalid Request Type</h2>
            <p>Invalid request type: {type}</p>
          </div>
        );
    }
  };

  if (!type || !data) {
    return (
      <div className="p-10 bg-white text-black max-w-6xl mx-auto">
        <div className="text-red-500 p-4 text-center">
          <h2 className="text-xl font-bold mb-4">Missing Information</h2>
          <p>
            Required data is missing. This could happen if you refreshed the
            page or navigated directly to this URL without proper parameters.
          </p>
          <p className="mt-4">
            Please go back to the previous page and try downloading again.
          </p>
        </div>
        <footer className="mt-10 pt-4 border-t text-sm text-gray-600">
          <p>© 2025 Vidatum Solution Private Limited</p>
          <p>CIN: U74900GJ2025PTC158439</p>
          <p>Phone: +91 8780894961 | Email: info@vidatum.in</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="p-10 bg-white text-black max-w-6xl mx-auto print:p-0 print:shadow-none">
      {renderFormByType()}
      <footer className="mt-10 pt-4 border-t text-sm text-gray-600">
        <p>© 2025 Vidatum Solution Private Limited</p>
        <p>CIN: U74900GJ2025PTC158439</p>
        <p>Phone: +91 8780894961 | Email: info@vidatum.in</p>
      </footer>
    </div>
  );
};

export default InwardRequestDownload;
