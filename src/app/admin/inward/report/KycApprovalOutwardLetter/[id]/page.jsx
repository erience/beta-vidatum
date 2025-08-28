"use client";
import { apiConnector } from "@/utils/apihelper";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const KycApprovalOutwardLetter = () => {
  const [data, setData] = useState([]);
  const { id } = useParams();
  const decodedId = decodeURIComponent(id);
  console.log("Raw param:", id);
  console.log("Decoded:", decodeURIComponent(id));
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchkycData = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/process/download-data-of-inward-final?id=${decodedId}&table=b_inward&isin=b_isin&demattable=b_inward_info`
      );
      const responseData = response?.data?.result?.data || [];
      console.log({ responseData });

      setData(responseData);
    } catch (error) {
      const errMsg = error.response.data.message;
      toast.error(errMsg || "An error occurred while processing the request.");
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchkycData();
  }, []);
  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      // Delay slightly to ensure render is complete
      const timer = setTimeout(() => {
        window.print();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [data]);

  // Format date: Convert date string to formatted date
  const formatDate = (dateStr) => {
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Set document title when component mounts
  useEffect(() => {
    document.title = `KYC Approval Letter - ${data?.name || "Shareholder"}`;

    // Add print-specific styles for better printing
    const style = document.createElement("style");
    style.id = "print-styles";
    style.innerHTML = `
      @media print {
        @page { size: A4; margin: 0; }
        body { font-size: 12pt; }
        .container { width: 100%; max-width: 100%; }
        .print-hidden { display: none !important; }
      }
    `;
    document.head.appendChild(style);

    return () => {
      // Clean up when component unmounts
      document.title = "Admin Portal";
      const printStyles = document.getElementById("print-styles");
      if (printStyles) {
        printStyles.remove();
      }
    };
  }, [data]);

  // If no data is provided, show a placeholder
  if (!data) {
    return (
      <div className="text-center p-5">No data available for KYC Letter</div>
    );
  }

  return (
    <>
      <div className="w-full flex justify-center px-0 print:text-[11px]">
        <div className="w-full max-w-[794px] bg-white pt-[10px] pr-[30px] pb-[0px] pl-[30px] no-print-break">
          <div className="relative  bg-white">
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

            <div className="w-full min-h-[calc(100vh-83px)] flex flex-col justify-between">
              <div className="container max-w-[1090px]">
                <div className="w-full">
                  {/* DATE */}
                  <div className="text-right mb-2">
                    <p>
                      Date:{" "}
                      <span>
                        {data.processDate
                          ? formatDate(data.processDate)
                          : formatDate(new Date())}
                      </span>
                    </p>
                  </div>

                  {/*  */}
                  <div className="relative w-full border !border-black">
                    <div className="grid grid-cols-12">
                      <div className="col-span-6 border-r !border-r-black">
                        <div className="p-2">
                          <p className="mb-0 leading-tight">
                            <b>To,</b>
                          </p>
                          <p className="mb-0 leading-tight uppercase">
                            <b>{data.name} (Shareholder)</b>
                          </p>
                          <p className="mb-0 leading-tight uppercase">
                            {data.address}
                          </p>
                        </div>
                      </div>
                      <div className="col-span-6">
                        <div className="p-2">
                          <p className="mb-0 leading-tight">
                            <b>CC,</b>
                          </p>
                          <p className="mb-0 leading-tight uppercase">
                            <b>{data.cin} (Issuer)</b>
                          </p>
                          <p className="mb-0 leading-tight uppercase">
                            {data.issuerAddress}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Subject Line */}
                  <div className="mt-4">
                    <div className="inline-flex text-center">
                      <p className="uppercase font-bold">
                        SUBJECT: APPROVAL OF {data.heading || "KYC"} REQUEST
                      </p>
                    </div>
                    <div className="mb-1">
                      <p className="mt-3">Dear Sir/ Madam,</p>
                      <p>
                        We refer to the request received from you for issuance
                        of securities in your name. We would like to inform you
                        that the request has been approved as detailed below:
                      </p>
                    </div>
                    <table className="w-full border-collapse border !border-black">
                      <thead>
                        <tr>
                          <th className="border !border-black p-2 text-left">
                            Company & ISIN
                          </th>
                          <th className="border !border-black p-2 text-left">
                            {data.cin} (ISIN: {data.isin})
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border !border-black p-2">
                            <div>Name of First Holder & PAN</div>
                            {data.name1 != null && data.pan1 != null && (
                              <div>Joint holder 1 & PAN</div>
                            )}
                            {data.name2 != null && data.pan2 != null && (
                              <div>Joint holder 2 & PAN</div>
                            )}
                          </td>
                          <td className="border !border-black p-2 align-top">
                            <b>
                              {data.name} (PAN: {data.pan})
                              {data.name1 != null && data.pan1 != null && (
                                <>
                                  <br />
                                  {data.name1} (PAN: {data.pan1})
                                </>
                              )}
                              {data.name2 != null && data.pan2 != null && (
                                <>
                                  <br />
                                  {data.name2} (PAN: {data.pan2})
                                </>
                              )}
                            </b>
                          </td>
                        </tr>
                        <tr>
                          <td className="border !border-black p-2">
                            Folio Number
                          </td>
                          <td className="border !border-black p-2">
                            {data.lf}
                          </td>
                        </tr>
                        <tr>
                          <td className="border !border-black p-2">
                            Request Status
                          </td>
                          <td className="border !border-black p-2">Approved</td>
                        </tr>
                        {data.remark && (
                          <tr>
                            <td className="border !border-black p-2">
                              Remarks
                            </td>
                            <td className="border !border-black p-2">
                              {data.remark}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                    <div className="mt-4">
                      <p>
                        In case of any clarification is required, you're
                        requested to kindly email us on the aforementioned
                        address with full details.
                      </p>
                      <p>Thanking you.</p>
                      <p>For, Vidatum Solution Private Limited</p>
                      <div className="mt-10">
                        <p>
                         (Nikita Sharma)
                          <br />
                          Compliance Officer
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <footer className="w-full mt-8">
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
                    <div className="col-span-4 ml-[0px]">
                      <div className="w-[15.8rem] text-left border-[2px] !border-black p-1">
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
                    <div className="col-span-4 ml-2">
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
          </div>
        </div>
      </div>
    </>
  );
};
export default KycApprovalOutwardLetter;
