"use client";
import { GridSection } from "@/components/analyticsCard/AnalyticsCard";
import OutwardAnalyticsCard from "@/components/outwardCardModal/OutwardAnalyticsCard";
import OutwardAnalyticsModal from "@/components/outwardCardModal/OutwardAnalyticsModal";
import { apiConnector } from "@/utils/apihelper";
import { useEffect, useState } from "react";

const OutwardAnalytics = () => {
  const [data, setData] = useState([]);
  const [idWiseData, setIdWiseData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //----------------------fetch OutwardAnalytics data-----------------------------
  const fetchOutwardAnalytics = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/process/outward/outward_analytics`
      );
      const responseData = response.data.result || [];
      console.log({ responseData });

      setData(responseData);
    } catch (error) {
      const errMsg = error.response.data.message;
      toast.error(errMsg || "An error occurred while processing the request.");
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchOutwardAnalytics();
  }, []);

  const checkNow = async (key, type) => {
    try {
      const payload = { data: key };
      console.log({ payload });

      if (type) {
        payload.mode = type;
        payload.state = type;
        payload.isin = type;
        payload.agency = type;
      }

      const response = await apiConnector(
        "POST",
        `${apiUrl}/v2/admin/process/outward/get-data-of-outward`,
        payload
      );

      console.log(response.data);
      setIdWiseData(response?.data?.result);
      setShowModal(true);
    } catch (err) {
      console.error("Error fetching ISIN data:", err);
    }
  };
  return (
    <>
      <div className="row">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-body">
              <h2 className="text-lg font-semibold">Outward Analytics</h2>
            </div>
          </div>
        </div>
      </div>
      <GridSection>
        <OutwardAnalyticsCard
          title="Outward Addition (in last 7 days)"
          count={data?.last_seven_day_addition?.length || 0}
          icon="⬆️"  
          color="green"
          onCheckNow={() => checkNow("last-seven-addition")}
        />

        <OutwardAnalyticsCard
          title="Outward Addition (in last 30 days)"
          count={data?.last_month_addition?.length || 0}
          icon="⬆️"
          color="green"
          onCheckNow={() => checkNow("last-month-addition")}
        />

        <OutwardAnalyticsCard
          title="Outward Edition (in last 7 days)"
          count={data?.last_seven_day_edition?.length || 0}
          icon="📝"
          color="yellow"
          onCheckNow={() => checkNow("last-seven-edition")}
        />

        <OutwardAnalyticsCard
          title="Outward Edition (in last 30 days)"
          count={data?.last_month_edition?.length || 0}
          icon="📝"
          color="yellow"
          onCheckNow={() => checkNow("last-month-edition")}
        />
      </GridSection>

      <GridSection>
        <OutwardAnalyticsCard
          title="Outward Deletion (in last 7 days)"
          count={data?.last_seven_day_deletion?.length || 0}
          icon="⬆️"
          color="red"
          onCheckNow={() => checkNow("last-seven-addition")}
        />

        <OutwardAnalyticsCard
          title="Outward Deletion (in last 30 days)"
          count={data?.last_month_deletion?.length || 0}
          icon="⬆️"
          color="red"
          onCheckNow={() => checkNow("last-month-addition")}
        />
      </GridSection>

      <GridSection>
        {data?.status?.length > 0 &&
          data.status.map((item, idx) => {
            let cardProps = {
              title: "",
              color: "",
              id: "",
            };

            // Set title, color and checkNow key based on status
            if (item.status === 1) {
              cardProps = {
                title: "Total Pending Outward",
                color: "orange",
                id: "get-pending",
              };
            } else if (item.status === 2) {
              cardProps = {
                title: "Total Active Outward",
                color: "green",
                id: "get-active",
              };
            } else if (item.status === 3) {
              cardProps = {
                title: "Total Deleted Outward",
                color: "red",
                id: "get-delete",
              };
            }

            return (
              <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12" key={idx}>
                <OutwardAnalyticsCard
                  title={cardProps.title}
                  count={item.count}
                  color={cardProps.color}
                  onCheckNow={() => checkNow(cardProps.id)}
                />
              </div>
            );
          })}
      </GridSection>

      <GridSection>
        {data?.mode_wise_list?.length > 0 &&
          data?.mode_wise_list?.map((item, idx) => (
            <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
              <OutwardAnalyticsCard
                key={idx}
                title={`Total ${item?.mode} Records Mode`}
                count={item.count}
                onCheckNow={() => checkNow("mode-wise", item?.mode)}
                color="black"
              />
            </div>
          ))}
        {data?.agency_wise_list?.length > 0 &&
          data?.agency_wise_list?.map((item, idx) => (
            <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
              <OutwardAnalyticsCard
                key={idx}
                title={` ${item?.agency} agency`}
                count={item.count || 0}
                onCheckNow={() => checkNow("agency-wise", item?.agency)}
                color="black"
              />
            </div>
          ))}
        {data?.isin_wise_list?.length > 0 &&
          data?.isin_wise_list?.map((item, idx) => (
            <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
              <OutwardAnalyticsCard
                key={idx}
                title={` ${item?.isin} agency`}
                count={item.count || 0}
                onCheckNow={() => checkNow("isin-wise", item?.isin)}
                color="black"
              />
            </div>
          ))}
      </GridSection>

      <OutwardAnalyticsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        data={idWiseData}
      />
    </>
  );
};



export default OutwardAnalytics;
