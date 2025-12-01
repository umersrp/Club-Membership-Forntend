// import React, { useState, useEffect, useMemo } from "react";
// import Card from "@/components/ui/Card";
// import Button from "@/components/ui/Button";
// import Icon from "@/components/ui/Icon";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import {
//   useTable,
//   useRowSelect,
//   useSortBy,
//   usePagination,
// } from "react-table";
// import GlobalFilter from "@/pages/table/react-tables/GlobalFilter";
// import Logo from "@/assets/images/logo/logo.png";
// import Modal from "@/components/ui/Modal";
// import Tippy from "@tippyjs/react";
// import 'tippy.js/dist/tippy.css';
// import 'tippy.js/themes/light-border.css';
// import defaultImage from "@/assets/images/all-img/widget-bg-5.png";

// const IndeterminateCheckbox = React.forwardRef(({ indeterminate, ...rest }, ref) => {
//   const defaultRef = React.useRef();
//   const resolvedRef = ref || defaultRef;

//   React.useEffect(() => {
//     resolvedRef.current.indeterminate = indeterminate;
//   }, [resolvedRef, indeterminate]);

//   return <input type="checkbox" ref={resolvedRef} {...rest} className="table-checkbox" />;
// });

// const NewClubListing = () => {
//   const navigate = useNavigate();
//   const [records, setRecords] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [pageCount, setPageCount] = useState(0);
//   const [globalFilterValue, setGlobalFilterValue] = useState("");
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [selectedBuildingId, setSelectedBuildingId] = useState(null);
  
//   //  Table Columns
//   const COLUMNS = [
//     {
//       Header: "Sr no",
//       accessor: "id",
//       Cell: ({ row }) => <span>{row.index + 1}</span>,
//     },

//     {
//     Header: "Logo",
//     accessor: "clubLogo",
//     Cell: ({ cell }) => (
//       <img 
//         src={cell.value || defaultImage} 
//         alt="Club" 
//         className="w-12 h-12 rounded object-cover"
//         onError={(e) => {
//           e.target.src = defaultImage; // Fallback if image fails to load
//         }}
//       />
//     ),
//   },
//     { Header: "Club Name", accessor: "clubName" },
//     { Header: "Category", accessor: "clubCategory" },
//     { Header: "Target Gender", accessor: "targetGender" },
//     {
//       Header: "Target Major",
//       accessor: "targetMajor",
//       Cell: ({ cell }) =>
//         Array.isArray(cell.value) && cell.value.length > 0
//           ? cell.value.join(", ")
//           : "-",
//     },
//     {
//       Header: "Target Year",
//       accessor: "targetYear",
//       Cell: ({ cell }) =>
//         Array.isArray(cell.value) && cell.value.length > 0
//           ? cell.value.join(", ")
//           : "-",
//     },
//     {
//       Header: "Proposed Activities",
//       accessor: "proposedActivities",
//       Cell: ({ cell }) =>
//         Array.isArray(cell.value) && cell.value.length > 0
//           ? cell.value.join(", ")
//           : "-",
//     },
//     {
//       Header: "Social Links",
//       accessor: "socialLinks",
//       Cell: ({ cell }) =>
//         Array.isArray(cell.value) && cell.value.length > 0 ? (
//           <a
//             href={cell.value[0]}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-blue-600 underline"
//           >
//             {cell.value[0]}
//           </a>
//         ) : (
//           "-"
//         ),
//     },
//     { Header: "President", accessor: "presidentName" },
//     { Header: "Vice President", accessor: "vicePresidentName" },
//     {
//       Header: "Expected Members",
//       accessor: "expectedMembers",
//       Cell: ({ cell }) => cell.value || "-",
//     },
//     {
//       Header: "Created At",
//       accessor: "createdAt",
//       Cell: ({ cell }) =>
//         cell.value ? new Date(cell.value).toLocaleDateString() : "-",
//     },
//     {
//       Header: "Status",
//       accessor: "status",
//       Cell: ({ cell }) => {
//         const status = cell.value || "Pending";

//         const getColor = (status) => {
//           switch (status) {
//             case "Approved":
//               return "bg-green-100 text-green-700 border border-green-300";
//             case "Rejected":
//               return "bg-red-100 text-red-700 border border-red-300";
//             default:
//               return "bg-yellow-100 text-yellow-700 border border-yellow-300";
//           }
//         };

//         return (
//           <span
//             className={`px-2 py-1 rounded text-sm font-medium ${getColor(status)}`}
//           >
//             {status}
//           </span>
//         );
//       },
//     },
//     {
//       Header: "Actions",
//       accessor: "_id",
//       Cell: ({ cell }) => {
//         // Get user role from localStorage
//         const userRole = localStorage.getItem("user-role");

//         return (
//           <div className="flex space-x-3">
//             {/* View */}
//             <Tippy content="view">
//               <button
//                 onClick={() =>
//                   navigate(`/new-club-form/${cell.value}`, {
//                     state: { mode: "view" },
//                   })
//                 }
//               >
//                 <Icon className="text-green-600" icon="heroicons:eye" />
//               </button>
//             </Tippy>

//             {/* Edit */}
//             <Tippy content="edit">
//               <button
//                 onClick={() =>
//                   navigate(`/new-club-form/${cell.value}`, {
//                     state: { mode: "edit" },
//                   })
//                 }
//               >
//                 <Icon className="text-blue-600" icon="heroicons:pencil-square" />
//               </button>
//             </Tippy>

//             {/* Delete */}
//             <Tippy content="delete">
//               <button onClick={() => confirmDelete(cell.value)}>
//                 <Icon className="text-red-700" icon="heroicons:trash" />
//               </button>
//             </Tippy>

//             {/* Approve - Only show for Admin */}
//             {userRole === "admin" && (
//               <Tippy content="approve">
//                 <button onClick={() => approveClub(cell.value)}>
//                   <Icon className="text-green-700" icon="heroicons:check-circle" />
//                 </button>
//               </Tippy>
//             )}

//             {/* Reject - Only show for Admin */}
//             {userRole === "admin" && (
//               <Tippy content="reject">
//                 <button onClick={() => rejectClub(cell.value)}>
//                   <Icon className="text-red-600" icon="heroicons:x-circle" />
//                 </button>
//               </Tippy>
//             )}
//           </div>
//         );
//       },
//     }

//   ];

//   const columns = useMemo(() => COLUMNS, []);
//   const data = useMemo(() => records, [records]);

//   //  React Table Instance
//   const tableInstance = useTable(
//   {
//     columns,
//     data,
//     initialState: { pageIndex: 0, pageSize: 10 }, // default page size
//   },
//   useSortBy,
//   usePagination,
//   useRowSelect,
//   (hooks) => {
//     hooks.visibleColumns.push((columns) => [
//       {
//         id: "selection",
//         Header: ({ getToggleAllRowsSelectedProps }) => (
//           <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
//         ),
//         Cell: ({ row }) => (
//           <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
//         ),
//       },
//       ...columns,
//     ]);
//   }
// );


//   const {
//     getTableProps,
//     getTableBodyProps,
//     headerGroups,
//     page,
//     prepareRow,
//     nextPage,
//     previousPage,
//     canNextPage,
//     canPreviousPage,
//     pageOptions,
//     gotoPage,
//     state,
//   } = tableInstance;

//   const { pageIndex, pageSize } = state;

//   //  Fetch Data
//   const fetchStationaryRecords = async (search = "") => {
//     setLoading(true);
//     try {
//       const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/club/get`, {
//         headers: { Authorization: `${localStorage.getItem("token")}` },
//         params: { page: pageIndex + 1, limit: pageSize, search },
//       });

//       const data = res.data?.data?.records || res.data?.data || [];
//       const pagination = res.data?.data?.pagination || {};

//       setRecords(data);
//       setPageCount(pagination.totalPages || 1);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   //  UseEffect for Fetching
//   useEffect(() => {
//     const delay = setTimeout(() => {
//       fetchStationaryRecords(globalFilterValue);
//     }, 400);
//     return () => clearTimeout(delay);
//   }, [globalFilterValue, pageIndex, pageSize]);

//   //  Delete Function
//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`${process.env.REACT_APP_BASE_URL}/club/${id}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       });
//       toast.success("Record deleted successfully");
//       fetchStationaryRecords();
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to delete record");
//     }
//   };

//   const confirmDelete = (id) => {
//     setSelectedBuildingId(id);
//     setDeleteModalOpen(true);
//   };

//   const approveClub = async (id) => {
//     setLoading(true);

//     try {

//       const token = localStorage.getItem("token");

//       const res = await axios.put(
//         `${process.env.REACT_APP_BASE_URL}/club/${id}`,
//         { status: "Approved" },
//         { headers: { Authorization: `${localStorage.getItem("token")}` } }
//       );

//       toast.success("Club approved successfully");
//     } catch (err) {
//       console.error(err.response?.data?.message || "Error approving club");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const rejectClub = async (id) => {
//     const reason = prompt("Enter rejection reason:");
//     if (!reason) {
//       toast.error("Rejection reason is required");
//       return;
//     }
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.put(
//         `${process.env.REACT_APP_BASE_URL}/club/${id}`,
//         {
//           status: "Rejected",
//           rejectionReason: reason,
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       toast.success("Club rejected successfully");
//       fetchData();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Error rejecting club");
//     }
//   };


import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Modal from "@/components/ui/Modal";
import GlobalFilter from "@/pages/table/react-tables/GlobalFilter";
import Tippy from "@tippyjs/react";
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light-border.css';
import defaultImage from "@/assets/images/all-img/widget-bg-5.png";
import Logo from "@/assets/images/logo/logo.png";
import { 
  useTable, 
  useSortBy, 
  usePagination, 
  useRowSelect 
} from "react-table";

const IndeterminateCheckbox = React.forwardRef(({ indeterminate, ...rest }, ref) => {
  const defaultRef = React.useRef();
  const resolvedRef = ref || defaultRef;

  React.useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);

  return <input type="checkbox" ref={resolvedRef} {...rest} className="table-checkbox" />;
});

const NewClubListing = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedBuildingId, setSelectedBuildingId] = useState(null);

  // Table Columns
  const COLUMNS = useMemo(() => [
    { Header: "Sr no", accessor: "id", Cell: ({ row }) => row.index + 1 },
    { 
      Header: "Logo", 
      accessor: "clubLogo", 
      Cell: ({ cell }) => (
        <img 
          src={cell.value || defaultImage} 
          alt="Club" 
          className="w-12 h-12 rounded object-cover" 
          onError={(e) => { e.target.src = defaultImage }} 
        />
      )
    },
    { Header: "Club Name", accessor: "clubName" },
    { Header: "Category", accessor: "clubCategory" },
    { Header: "Target Gender", accessor: "targetGender" },
    { 
      Header: "Target Major", 
      accessor: "targetMajor", 
      Cell: ({ cell }) => Array.isArray(cell.value) && cell.value.length ? cell.value.join(", ") : "-"
    },
    { 
      Header: "Target Year", 
      accessor: "targetYear", 
      Cell: ({ cell }) => Array.isArray(cell.value) && cell.value.length ? cell.value.join(", ") : "-"
    },
    { Header: "Proposed Activities", accessor: "proposedActivities", 
      Cell: ({ cell }) => Array.isArray(cell.value) && cell.value.length ? cell.value.join(", ") : "-" 
    },
    { 
      Header: "Social Links", 
      accessor: "socialLinks", 
      Cell: ({ cell }) => Array.isArray(cell.value) && cell.value.length 
        ? <a href={cell.value[0]} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{cell.value[0]}</a> 
        : "-"
    },
    { Header: "President", accessor: "presidentName" },
    { Header: "Vice President", accessor: "vicePresidentName" },
    { Header: "Expected Members", accessor: "expectedMembers", Cell: ({ cell }) => cell.value || "-" },
    { Header: "Created At", accessor: "createdAt", Cell: ({ cell }) => cell.value ? new Date(cell.value).toLocaleDateString() : "-" },
    { 
      Header: "Status", 
      accessor: "status", 
      Cell: ({ cell }) => {
        const status = cell.value || "Pending";
        const getColor = (status) => {
          switch(status) {
            case "Approved": return "bg-green-100 text-green-700 border border-green-300";
            case "Rejected": return "bg-red-100 text-red-700 border border-red-300";
            default: return "bg-yellow-100 text-yellow-700 border border-yellow-300";
          }
        };
        return <span className={`px-2 py-1 rounded text-sm font-medium ${getColor(status)}`}>{status}</span>
      } 
    },
    {
      Header: "Actions",
      accessor: "_id",
      Cell: ({ cell }) => {
        const userRole = localStorage.getItem("user-role");
        return (
          <div className="flex space-x-3">
            <Tippy content="view">
              <button onClick={() => navigate(`/new-club-form/${cell.value}`, { state: { mode: "view" } })}>
                <Icon className="text-green-600" icon="heroicons:eye" />
              </button>
            </Tippy>
            <Tippy content="edit">
              <button onClick={() => navigate(`/new-club-form/${cell.value}`, { state: { mode: "edit" } })}>
                <Icon className="text-blue-600" icon="heroicons:pencil-square" />
              </button>
            </Tippy>
            <Tippy content="delete">
              <button onClick={() => confirmDelete(cell.value)}>
                <Icon className="text-red-700" icon="heroicons:trash" />
              </button>
            </Tippy>
            {userRole === "admin" && (
              <>
                <Tippy content="approve">
                  <button onClick={() => approveClub(cell.value)}>
                    <Icon className="text-green-700" icon="heroicons:check-circle" />
                  </button>
                </Tippy>
                <Tippy content="reject">
                  <button onClick={() => rejectClub(cell.value)}>
                    <Icon className="text-red-600" icon="heroicons:x-circle" />
                  </button>
                </Tippy>
              </>
            )}
          </div>
        )
      }
    }
  ], []);

  const data = useMemo(() => records, [records]);

  // React Table instance with built-in pagination
  const tableInstance = useTable(
    { columns: COLUMNS, data, initialState: { pageIndex: 0, pageSize: 10 } },
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: "selection",
          Header: ({ getToggleAllRowsSelectedProps }) => <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />,
          Cell: ({ row }) => <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />,
        },
        ...columns,
      ])
    }
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    gotoPage,
    state: { pageIndex, pageSize },
    setPageSize,
  } = tableInstance;

  // Fetch all data once
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/club/get`, {
          headers: { Authorization: `${localStorage.getItem("token")}` },
        });
        setRecords(res.data?.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Delete Function
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}/club/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setRecords(records.filter(r => r._id !== id));
      toast.success("Record deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete record");
    }
  };

  const confirmDelete = (id) => {
    setSelectedBuildingId(id);
    setDeleteModalOpen(true);
  };

  const approveClub = async (id) => {
    setLoading(true);
    try {
      await axios.put(
        `${process.env.REACT_APP_BASE_URL}/club/${id}`,
        { status: "Approved" },
        { headers: { Authorization: `${localStorage.getItem("token")}` } }
      );
      toast.success("Club approved successfully");
      setRecords(records.map(r => r._id === id ? { ...r, status: "Approved" } : r));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const rejectClub = async (id) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) {
      toast.error("Rejection reason is required");
      return;
    }
    try {
      await axios.put(
        `${process.env.REACT_APP_BASE_URL}/club/${id}`,
        { status: "Rejected", rejectionReason: reason },
        { headers: { Authorization: `${localStorage.getItem("token")}` } }
      );
      toast.success("Club rejected successfully");
      setRecords(records.map(r => r._id === id ? { ...r, status: "Rejected" } : r));
    } catch (err) {
      toast.error("Error rejecting club");
    }
  };

  //  UI Render
  return (
    <>
      <Card noborder>
        <div className="md:flex pb-6 items-center">
          <h6 className="flex-1 md:mb-0">Club Records</h6>
          <div className="md:flex md:space-x-3 items-center flex-none rtl:space-x-reverse">
            <GlobalFilter filter={globalFilterValue} setFilter={setGlobalFilterValue} />
            <Button
              icon="heroicons-outline:plus-sm"
              text="Add Club"
              className="btn font-normal btn-sm bg-gradient-to-r from-[#18BB90] to-[#0C6B47] text-white border-0 hover:opacity-90"
              iconClass="text-lg"
              onClick={() => navigate("/new-club-form/add")}
            />
          </div>
        </div>

          {/* Table */}
        <div className="overflow-x-auto -mx-6">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <img src={Logo} alt="Loading..." className="w-52 h-24" />
                </div>
              ) : (
                <table {...getTableProps()} className="min-w-full divide-y divide-slate-100 table-fixed">
                  <thead className="bg-gradient-to-r from-[#18BB90] to-[#0C6B47]">
                    {headerGroups.map((headerGroup) => (
                      <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                          <th {...column.getHeaderProps(column.getSortByToggleProps())} className="table-th text-white">
                            {column.render("Header")}
                            <span>{column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}</span>
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody {...getTableBodyProps()}>
                    {page.length === 0 ? (
                      <tr>
                        <td colSpan={COLUMNS.length + 1} className="text-center py-4">No data available.</td>
                      </tr>
                    ) : (
                      page.map((row) => {
                        prepareRow(row);
                        return (
                          <tr {...row.getRowProps()} className="even:bg-gray-50">
                            {row.cells.map((cell) => (
                              <td {...cell.getCellProps()} className="px-6 py-4 whitespace-nowrap">
                                {cell.render("Cell")}
                              </td>
                            ))}
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <div>Page {pageIndex + 1} of {pageOptions.length}</div>
           <div className="flex items-center space-x-2">
            <button onClick={previousPage} disabled={!canPreviousPage} className="px-2 py-1 border rounded disabled:opacity-50">Prev</button>
            <button onClick={nextPage} disabled={!canNextPage} className="px-2 py-1 border rounded disabled:opacity-50 bg-primary-600 text-white">Next</button>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="border p-1 rounded"
            >
              {[5, 10, 25, 50].map((size) => (
                <option key={size} value={size}>
                  Show {size}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/*  Delete Modal */}
      <Modal
        activeModal={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Delete"
        themeClass="bg-gradient-to-r from-[#18BB90] to-[#0C6B47]"
        centered
        footerContent={
          <>
            <Button
              text="Cancel"
              className="btn-light"
              onClick={() => setDeleteModalOpen(false)}
            />
            <Button
              text="Delete"
              className="btn-danger"
              onClick={async () => {
                await handleDelete(selectedBuildingId);
                setDeleteModalOpen(false);
              }}
            />
          </>
        }
      >
        <p className="text-gray-700 text-center">
          Are you sure you want to delete this club? This action cannot be undone.
        </p>
      </Modal>
    </>
  );
};

export default NewClubListing;


