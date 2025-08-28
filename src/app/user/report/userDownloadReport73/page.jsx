"use client";
import { apiConnector } from "@/utils/apihelper";
import { formatDateLong } from "@/utils/helper";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const UserDownloadReport73 = () => {
  const { id } = useParams();
  const [companyData, setCompanyData] = useState({});
  const [reportData, setReportData] = useState({});
  const [addressData, setAddressData] = useState({});
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await apiConnector(
          "GET",
          `${apiUrl}/v2/user/download-report-73/${id}`
        );
        const { data1, data, data3 } = res.data.result;
        setCompanyData(data1);
        setReportData(data);
        setAddressData(data3);
      } catch (err) {
        const errMsg = err.response.data.message;
        toast.error(
          errMsg || "An error occurred while processing the request."
        );
        console.error("Failed to fetch report data:", err);
      }
    };
    fetchReport();
  }, [id]);

  useEffect(() => {
    if (
      Object.keys(companyData).length &&
      Object.keys(reportData).length &&
      Object.keys(addressData).length
    ) {
      setTimeout(() => window.print(), 1000);
    }
  }, [companyData, reportData, addressData]);

  return (
    <>
      <header className="border-b border-gray-200 py-4">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center">
            <div className="w-1/6 border-b-4 border-black pb-1.5">
              <img
                src="/app/assets/images/vidatum.png"
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
      <main className="main p-8">
        <div className="container mx-auto">
          {/* Date */}
          <div className="flex justify-end">
            <p>
              Date: <span>{formatDateLong(reportData?.date)}</span>
            </p>
          </div>

          {/* Title */}
          <div className="flex justify-center mt-5">
            <div className="inline-flex">
              <p className="underline font-bold">
                TO WHOMSOEVER IT MAY CONCERN
              </p>
            </div>
          </div>

          {/* Issuer and Address */}
          <div className="flex mt-8">
            <div className="w-1/2">
              <p>Issuer: {companyData?.cin}</p>
              <p className="w-20">{addressData?.address}</p>
            </div>
          </div>

          {/* Subject */}
          <div className="flex justify-center mt-8">
            <div className="inline-flex">
              <p className="text-center">
                <strong>Subject:</strong> In the matter of Regulation 7(3) of
                SEBI (Listing Obligations and Disclosure Requirement), 2015
              </p>
            </div>
          </div>

          {/* Period */}
          <div className="flex justify-center mt-8">
            <p className="text-center">
              <strong>Period: </strong> {reportData?.period}
            </p>
          </div>

          {/* Body */}
          <div className="mt-8">
            <h6>Sir/ Madam,</h6>

            <p className="mt-2 text-justify">
              In reference to the above captioned subject & regulations, please
              note that, We have been appointed as the Share transfer agent to
              render services related to securities allotment, transmission,
              transposition, split, consolidation and other ancillary services
              during the captioned period. Please further note that, the
              aforementioned Issuer is maintaining the physical and electronic
              connectivity with us as specified under the SEBI (Listing
              Obligations and Disclosure Requirement), 2015.
            </p>

            <p className="mt-4 text-justify">
              * The SEBI has mandated all listed companies that with effect from
              April 1, 2019, requests for effecting transfer of securities
              should not be processed in the physical form. [the SEBI (Listing
              Obligations and Disclosure Requirements) (Fourth Amendment)
              Regulations, 2018 & Press Release No. 49/2018]
            </p>

            <p className="mt-4 text-justify">
              We request you to kindly take note of the above.
            </p>

            <p className="mt-4">
              <b>Note:</b> The company has changed the Share transfer agent
              w.e.f March 16, 2022.
            </p>

            <p className="mt-6">Thanking You.</p>

            <p className="mt-8">For, Vidatum Solution Private Limited</p>

          </div>
        </div>
      </main>
      <footer className="mt-12 pb-4">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-8 mb-6">
            {/* Column 1 - Address */}
            <div>
              <h6 className="font-bold mb-2">Regd. Office:</h6>
              <p className="text-sm">
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

export default UserDownloadReport73;
