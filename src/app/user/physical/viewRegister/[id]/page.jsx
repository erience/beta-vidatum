"use client";
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { apiConnector } from "@/utils/apihelper";
import { formatDateShort } from "@/utils/helper";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const ViewRegister = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [isin, setIsin] = useState("");
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //----------------------fetch register data-----------------------------

  const fetchRegisterData = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/user/physical/viewregistershare/${id}`
      );
      const responseData = response.data.result.data || [];
      const finalIsin = response.data.result.finalisin || [];
      console.log({ responseData });
      setData(responseData);
      setIsin(finalIsin);
      setLoading(false);
    } catch (error) {
      const errMsg = error.response.data.message;
      toast.error(errMsg || "An error occurred while processing the request.");
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegisterData();
  }, []);

  const count = data.reduce((acc, item) => acc + (item.t_share || 0), 0);
  //---------------------------dynamic column---------------------------
  const columns = useMemo(
    () => [
      {
        header: "#",
        accessorKey: "index",
        cell: (info) => info.row.index + 1,
      },
      {
        header: "Allotment Date",
        accessorKey: "a_date",
        cell: (info) => formatDateShort(info.row.original.a_date),
      },
      {
        header: "Endorsement Date",
        accessorKey: "i_date",
        cell: (info) => formatDateShort(info.row.original.i_date),
      },
      {
        header: "Transfer Share",
        accessorKey: "t_share",
        cell: (info) => info.row.original.t_share || "0",
      },
      {
        header: "Certificate",
        accessorKey: "certi",
        cell: (info) => info.row.original.certi,
      },
      {
        header: "From",
        accessorKey: "from",
        cell: (info) => info.row.original.from,
      },
      {
        header: "To",
        accessorKey: "to",
        cell: (info) => info.row.original.to,
      },
      {
        header: "Payable",
        accessorKey: "payable",
        cell: (info) => info.row.original.payable,
      },
      {
        header: "Paid",
        accessorKey: "paid",
        cell: (info) => info.row.original.paid,
      },
      {
        header: "Due",
        accessorKey: "due",
        cell: (info) => info.row.original.due,
      },
      {
        header: "Consideration",
        accessorKey: "consideration",
        cell: (info) => info.row.original.consideration,
      },
      {
        header: "Transfer Date",
        accessorKey: "t_date",
        cell: (info) => formatDateShort(info.row.original.t_date),
      },
      {
        header: "Ledger Folio Buyer",
        accessorKey: "lf_buyer",
        cell: (info) => info.row.original.lf_buyer,
      },
      {
        header: "Transfer Name",
        accessorKey: "t_name",
        cell: (info) => info.row.original.t_name,
      },
      {
        header: "Lock",
        accessorKey: "lock",
        cell: (info) => info.row.original.lock,
      },
      {
        header: "Remarks",
        accessorKey: "remarks",
        cell: (info) => info.row.original.remarks,
      },

      {
        header: "Status",
        accessorKey: "status",
        cell: (info) => {
          const status = info.row.original.status;
          if (status == 1) {
            return (
              <span className="badge label-table badge-success">Active</span>
            );
          } else if (status == 2) {
            return (
               <span className=" text-yellow-500 bg-yellow-100  inline-block  text-xs font-semibold px-3 py-1 rounded-full">
                  InActive
                </span>
            );
          } else if (status == 3) {
            return (
              <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
                Delete
              </span>
            );
          } else {
            return "Something went wrong";
          }
        },
      },
    ],
    [data]
  );

  return (
    <>
      <div className="card">
        <div className="card-body p-4">
          <div className="row">
            {/* Card 1 */}
            <div className="col-xl-3 col-md-6">
              <div className="card feed-card">
                <div className="card-body p-t-0 p-b-0">
                  <div className="row">
                    <div className="col-3 bg-primary border-feed">
                      <i className="fas fa-calendar-alt f-40"></i>
                    </div>
                    <div className="col-9">
                      <div className="p-t-25 p-b-25 text-right">
                        <h2 className="f-w-400 m-b-10">{isin}</h2>
                        <p className="text-muted m-0">ISIN</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="col-xl-3 col-md-6">
              <div className="card feed-card">
                <div className="card-body p-t-0 p-b-0">
                  <div className="row">
                    <div className="col-3 bg-primary border-feed">
                      <i className="fas fa-calendar-alt f-40"></i>
                    </div>
                    <div className="col-9">
                      <div className="p-t-25 p-b-25 text-right">
                        <h2 className="f-w-400 m-b-10">{count}</h2>
                        <p className="text-muted m-0">COUNT</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <ViewDataTable
                title="Register List"
                cardHeader="rehister data"
                columns={columns}
                data={data}
                isLoading={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewRegister;
