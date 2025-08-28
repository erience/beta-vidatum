"use client";
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { apiConnector } from "@/utils/apihelper";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const UserViewReconciliation = () => {
  const [tableData, setTableData] = useState([]);
  const [reconcillationList, setReconcillationList] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiConnector(
          "GET",
          `${apiUrl}/v2/user/reconciliation/index`
        );
        const result = res.data.result || {};
        console.log({ result });

        const { isin_info, master_array, isin } = result;

        const combinedData = (isin_info || []).map((info) => ({
          ...info,
          isin: isin?.isin || "-", // Ensure ISIN field is properly set
        }));

        setReconcillationList(combinedData);

        if (!isin_info || !isin_info[0] || !master_array) {
          setTableData([]);
          setLoading(false);
          return;
        }

        const c_open = parseInt(isin_info[0].c_open || 0);
        const n_open = parseInt(isin_info[0].n_open || 0);
        let physical = parseInt(isin_info[0].p_open || 0);
        let cdslPastClose = 0;
        let nsdlPastClose = 0;
        let index = 1;

        const rows = [];

        for (const [key, records] of Object.entries(master_array)) {
          for (const row of records) {
            const n_demat = parseInt(row?.reco?.nsdl?.count || 0);
            const c_demat = parseInt(row?.reco?.cdsl?.ca_qty || 0);

            let n_ca = 0;
            if (row?.ca?.nsdl) {
              n_ca = row.ca.nsdl.type === 177 ? 0 : parseInt(row.ca.nsdl.count);
            }

            let c_ca = 0;
            if (row?.ca?.cdsl) {
              c_ca = row.ca.cdsl.type === 177 ? 0 : parseInt(row.ca.cdsl.count);
            }

            let share = 0;
            if (row?.e) {
              share = parseInt(String(row.e).slice(0, -3).replace(/^0+/, ""));
            }

            const cout = row.n === 90 ? share : 0;
            const cin = row.n === 51 ? share : 0;
            const cremat = 0;

            if (!cdslPastClose) cdslPastClose = c_open;
            const c_close =
              parseInt(cdslPastClose) + c_demat + c_ca + cin - cout - cremat;

            const nout = row.n === 51 ? share : 0;
            const nin = row.n === 90 ? share : 0;
            const nremat = 0;

            if (!nsdlPastClose) nsdlPastClose = n_open;
            const n_close =
              parseInt(nsdlPastClose) + n_demat + n_ca + nin - nremat - nout;

            physical = physical - n_demat - c_demat;

            const formattedDate =
              key === "0000-00-00"
                ? "-"
                : new Date(key).toLocaleDateString("en-GB");

            rows.push({
              index: index++,
              isin: isin?.isin || "-",
              date: formattedDate,
              c_open: cdslPastClose,
              c_demat,
              c_ca,
              cin,
              cremat,
              cout,
              c_close,
              n_open: nsdlPastClose,
              n_demat,
              n_ca,
              nin,
              nremat,
              nout,
              n_close,
              physical,
              total: c_close + n_close + physical,
              remarks: row?.remarks || "No Record",
            });

            cdslPastClose = c_close;
            nsdlPastClose = n_close;
          }
        }

        console.log({ rows });
        setTableData(rows);
      } catch (err) {
        const errMsg = err.response.data.message;
        toast.error(
          errMsg || "An error occurred while processing the request."
        );
        console.error("Error fetching reconciliation data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ------------------ Columns for the second table --------------------
  const columns = useMemo(
    () => [
      { header: "#", accessorKey: "index" },
      { header: "ISIN", accessorKey: "isin" },
      { header: "Date", accessorKey: "date" },
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
    ],
    []
  );

  // ------------------ Columns for the first table --------------------
  const reconcillationColumns = useMemo(
    () => [
      { header: "#", accessorKey: "index", cell: (info) => info.row.index + 1 },
      {
        header: "ISIN",
        accessorKey: "isin",
        cell: (info) => info.row.original.isin || "-", // safer fallback
      },
      {
        header: "CDSL Op. Balance",
        accessorKey: "c_open",
        cell: (info) => info.row.original.c_open,
      },
      {
        header: "NSDL Op. Balance",
        accessorKey: "n_open",
        cell: (info) => info.row.original.n_open,
      },
      {
        header: "PHY Op. Balance",
        accessorKey: "p_open",
        cell: (info) => info.row.original.p_open,
      },
    ],
    []
  );

  return (
    <>
      <div className="card">
        <div className="card-body">
          <ViewDataTable
            title="Reconcillation List"
            cardHeader="reconcillation List data"
            columns={reconcillationColumns}
            data={reconcillationList}
            isLoading={loading}
          />
          <ViewDataTable
            title="IDT, Demat/ Remat, Corporate Action Activities"
            cardHeader="IDT, Demat/ Remat, Corporate Action Activities"
            columns={columns}
            data={tableData}
            isLoading={loading}
            headerIcons={<div className="flex items-center gap-1"></div>}
          />
        </div>
      </div>
    </>
  );
};

export default UserViewReconciliation;
