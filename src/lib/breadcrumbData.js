export const menus = [
  {
    id: "dashboard",
    name: "Dashboard",
    icon: "Home",
    children: [
      {
        id: "dashboardData",
        name: "Dashboard",
        path: "/admin/dashboard",
      },
    ],
  },
  {
    id: "isin",
    name: "ISIN",
    icon: "Users",
    children: [
      {
        id: "isinlist",
        name: "ISIN List",
        children: [
          {
            id: "viewIsinReportData",
            name: "All ISINs",
            path: "/admin/viewIsinReportData",
          },
          {
            id: "privateisin",
            name: "Private ISIN",
            path: "/admin/privateIsin",
          },
          {
            id: "unlistedisin",
            name: "Unlisted ISIN",
            path: "/admin/unlistedIsin",
          },
          {
            id: "listedisin",
            name: "Listed ISIN",
            path: "/admin/listedIsin",
          },
        ],
      },
      // {
      //   id: "isinanalytics",
      //   name: "ISIN Analytics",
      //   path: "/admin/isinAnalytics",
      // },
      // {
      //   id: "isinfileformats",
      //   name: "ISIN File Formats",
      //   path: "/admin/isinFileFormat",
      // },
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
            path: "/admin/benpose/weekly/allBenpose",
          },
          {
            id: "cdslupload",
            name: "CDSL Upload",
            path: "/admin/benpose/weekly/cdslBenposeUplaod",
          },
          {
            id: "nsdlupload",
            name: "NSDL Upload",
            path: "/admin/benpose/weekly/nsdlBenposeUpload",
          },
          {
            id: "benposerecords",
            name: "Berpose Records",
            path: "/admin/benpose/weekly/downloadBenpose",
          },
          {
            id: " Preferentialshareallotnment",
            name: "Preferential Share Allotnment",
            path: "/admin/benpose/weekly/checkPreAllotmentHolding",
          },
        ],
      },
      {
        id: "blockedbenpose",
        name: "Blocked Benpose",
        children: [
          {
            id: "cdslupload",
            name: "CDSL Upload",
            path: "/admin/benpose/block/cdslBlockBenposeUplaod",
          },
          {
            id: "nsdlupload",
            name: "NSDL Upload",
            path: "/admin/benpose/block/nsdlBlockBenposeUpload",
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
            path: "/admin/benpose/special/allspecialBenpose",
          },
          {
            id: "cdslupload",
            name: "CDSL Upload",
            path: "/admin/benpose/special/cdslSpecialBenposeUplaod",
          },
          {
            id: "nsdlupload",
            name: "NSDL Upload",
            path: "/admin/benpose/special/nsdlSpecialBenposeUplaod",
          },
          {
            id: "benposerecord",
            name: "Benpose Records",
            path: "/admin/benpose/special/downloadBenpose",
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
        id: "datewise",
        name: "Get Date Wise Reconciliation",
        path: "/admin/reconciliation/viewRecoDatewise",
      },
      {
        id: "idt",
        name: "IDT History",
        path: "/admin/reconciliation/idtList",
      },
      // {
      //   id: "idtanlytics",
      //   name: "IDT Analytics",
      //   path: "/admin/reconciliation/idtAnalytics",
      // },

      {
        id: "dematlogupload",
        name: "Demat Log Upload CDSL & NSDL",
        path: "/admin/reconciliation/uploadDemateLogs",
      },
      // {
      //   id: "viewdematlog",
      //   name: "View Demat Log",
      //   path: "/admin/app/admin/actionHistory/get-demat-log",
      // },
      {
        id: "demathistorycdsl",
        name: "Demat History CDSL",
        path: "/admin/reconciliation/cdslDematHistory",
      },
      {
        id: "demathistorynsdl",
        name: "Demat History NSDL",
        path: "/admin/reconciliation/nsdlDematHistory",
      },
      {
        id: "remathistorymain",
        name: "Remat History",
        children: [
          {
            id: "remathistory",
            name: "Remat History",
            path: "/admin/reconciliation/rematHistory",
          },
          {
            id: "cdslremathistory",
            name: "CDSL Remat History",
            path: "/admin/reconciliation/cdslRematHistory",
          },
          {
            id: "nsdlremathistory",
            name: "NSDL Remat History",
            path: "/admin/reconciliation/nsdlRematHistory",
          },
        ],
      },

      {
        id: "cahistorymain",
        name: "CA History",
        children: [
          {
            id: "cahistory",
            name: "CA History",
            path: "/admin/reconciliation/corporateList",
          },
          {
            id: "cacdslhistory",
            name: "CA CDSL History",
            path: "/admin/reconciliation/caCdslHistory",
          },
          {
            id: "cansdlhistory",
            name: "CA NDSL History",
            path: "/admin/reconciliation/caNsdlHistory",
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
        name: "Inward Process ",
        children: [
          {
            id: "searchinward",
            name: "Search Inward",
            path: "/admin/inward/serachInward",
          },
          {
            id: "alldatewise",
            name: "All Inward Datewise",
            path: "/admin/inward/inwardDateWise",
          },
          // {
          //   id: "escrowList",
          //   name: "Ascros List",
          //   path: "/admin/inward/ascrosList",
          // },
          // {
          //   id: "dematfile",
          //   name: "Demat File",
          //   path: "/admin/inward/addDematFile",
          // },
          {
            id: "kycrequest",
            name: "KYC Request",
            path: "/admin/inward/kycInwardProcess",
          },
          {
            id: "dematrequest",
            name: "Demat Request",
            path: "/admin/inward/demateInwardProcess",
          },
          {
            id: "rematrequest",
            name: "Remat Request",
            path: "/admin/inward/remateInwardProcess",
          },
          {
            id: "transferrequest",
            name: "Transfer Request",
            path: "/admin/inward/transferInward",
          },
          {
            id: "transmissionrequest",
            name: "Transmission Request",
            path: "/admin/inward/transmissionInward",
          },
          {
            id: "duplicaterequest",
            name: "Duplicate Request",
            path: "/admin/inward/duplicateShareCertificate",
          },
          {
            id: "exchangerequest",
            name: "Exchange Request",
            path: "/admin/inward/exchangeInwardProcess",
          },
          {
            id: "otherinwards",
            name: "Other Inwards",
            path: "/admin/inward/otherInwardProcess",
          },
          // {
          //   id: "inwardfileformat",
          //   name: "Inward File Format",
          //   path: "/admin/inward/inwardFileFormate",
          // },
          // {
          //   id: "inwardanalytics",
          //   name: "Inward Analytics",
          //   path: "/admin/inward/inwardAnalytics",
          // },
        ],
      },
      {
        id: "outwardprocessv2",
        name: "Outward Process ",
        children: [
          // {
          //   id: "outwardprocess",
          //   name: "Outward Process",
          //   path: "/admin/outward/outwardProcess",
          // },
          {
            id: "outwardprocessv2",
            name: "Outward Process",
            path: "/admin/outward/outwardProcess",
          },
          // {
          //   id: "outwardanalytics",
          //   name: "Outward Analytics",
          //   path: "/admin/outward/outwardAnalytics",
          // },
          // {
          //   id: "outwardfileformat",
          //   name: "Outward File Format",
          //   path: "/admin/outward/outwardFileFormate",
          // },
        ],
      },
      // {
      //   id: "processv1",
      //   name: "Process v1.0",
      //   children: [
      //     {
      //       id: "inwardv1",
      //       name: "Inward Process v1.0",
      //       path: "/admin/processv1/inwardProcessv1",
      //     },
      //     {
      //       id: "outwardv1",
      //       name: "Outward Process v1.0",
      //       path: "/admin/processv1/outwardProcessv1",
      //     },
      //   ],
      // },
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
            path: "/admin/report/report73",
          },
          {
            id: "report133",
            name: "Report 13(3)",
            path: "/admin/report/report133",
          },
          {
            id: "report409",
            name: "Report 40(9)",
            path: "/admin/report/report409",
          },
          {
            id: "report745",
            name: "Report 74(5)",
            path: "/admin/report/report745",
          },
          {
            id: "report76a",
            name: "Report 76",
            path: "/admin/report/report55a",
          },
          {
            id: "reportfileformat",
            name: "Report File Format",
            path: "/admin/report/mainReportFileFormate",
          },
        ],
      },
      {
        id: "publiclimited",
        name: "Public Limited",
        children: [
          {
            id: "report55u",
            name: "Report 55u",
            path: "/admin/report/report55u",
          },
          {
            id: "report76",
            name: "Report 76",
            path: "/admin/report/report76",
          },
          {
            id: "reportfileformat2",
            name: "Report File Format",
            path: "/admin/report/mainReportFileFormate",
          },
        ],
      },
    ],
  },
  //register
  {
    id: "physicaldata",
    name: "Physical Data",
    icon: "Gitlab",
    children: [
      {
        id: "listedisin",
        name: "Listed ISIN",
        path: "/admin/register/cIsinList",
        children: [
          // {
          //   id: "corporatelist1",
          //   name: "Corporate List 1",
          //   path: "/admin/register/listedIsinRegister",
          // },
          // {
          //   id: "cisin",
          //   name: "C_ISINs List",
          //   path: "/admin/register/cIsinList",
          // },
          // {
          //   id: "cregister",
          //   name: "C_Register List",
          //   path: "/admin/register/cRegister",
          // },
          // {
          //   id: "fileformat1",
          //   name: "Physical Data File Format",
          //   path: "/admin/register/registerFileFormat",
          // },
        ],
      },
      // {
      //   id: "unlistedisin",
      //   name: "Unlisted ISIN",
      //   children: [
      //     {
      //       id: "corporatelist2",
      //       name: "Corporate List",
      //       path: "/admin/register/unlistedIsinRegister",
      //     },

      //     {
      //       id: "fileformat2",
      //       name: "Physical Data File Format",
      //       path: "/admin/register/registerFileFormat",
      //     },
      //   ],
      // },
      // {
      //   id: "privateisin",
      //   name: "Private ISIN",
      //   children: [
      //     {
      //       id: "corporatelist3",
      //       name: "Corporate List",
      //       path: "/admin/register/privateIsinRegister",
      //     },

      //     {
      //       id: "fileformat3",
      //       name: "Physical Data File Format",
      //       path: "/admin/register/registerFileFormat",
      //     },
      //   ],
      // },
      {
        id: "iepf",
        name: "IEPF",
        children: [
          {
            id: "iepfrecords",
            name: "IEPF Records",
            path: "/admin/Iepf/IepfRecord",
          },
          {
            id: "iepfFileFormat",
            name: "IEPF File Format",
            path: "/admin/Iepf/iepfFileFormat",
          },
        ],
      },
      {
        id: "register",
        name: "Register",
        path: "/admin/register/uploadRegisterFile",
      },
      {
        id: "registershare",
        name: "Register Share",
        path: "/admin/register/uploadRegisterShare",
      },
    ],
  },
  //user
  {
    id: "users",
    name: "Users",
    icon: "Grid",
    children: [
      { id: "userlist", name: "User List", path: "/admin/users/userList" },
    ],
  },
  // {
  //   id: "admin",
  //   name: "Admin",
  //   icon: "Activity",
  //   children: [
  //     {
  //       id: "adminanalytics",
  //       name: "Admin Analytics",
  //       path: "/admin/adminAnalytics/adminReport",
  //     },
  //   ],
  // },
  //depository
  {
    id: "depository",
    name: "Depository",
    icon: "Box",
    children: [
      {
        id: "depositorylist",
        name: "Depository List",
        path: "/admin/depository/depositoryList",
      },
      {
        id: "sebidata",
        name: "SEBI List",
        path: "/admin/reconciliation/sebiList",
      },
    ],
  },
];
