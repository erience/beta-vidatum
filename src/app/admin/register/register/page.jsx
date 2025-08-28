"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { apiConnector } from "@/utils/apihelper";
import useQueryParams from "../../../../../hook/useQueryParams";

const Register = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { isin, lf } = useQueryParams();
  const [registerData, setRegisterData] = useState([]);
  const [registerShareData, setRegisterShareData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRegisterData = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/register/getregisterlf?isin=${isin}&lf=${lf}`
      );

      const result = response?.data?.result || {};
      setRegisterData(result.registerdata || []);
      setRegisterShareData(result.registersharedata || []);
    } catch (err) {
      console.error("Error fetching data:", err);
      setRegisterData([]);
      setRegisterShareData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isin && lf) {
      fetchRegisterData();
    }
  }, [isin, lf]);

  const getStatusLabel = (status) => {
    const normalized = status?.toLowerCase().trim();
    let className = "bg-gray-200 text-gray-800";

    if (normalized === "active") className = "bg-green-100 text-green-800";
    else if (normalized === "pending")
      className = "bg-yellow-100 text-yellow-800";
    else if (normalized === "delete" || normalized === "rejected")
      className = "bg-red-100 text-red-800";

    return (
      <span className={`${className} px-2 py-1 rounded-full text-sm`}>
        {status || "-"}
      </span>
    );
  };

  const renderCard = (item, index) => (
    <div key={index} className="rounded-md p-6 mb-4 border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">
        {item?.name || "Unnamed Holder"}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
        {[
          ["ISIN", item.isin],
          ["Total Shares", item.share],
          ["Admission Date", item.admission],
          ["Category", item.category],
          ["LF No", item.lf],
          ["First Holder Name", item.name],
          ["First Holder PAN", item.pan],
          ["Second Holder Name", item.jt1],
          ["Second Holder PAN", item.jt1pan],
          ["Third Holder Name", item.jt2],
          ["Third Holder PAN", item.jt2pan],
          ["Address", item.address],
          ["PIN", item.pin],
          ["Phone", item.cin],
          ["Email", item.email],
          ["Aadhaar", item.uid],
          ["Father/Mother/Spouse", item.fms],
          ["Occupation", item.occupation],
          ["Nationality", item.nationality],
          ["Cessation Date", item.cessation],
          ["Is Minor", item.is_minor],
          ["Minor DOB", item.minor_dob],
          ["Guardian Name", item.guardian_name],
          ["Nomination Date", item.nomination_date],
          ["Nominee Name", item.nominee_name],
          ["Nominee Address", item.nominee_address],
          ["Is SBO", item.is_sbo],
          ["SBO Ref No.", item.sbo_ref],
          ["Lien", item.lien],
          ["Lock-In", item.lock],
          ["Dump", item.dump],
          ["Remarks", item.remarks],
          ["Status", getStatusLabel(item.status)],
        ].map(([label, value], i) => (
          <div key={i}>
            <div className="text-gray-500 font-medium">{label}</div>
            <div className="text-black">{value || "-"}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Register Data</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {registerData.length === 0 ? (
            <p>No register data found.</p>
          ) : (
            registerData.map((item, index) => renderCard(item, index))
          )}

          <h1 className="text-xl font-bold mt-8 mb-4">Register Share Data</h1>
          {registerShareData.length === 0 ? (
            <p>No register share data found.</p>
          ) : (
            registerShareData.map((item, index) => renderCard(item, index))
          )}
        </>
      )}
    </div>
  );
};

export default Register;
