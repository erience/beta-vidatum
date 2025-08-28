"use client";
import { apiConnector } from "@/utils/apihelper";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const ViewOutwardV2 = () => {
  const [data, setData] = useState({});
  const { id, isin } = useParams();
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchOutwradData = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/process/viewoutwardv2/${id}/${isin}`
      );
      const result = response.data.result[0] || {};
      setData(result);
    } catch (error) {
      toast.error(error.response.data.message || "Error fetching data");
    }
  };

  useEffect(() => {
    fetchOutwradData();
  }, [id, isin]);

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("en-GB") : "No Record.";

  const getStatusText = (status) => {
    switch (status) {
      case 1:
        return "Pending";
      case 2:
        return "Active";
      case 3:
        return "Rejected";
      case 4:
        return "Delete";
      default:
        return "Processed";
    }
  };

  return (
    <div className=" max-w-7xl">
      <div className="">
        {/* Header */}
        <div className=" mb-6">
          <h2 className="text-xl font-semibold">{data?.isin || "No Record."}</h2>
          <div className="inline-block mt-2 px-4 py-1 bg-green-500 text-white text-sm rounded">
            {getStatusText(data?.status)}
          </div>
          <p className="text-gray-500 text-sm mt-1">{formatDate(data?.o_date)}</p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Section */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-600 font-medium uppercase">Outward Date</p>
              <p className="text-sm text-gray-800 mb-3">{formatDate(data?.o_date)}</p>

              <p className="text-xs text-gray-600 font-medium uppercase">Outward Mode</p>
              <p className="text-sm text-gray-800 mb-3">{data?.mode || "No Record."}</p>

              <p className="text-xs text-gray-600 font-medium uppercase">Track ID</p>
              <p className="text-sm text-gray-800 mb-3">{data?.awb || "No Record."}</p>
            </div>

            <div>
              <p className="text-xs text-gray-600 font-medium uppercase">Outward No.</p>
              <p className="text-sm text-gray-800 mb-3">{data?.outward_ref || "No Record."}</p>

              <p className="text-xs text-gray-600 font-medium uppercase">Inward Ref. Number</p>
              <p className="text-sm text-gray-800 mb-3">{data?.inward_ref || "No Record."}</p>

              <p className="text-xs text-gray-600 font-medium uppercase">Location</p>
              <p className="text-sm text-gray-800 mb-3">{data?.location || "No Record."}</p>

              <p className="text-xs text-gray-600 font-medium uppercase">AWB</p>
              <p className="text-sm text-gray-800 mb-3">{data?.awb || "No Record."}</p>
            </div>
          </div>

          {/* Right Section */}
          <div>
            <p className="text-xs text-gray-600 font-medium uppercase mb-1">Sender</p>
            <p className="text-sm text-gray-800 mb-4">{data?.sender || "No Record."}</p>

            <p className="text-xs text-gray-600 font-medium uppercase mb-1">Address</p>
            <p className="text-sm text-gray-800 mb-4 whitespace-pre-line">
              {data?.address || "No Record."}
            </p>

            <p className="text-xs text-gray-600 font-medium uppercase mb-1">State</p>
            <p className="text-sm text-gray-800 mb-4">{data?.state || "No Record."}</p>

            <p className="text-xs text-gray-600 font-medium uppercase mb-1">Reason</p>
            <p className="text-sm text-gray-800">
              {data?.reason || "No Record."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewOutwardV2;
