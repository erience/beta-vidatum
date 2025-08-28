"use client";
import { useEffect, useState } from "react";
import { apiConnector } from "@/utils/apihelper";
import { toast } from "react-toastify";
import IsinModal from "@/components/isinModal/IsinModal";
import {
  AnalyticsCard,
  GridSection,
  StatusCard,
} from "@/components/analyticsCard/AnalyticsCard";
import { Grid } from "lucide-react";

const IsinAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [idWiseData, setIdWiseData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchIsinAnalytics = async () => {
      try {
        const res = await apiConnector(
          "GET",
          `${apiUrl}/v2/admin/isin/isin-analytics`
        );
        console.log("data", res.data.result);

        setData(res.data.result || {});
      } catch (error) {
        const errMsg = error.response.data.message;
        toast.error(
          errMsg || "An error occurred while processing the request."
        );
        console.error("Error fetching ISIN analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIsinAnalytics();
  }, []);

  const checkNow = async (key, type) => {
    try {
      const payload = { data: key };

      if (type) {
        payload.type = type;
        payload.instrument = type;
        payload.connect = type;
        payload.transfer = type;
      }

      const response = await apiConnector(
        "POST",
        `${apiUrl}/v2/admin/isin/get-data-of-isin`,
        payload
      );

      console.log(response.data);
      setIdWiseData(response.data);
      setShowModal(true);
    } catch (err) {
      console.error("Error fetching ISIN data:", err);
    }
  };

  
  if (!data)
    return (
      <div className="p-10 text-center text-red-500">
        Failed to load ISIN data
      </div>
    );

  const getSum = (key) => {
    const bcount = data?.empty_by_party_list?.[0]?.[key] || 0;
    const totalMissing = data?.isin_not_available?.[0]?.total_missing || 0;
    const total = bcount + totalMissing;
    return bcount ? total : "0";
  };

  return (
    <>
      <div className="row">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-body">
              <h2 className="text-lg font-semibold">ISIN Analytics</h2>
            </div>
          </div>
        </div>
      </div>

      <GridSection>
        <AnalyticsCard
          title="Pending Bi-Party Agreements"
          count={getSum("bcount")}
          onCheckNow={() => checkNow("bypaty-wise")}
          color="yellow"
        />
        <AnalyticsCard
          title="Pending CDSL Tripartite Agreements"
          count={getSum("ctcount")}
          onCheckNow={() => checkNow("cdsl-trypaty-wise")}
        />
        <AnalyticsCard
          title="Pending NSDL Tripartite Agreements"
          count={getSum("ntcount")}
          onCheckNow={() => checkNow("nsdl-trypaty-wise")}
        />
        <AnalyticsCard
          title="Pending NSDL Activation Letters"
          count={getSum("ncount")}
          onCheckNow={() => checkNow("nsdl-wise-data")}
        />
        <AnalyticsCard
          title="Pending CDSL Activation Letters"
          count={getSum("ccount")}
          onCheckNow={() => checkNow("cdsl-wise-data")}
        />
      </GridSection>

      <GridSection>
        <AnalyticsCard
          title="Completed Bi-Party Agreements"
          count={data?.uploade_agreement_list?.[0]?.bcount || 0}
          color="green"
          onCheckNow={() => checkNow("upload-bypaty-wise")}
        />

        <AnalyticsCard
          title="Completed Tripartite Agreements"
          count={data?.uploade_agreement_list?.[0]?.tcount || 0}
          color="green"
          onCheckNow={() => checkNow("upload-trypaty-wise")}
        />

        <AnalyticsCard
          title="Completed NSDL Activation Letters"
          count={data?.uploade_agreement_list?.[0]?.ncount || 0}
          color="green"
          onCheckNow={() => checkNow("upload-nsdl-wise-data")}
        />

        <AnalyticsCard
          title="Completed CDSL Activation Letters"
          count={data?.uploade_agreement_list?.[0]?.ccount || 0}
          color="green"
          onCheckNow={() => checkNow("upload-cdsl-wise-data")}
        />
      </GridSection>

      {/* CHANGE THE DESIGN */}
      <GridSection>
        <AnalyticsCard
          title="Active ISIN"
          count={data?.status?.[0]?.count || 0}
          color="green"
          onCheckNow={() => checkNow("get-active")}
        />
        <AnalyticsCard
          title="Active ISIN Info"
          count={
            data?.isin_info_status?.find((x) => x.status === 1)?.count || 0
          }
          color="green"
          onCheckNow={() => checkNow("get-active-isin-info")}
        />
        <AnalyticsCard
          title="Active ISIN Media"
          count={
            data?.isin_media_status?.find((x) => x.status === 1)?.count || 0
          }
          color="green"
          onCheckNow={() => checkNow("get-active-isin-media")}
        />
        <AnalyticsCard
          title="Deleted ISIN"
          count={data?.last_sixty_day_deletion?.length || 0}
          color="red"
          onCheckNow={() => checkNow("get-delete")}
        />
      </GridSection>

      {/* //ISIN Addition  */}
      <GridSection>
        <AnalyticsCard
          title="ISIN Addition (in last 7 days)"
          count={data?.last_seven_day_addition?.length || 0}
          icon="⬆️"
          onCheckNow={() => checkNow("last-seven-addition")}
          color="green"
        />

        <AnalyticsCard
          title="ISIN Addition (in last 15 days)"
          count={data?.last_fifteen_day_addition?.length || 0}
          icon="⬆️"
          onCheckNow={() => checkNow("last-fifteen-addition")}
          color="green"
        />

        <AnalyticsCard
          title="ISIN Addition (in last 30 days)"
          count={data?.last_thirty_day_addition?.length || 0}
          icon="⬆️"
          onCheckNow={() => checkNow("last-thirty-addition")}
          color="green"
        />

        <AnalyticsCard
          title="ISIN Addition (in last 60 days)"
          count={data?.last_sixty_day_addition?.length || 0}
          icon="⬆️"
          onCheckNow={() => checkNow("last-sixty-addition")}
          color="green"
        />
      </GridSection>

      {/*  ISIN Edition */}
      <GridSection>
        <AnalyticsCard
          title="ISIN Edition (in last 7 days) "
          count={data?.last_seven_day_edition?.length || 0}
          icon="📝"
          color="yellow"
          onCheckNow={() => checkNow("last-seven-edition")}
        />
        <AnalyticsCard
          title="ISIN Edition (in last 15 days)"
          count={data?.last_fifteen_day_edition?.length || 0}
          icon="📝"
          color="yellow"
          onCheckNow={() => checkNow("last-fifteen-edition")}
        />
        <AnalyticsCard
          title="ISIN Edition (in last 30 days)"
          count={data?.last_thirty_day_edition?.length || 0}
          icon="📝"
          color="yellow"
          onCheckNow={() => checkNow("last-thirty-edition")}
        />
        <AnalyticsCard
          title="ISIN Edition (in last 60 days)"
          count={data?.last_sixty_day_edition?.length || 0}
          icon="📝"
          color="yellow"
          onCheckNow={() => checkNow("last-sixty-edition")}
        />
      </GridSection>

      {/* ISIN Deletion */}

      <GridSection>
        <AnalyticsCard
          title="ISIN Deletion (in last 7 days)"
          count={data?.last_seven_day_deletion?.length || 0}
          icon="⬇️"
          color="red"
          onCheckNow={() => checkNow("last-seven-deletion")}
        />
        <AnalyticsCard
          title="ISIN Deletion (in last 15 days)"
          count={data?.last_fifteen_day_deletion?.length || 0}
          icon="⬇️"
          color="red"
          onCheckNow={() => checkNow("last-fifteen-deletion")}
        />
        <AnalyticsCard
          title="ISIN Deletion (in last 30 days)"
          count={data?.last_thirty_day_deletion?.length || 0}
          icon="⬇️"
          color="red"
          onCheckNow={() => checkNow("last-thirty-deletion")}
        />
        <AnalyticsCard
          title="ISIN Deletion (in last 60 days)"
          count={data?.last_sixty_day_deletion?.length || 0}
          icon="⬇️"
          color="red"
          onCheckNow={() => checkNow("last-sixty-deletion")}
        />
      </GridSection>

      {/* type_wise_list */}

      <GridSection>
        {data?.type_wise_list?.map((item, idx) => (
          <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
            <AnalyticsCard
              key={idx}
              title={`${item?.type} Entities`}
              count={item.count}
              onCheckNow={() => checkNow("type-wise", item?.type)}
              color="black"
            />
          </div>
        ))}
      </GridSection>

      {/* instrument_wise_list */}
      <GridSection>
        {data?.instrument_wise_list?.map((item, idx) => (
          <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
            <AnalyticsCard
              key={idx}
              title={`Total ${item?.instrument} Instruments`}
              count={item.count}
              onCheckNow={() => checkNow("instrument-wise", item?.instrument)}
              color="black"
            />
          </div>
        ))}
      </GridSection>

      {/* connect_wise_list */}
      <GridSection>
        {data?.connect_wise_list?.map((item, idx) => (
          <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
            <AnalyticsCard
              key={idx}
              title={`${item?.connect} Connectivity ISINs`}
              count={item.count}
              onCheckNow={() => checkNow("connect-wise", item?.connect)}
              color="black"
            />
          </div>
        ))}
      </GridSection>

      {/* transfer_wise_list */}
      <GridSection>
        {data?.transfer_wise_list?.map((item, idx) => (
          <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
            <AnalyticsCard
              key={idx}
              title={`${item?.transfer} Transfer ISINs`}
              count={item.count}
              onCheckNow={() => checkNow("transfer-wise", item?.transfer)}
              color="black"
            />
          </div>
        ))}
      </GridSection>

      <IsinModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        data={idWiseData}
      />
    </>
  );
};

export default IsinAnalytics;
