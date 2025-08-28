"use client";
import { apiConnector } from "@/utils/apihelper";
import { formatDateLong } from "@/utils/helper";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const UserDownloadReport133 = () => {
  const { id } = useParams();
  const [companyData, setCompanyData] = useState({});
  const [reportData, setReportData] = useState({});
  const [addressData, setAddressData] = useState({});
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const downloadData = async () => {
      try {
        const response = await apiConnector(
          "GET",
          `${apiUrl}/v2/user/download-report-133/${id}`
        );
        const { data1, data, data3 } = response.data.result;
        setCompanyData(data1);
        setReportData(data);
        setAddressData(data3);
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
    if (
      Object.keys(companyData).length &&
      Object.keys(reportData).length &&
      Object.keys(addressData).length
    ) {
      setTimeout(() => {
        window.print();
      }, 1000);
    }
  }, [companyData, reportData, addressData]);

  const formatAddress = (address) =>
    address
      ? address.split(",").map((line, i) => (
          <span key={i}>
            {line.trim()}
            <br />
          </span>
        ))
      : "";

  return (
    <>
      <header className="border-b border-gray-200 py-4">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center">
            <div className="w-1/6 border-b-4 border-black pb-1.5">
              <img
                src="/assets/images/vidatum.png"
                alt="Vidatum Solution Private Limited Logo"
                className="w-full max-w-[170px]"
              />
            </div>
            <div className="w-5/6 border-b-2 border-gray-200 pl-4">
              <p className="text-lg leading-8">
                Vidatum Solution Private Limited
              </p>
            </div>
          </div>
        </div>
      </header>
      <main className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Date */}
          <div className="text-right mb-4">
            <p>
              Date: <span>{formatDateLong(reportData?.date)}</span>
            </p>
          </div>

          {/* Address */}
          <div className="mb-8">
            <p className="w-full">To</p>
            <p className="font-medium">{formatAddress(addressData?.address)}</p>
          </div>

          {/* Subject */}
          <div className="text-center mb-4">
            <p>
              <strong>Subject:</strong> In the matter of Regulation 13(3) of
              SEBI (Listing Obligations and Disclosure Requirement) Regulations,
              2015
            </p>
          </div>

          {/* Period */}
          <div className="text-center mb-6">
            <p>
              <strong>Period:</strong> {reportData?.period}
            </p>
          </div>

          {/* Body Paragraphs */}
          <div className="mb-8">
            <h6>Sir/ Madam,</h6>
            <p className="mt-2 text-justify">
              In reference to the above captioned subject & regulations, please
              note the details pertaining to complaint(s) received & disposed
              off during the captioned period within the stipulated time limit
              specified under the SEBI (Listing Obligations and Disclosure
              Requirement) Regulations, 2015.
            </p>

            {/* Table */}
            <table className="table-auto border-collapse border w-full my-4">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-4 py-2">Particulars</th>
                  <th className="border px-4 py-2">
                    Complaints pending at the beginning
                  </th>
                  <th className="border px-4 py-2">
                    Complaints received during the period
                  </th>
                  <th className="border px-4 py-2">
                    Complaints resolved at the end
                  </th>
                  <th className="border px-4 py-2">Balance</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-4 py-2">No. of Complaints</td>
                  <td className="border px-4 py-2">
                    <input
                      type="text"
                      className="form-control w-full"
                      placeholder={reportData.open}
                      readOnly
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="text"
                      className="form-control w-full"
                      placeholder={reportData.new}
                      readOnly
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="text"
                      className="form-control w-full"
                      placeholder={reportData.close}
                      readOnly
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="text"
                      className="form-control w-full"
                      placeholder={reportData.balance}
                      readOnly
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Final Paragraphs */}
            <p className="text-justify">
              The word "complaint" with respect to the aforesaid report shall be
              construed to mean, either a complaint lodged with us in the SCORES
              Portal or an official request and tagged as either "complaint" or
              "grievance" by a security holder(s) pertaining to unsatisfactory
              or unacceptable acts of the Issuer/ Us.
            </p>
            <p className="mt-4">
              We request you to kindly take note of the above.
            </p>
            <p className="mt-4">Thanking You.</p>
            <p className="mt-4">For, Vidatum Solution Private Limited</p>

          </div>
        </div>
      </main>
      <footer className="mt-12 pb-4">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-8 mb-6">
            {/* Column 1 - Address */}
            <div>
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

            {/* Column 2 - Working Hours */}
            <div className="text-center">
              <div className="border-2 border-black p-3">
                <p className="text-sm">
                  <b className="text-orange-500">Working Days:</b> Monday to
                  Friday
                </p>
                <p className="text-sm">
                  <b className="text-orange-500">Call Hours:</b> 11.30 AM to
                  5.00 PM
                </p>
                <p className="text-sm">
                  <b className="text-orange-500">Lunch Break:</b> 1.30 PM to
                  2.30 PM
                </p>
              </div>
            </div>

            {/* Column 3 - Contact */}
            <div className="text-sm">
              <p>
                <b className="text-orange-500">CIN:</b> U74900GJ2025PTC158439
              </p>
              <p>
                <b className="text-orange-500">SEBI Regd. No.:</b> NA
              </p>
              <p>
                <b className="text-orange-500">Phone:</b> +91 8780894961
              </p>
              <p>
                <b className="text-orange-500">Email:</b> info@vidatum.in
              </p>
              <p>
                <b className="text-orange-500">Website:</b> https://vidatum.in/
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        
      </footer>
    </>
  );
};

export default UserDownloadReport133;
