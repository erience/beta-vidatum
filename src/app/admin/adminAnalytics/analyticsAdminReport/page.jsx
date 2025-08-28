"use client";
export const dynamic = "force-dynamic";

import InwardAnalyticsCard, {
  GridSection,
} from "@/components/inwardcardModal/InwardAnalyticsCard";
import { apiConnector } from "@/utils/apihelper";
// import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import GenrateReportModal from "../genrateReportModal/page";
import useQueryParams from "../../../../../hook/useQueryParams";

const AnalyticsAdminReport = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [idWiseData, setIdWiseData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { admin, from, to } = useQueryParams();
  // const searchParams = useSearchParams();
  // const admin = searchParams.get("admin");
  // const from = searchParams.get("from");
  // const to = searchParams.get("to");

  const fetchAdminData = async () => {
    try {
      const responseData = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/allAdmin/report?admin=${admin}&from=${from}&to=${to}`
      );
      const result = responseData.data.result || [];
      setData(result);
    } catch (error) {
      const errMsg = error.response?.data?.message || "Error fetching data";
      toast.error(errMsg);
      console.error("Error fetching admin report:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [admin, from, to]);

  const checkNow = async (data) => {
    try {
      const formData = new FormData();
      formData.append("data", data);
      formData.append("admin", admin);
      formData.append("from", from);
      formData.append("to", to);

      const response = await apiConnector(
        "POST",
        `${apiUrl}/v2/admin/individual/generate-report`,
        { data, admin, from, to },
        {
          headers: {
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          },
        }
      );

      setIdWiseData(response.data);
      setShowModal(true);
    } catch (err) {
      console.error("Error fetching ISIN data:", err);
    }
  };

  const inwardSections = [
    {
      title: "Inward Reports",
      items: [
        {
          title: "Total Inward Done",
          key: "inwardData",
          dataKey: "Inward-created",
        },
        {
          title: "Total Inward Updated",
          key: "inwardUpData",
          dataKey: "inward-updated",
        },
        {
          title: "Total Inward Info Created",
          key: "inwardInfoData",
          dataKey: "Inward-info-created",
        },
        {
          title: "Total Inward Info Updated",
          key: "inwardInfoUpData",
          dataKey: "inward-info-updated",
        },
        {
          title: "Total Inward Range Created",
          key: "inwardRangeData",
          dataKey: "Inward-Range-created",
        },
        {
          title: "Total Inward KYC Created",
          key: "inwardKycInfoData",
          dataKey: "InwardInfo-kyc-created",
        },
        {
          title: "Total Inward KYC Updated",
          key: "inwardKycInfoUpData",
          dataKey: "InwardInfoUpdated-kyc-created",
        },
        {
          title: "Total Inward Info Transmission Created",
          key: "inwardTransmiisionInfoData",
          dataKey: "InwardInfo-Transmission-created",
        },
        {
          title: "Total Inward Info Transmission Updated",
          key: "inwardTransmiisionInfoUpData",
          dataKey: "InwardInfoUpdated-Transmission-created",
        },
        {
          title: "Total Inward Info Duplicate Created",
          key: "inwardDuplicateInfoData",
          dataKey: "InwardInfo-Duplicate-created",
        },
        {
          title: "Total Inward Info Duplicate Updated",
          key: "inwardDuplicateInfoUpData",
          dataKey: "InwardInfoUpdated-Duplicate-created",
        },
      ],
    },
    {
      title: "Admin Outward Reports",
      items: [
        {
          title: "Outward Added",
          key: "outwardData",
          dataKey: "outward-created",
        },
        {
          title: "Outward Updated",
          key: "outwardUpData",
          dataKey: "outward-updated",
        },
      ],
    },
    {
      title: "Admin ISIN Reports",
      items: [
        {
          title: "ISIN Addition",
          key: "isinAddtionData",
          dataKey: "isin-addition",
        },
        {
          title: "ISIN Updation",
          key: "isinUpdationData",
          dataKey: "isin-updation",
        },
      ],
    },
    {
      title: "Admin Corporate Action Reports",
      items: [
        {
          title: "Corporate Action Added",
          key: "corporateActionData",
          dataKey: "corporate-action-created",
        },
        {
          title: "Corporate Action Updated",
          key: "corporateActionUpData",
          dataKey: "corporate-action-updated",
        },
      ],
    },
    {
      title: "Admin Reconciliation Reports",
      items: [
        { title: "idtData Added", key: "idtData" },
        { title: "Demat Cdsl Added", key: "dematCdslData" },
        { title: "Demat Nsdl Added", key: "dematNsdlData" },
      ],
    },
  ];

  return (
    <>
      <div className="w-full px-4">
        {inwardSections.map((section, index) => (
          <div key={index} className="mb-6">
            <div className="mb-2">
              <h5 className="text-lg font-semibold border-b pb-1">
                {section.title}
              </h5>
            </div>
            <GridSection>
              {section.items.map((item) => (
                <InwardAnalyticsCard
                  key={item.title}
                  title={item.title}
                  count={
                    Array.isArray(data?.[item.key]) ? data[item.key].length : 0
                  }
                  onCheckNow={
                    item.dataKey ? () => checkNow(item.dataKey) : undefined
                  }
                />
              ))}
            </GridSection>
          </div>
        ))}

        <GenrateReportModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          data={idWiseData}
        />
      </div>
    </>
  );
};

export default AnalyticsAdminReport;
