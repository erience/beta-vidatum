"use client";
import { useEffect, useState } from "react";
import { useBenposeStore } from "../../../../store/benposeStore";

const OtherInwardOutwardLetter = () => {
  const data = useBenposeStore((state) => state.formData);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState([]);
  console.log({ formData });

  useEffect(() => {
    if (data) {
      setFormData(data.data);
      setLoading(false);
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

  // If formData is still loading, show a loading message
  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!formData) {
    return <div className="p-8 text-center">No data available</div>;
  }

  return (
    <div className="relative w-full min-h-screen bg-white">
      <div className="container mx-auto max-w-[1090px] p-4">
        <header>
          <div className="flex items-center py-4">
            <div className="w-[15%] border-b-[3px] border-b-black pb-1.5">
              <img
                src="/assets/images/vidatum.png"
                alt="Logo"
                className="w-full max-w-[170px]"
              />
            </div>
            <div className="w-[85%] border-b-[2px] border-[#e6e6e6] pl-4">
              <p className="block text-lg leading-[2]">
                Vidatum Solution Private Limited
              </p>
            </div>
          </div>
        </header>

        <div className="text-right mb-2">
          <p>
            Date:{" "}
            <span>
              {formData.processDate
                ? formatDate(formData.processDate)
                : formatDate(new Date())}
            </span>
          </p>
        </div>

        <div className="relative w-full border !border-black">
          <div className="grid grid-cols-12">
            <div className="col-span-6 border-r !border-r-black">
              <div className="p-2">
                <p className="mb-0 leading-tight">
                  <b>To,</b>
                </p>
                <p className="mb-0 leading-tight text-uppercase">
                  <b>{formData.name} (Shareholder)</b>
                </p>
                <p className="mb-0 leading-tight text-uppercase">
                  {formData.address}
                </p>
                {formData.mobile && (
                  <p className="mb-0 leading-tight text-uppercase">
                    Phone: {formData.mobile}
                  </p>
                )}
              </div>
            </div>
            <div className="col-span-6">
              <div className="p-2">
                <p className="mb-0 leading-tight">
                  <b>CC,</b>
                </p>
                <p className="mb-0 leading-tight text-uppercase">
                  <b>{formData.cin} (Issuer)</b>
                </p>
                <p className="mb-0 leading-tight text-uppercase">
                  {formData.issuerAddress}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="text-center">
            <p className="uppercase font-bold">SUBJECT</p>
            <p className="text-lg font-bold">
              {formData.rStatus === "Approved" ? "Approval" : "Rejection"} OF{" "}
              {formData.heading} REQUEST
            </p>
          </div>
          <div className="mb-1">
            <p className="mt-3">Dear Sir/ Madam,</p>
            <p>
              We have received your request for{" "}
              <span className="text-capitalize">{formData.sub}</span> of{" "}
              <span className="text-capitalize">{formData.name}</span>. Details
              of the request submitted by you are here as under:
            </p>
          </div>

          <table className="w-full border-collapse border !border-black">
            <tbody>
              <tr>
                <td className="border !border-black p-2 text-left">
                  <div>Name of First Holder & PAN</div>
                  {formData.name1 && formData.pan1 && (
                    <div>Joint holder 1 & PAN</div>
                  )}
                  {formData.name2 && formData.pan2 && (
                    <div>Joint holder 2 & PAN</div>
                  )}
                </td>
                <td className="border !border-black p-2 text-left">
                  <b>
                    {formData.name} (PAN: {formData.pan})
                    {formData.name1 && formData.pan1 && (
                      <>
                        <br />
                        {formData.name1} (PAN: {formData.pan1})
                      </>
                    )}
                    {formData.name2 && formData.pan2 && (
                      <>
                        <br />
                        {formData.name2} (PAN: {formData.pan2})
                      </>
                    )}
                  </b>
                </td>
              </tr>
              <tr>
                <td className="border !border-black p-2 text-left">
                  <div>Folio Number</div>
                </td>
                <td className="border !border-black p-2 text-left">
                  <b>{formData.lf}</b>
                </td>
              </tr>

              <tr>
                <td className="border !border-black p-2 text-left">
                  <div>Request Status</div>
                </td>
                <td className="border !border-black p-2 text-left">
                  <b>
                    {formData.rStatus === "Approved" ? "Approved" : "Rejected"}
                  </b>
                </td>
              </tr>

              {formData.rStatus !== "Approved" && (
                <tr>
                  <td className="border !border-black p-2 text-left">
                    <div>
                      Additional documents required to Approve the Request
                    </div>
                  </td>
                  <td className="border !border-black p-2 text-left">
                    <b>
                      {formData.requiredDocs &&
                        formData.requiredDocs
                          .split("^^")
                          .map((element, index) => (
                            <p key={index}>{element}</p>
                          ))}
                    </b>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="mt-4">
            <p>
              In case of any clarification is required, you’re requested to
              kindly email us on the aforementioned address with full details.
            </p>
            <p className="line">Thanking You.</p>
            <p>For, Vidatum Solution Private Limited</p>
            <p className="mt-5"></p>
            <p>(Nikita Sharma)</p>
            <p>Compliance Officer</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherInwardOutwardLetter;
