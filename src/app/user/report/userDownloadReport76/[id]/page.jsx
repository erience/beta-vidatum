"use client";
import { apiConnector } from "@/utils/apihelper";
import { formatDateLong } from "@/utils/helper";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const UserDownloadReport76 = () => {
  const { id } = useParams();
  const [reportData, setReportData] = useState({});
  const [companyData, setCompanyData] = useState({});
  const [addressData, setAddressData] = useState({});
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await apiConnector(
          "GET",
          `${apiUrl}/v2/user/download-report-745/${id}`
        );
        const { data1, data, data3 } = res.data.result;
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

    fetchReport();
  }, [id]);

  useEffect(() => {
    if (
      Object.keys(reportData).length &&
      Object.keys(companyData).length &&
      Object.keys(addressData).length
    ) {
      setTimeout(() => window.print(), 1000);
    }
  }, [reportData, companyData, addressData]);

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
      <main className="main p-8">
        <div className="container mx-auto">
          {/* Date */}
          <div className="flex justify-end">
            <p>
              Date:{" "}
              <span>
                {reportData.date
                  ? formatDateLong(reportData.date)
                  : "Loading..."}
              </span>
            </p>
          </div>

          {/* Address */}
          <div className="mt-8">
            <p className="mb-1">
              To,
              <br />
            </p>
            <p className="w-1/4">{addressData?.address}</p>
          </div>

          {/* Subject */}
          <div className="mt-8 text-center">
            <p>
              <strong>Subject:</strong> In the matter of Regulation 74(5) of
              SEBI (Depositories and Participants) Regulations, 2018
            </p>
          </div>

          {/* References */}
          <div className="mt-8 text-center">
            <p>
              <strong>References:</strong> SEBI Letter MRD/ DOP2/OW/2019/2498/1
              dated January 24, 2019, NSDL/CIR/II/5/2019 dated January 25, 2019,
              CDSL/OPS/RTA/POLICY/2019/14 dated January 25, 2019
            </p>
          </div>

          {/* Period */}
          <div className="mt-8 text-center">
            <p>
              <strong>Period:</strong> {reportData?.period}
            </p>
          </div>

          {/* Body */}
          <div className="mt-8">
            <h6>Sir/ Madam,</h6>
            <p className="mt-2 text-justify">
              In reference to the above captioned subject & regulations, please
              note that the security(ies) received from the depository
              participant(s) for dematerialisation during the captioned period,
              were processed (either accepted or rejected on technical grounds,
              as the case may be) within the stipulated time limit specified
              under the SEBI (Depositories and Participants) Regulations, 2018
              and that the security(ies) comprised in the said certificate(s)
              have been listed on the stock exchanges, where the earlier issued
              security(ies) are listed.
            </p>
            <p className="mt-4 text-justify">
              Please further note that the security(ies) received for
              dematerialisation have been mutilated/ cancelled after due
              verification by us (as per our operational procedure) and the name
              of the depository(ies) have been substituted in the security
              holder's list as the registered owner within the stipulated time
              limit specified under the SEBI (Depositories and Participants)
              Regulations, 2018.
            </p>
            <p className="mt-4">
              We request you to kindly take note of the above.
            </p>

            {/* Optional Note */}
            {reportData.note && (
              <p className="mt-4">
                <strong>Note:</strong> {reportData.note}
              </p>
            )}

            <p className="mt-6">Thanking You.</p>

            <p className="mt-8">For, Vidatum Solution Private Limited</p>

            {/* Signature */}
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
        <div className="bg-black py-3 mt-6"></div>
      </footer>
    </>
  );
};

export default UserDownloadReport76;
