"use client";
import { apiConnector } from "@/utils/apihelper";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const ViewOutwardv1 = () => {
  const [data, setData] = useState([]);
  const { id, isin } = useParams();
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchOutwardv1Data = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/process/viewoutwardv1/${id}/${isin}`
      );
      const result = response.data.result || [];
      setData(result);
    } catch (error) {
      const errMsg = error.response.data.message;
      toast.error(errMsg || "An error occurred while processing the request.");
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchOutwardv1Data();
  }, [id, isin]);

  const formatDate = (dateString) => {
    if (dateString === "0000-00-00" || !dateString) return "--";
    const dateObj = new Date(dateString);
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = String(dateObj.getFullYear()).slice(-2);
    return `${day}-${month}-${year}`;
  };

  const outward = data[0] || {};

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">View Outward</h2>
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ISIN and Status Column */}
          <div className="">
            <h4 className="text-xl font-bold mb-2">
              {outward.isin || "No Record."}
            </h4>
            <button className="bg-green-500 text-white text-xs px-4 py-1 rounded mb-2">
              Processed
            </button>
            <p className="text-gray-500 text-sm mb-4">
              {formatDate(outward.date)}
            </p>

            <div className="text-left space-y-3">
              <div>
                <h4 className="text-xs font-bold uppercase text-gray-700">
                  Outward Date:
                </h4>
                <p className="text-gray-600 text-sm">
                  {formatDate(outward.date)}
                </p>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase text-gray-700">
                  Outward Mode:
                </h4>
                <p className="text-gray-600 text-sm">{outward.mode}</p>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase text-gray-700">
                  Track ID:
                </h4>
                <p className="text-gray-600 text-sm">{outward.track_id}</p>
              </div>
            </div>
          </div>

          {/* Middle Column */}
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase text-gray-700">
                Outward No.:
              </h4>
              <p className="text-gray-600 text-sm">{outward.number}</p>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase text-gray-700">
                Inward Ref. Number:
              </h4>
              <p className="text-gray-600 text-sm">{outward.inward_ref}</p>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase text-gray-700">
                Location:
              </h4>
              <p className="text-gray-600 text-sm">{outward.city}</p>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase text-gray-700">
                AWB:
              </h4>
              <p className="text-gray-600 text-sm">{outward.awb}</p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase text-gray-700">
                Sender:
              </h4>
              <p className="text-gray-600 text-sm">{outward.name}</p>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase text-gray-700">
                Address:
              </h4>
              <p className="text-gray-600 text-sm">
                {[
                  outward.address1,
                  outward.address2,
                  outward.address3,
                  outward.pin,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase text-gray-700">
                State:
              </h4>
              <p className="text-gray-600 text-sm">{outward.state}</p>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase text-gray-700">
                Reason:
              </h4>
              <p className="text-gray-600 text-sm">{outward.reason}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewOutwardv1;
