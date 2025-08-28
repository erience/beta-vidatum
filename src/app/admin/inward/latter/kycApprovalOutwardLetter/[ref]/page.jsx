"use client";
import { useEffect, useState } from "react";
import { useBenposeStore } from "../../../../../../../store/benposeStore";

const KycApprovalOutwardLetter = () => {
  const data = useBenposeStore((state) => state.formData);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (data?.data) {
      console.log("data", data.data);
      setFormData(data.data);
      setLoading(false);

      setTimeout(() => {
        window.print();
      }, 500);
    }
  }, [data]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const dateObj = new Date(dateString);
    return dateObj.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading || !formData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white min-h-screen text-black font-sans">
      {/* Header */}
      <header>
        <div className="max-w-7xl mx-auto">
          <div className="flex">
            <div className="border-l-4 border-orange-500 pl-2">
              <img
                src="/assets/images/vidatum.png"
                alt="Logo"
                className="h-12 w-auto"
              />
            </div>
            <div className="flex-1 border-l-2 border-gray-300 pl-4 flex items-center">
              <p className="text-lg font-medium">
                Vidatum Solution Private Limited
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Date Section */}
        <div className="text-right mb-6">
          <p className="text-sm">
            Date:{" "}
            <span>
              {formData && formData.processDate
                ? formatDate(formData.processDate)
                : formatDate(new Date())}
            </span>
          </p>
        </div>

        {/* Address Section with Border */}
        <div className="border-2 border-black mx-2 mb-4 p-4">
          <div className="grid grid-cols-2">
            {/* To Section */}
            <div className="border-r-2 border-black pr-4">
              <p className="mb-1">
                <strong>To,</strong>
              </p>
              <p className="mb-1 uppercase font-bold">
                {formData?.name} (Shareholder)
              </p>
              <p className="mb-1 uppercase">{formData?.address}</p>
            </div>

            {/* CC Section */}
            <div className="pl-4">
              <p className="mb-1">
                <strong>CC,</strong>
              </p>
              <p className="mb-1 uppercase font-bold">
                {formData?.cin} (Issuer)
              </p>
              <p className="mb-1 uppercase">{formData?.issuerAddress}</p>
            </div>
          </div>
        </div>

        {/* Subject Section */}
        <div className="text-center mt-8 mb-6">
          <div className="inline-flex">
            <p className="uppercase font-bold">
              SUBJECT: APPROVAL OF {formData.heading} REQUEST
            </p>
          </div>
        </div>

        {/* Letter Content */}
        <div className="min-h-[62vh] mb-6">
          <p className="mb-3">Dear Sir/ Madam,</p>
          <p className="mt-2 mb-6">
            We refer to the request received from you for issuance of securities
            in your name. We would like to inform you that the request has been
            approved as detailed below:
          </p>

          {/* Details Table */}
          <table className="w-full border-collapse border border-black mb-6">
            <thead>
              <tr>
                <th className="border border-black bg-gray-50 p-3 text-left">
                  Company & ISIN
                </th>
                <th className="border border-black bg-gray-50 p-3 text-left">
                  {formData?.cin} (ISIN: {formData?.isin})
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black p-3 align-top">
                  <div>Name of First Holder & PAN</div>
                  {formData?.name1 && formData?.pan1 && (
                    <div>Joint holder 1 & PAN</div>
                  )}
                  {formData?.name2 && formData?.pan2 && (
                    <div>Joint holder 2 & PAN</div>
                  )}
                </td>
                <td className="border border-black p-3 align-top">
                  <strong>
                    {formData?.name} (PAN: {formData?.pan})
                    {formData?.name1 && formData?.pan1 && (
                      <>
                        <br />
                        {formData?.name1} (PAN: {formData?.pan1})
                      </>
                    )}
                    {formData?.name2 && formData?.pan2 && (
                      <>
                        <br />
                        {formData?.name2} (PAN: {formData?.pan2})
                      </>
                    )}
                  </strong>
                </td>
              </tr>
              <tr>
                <td className="border border-black p-3">Folio Number</td>
                <td className="border border-black p-3">{formData?.lf}</td>
              </tr>
              <tr>
                <td className="border border-black p-3">Request Status</td>
                <td className="border border-black p-3">Approved</td>
              </tr>
              {formData?.remark && (
                <tr>
                  <td className="border border-black p-3">Remarks</td>
                  <td className="border border-black p-3">
                    {formData?.remark}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <p className="mb-4">
            In case of any clarification is required, you're requested to kindly
            email us on the aforementioned address with full details.
          </p>
          <p className="mb-2">Thanking you.</p>
          <p className="mb-5">For, Vidatum Solution Private Limited</p>
          <div className="mb-5"></div>
          <p>
            (Nikita Sharma)
            <br />
            Compliance Officer
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
            {/* Registered Office */}
            <div className="md:col-span-4">
              <h6 className="text-orange-600 font-bold mb-2">Regd. Office:</h6>
              <p className="text-sm leading-relaxed">
                F.F.-19, Dev Auram,
                <br />
                Anand Nagar Cross Road,
                <br />
                Prahlad Nagar Road,
                <br />
                Manekbag, Ahmedabad - 380015.
              </p>
            </div>

            {/* Working Hours - Centered with border */}
            <div className="md:col-span-3 text-center">
              <div className="border border-gray-400 p-3 text-sm">
                <p>
                  <span className="text-orange-600 font-bold">
                    Working Days:
                  </span>{" "}
                  Monday to Friday
                  <br />
                  <span className="text-orange-600 font-bold">
                    Call Hours:
                  </span>{" "}
                  11.30 AM to 5.00 PM
                  <br />
                  <span className="text-orange-600 font-bold">
                    Lunch Break:
                  </span>{" "}
                  1.30 PM to 2.30 PM
                </p>
              </div>
            </div>

            {/* Contact Details */}
            <div className="md:col-span-4 md:ml-5">
              <div className="text-right text-sm">
                <p>
                  <span className="text-orange-600 font-bold">CIN:</span>{" "}
                  U74900GJ2025PTC158439
                  <br />
                  <span className="text-orange-600 font-bold">
                    SEBI Regd. No.:
                  </span>{" "}
                  NA
                  <br />
                  <span className="text-orange-600 font-bold">Phone:</span>{" "}
                  +91 8780894961
                  <br />
                  <span className="text-orange-600 font-bold">Email:</span>{" "}
                  info@vidatum.in
                  <br />
                  <span className="text-orange-600 font-bold">
                    Website:
                  </span>{" "}
                  https://vidatum.in/
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Banner */}
         
        </div>
      </footer>
    </div>
  );
};

export default KycApprovalOutwardLetter;
