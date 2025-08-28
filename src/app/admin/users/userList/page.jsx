"use client";
import ViewDataTable from "@/components/dataTables/ViewDataTable";
import { apiConnector } from "@/utils/apihelper";
import { Edit, SquarePlus } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const UserList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  //----------------------fetch user data-----------------------------
  const fetchUserData = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${apiUrl}/v2/admin/user/user_list`
      );
      const responseData = response.data.result || [];
      console.log({ responseData });
      setData(responseData);
      setLoading(false);
    } catch (error) {
      const errMsg = error.response.data.message;
      toast.error(errMsg || "An error occurred while processing the request.");
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const columns = useMemo(
    () => [
      {
        header: "#",
        accessorKey: "index",
        cell: (info) => info.row.index + 1,
      },
      {
        header: "ISIN",
        accessorKey: "isin_id",
        cell: (info) => info.row.original.isin_id,
      },
      {
        header: "Email",
        accessorKey: "email",
        cell: (info) => info.row.original.email,
      },

      {
        header: "Company Name",
        accessorKey: "cin",
        cell: (info) => info.row.original.cin,
      },
      {
        header: "First Name",
        accessorKey: "f_name",
        cell: (info) => info.row.original.f_name,
      },
      {
        header: "Last Name",
        accessorKey: "l_name",
        cell: (info) => info.row.original.l_name,
      },
      {
        header: "Phone Number",
        accessorKey: "phone",
        cell: (info) => info.row.original.phone,
      },

      {
        header: "Mobile Number",
        accessorKey: "mobile",
        cell: (info) =>
          info.row.original.mobile ? info.row.original.mobile : "-",
      },
      // {
      //   header: "RTA Subscription",
      //   accessorKey: "rta",
      //   cell: (info) => {
      //     const status = info.row.original.rta;
      //     switch (status) {
      //       case 1:
      //         return (
      //           <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
      //             Active
      //           </span>
      //         );
      //       case 2:
      //         return (
      //           <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
      //             Disable
      //           </span>
      //         );
      //       default:
      //         return (
      //           <span className="inline-block bg-blue-400 text-black text-xs font-semibold px-3 py-1 rounded-full">
      //             Unknown
      //           </span>
      //         );
      //     }
      //   },
      // },
      // {
      //   header: "E-voting Subscription",
      //   accessorKey: "evoting",
      //   cell: (info) => {
      //     const status = info.row.original.evoting;
      //     switch (status) {
      //       case 1:
      //         return (
      //           <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
      //             Active
      //           </span>
      //         );
      //       case 2:
      //         return (
      //           <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
      //             Disable
      //           </span>
      //         );
      //       default:
      //         return (
      //           <span className="inline-block bg-blue-400 text-black text-xs font-semibold px-3 py-1 rounded-full">
      //             Unknown
      //           </span>
      //         );
      //     }
      //   },
      // },
      // {
      //   header: "Corporate Action Subscription",
      //   accessorKey: "ca",
      //   cell: (info) => {
      //     const status = info.row.original.ca;
      //     switch (status) {
      //       case 1:
      //         return (
      //           <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
      //             Active
      //           </span>
      //         );
      //       case 2:
      //         return (
      //           <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
      //             Disable
      //           </span>
      //         );
      //       default:
      //         return (
      //           <span className="inline-block bg-blue-400 text-black text-xs font-semibold px-3 py-1 rounded-full">
      //             Unknown
      //           </span>
      //         );
      //     }
      //   },
      // },
      // {
      //   header: "Finance Subscription",
      //   accessorKey: "finance",
      //   cell: (info) => {
      //     const status = info.row.original.finance;
      //     switch (status) {
      //       case 1:
      //         return (
      //           <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
      //             Active
      //           </span>
      //         );
      //       case 2:
      //         return (
      //           <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
      //             Disable
      //           </span>
      //         );
      //       default:
      //         return (
      //           <span className="inline-block bg-blue-400 text-black text-xs font-semibold px-3 py-1 rounded-full">
      //             Unknown
      //           </span>
      //         );
      //     }
      //   },
      // },
      // {
      //   header: "ISIN Subscription",
      //   accessorKey: "isin",
      //   cell: (info) => {
      //     const status = info.row.original.isin;
      //     switch (status) {
      //       case 1:
      //         return (
      //           <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
      //             Active
      //           </span>
      //         );
      //       case 2:
      //         return (
      //           <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
      //             Disable
      //           </span>
      //         );
      //       default:
      //         return (
      //           <span className="inline-block bg-blue-400 text-black text-xs font-semibold px-3 py-1 rounded-full">
      //             Unknown
      //           </span>
      //         );
      //     }
      //   },
      // },
      // {
      //   header: "SDD Subscription",
      //   accessorKey: "sdd",
      //   cell: (info) => {
      //     const status = info.row.original.sdd;
      //     switch (status) {
      //       case 1:
      //         return (
      //           <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
      //             Active
      //           </span>
      //         );
      //       case 2:
      //         return (
      //           <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
      //             Disable
      //           </span>
      //         );
      //       default:
      //         return (
      //           <span className="inline-block bg-blue-400 text-black text-xs font-semibold px-3 py-1 rounded-full">
      //             Unknown
      //           </span>
      //         );
      //     }
      //   },
      // },
      // {
      //   header: "IPO Subscription",
      //   accessorKey: "ipo",
      //   cell: (info) => {
      //     const status = info.row.original.ipo;
      //     switch (status) {
      //       case 1:
      //         return (
      //           <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
      //             Active
      //           </span>
      //         );
      //       case 2:
      //         return (
      //           <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
      //             Disable
      //           </span>
      //         );
      //       default:
      //         return (
      //           <span className="inline-block bg-blue-400 text-black text-xs font-semibold px-3 py-1 rounded-full">
      //             Unknown
      //           </span>
      //         );
      //     }
      //   },
      // },
      {
        header: "Actions",
        accessorKey: "",
        cell: ({ row }) => {
          const rowData = row.original;
          return (
            <>
              <Link
                className="position-relative mx-3"
                href={`/admin/users/editUser/${btoa(rowData.id)}`}
                target="_blank"
              >
                <Edit className="text-yellow-500" />
              </Link>
            </>
          );
        },
      },
    ],
    []
  );
  return (
    <>
      <div className="card">
        <div className="card-body">
          <ViewDataTable
            title="User List"
            cardHeader="user list data"
            columns={columns}
            data={data}
            isLoading={loading}
            headerIcons={
              <div className="flex items-center gap-1">
                <Link href="/admin/users/addUser">
                  <button type="button" title="">
                    <SquarePlus size={25} />
                  </button>
                </Link>
              </div>
            }
          />
        </div>
      </div>
    </>
  );
};

export default UserList;
