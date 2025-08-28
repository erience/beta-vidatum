"use client";

import { useState } from "react";
import Link from "next/link";
import * as Icons from "react-feather";
import * as FeatherIcons from "react-feather";

const menus = [
  {
    id: "isin",
    name: "ISIN",
    icon: "Users",
    children: [
      {
        id: "viewIsin",
        name: "View ISIN",
        path: "/user/isin/viewUserIsin",
      },
    ],
  },
  //benpose
  {
    id: "benpose",
    name: "Benpose",
    icon: "BarChart2",
    children: [
      {
        id: "weeklybenpose",
        name: "Weekly Benpose",
        children: [
          {
            id: "benposeindex",
            name: "Benpose Index",
            path: "/user/benpose/userBenposeList",
          },
        ],
      },
      {
        id: "specialbenpose",
        name: "Special Benpose",
        children: [
          {
            id: "benposeindex",
            name: "Benpose Index",
            path: "/user/benpose/special/userSpecialBenposeList",
          },
        ],
      },
    ],
  },
  //reconciliation
  {
    id: "reconciliation",
    name: "Reconciliation",
    icon: "Link",
    children: [
      {
        id: "viewReco",
        name: "View Reco",
        path: "/user/reconciliation/userViewReconcillation",
      },
      {
        id: "actionhistory",
        name: "Action History",
        children: [
          {
            id: "idt",
            name: "IDT History",
            path: "/user/reconcillation/userIdtList",
          },
          {
            id: "demathistorycdsl",
            name: "Demat History CDSL",
            path: "/user/reconcillation/userDemateHistoryCdsl",
          },
          {
            id: "demathistorynsdl",
            name: "Demat History NSDL",
            path: "/user/reconcillation/userDemateHistoryNsdl",
          },
          {
            id: "remathistory",
            name: "Remat History",
            path: "/user/reconcillation/userRemateHistory",
          },
          {
            id: "cahistory",
            name: "CA History",
            path: "/user/reconcillation/userCaHistory",
          },
        ],
      },
    ],
  },
  //inward
  {
    id: "process",
    name: "Process",
    icon: "Codepen",
    children: [
      {
        id: "inwardprocessv2",
        name: "Inward Process v2.0",
        children: [
          {
            id: "getallInward",
            name: "Get all Inward",
            path: "/user/process/userAllInward",
          },
          {
            id: "pendingInfoRange",
            name: "Pending Info Range",
            path: "/user/process/pendingInfoRange",
          },
          {
            id: "serachInwardLf",
            name: "Search Inward LF",
            path: "/user/process/userSearchInward",
          },
          {
            id: "kycrequest",
            name: "KYC Inward",
            path: "/user/process/userKycInward",
          },
          {
            id: "dematrequest",
            name: "Demat Inward",
            path: "/user/process/userDemateInward",
          },
          {
            id: "rematrequest",
            name: "Remat Request",
            path: "/user/process/remateInward",
          },
          {
            id: "transferrequest",
            name: "Transfer Inward",
            path: "/user/process/userTransferInward",
          },
          {
            id: "transmissionrequest",
            name: "Transmission Request",
            path: "/user/process/userTransmissionRequest",
          },
          {
            id: "duplicaterequest",
            name: "Duplicate Request",
            path: "/user/process/userDuplicateInward",
          },
          {
            id: "exchangerequest",
            name: "Exchange Request",
            path: "/user/process/userExchangeInward",
          },
          {
            id: "otherinwards",
            name: "Other Inwards",
            path: "/user/process/userOtherInward",
          },
          {
            id: "inwardProcessV1",
            name: "Inward Process v1.0",
            path: "/user/process/userInwardProcessv1",
          },
          {
            id: "outwardProcessV1",
            name: "Outward Process v1.0",
            path: "/user/process/userOutwardv2",
          },
        ],
      },
      {
        id: "outwardprocessv2",
        name: "Outward Process v2.0",
        children: [
          {
            id: "outwardprocess",
            name: "Outward Process V2",
            path: "/user/process/userOutwardv2",
          },
        ],
      },
      {
        id: "processv1",
        name: "Process v1.0",
        children: [
          {
            id: "inwardv1",
            name: "Inward Process v1.0",
            path: "/user/process/userInwardProcessv1",
          },
          {
            id: "outwardv1",
            name: "Outward Process v1.0",
            path: "/user/process/userOutwardv2",
          },
        ],
      },
    ],
  },
  //report
  {
    id: "report",
    name: "Report",
    icon: "Briefcase",
    children: [
      {
        id: "mainboard",
        name: "Main Board",
        children: [
          {
            id: "report73",
            name: "Report 7(3)",
            path: "/user/report/report73",
          },
          {
            id: "report133",
            name: "Report 13(3)",
            path: "/user/report/report133",
          },
          {
            id: "report409",
            name: "Report 40(9)",
            path: "/user/report/report409",
          },
          {
            id: "report745",
            name: "Report 74(5)",
            path: "/user/report/report745",
          },
          {
            id: "report76a",
            name: "Report 76",
            path: "/user/report/report55a",
          },
        ],
      },
    ],
  },
  //register
  {
    id: "physicaldata1",
    name: "Physical Data",
    icon: "Gitlab",
    children: [
      {
        id: "physicaldata",
        name: "Physical Data",
        path: "/user/physical/physicalData",
      },

      {
        id: "iepf1",
        name: "IEPF",
        children: [
          {
            id: "iepf",
            name: "IEPF",
            path: "/user/iepf/userViewSpecificRegister",
          },
        ],
      },
    ],
  },
];

const SidebarItem = ({ item, level = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const hasChildren = Array.isArray(item.children) && item.children.length > 0;

  const IconComponent =
    level === 0 && item.icon && FeatherIcons[item.icon]
      ? FeatherIcons[item.icon]
      : null;

  return (
    <li
      className={`relative text-white`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* MAIN ITEMS */}
      {level === 0 ? (
        <div className="flex items-center justify-center w-20 h-10 mx-auto hover:bg-blue-600 cursor-pointer">
          {IconComponent && <IconComponent size={22} />}
        </div>
      ) : item.path ? (
        <Link
          href={item.path}
          className="flex items-center px-4 py-3 hover:bg-blue-600 cursor-pointer w-full min-w-[220px]"
        >
          <span>{item.name}</span>
          {hasChildren && <Icons.ChevronRight size={14} className="ml-auto" />}
        </Link>
      ) : (
        <div className="flex items-center px-4 py-3 hover:bg-blue-600 cursor-pointer w-full min-w-[220px]">
          <span>{item.name}</span>
          {hasChildren && <Icons.ChevronRight size={14} className="ml-auto" />}
        </div>
      )}

      {/* CHILDREN (only when hovered) */}
      {isHovered && hasChildren && (
        <ul className="absolute left-full top-0 min-w-[220px] bg-[rgb(17,16,29)] shadow-md z-50">
          {item.children.map((child) => (
            <SidebarItem key={child.id} item={child} level={level + 1} />
          ))}
        </ul>
      )}
    </li>
  );
};

const UserSidebar = () => {
  const [openMenus, setOpenMenus] = useState([]);

  const toggleMenu = (id) => {
    setOpenMenus((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  return (
    <>
      {/* Sidebar */}
      <div className="w-20 bg-[rgb(17,16,29)] min-h-screen text-white relative">
        <ul className="space-y-6 pt-10">
          <li>
            <div className="flex justify-center">
              <img
                src="/assets/images/vidatumlatter.png"
                alt="Logo"
                className="w-[50px]"
              />
            </div>
          </li>
          {menus.map((menu) => (
            <SidebarItem key={menu.id} item={menu} />
          ))}
        </ul>
      </div>

      {/* Main Content (placeholder) */}
      {/* <div className="flex-1 p-6 bg-white">
          <h1 className="text-2xl font-semibold">Main Content Goes Here</h1>
        </div> */}
    </>
  );
};

export default UserSidebar;
