"use client";
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { apiConnector } from "@/utils/apihelper";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const ViewReconciliation = () => {
  const { id } = useParams();
  console.log({ id });
  const [data, setData] = useState([]);
  const [recoData, setRecoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiConnector(
          "GET",
          `${apiUrl}/v2/admin/reconciliation/master/${bota(id)}`
        );
        const { isin, isin_info } = response.data.result.data;

        const mergedData = isin_info.map((row) => ({
          ...row,
          isin: isin,
        }));

        setData(mergedData);
      } catch (error) {
        toast.error(error.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchReconciliationData = async () => {
      try {
        const response = await apiConnector(
          "GET",
          `${apiUrl}/v2/admin/reconciliation/master/${id}`
        );
        const result = response.data.result.data;

        const isin = result?.isin?.isin;
        const info = result?.isin_info?.[0] || {};
        const masterArray = result?.master_array || {};

        let cdslOpen = parseInt(info.c_open || 0);
        let nsdlOpen = parseInt(info.n_open || 0);
        let physical = parseInt(info.p_open || 0);

        const processed = [];

        Object.entries(masterArray).forEach(([date, rows]) => {
          rows.forEach((row) => {
            const c_demat = row.reco?.cdsl?.ca_qty || 0;
            const n_demat = row.reco?.nsdl?.count || 0;

            const c_ca = 0;
            const n_ca = 0;

            const cin = row.n === 51 ? 100 : 0;
            const cout = row.n === 90 ? 100 : 0;
            const nin = row.n === 90 ? 100 : 0;
            const nout = row.n === 51 ? 100 : 0;

            const cremat = 0;
            const nremat = 0;

            const c_close = cdslOpen + c_demat + c_ca + cin - cout - cremat;
            const n_close = nsdlOpen + n_demat + n_ca + nin - nout - nremat;

            const total = c_close + n_close + physical;

            processed.push({
              date,
              isin,
              c_open: cdslOpen,
              c_demat,
              c_ca,
              cin,
              cremat,
              cout,
              c_close,
              n_open: nsdlOpen,
              n_demat,
              n_ca,
              nin,
              nremat,
              nout,
              n_close,
              physical,
              total,
              remarks: row.remarks || "Master Data",
            });

            cdslOpen = c_close;
            nsdlOpen = n_close;
          });
        });

        setRecoData(processed);
      } catch (err) {
        toast.error(
          err.response?.data?.error || "Error fetching reconciliation data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReconciliationData();
  }, [id]);

  const handleDownload = async (row) => {
    const datatoSend = {
      isin: typeof row.isin === "object" ? row.isin.isin : row.isin,
      date: row.date,
      cdslClose: row.c_close?.toString() ?? "0",
      nsdlClose: row.n_close?.toString() ?? "0",
      physical: row.physical?.toString() ?? "0",
      total: row.total?.toString() ?? "0",
    };

    try {
      const response = await apiConnector(
        "POST",
        `${apiUrl}/v2/admin/report/reconsillation/report55a`,
        datatoSend
      );
      if (response.data.status) {
        toast.success("Download started!");
        const backendUrl = response.data.result.redirectUrl;
        const reportUrl = backendUrl.replace(
          "/v2/admin/report/reconsillation/report55a",
          "/reconciliation/downloadRecoReport55a"
        );
        window.open(reportUrl, "_blank");
      } else {
        toast.error(response.data.result.message || "Download failed.");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    }
  };

  const columns = useMemo(
    () => [
      {
        header: "#",
        cell: (info) => info.row.index + 1,
      },
      {
        header: "Isin",
        accessorKey: "isin",
        cell: (info) =>
          typeof info.getValue() === "object"
            ? info.getValue()?.isin ?? "-"
            : info.getValue() ?? "-",
      },
      {
        header: "CDSL Op. Balance",
        accessorKey: "c_open",
        cell: (info) => info.row.original.c_open ?? "-",
      },
      {
        header: "NSDL Op. Balance",
        accessorKey: "n_open",
        cell: (info) => info.row.original.n_open ?? "-",
      },
      {
        header: "PHY Op. Balance",
        accessorKey: "p_open",
        cell: (info) => info.row.original.p_open ?? "-",
      },
    ],
    []
  );

  const recoColumns = useMemo(
    () => [
      { header: "#", cell: (info) => info.row.index + 1 },
      {
        header: "ISIN",
        accessorKey: "isin",
        cell: (info) =>
          typeof info.getValue() === "object"
            ? info.getValue()?.isin ?? "-"
            : info.getValue() ?? "-",
      },
      {
        header: "Date",
        accessorKey: "date",
        cell: (info) => new Date(info.getValue()).toLocaleDateString("en-GB"),
      },
      { header: "C Open", accessorKey: "c_open" },
      { header: "C Demat", accessorKey: "c_demat" },
      { header: "C CA", accessorKey: "c_ca" },
      { header: "C In", accessorKey: "cin" },
      { header: "C Remat", accessorKey: "cremat" },
      { header: "C Out", accessorKey: "cout" },
      { header: "C Close", accessorKey: "c_close" },
      { header: "N Open", accessorKey: "n_open" },
      { header: "N Demat", accessorKey: "n_demat" },
      { header: "N CA", accessorKey: "n_ca" },
      { header: "N In", accessorKey: "nin" },
      { header: "N Remat", accessorKey: "nremat" },
      { header: "N Out", accessorKey: "nout" },
      { header: "N Close", accessorKey: "n_close" },
      { header: "Physical", accessorKey: "physical" },
      { header: "Total", accessorKey: "total" },
      { header: "Remarks", accessorKey: "remarks" },
      {
        header: "Action",
        cell: (info) => (
          <button onClick={() => handleDownload(info.row.original)}>
            Download
          </button>
        ),
      },
    ],
    []
  );

  return (
    <>
      <div className="card">
        <div className="card-body">
          <ViewDataTable
            title="In case of no activities in IDT, Demat/ Remat, Corporate Action, Closing Balance shall be same as Op. Balance."
            columns={columns}
            data={data}
            isLoading={loading}
          />
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <ViewDataTable
            title="Reconciliation Table"
            columns={recoColumns}
            data={recoData}
            isLoading={loading}
          />
        </div>
      </div>
    </>
  );
};

export default ViewReconciliation;
