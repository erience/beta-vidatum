"use client";
import { useEffect, useState } from "react";
import { useBenposeStore } from "../../../../../../../store/benposeStore";

const RejectionOutwardLetter = () => {
  const data = useBenposeStore((state) => state.formData);
  console.log({ data });
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (data) {
      setFormData(data); // Use data directly, not data.data
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

  // Calculate total sum for securities
  const calculateTotalSecurities = (inwardRange) => {
    if (!inwardRange) return 0;
    return inwardRange.reduce((total, row) => {
      return total + (row.to - row.from + 1);
    }, 0);
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
        <div className="container mx-auto px-4">
          <div className="flex">
            <div className="border-l-4 border-orange-500 pl-2">
              <img
                src="/assets/images/vidatum.png"
                alt="Logo"
                className="h-12 w-auto"
              />
            </div>
            <div className="border-l-2 border-gray-300 pl-4 flex-1 flex items-center">
              <p className="text-lg font-medium">
                Vidatum Solution Private Limited
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 mt-8">
        {/* Date */}
        <div className="text-right mb-8">
          <p>
            Date: <span>{formatDate(formData?.data?.processDate)}</span>
          </p>
        </div>

        {/* To and CC Section */}
        <div className="border border-gray-800 px-2 mx-1 mb-2 flex">
          <div className="w-1/2 border-r border-gray-800 pr-4">
            <p className="mb-1">
              <b>To,</b>
            </p>
            <p className="mb-1 uppercase">
              <b>{formData?.data?.cname} (DP)</b>
            </p>
            <p className="mb-1 uppercase">{formData?.data?.address}</p>
          </div>
          <div className="w-1/2 pl-4">
            <p className="mb-1">
              <b>CC,</b>
            </p>
            <p className="mb-1 uppercase">
              <b>{formData?.data?.name} (Shareholder)</b>
            </p>
            <p className="mb-1 uppercase">{formData?.data?.shAddress}</p>
          </div>
        </div>

        {/* Subject */}
        <div className="text-center mb-8 mt-8">
          <div className="inline-flex uppercase">
            <p>
              <b>
                SUBJECT: REJECTION OF {formData?.data?.sub} REQUEST NO.{" "}
                {formData?.data?.drn}
              </b>
            </p>
          </div>
        </div>

        {/* Letter Content */}
        <div className="mb-8 mt-5">
          <p className="mb-3">Dear Sir/ Madam,</p>
          <p className="mt-2 mb-6">
            We refer to the request received from you for dematerialization of
            securities. After examining the documents, we regret to inform you
            that we have to reject the said request. The details of the same are
            as per below:
          </p>

          {/* Details Table */}
          <table className="w-full border border-gray-800 mb-6">
            <thead>
              <tr>
                <th className="border border-gray-800 p-2 bg-gray-100">
                  Company & ISIN
                </th>
                <th className="border border-gray-800 p-2 bg-gray-100">
                  {formData?.data?.cin} (ISIN: {formData?.data?.isin})
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-800 p-2 align-top">
                  <div>Name of First Holder & PAN</div>
                  {formData?.data?.name1 && formData?.data?.pan1 && (
                    <div>Joint holder 1 & PAN</div>
                  )}
                  {formData?.data?.name2 && formData?.data?.pan2 && (
                    <div>Joint holder 2 & PAN</div>
                  )}
                </td>
                <td className="border border-gray-800 p-2 align-top">
                  <b>
                    {formData?.data?.name} (PAN: {formData?.data?.pan || "N/A"})
                    {formData?.data?.name1 && formData?.data?.pan1 && (
                      <>
                        <br />
                        {formData?.data?.name1} (PAN: {formData?.data?.pan1})
                      </>
                    )}
                    {formData?.data?.name2 && formData?.data?.pan2 && (
                      <>
                        <br />
                        {formData?.data?.name2} (PAN: {formData?.data?.pan2})
                      </>
                    )}
                  </b>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-800 p-2">
                  <div>Folio Number & DP ID/ Client ID</div>
                </td>
                <td className="border border-gray-800 p-2">
                  <b>
                    {formData?.data?.lf} [{formData?.data?.dp} ||{" "}
                    {formData?.data?.client}]
                  </b>
                </td>
              </tr>
              {/* ISIN Type Row */}
              <tr>
                <td className="border border-gray-800 p-2">
                  <div>ISIN Type</div>
                </td>
                <td className="border border-gray-800 p-2">
                  <b>{formData?.data?.isinType}</b>
                </td>
              </tr>
              {/* Instrument Row */}
              <tr>
                <td className="border border-gray-800 p-2">
                  <div>Instrument</div>
                </td>
                <td className="border border-gray-800 p-2">
                  <b>{formData?.data?.instrument}</b>
                </td>
              </tr>
              {/* Request Type Row */}
              <tr>
                <td className="border border-gray-800 p-2">
                  <div>Request Type</div>
                </td>
                <td className="border border-gray-800 p-2">
                  <b>{formData?.data?.requestType}</b>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-800 p-2">
                  <div>Number of Securities</div>
                </td>
                <td className="border border-gray-800 p-2">
                  <b>
                    {formData?.data?.tQuanty ||
                      calculateTotalSecurities(formData?.b_inward_range)}
                  </b>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-800 p-2">
                  <div>Certificate numbers</div>
                </td>
                <td className="border border-gray-800 p-2">
                  <b>
                    {formData?.b_inward_range?.map((row, index) => (
                      <span key={index}>
                        {row.certi}
                        {index < formData.b_inward_range.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </b>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-800 p-2">
                  <div>Distinctive Numbers</div>
                </td>
                <td className="border border-gray-800 p-2">
                  <b>
                    {formData?.b_inward_range?.map((row, index) => (
                      <span key={index}>
                        {row.from} - {row.to}
                        {index < formData.b_inward_range.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </b>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-800 p-2">
                  <div>Request Status & Rejection Reason</div>
                </td>
                <td className="border border-gray-800 p-2">
                  <b>Rejected [{formData?.data?.messageRejection}]</b>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-800 p-2">
                  <div>
                    Additional documents required to Approve the Request
                  </div>
                </td>
                <td className="border border-gray-800 p-2">
                  <b>
                    {formData?.data?.requiredDocs
                      ?.split("^^")
                      .map((doc, index) => (
                        <div key={index}>{doc}</div>
                      ))}
                  </b>
                </td>
              </tr>
            </tbody>
          </table>

          <p className="mb-4">
            <b>Important Note: </b>As a depository participant of the
            shareholder, you're kindly requested do the needful in this regard
            and inform the shareholder accordingly to rectify the errors in the
            demat request. In case of any clarification is required, you're
            requested to kindly email us on the aforementioned address with full
            details.
          </p>
          <p className="mb-4">Thanking you.</p>
          <p className="mb-4">For, Vidatum Solution Private Limited</p>
          <div className="mb-16"></div>
          <p>
           (Nikita Sharma)
            <br />
            Compliance Officer
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full mt-8 text-[14px] ms-8">
        <div className="container max-w-[1090px]">
          <div className="flex items-center justify-between gap-2">
            <div className="col-span-4">
              <div className="w-full">
                <h6 className="font-bold mb-2">Regd. Office:</h6>
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
            </div>
            <div className="col-span-4">
              <div className="max-w-[100%] text-center border-[2px] !border-black p-3">
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
            </div>
            <div className="col-span-4">
              <div className="w-full">
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
        
      </footer>
    </div>
  );
};

export default RejectionOutwardLetter;
