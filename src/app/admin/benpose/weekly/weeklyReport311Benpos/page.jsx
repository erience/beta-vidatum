"use client";
export const dynamic = "force-dynamic";

import ShareholderModal from "@/components/ShareholderModal/ShareholderModal";
import { useEffect, useMemo, useState } from "react";
import { apiConnector } from "@/utils/apihelper";
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { formatDMY } from "@/utils/helper";
import useQueryParams from "../../../../../../hook/useQueryParams";
import { Base64 } from "js-base64";

const WeeklyReport311Benpos = () => {
  const [data, setData] = useState({
    consolidated: {
      promoter: { count: 0, total: 0, pledge: 0, lock: 0 },
      public: { count: 0, total: 0, pledge: 0, lock: 0 },
      physicalTotal: 0,
      totalShares: 0,
      dematShares: 0,
    },
    promoterData: [],
    publicData: [],
    drData: [],
    employeeTrustData: [],
    nonPromoterNonPublicData: [],
  });
  const [loading, setLoading] = useState(true);

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedShareholderData, setSelectedShareholderData] = useState([]);
  const [selectedCategoryType, setSelectedCategoryType] = useState("");
  // const { date, isin, benposType } = useQueryParams();
  // const searchParams = useSearchParams();
  // const date = searchParams.get("date");
  // const fetchIsin = searchParams.get("isin");
  // const benposType = searchParams.get("benposType");
  const getQueryParam = (param) => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(param);
    }
    return null;
  };

  const date = getQueryParam("date");
  const isin = getQueryParam("isin");
  const benposType = getQueryParam("benposType");
  // const finalIsin = Base64.isValid(isin) ? Base64.decode(isin) : isin;

  console.log("date", date);
  console.log({ date, isin, benposType });
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const submitData = {
          isin: isin,
          bdate: formatDMY(date),
          benposType,
        };
        console.log({ submitData });
        const response = await apiConnector(
          "POST",
          `${apiUrl}/v2/admin/benpose/report-311`,
          submitData
        );
        const responseData = response.data.data || {};
        console.log({ responseData });

        setData({
          consolidated: {
            promoter: {
              count: responseData.promoterCount || 0,
              total: responseData.promoterTotal || 0,
              pledge: responseData.promoterPledge || 0,
              lock: responseData.promoterLock || 0,
            },
            public: {
              count: responseData.publicCount || 0,
              total: responseData.publicTotal || 0,
              pledge: responseData.publicPledge || 0,
              lock: responseData.publicLock || 0,
            },
            physicalTotal: responseData.physicalTotal || 0,
            totalShares:
              (responseData.count?.[0]?.total || 0) +
              (responseData.physicalTotal || 0),
            dematShares: responseData.count?.[0]?.total || 0,
          },
          promoterData: responseData.promoterDataavailableinIsinData || [],
          publicData: responseData.data || [],
          drData: [],
          employeeTrustData: [],
          nonPromoterNonPublicData: [],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to open modal with shareholder data
  const openShareholderModal = (rowData, categoryType) => {
    // For public category, we need to get the detailed data
    if (rowData.data && Array.isArray(rowData.totalHolders)) {
      setSelectedShareholderData(rowData.totalHolders);
    } else {
      // For other categories, use the row data itself
      setSelectedShareholderData([rowData.totalHolders]);
    }
    setSelectedCategoryType(categoryType);
    setIsModalOpen(true);
  };

  // Consolidated Sheet Columns
  const consolidatedColumns = useMemo(
    () => [
      { header: "Sr. No.", accessorKey: "srNo" },
      { header: "Category", accessorKey: "category" },
      { header: "No. of Shareholders", accessorKey: "shareholderCount" },
      { header: "Fully Paid-Up Shares", accessorKey: "fullyPaidShares" },
      { header: "Partly Paid-Up Shares", accessorKey: "partlyPaidShares" },
      { header: "No. of Shares in DR", accessorKey: "sharesInDR" },
      { header: "Total Shares", accessorKey: "totalShares" },
      { header: "% of Total Shareholding", accessorKey: "percentOfTotal" },
      { header: "Class X Voting Rights", accessorKey: "votingRights" },
      {
        header: "Total as a % of Total Voting Rights",
        accessorKey: "percentOfVotingRights",
      },
      { header: "Pledged Shares", accessorKey: "pledgedShares" },
      {
        header: "As a % of Total Shares (Pledged)",
        accessorKey: "percentPledged",
      },
      { header: "Locked-In Shares", accessorKey: "lockedShares" },
      {
        header: "As a % of Total Shares (Locked)",
        accessorKey: "percentLocked",
      },
      { header: "Demat Shares", accessorKey: "dematShares" },
    ],
    []
  );

  // Promoter Sheet Columns
  const promoterColumns = useMemo(
    () => [
      {
        header: "Sr. No.",
        accessorKey: "index",
        cell: (info) => info.row.index + 1,
      },
      { header: "Category", accessorKey: "label" },
      { header: "Shareholder Name", accessorKey: "f_holder" },
      { header: "PAN", accessorKey: "f_pan" },
      { header: "Fully Paid-Up Shares", accessorKey: "total" },
      { header: "Partly Paid-Up Shares", cell: () => 0 },
      { header: "No. of Shares in DR", cell: () => 0 },
      { header: "Total Shares", accessorKey: "total" },
      {
        header: "% of Total Shareholding",
        cell: (info) => {
          const percentage =
            (info.row.original.total * 100) / data.consolidated.totalShares;
          return isNaN(percentage) ? "0.00" : percentage.toFixed(2);
        },
      },
      { header: "Class X Voting Rights", accessorKey: "total" },
      {
        header: "Total as a % of Total Voting Rights",
        cell: (info) => {
          const percentage =
            (info.row.original.total * 100) / data.consolidated.totalShares;
          return isNaN(percentage) ? "0.00" : percentage.toFixed(2);
        },
      },
      {
        header: "Pledged Shares",
        cell: (info) =>
          isNaN(info.row.original.pledge) ? 0 : info.row.original.pledge,
      },
      {
        header: "As a % of Total Shares (Pledged)",
        cell: (info) => {
          const percentage =
            (info.row.original.pledge * 100) / info.row.original.total;
          return isNaN(percentage) ? "0.00" : percentage.toFixed(2);
        },
      },
      {
        header: "Locked-In Shares",
        cell: (info) =>
          isNaN(info.row.original.lock) ? 0 : info.row.original.lock,
      },
      {
        header: "As a % of Total Shares (Locked)",
        cell: (info) => {
          const percentage =
            (info.row.original.lock * 100) / info.row.original.total;
          return isNaN(percentage) ? "0.00" : percentage.toFixed(2);
        },
      },
      {
        header: "Demat Shares",
        cell: (info) =>
          info.row.original.mode === 3 ? 0 : info.row.original.total,
      },
    ],
    [data.consolidated.totalShares]
  );

  // Public Sheet Columns
  const publicColumns = useMemo(
    () => [
      {
        header: "Sr. No.",
        accessorKey: "index",
        cell: (info) => info.row.index + 1,
      },
      { header: "Category", accessorKey: "type" },
      {
        header: "Shareholder List",
        cell: (info) => (
          <button
            onClick={() =>
              openShareholderModal(info.row.original, info.row.original.type)
            }
            className="text-blue-600 hover:underline focus:outline-none"
          >
            1% Shareholders
          </button>
        ),
      },
      { header: "Total No. of Shareholders", accessorKey: "count" },
      { header: "Fully Paid-Up Shares", accessorKey: "total" },
      { header: "Partly Paid-Up Shares", cell: () => 0 },
      { header: "No. of Shares in DR", cell: () => 0 },
      { header: "Total Shares", accessorKey: "total" },
      {
        header: "% of Total Shareholding",
        cell: (info) => {
          const percentage =
            (info.row.original.total * 100) / data.consolidated.totalShares;
          return isNaN(percentage) ? "0.00" : percentage.toFixed(2);
        },
      },
      { header: "Class X Voting Rights", accessorKey: "total" },
      {
        header: "Total as a % of Total Voting Rights",
        cell: (info) => {
          const percentage =
            (info.row.original.total * 100) / data.consolidated.totalShares;
          return isNaN(percentage) ? "0.00" : percentage.toFixed(2);
        },
      },
      {
        header: "Pledged Shares",
        cell: (info) =>
          isNaN(info.row.original.pledge) ? 0 : info.row.original.pledge,
      },
      {
        header: "As a % of Total Shares (Pledged)",
        cell: (info) => {
          const percentage =
            (info.row.original.pledge * 100) / info.row.original.total;
          return isNaN(percentage) ? "0.00" : percentage.toFixed(2);
        },
      },
      {
        header: "Locked-In Shares",
        cell: (info) =>
          isNaN(info.row.original.lock) ? 0 : info.row.original.lock,
      },
      {
        header: "As a % of Total Shares",
        cell: (info) => {
          const percentage =
            (info.row.original.lock * 100) / info.row.original.total;
          return isNaN(percentage) ? "0.00" : percentage.toFixed(2);
        },
      },
      {
        header: "Demat Shares",
        cell: (info) => {
          let totalShareData = info.row.original.totalShareData;
          // if (info.row.original.data) {
          //   info.row.original.data.forEach((res) => {
          //     if (res.mode !== 3) {
          //       totalShareData += parseFloat(res.total || 0);
          //     }
          //   });
          // }
          return totalShareData;
        },
      },
    ],
    [data.consolidated.totalShares]
  );

  // Other tables columns
  const simpleColumns = useMemo(
    () => [
      { header: "Sr. No.", accessorKey: "srNo" },
      { header: "Category", accessorKey: "category" },
      { header: "Total Shares", accessorKey: "totalShares" },
      { header: "Pledged Shares", accessorKey: "pledgedShares" },
      { header: "Lock-In Shares", accessorKey: "lockedShares" },
      { header: "1% Holding", accessorKey: "onePercentHolding" },
    ],
    []
  );

  // Consolidated data
  const consolidatedData = useMemo(() => {
    const {
      promoter,
      public: publicData,
      physicalTotal,
      totalShares,
      dematShares,
    } = data.consolidated;

    return [
      {
        srNo: "A",
        category: "Promoters & Promoter Group",
        shareholderCount: promoter.count,
        fullyPaidShares: promoter.total,
        partlyPaidShares: 0,
        sharesInDR: 0,
        totalShares: promoter.total,
        percentOfTotal: isNaN((promoter.total * 100) / totalShares)
          ? "0.00"
          : ((promoter.total * 100) / totalShares).toFixed(2),
        votingRights: promoter.total,
        percentOfVotingRights: isNaN((promoter.total * 100) / totalShares)
          ? "0.00"
          : ((promoter.total * 100) / totalShares).toFixed(2),
        pledgedShares: promoter.pledge,
        percentPledged: isNaN((promoter.pledge * 100) / promoter.total)
          ? "0.00"
          : ((promoter.pledge * 100) / promoter.total).toFixed(2),
        lockedShares: promoter.lock,
        percentLocked: isNaN((promoter.lock * 100) / promoter.total)
          ? "0.00"
          : ((promoter.lock * 100) / promoter.total).toFixed(2),
        dematShares: promoter.total,
      },
      {
        srNo: "B",
        category: "Public",
        shareholderCount: publicData.count,
        fullyPaidShares: publicData.total,
        partlyPaidShares: 0,
        sharesInDR: 0,
        totalShares: publicData.total,
        percentOfTotal: isNaN((publicData.total * 100) / totalShares)
          ? "0.00"
          : ((publicData.total * 100) / totalShares).toFixed(2),
        votingRights: publicData.total,
        percentOfVotingRights: isNaN((publicData.total * 100) / totalShares)
          ? "0.00"
          : ((publicData.total * 100) / totalShares).toFixed(2),
        pledgedShares: publicData.pledge,
        percentPledged: isNaN((publicData.pledge * 100) / publicData.total)
          ? "0.00"
          : ((publicData.pledge * 100) / publicData.total).toFixed(2),
        lockedShares: publicData.lock,
        percentLocked: isNaN((publicData.lock * 100) / publicData.total)
          ? "0.00"
          : ((publicData.lock * 100) / publicData.total).toFixed(2),
        dematShares: publicData.total - physicalTotal,
      },
      {
        srNo: "C",
        category: "Shares underlying DRs",
        shareholderCount: 0,
        fullyPaidShares: 0,
        partlyPaidShares: 0,
        sharesInDR: 0,
        totalShares: 0,
        percentOfTotal: "0.00",
        votingRights: 0,
        percentOfVotingRights: "0.00",
        pledgedShares: 0,
        percentPledged: "0.00",
        lockedShares: 0,
        percentLocked: "0.00",
        dematShares: 0,
      },
      {
        srNo: "D",
        category: "Shares held by Employee Trust",
        shareholderCount: 0,
        fullyPaidShares: 0,
        partlyPaidShares: 0,
        sharesInDR: 0,
        totalShares: 0,
        percentOfTotal: "0.00",
        votingRights: 0,
        percentOfVotingRights: "0.00",
        pledgedShares: 0,
        percentPledged: "0.00",
        lockedShares: 0,
        percentLocked: "0.00",
        dematShares: 0,
      },
      {
        srNo: "E",
        category: "Non Promoter-Non Public",
        shareholderCount: 0,
        fullyPaidShares: 0,
        partlyPaidShares: 0,
        sharesInDR: 0,
        totalShares: 0,
        percentOfTotal: "0.00",
        votingRights: 0,
        percentOfVotingRights: "0.00",
        pledgedShares: 0,
        percentPledged: "0.00",
        lockedShares: 0,
        percentLocked: "0.00",
        dematShares: 0,
      },
    ];
  }, [data.consolidated]);

  return (
    <>
      <div className="card">
        <div className="card-body p-4">
          {/* Consolidated Sheet */}
          <ViewDataTable
            title={`Reg. 31(1) Report - Consolidated Sheet [Total Demat Shares: ${data.consolidated.dematShares}] + [Total Physical Shares: ${data.consolidated.physicalTotal}] = [Total Shares: ${data.consolidated.totalShares}]`}
            description="The Consolidated Sheet provides a summary statement of holdings of specified securities by various groups of people, including Promoters & Promoter Group, Public, Non-Promoter - Non-Public, Shares underlying DRs, and Shares held by Employee Trusts. If you notice any discrepancies, please email us at info@vidatum.in."
            columns={consolidatedColumns}
            data={consolidatedData}
            isLoading={loading}
          />

          {/* Promoters & Promoter Group Sheet */}
          <ViewDataTable
            title="Reg. 31(1) Report - Promoters & Promoter Group Sheet"
            description="This Promoters & Promoter Group Sheet provides the shareholding pattern of the Promoter and Promoter Group. If you identify any discrepancies, please contact us at info@vidatum.in."
            columns={promoterColumns}
            data={data.promoterData}
            isLoading={loading}
          />

          {/* Public Sheet */}
          <ViewDataTable
            title="Reg. 31(1) Report - Public"
            description="This Public sheet provides a summary statement of holdings of specified securities by the public. If you identify any discrepancies, please contact us at info@vidatum.in."
            columns={publicColumns}
            data={data.publicData}
            isLoading={loading}
          />

          {/* Shares underlying DRs Sheet */}
          <ViewDataTable
            title="Reg. 31(1) Report - Shares underlying DRs Sheet"
            description="This Shares underlying DRs Sheet provides a summary statement of holdings of specified securities by Shares underlying DRs. If you identify any discrepancies, please contact us at info@vidatum.in."
            columns={simpleColumns}
            data={data.drData}
            isLoading={loading}
          />

          {/* Shares held by Employee Trust Sheet */}
          <ViewDataTable
            title="Reg. 31(1) Report - Shares held by Employee Trust Sheet"
            description="This Shares held by Employee Trust Sheet provides a summary statement of holdings of specified securities by Employee Trusts. If you identify any discrepancies, please contact us at info@vidatum.in."
            columns={simpleColumns}
            data={data.employeeTrustData}
            isLoading={loading}
          />

          {/* Non Promoter-Non Public Sheet */}
          <ViewDataTable
            title="Reg. 31(1) Report - Non Promoter-Non Public Sheet"
            description="This Non Promoter-Non Public Sheet provides a summary statement of holdings of specified securities by Employee Trusts. If you identify any discrepancies, please contact us at info@vidatum.in."
            columns={simpleColumns}
            data={data.nonPromoterNonPublicData}
            isLoading={loading}
          />
        </div>
        <h1 className="text-2xl font-bold mb-6">Reg. 31(1) Report</h1>

        {/* Shareholder Modal */}
        <ShareholderModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          shareholderData={selectedShareholderData}
          totalCount={data.consolidated.totalShares}
          categoryType={selectedCategoryType}
        />
      </div>
    </>
  );
};

export default WeeklyReport311Benpos;
