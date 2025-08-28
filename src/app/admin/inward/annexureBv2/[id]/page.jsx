"use client";
import { apiConnector } from "@/utils/apihelper";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AnnexureBv2 = () => {
  const [data, setData] = useState(null);
  const [inwardData, setInwardData] = useState([]);
  const [bInwardRange, setBInwardRange] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const decodedId = id ? decodeURIComponent(id) : "";
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchAnnexurData = async () => {
    if (!decodedId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/process/download-data-of-annexure-final?id=${decodedId}&table=b_inward_v2&isin=c_isin`
      );
      const responseData = response?.data?.result || {};
      console.log({ responseData });
      setData(responseData.data || {});
      setInwardData(responseData.inwardData || []);
      setBInwardRange(responseData.b_inward_range || []);
    } catch (error) {
      const errMsg = error?.response?.data?.message;
      toast.error(errMsg || "An error occurred while processing the request.");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnexurData();
  }, [decodedId]);

  useEffect(() => {
    const hasData = data && Object.keys(data).length > 0;
    const hasInwardData = inwardData && inwardData.length > 0;
    const hasBInwardRange = bInwardRange && bInwardRange.length > 0;

    if (hasData && hasInwardData && hasBInwardRange) {
      const timer = setTimeout(() => {
        window.print();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [data, inwardData, bInwardRange]);

  // Calculate total securities
  const calculateTotalSecurities = () => {
    let totalSum = 0;
    bInwardRange.forEach((row) => {
      totalSum += row.to - row.from + 1;
    });
    return totalSum;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const dateObj = new Date(dateString);
    return dateObj.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Format certificate numbers
  const formatCertificateNumbers = () => {
    return bInwardRange
      .map((row, index) =>
        index === bInwardRange.length - 1 ? row.certi : row.certi + ","
      )
      .join(" ");
  };

  // Format distinctive numbers
  const formatDistinctiveNumbers = () => {
    return bInwardRange
      .map((row, index) =>
        index === bInwardRange.length - 1
          ? `${row.from} - ${row.to}`
          : `${row.from} - ${row.to},`
      )
      .join(" ");
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  const pDate =
    inwardData && inwardData[0]
      ? formatDate(inwardData[0].p_date)
      : formatDate(new Date());

  return (
    <>
      <div className="w-full bg-white min-h-screen text-black font-sans">
        <div className="max-w-4xl mx-auto p-2">
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
          <div className="mx-auto w-[210mm] min-h-[280mm] text-[14px]  flex flex-col justify-between">
            <div className="container max-w-[1090px]">
              <div className="w-full">
                <div className="text-right mb-2">
                  <p>
                    Date:{" "}
                    <span>
                      {data?.processDate
                        ? formatDate(data?.processDate)
                        : formatDate(new Date())}
                    </span>
                  </p>
                </div>

                <div className="relative w-full border !border-black text-[14px]">
                  <div className="grid grid-cols-12">
                    <div className="col-span-6 border-r !border-r-black">
                      <div className="p-2">
                        <p className="mb-0 leading-tight">
                          <b>To,</b>
                        </p>
                        <p className="mb-0 leading-tight text-uppercase">
                          <b>{data.name} (Shareholder)</b>
                        </p>
                        <p className="mb-0 leading-tight text-uppercase">
                          {data.address}
                        </p>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <div className="p-2">
                        <p className="mb-0 leading-tight">
                          <b>CC,</b>
                        </p>
                        <p className="mb-0 leading-tight text-uppercase">
                          <b>{data.cin} (Issuer)</b>
                        </p>
                        <p className="mb-0 leading-tight text-uppercase">
                          {data.isinAddress}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-center text-[14px]">
                    <p className="uppercase font-bold">
                      LETTER OF CONFIRMATION [SHAREHOLDER COPY]
                    </p>
                    <p>
                      <b>Name of the Company:</b> {data.cin}
                    </p>
                    <p>
                      Subject: Issuance of Securities in dematerialized form in
                      case of Investor Service Requests
                    </p>
                  </div>
                  <div className="mb-1 text-[14px]">
                    <p className="mt-3">Dear Sir/ Madam,</p>
                    <p>
                      We refer to the request received from you for issuance of
                      securities in your name. We would like to inform you that
                      the request has been approved as per the detailed below:
                    </p>
                  </div>

                  <table className="w-full border-collapse text-[14px] border !border-black text-[14px]">
                    <tbody>
                      <tr>
                        <td className="border !border-black p-1 text-left">
                          <div>Name of First Holder & PAN</div>
                          {data.name1 != null && data.pan1 != null && (
                            <div>Joint holder 1 & PAN</div>
                          )}
                          {data.name2 != null && data.pan2 != null && (
                            <div>Joint holder 2 & PAN</div>
                          )}
                        </td>
                        <td className="border !border-black p-1 text-left">
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
                        <td className="border !border-black p-1 text-left">
                          <div>Number of Securities</div>
                        </td>
                        <td className="border !border-black p-1 text-left">
                          <b>{calculateTotalSecurities()}</b>
                        </td>
                      </tr>
                      <tr>
                        <td className="border !border-black p-1 text-left">
                          <div>Folio Number</div>
                        </td>
                        <td className="border !border-black p-1 text-left">
                          <b>{data.lf}</b>
                        </td>
                      </tr>
                      <tr>
                        <td className="border !border-black p-1 text-left">
                          <div>Certificate numbers</div>
                        </td>
                        <td className="border !border-black p-1 text-left">
                          <b>{formatCertificateNumbers()}</b>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          {" "}
                          <div className="pl-1">Distinctive Numbers</div>
                        </td>
                        <td className="border !border-black p-1 text-left">
                          <b>{formatDistinctiveNumbers()}</b>
                        </td>
                      </tr>
                      <tr>
                        <td className="border !border-black p-1 text-left">
                          <div>Lock-In of Securities</div>
                        </td>
                        <td className="border !border-black p-1 text-left">
                          <b>
                            <div className="line mb-0">Not Applicable</div>
                            <div className="line mb-0">
                              {data.lockin === 1 && (
                                <>
                                  If yes, lock-in from
                                  <input
                                    type="text"
                                    className="border-bottom"
                                  />
                                  till
                                  <input
                                    type="text"
                                    className="border-bottom"
                                  />
                                  (DD/MM/YYYY)
                                </>
                              )}
                            </div>
                          </b>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="mt-2  text-[14px]">
                    <p className="text-justify">
                      As you may be aware, SEBI vide Gazette Notification no.
                      SEBI/LAD-NRO/GN/2022/66 dated January 24, 2022, has
                      mandated that the shares that are issued pursuant to
                      investor service request shall henceforth be issued in
                      demat mode only and hence the security certificates
                      (wherever applicable) are retained at our end.
                      Accordingly, within 120 days of this letter, please
                      request your Depository Participant <b>(DP)</b> to demat
                      these shares using the Dematerialization Request Form{" "}
                      <b>(DRF)</b>. Please fill the DRF with the details
                      mentioned in this letter, sign it and present this letter
                      in original to your DP along with the DRF for enabling
                      your DP to raise a Demat Request Number. In case you do
                      not have a demat account, kindly open one with any DP.
                      Please note that you can open Basic Service Demat Account
                      at minimal / nil charges. Please note that{" "}
                      <b> this letter is valid only for a period of 120 days</b>{" "}
                      from the date of its issue within which you have to raise
                      demat request with the DP as above. Any request for
                      processing demat after the expiry of aforesaid 120 days
                      will not be entertained and as per the operating
                      guidelines issued by SEBI, the subject shares shall be
                      transferred to a Suspense Escrow Demat Account of the
                      company.
                    </p>
                  </div>
                  <div className="mt-2  text-[14px]">
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

            <footer className="w-full mt-8 text-[14px]">
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
              <div className="w-full !bg-black mt-3">
            
              </div>
            </footer>
          </div>
        </div>

        <div className="relative w-full min-h-screen bg-white">
          <div className="max-w-4xl mx-auto p-2">
            <header>
              <div className="container max-w-[1090px]">
                <div className="flex items-center py-4">
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
            <div className="mx-auto w-[210mm] min-h-[280mm] text-[14px]  flex flex-col justify-between">
              <div className="container max-w-[1090px]">
                <div className="w-full">
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

                  <div className="relative w-full border !border-black text-[14px]">
                    <div className="grid grid-cols-12">
                      <div className="col-span-6 border-r !border-r-black">
                        <div className="p-2">
                          <p className="mb-0 leading-tight">
                            <b>To,</b>
                          </p>
                          <p className="mb-0 leading-tight text-uppercase">
                            <b>{data.name} (Shareholder)</b>
                          </p>
                          <p className="mb-0 leading-tight text-uppercase">
                            {data.address}
                          </p>
                        </div>
                      </div>
                      <div className="col-span-6">
                        <div className="p-2">
                          <p className="mb-0 leading-tight">
                            <b>CC,</b>
                          </p>
                          <p className="mb-0 leading-tight text-uppercase">
                            <b>{data.cin} (Issuer)</b>
                          </p>
                          <p className="mb-0 leading-tight text-uppercase">
                            {data.isinAddress}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="text-center text-[14px]">
                      <p className="uppercase font-bold">
                        LETTER OF CONFIRMATION [ISSUER COPY]
                      </p>
                      <p>
                        <b>Name of the Company:</b> {data.cin}
                      </p>
                      <p>
                        Subject: Issuance of Securities in dematerialized form
                        in case of Investor Service Requests
                      </p>
                    </div>
                    <div className="mb-1 text-[14px]">
                      <p className="mt-3">Dear Sir/ Madam,</p>
                      <p>
                        We refer to the request received from you for issuance
                        of securities in your name. We would like to inform you
                        that the request has been approved as per the detailed
                        below:
                      </p>
                    </div>

                    <table className="w-full border-collapse border !border-black">
                      <tbody>
                        <tr>
                          <td className="border !border-black p-1 text-left">
                            <div>Name of First Holder & PAN</div>
                            {data.name1 != null && data.pan1 != null && (
                              <div>Joint holder 1 & PAN</div>
                            )}
                            {data.name2 != null && data.pan2 != null && (
                              <div>Joint holder 2 & PAN</div>
                            )}
                          </td>
                          <td className="border !border-black p-1 text-left">
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
                          <td className="border !border-black p-1 text-left">
                            <div>Number of Securities</div>
                          </td>
                          <td className="border !border-black p-1 text-left">
                            <b>{calculateTotalSecurities()}</b>
                          </td>
                        </tr>
                        <tr>
                          <td className="border !border-black p-1 text-left">
                            <div>Folio Number</div>
                          </td>
                          <td className="border !border-black p-1 text-left">
                            <b>{data.lf}</b>
                          </td>
                        </tr>
                        <tr>
                          <td className="border !border-black p-1 text-left">
                            <div>Certificate numbers</div>
                          </td>
                          <td className="border !border-black p-1 text-left">
                            <b>{formatCertificateNumbers()}</b>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            {" "}
                            <div className="pl-1">Distinctive Numbers</div>
                          </td>
                          <td className="border !border-black p-1 text-left">
                            <b>{formatDistinctiveNumbers()}</b>
                          </td>
                        </tr>
                        <tr>
                          <td className="border !border-black p-1 text-left">
                            <div>Lock-In of Securities</div>
                          </td>
                          <td className="border !border-black p-1 text-left">
                            <b>
                              <div className="line mb-0">Not Applicable</div>
                              <div className="line mb-0">
                                {data.lockin === 1 && (
                                  <>
                                    If yes, lock-in from
                                    <input
                                      type="text"
                                      className="border-bottom"
                                    />
                                    till
                                    <input
                                      type="text"
                                      className="border-bottom"
                                    />
                                    (DD/MM/YYYY)
                                  </>
                                )}
                              </div>
                            </b>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="mt-2 text-[14px]">
                      <p className="text-justify">
                        As you may be aware, SEBI vide Gazette Notification no.
                        SEBI/LAD-NRO/GN/2022/66 dated January 24, 2022, has
                        mandated that the shares that are issued pursuant to
                        investor service request shall henceforth be issued in
                        demat mode only and hence the security certificates
                        (wherever applicable) are retained at our end.
                        Accordingly, within 120 days of this letter, please
                        request your Depository Participant <b>(DP)</b> to demat
                        these shares using the Dematerialization Request Form{" "}
                        <b>(DRF)</b>. Please fill the DRF with the details
                        mentioned in this letter, sign it and present this
                        letter in original to your DP along with the DRF for
                        enabling your DP to raise a Demat Request Number. In
                        case you do not have a demat account, kindly open one
                        with any DP. Please note that you can open Basic Service
                        Demat Account at minimal / nil charges. Please note that{" "}
                        <b>
                          {" "}
                          this letter is valid only for a period of 120 days
                        </b>{" "}
                        from the date of its issue within which you have to
                        raise demat request with the DP as above. Any request
                        for processing demat after the expiry of aforesaid 120
                        days will not be entertained and as per the operating
                        guidelines issued by SEBI, the subject shares shall be
                        transferred to a Suspense Escrow Demat Account of the
                        company.
                      </p>
                    </div>
                    <div className="mt-2 text-[14px]">
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

              <footer className="w-full mt-8 text-[14px]">
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
                <div className="w-full !bg-black mt-3 text-[14px]">
                 
                </div>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AnnexureBv2;
