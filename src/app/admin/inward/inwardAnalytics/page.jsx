"use client";
import { useEffect, useState } from "react";
import { apiConnector } from "@/utils/apihelper";
import InwardAnalyticsCard from "@/components/inwardcardModal/InwardAnalyticsCard";
import InwardAnalyticsModal from "@/components/inwardcardModal/InwardAnalyticsModal";

const InwardAnalytics = () => {
  const [data, setData] = useState([]);
  const [idWiseData, setIdWiseData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //----------------------fetch InwardAnalytics data-----------------------------
  const fetchAnayticsData = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/process/inward/inward_analytics?table=b_inward`
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
    fetchAnayticsData();
  }, []);

  const checkNow = async (key, type) => {
    try {
      const payload = { data: key };
      console.log({ payload });

      if (type) {
        payload.type = type;
        payload.mode = type;
        payload.location = type;
      }

      const response = await apiConnector("POST",
        `${apiUrl}/v2/admin/process/get-data-of-inward`,
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
              <h2 className="text-lg font-semibold">Inward Analytics</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
          <InwardAnalyticsCard
            title="Total Pending Inward Info"
            count={data?.dataofnotinwardinfo || 0}
            onCheckNow={() => checkNow("Inward-Info-wise")}
          />
        </div>
        <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
          <InwardAnalyticsCard
            title="Total Pending Inward Range"
            count={data?.dataofnotinwardrange || 0}
            onCheckNow={() => checkNow("Inward-Info-wise")}
          />
        </div>
        <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
          <InwardAnalyticsCard
            title="Total Pending Inward (Last 7 Days)"
            count={data?.pendingInwardBeforeSevenDays?.[0]?.count || 0}
            onCheckNow={() => checkNow("Inward-pending-7")}
          />
        </div>
        <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
          <InwardAnalyticsCard
            title="Total Pending Inward (Last 12 Days)"
            count={data?.pendingInwardBeforeTwelveDays?.[0]?.count || 0}
            onCheckNow={() => checkNow("Inward-pending-12")}
          />
        </div>
        <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
          <InwardAnalyticsCard
            title="Total Pending Inward (Last 15 Days)"
            count={data?.pendingInwardBeforeFifteenDays?.[0]?.count || 0}
            onCheckNow={() => checkNow("Inward-pending-15")}
          />
        </div>
        <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
          <InwardAnalyticsCard
            title="Total Inward PDF Remaining"
            count={data?.totalpendingInward?.[0]?.total || 0}
            onCheckNow={() => checkNow("Inward-PDF-Remaining")}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
          <InwardAnalyticsCard
            title="Total Inward PDF Remaining"
            count={data?.totalpendingInward?.[0]?.total || 0}
            onCheckNow={() => checkNow("Inward-PDF-Remaining")}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
          <InwardAnalyticsCard
            title="Total Inward Info Inserted/Updated"
            onCheckNow={() => checkNow("Inward-Date-wise")}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-body">
              <h2 className="text-lg font-semibold">
                Date Wise Wise Analytics
              </h2>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
          <InwardAnalyticsCard
            title="Inward Addition (in last 7 days)"
            count={data?.last_seven_day_addition?.length || 0}
            icon="⬆️"
            color="green"
            onCheckNow={() => checkNow("last-seven-addition")}
          />
        </div>
        <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
          <InwardAnalyticsCard
            title="Inward Addition (in last 30 days)"
            count={data?.last_month_addition?.length || 0}
            icon="⬆️"
            color="green"
            onCheckNow={() => checkNow("last-month-addition")}
          />
        </div>
        <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
          <InwardAnalyticsCard
            title="Inward Edition (in last 7 days)"
            count={data?.last_seven_day_edition?.length || 0}
            icon="📝"
            color="yellow"
            onCheckNow={() => checkNow("last-seven-edition")}
          />
        </div>
        <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
          <InwardAnalyticsCard
            title="Inward Edition (in last 30 days)"
            count={data?.last_month_edition?.length || 0}
            icon="📝"
            color="yellow"
            onCheckNow={() => checkNow("last-month-edition")}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
          <InwardAnalyticsCard
            title="Inward Deletion (in last 7 days)"
            count={data?.last_seven_day_deletion?.length || 0}
            icon="⬇️"
            color="red"
            onCheckNow={() => checkNow("last-seven-deletion")}
          />
        </div>
        <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
          <InwardAnalyticsCard
            title="Inward Deletion (in last 30 days)"
            count={data?.last_month_deletion?.length || 0}
            icon="⬇️"
            color="red"
            onCheckNow={() => checkNow("last-month-deletion")}
          />
        </div>
      </div>
      {/* <div className='row'>
                <div className='col-sm-12'>
                    <h2 className='text-lg font-semibold text-white'>Status Wise List</h2>
                </div>
            </div>

            <div className="row">
                <div className='col-xl-4 col-lg-4 col-md-4 col-sm-12'>
                    <StatusCard title="Total Approved" count={data?.status?.[0]?.count || 0} color="green" onCheckNow={() => checkNow('get-active')} />
                </div>
                <div className='col-xl-4 col-lg-4 col-md-4 col-sm-12'>
                    <StatusCard title="Active ISIN Info" count={data?.isin_info_status?.find((x) => x.status === 1)?.count || 0} color="green" onCheckNow={() => checkNow('get-active-isin-info')} />
                </div>
                <div className='col-xl-4 col-lg-4 col-md-4 col-sm-12'>
                    <StatusCard title="Active ISIN Media" count={data?.isin_media_status?.find((x) => x.status === 1)?.count || 0} color="green" onCheckNow={() => checkNow('get-active-isin-media')} />
                </div>
                <div className='col-xl-4 col-lg-4 col-md-4 col-sm-12'>
                    <StatusCard title="Deleted ISIN" count={data?.last_sixty_day_deletion?.length || 0} color="red" onCheckNow={() => checkNow('get-delete')} />
                </div>
            </div> */}
      <div className="row">
        <div className="col-sm-12">
          <h2 className="text-lg font-semibold text-black">Type Wise List</h2>
        </div>
      </div>
      <div className="row">
        {data?.type_wise_list?.map((item, idx) => (
          <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
            <InwardAnalyticsCard
              key={idx}
              title={`Total ${item?.type}  Request Type`}
              count={item.count}
              onCheckNow={() => checkNow("type-wise", item?.type)}
              color="black"
            />
          </div>
        ))}
      </div>
      <div className="row">
        <div className="col-sm-12">
          <h2 className="text-lg font-semibold text-black">Mode Wise List</h2>
        </div>
      </div>
      <div className="row">
        {data?.mode_wise_list?.map((item, idx) => (
          <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
            <InwardAnalyticsCard
              key={idx}
              title={`Total ${item?.mode} Mode`}
              count={item.count || 0}
              onCheckNow={() => checkNow("mode-wise", item?.mode)}
              color="black"
            />
          </div>
        ))}
      </div>
      <div className="row">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-body">
              <h2 className="text-lg font-semibold text-black">
                Location Wise List
              </h2>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        {data?.location_wise_list?.map((item, idx) => (
          <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
            <InwardAnalyticsCard
              key={idx}
              title={item?.location}
              count={item.count || 0}
              onCheckNow={() => checkNow("location-wise", item?.location)}
              color="black"
            />
          </div>
        ))}
      </div>

      <InwardAnalyticsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        data={idWiseData}
      />
    </>
  );
};

export default InwardAnalytics;


