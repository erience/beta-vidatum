"use client";
export const dynamic = "force-dynamic";

import { apiConnector } from "@/utils/apihelper";
// import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import useQueryParams from "../../../../../hook/useQueryParams";

const DownloadRecoReport55a = () => {
  // const searchParams = useSearchParams();
  const queryParams = useQueryParams();
  const [data, setData] = useState({
    address: "",
    period: "",
    isin: "",
    facev: "",
    cdsl: 0,
    nsdl: 0,
    phy: 0,
    getcin: "",
  });
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  useEffect(() => {
    // Don’t fetch until queryParams are available
    if (!Object.keys(queryParams).length) return;

    const params = {
      address: queryParams.address || "",
      facev: queryParams.facev || "",
      cdsl: parseInt(queryParams.cdsl || "0"),
      nsdl: parseInt(queryParams.nsdl || "0"),
      phy: parseInt(queryParams.phy || "0"),
      period: queryParams.date || "",
      isin: queryParams.isin || "",
      getcin: queryParams.getcin || "",
    };

    downloadData(params);
  }, [queryParams]);

  const downloadData = async (params) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/report/reconsillation/report55a?${queryString}`
      );

      const responseData = response?.data?.result || {};
      setData(responseData);
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const total = data.cdsl + data.nsdl + data.phy;
  const cdslPercent =
    total > 0 ? ((data.cdsl * 100) / total).toFixed(2) : "0.00";
  const nsdlPercent =
    total > 0 ? ((data.nsdl * 100) / total).toFixed(2) : "0.00";
  const phyPercent = total > 0 ? ((data.phy * 100) / total).toFixed(2) : "0.00";
  const totalPercent = total > 0 ? "100.00" : "0.00";

  return (
    <main className="main">
      <div className="container print-container">
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

        <div className="row">
          <div className="col-sm-12 text-right">
            <p>
              Generation Date:{" "}
              {new Date().toLocaleString("en-US", {
                month: "long",
                day: "2-digit",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="row mt-20">
          <div className="col-sm-12">
            <p>To</p>
            <p className="w-25">{data.getcin}</p>
            <p className="w-25">{data.address}</p>
          </div>
        </div>

        <div className="row mt-20">
          <div className="col-sm-12 text-center">
            <div className="d-inline-flex">
              <p>
                <strong>Subject:</strong> In the matter of Reconciliation of
                Share Capital Audit Report
              </p>
            </div>
          </div>
        </div>

        <div className="row mt-20">
          <div className="col-sm-12 text-center">
            <p>
              <strong>Record Date:</strong>{" "}
              {data.period
                ? new Date(data.period).toLocaleString("en-US", {
                    month: "long",
                    day: "2-digit",
                    year: "numeric",
                  })
                : "N/A"}
            </p>
          </div>
        </div>

        <div className="row mt-20">
          <div className="col-sm-12 text-center">
            <p>
              <strong>ISIN:</strong> {data.isin} | <strong>Face Value: </strong>{" "}
              Rs. {data.facev} per Share
            </p>
          </div>
        </div>

        <div className="row mt-20">
          <div className="col-sm-12">
            <h6>Sir/ Madam,</h6>
            <p className="mt-2 justify">
              In reference to the above captioned subject, please note the
              details pertaining to reconciliation statement during the
              captioned period under the Companies Act, 2013 and Depositories
              Act, 1996.
            </p>

            <table className="table table-bordered regulation-table">
              <thead>
                <tr>
                  <th>Particulars</th>
                  <th>Total Shares</th>
                  <th>% of Total Issued Shares</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-left">Shares with CDSL</td>
                  <td>{data.cdsl.toLocaleString()}</td>
                  <td>{cdslPercent} %</td>
                </tr>
                <tr>
                  <td className="text-left">Shares with NSDL</td>
                  <td>{data.nsdl.toLocaleString()}</td>
                  <td>{nsdlPercent} %</td>
                </tr>
                <tr>
                  <td className="text-left">Physical Shares</td>
                  <td>{data.phy.toLocaleString()}</td>
                  <td>{phyPercent} %</td>
                </tr>
                <tr>
                  <td className="text-left">
                    <b>Total Shares</b>
                  </td>
                  <td className="text-right">
                    <strong>{total.toLocaleString()}</strong>
                  </td>
                  <td className="text-right">
                    <strong>{totalPercent}%</strong>
                  </td>
                </tr>
              </tbody>
            </table>

            <p>Also, we hereby confirm that during the half year:</p>
            <ol>
              <li>
                The Register of Members is updated in our records based on the
                Data provided by the Captioned Company.
              </li>
              <li>
                The dematerialisation request lodged with us during the
                captioned period were processed (either accepted or rejected on
                technical grounds, as the case may be) within the stipulated
                time period specified under the applicable Rules and
                Regulations.
              </li>
            </ol>

            <p>
              We request you to kindly take note of the above.
              <br />
              <br />
            </p>
            <p>Thanking You.</p>
            <p>For, Vidatum Solution Private Limited</p>
            <p>
              <br />
            </p>
         

            <div className="row mt-40">
              <div className="col-sm-4">
                <p>
                  <strong>Regd. Office:</strong>
                </p>
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
              <div className="col-sm-4">
                <p>
                  <strong>Working Days:</strong> Monday to Friday
                </p>
                <p>
                  <strong>Call Hours:</strong> 11:30 AM to 5:00 PM
                </p>
                <p>
                  <strong>Lunch Break:</strong> 1:30 PM to 2:30 PM
                </p>
              </div>
              <div className="col-sm-4">
                <p>
                  <strong>CIN:</strong> U74900GJ2025PTC158439
                </p>
                <p>
                  <strong>SEBI Regd. No.:</strong> NA
                </p>
                <p>
                  <strong>Phone:</strong> +91 8780894961
                </p>
                <p>
                  <strong>Email:</strong> info@vidatum.in
                </p>
                <p>
                  <strong>Website:</strong> https://vidatum.in/
                </p>
              </div>
            </div>

            
          </div>
        </div>
      </div>
    </main>
  );
};

export default DownloadRecoReport55a;
