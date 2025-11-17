// import React, { useState, useEffect, useMemo } from "react";
// import Card from "@/components/ui/Card";
// import Button from "@/components/ui/Button";
// import Icon from "@/components/ui/Icon";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import Tippy from "@tippyjs/react";
// import {
//   useTable,
//   useRowSelect,
//   useSortBy,
//   usePagination,
// } from "react-table";
// import GlobalFilter from "@/pages/table/react-tables/GlobalFilter";
// import Logo from "@/assets/images/logo/logo.png";
// import Modal from "@/components/ui/Modal";

// const IndeterminateCheckbox = React.forwardRef(({ indeterminate, ...rest }, ref) => {
//   const defaultRef = React.useRef();
//   const resolvedRef = ref || defaultRef;

//   React.useEffect(() => {
//     resolvedRef.current.indeterminate = indeterminate;
//   }, [resolvedRef, indeterminate]);

//   return <input type="checkbox" ref={resolvedRef} {...rest} className="table-checkbox" />;
// });

// const ClubRequestListing = () => {
//   const navigate = useNavigate();
//   const [records, setRecords] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [pageCount, setPageCount] = useState(0);
//   const [globalFilterValue, setGlobalFilterValue] = useState("");
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [selectedRequestId, setSelectedRequestId] = useState(null);

//   //  Table Columns
//   const COLUMNS = [
//     {
//       Header: "Sr no",
//       accessor: "id",
//       Cell: ({ row }) => <span>{row.index + 1}</span>,
//     },
//     { Header: "Student Name", accessor: "userName" },
//     { Header: "Club Name", accessor: "clubName" },
//     { Header: "Motivation", accessor: "motivation" },
//     { Header: "Skills", accessor: "skills" },
//     { Header: "Experience", accessor: "previousExperience" },
//     { Header: "Availability", accessor: "availability" },
//     { Header: "Contribution", accessor: "contribution" },
//     {
//       Header: "Custom Questions",
//       accessor: "customQuestions",
//       Cell: ({ cell }) => cell.value || "-",
//     },
//     {
//       Header: "Actions",
//       accessor: "_id",
//       Cell: ({ cell }) => (
//         <div className="flex space-x-3 rtl:space-x-reverse">
//           <Button
//             text="Accept"
//             className="btn-sm bg-green-500 text-white"
//             onClick={() => handleAccept(cell.value)}
//           />
//           <Button
//             text="Reject"
//             className="btn-sm bg-red-500 text-white"
//             onClick={() => handleReject(cell.value)}
//           />
//         </div>
//       ),
//     },
//   ];

//   const columns = useMemo(() => COLUMNS, []);
//   const data = useMemo(() => records, [records]);

//   const tableInstance = useTable(
//     {
//       columns,
//       data,
//       manualPagination: true,
//       pageCount,
//       initialState: { pageIndex: 0, pageSize: 10 },
//     },
//     useSortBy,
//     usePagination,
//     useRowSelect,
//     (hooks) => {
//       hooks.visibleColumns.push((columns) => [
//         {
//           id: "selection",
//           Header: ({ getToggleAllRowsSelectedProps }) => (
//             <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
//           ),
//           Cell: ({ row }) => (
//             <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
//           ),
//         },
//         ...columns,
//       ]);
//     }
//   );

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

//   //  Fetch Requests
//   const fetchJoinRequests = async (search = "") => {
//     setLoading(true);
//     try {
//       const res = await axios.get(
//         `${process.env.REACT_APP_BASE_URL}/Joining-requests/all`,
//         {
//           headers: { Authorization: `${localStorage.getItem("token")}` },
//           params: { page: pageIndex + 1, limit: pageSize, search },
//         }
//       );

//       const data = res.data?.data?.records || res.data?.data || [];
//       const pagination = res.data?.data?.pagination || {};

//       setRecords(data);
//       setPageCount(pagination.totalPages || 1);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to fetch requests");
//     } finally {
//       setLoading(false);
//     }
//   };

//   //  UseEffect for Fetching
//   useEffect(() => {
//     const delay = setTimeout(() => {
//       fetchJoinRequests(globalFilterValue);
//     }, 400);
//     return () => clearTimeout(delay);
//   }, [globalFilterValue, pageIndex, pageSize]);

// // Accept Request
// const handleAccept = async (id) => {
//   try {
//     await axios.put(
//       `${process.env.REACT_APP_BASE_URL}/Joining-requests/${id}`,
//       { status: "approved" }, // backend expects this
//       {
//         headers: {
//           Authorization: `${localStorage.getItem("token")}`,
//         },
//       }
//     );
//     toast.success("Request approved successfully");
//     fetchJoinRequests(); // refresh list after update
//   } catch (err) {
//     console.error(err);
//     toast.error("Failed to approve request");
//   }
// };

// // Reject Request
// const handleReject = async (id) => {
//   try {
//     await axios.put(
//       `${process.env.REACT_APP_BASE_URL}/Joining-requests/${id}`,
//       { status: "rejected" }, // backend expects this
//       {
//         headers: {
//           Authorization: `${localStorage.getItem("token")}`,
//         },
//       }
//     );
//     toast.success("Request rejected successfully");
//     fetchJoinRequests();
//   } catch (err) {
//     console.error(err);
//     toast.error("Failed to reject request");
//   }
// };


//   //  UI Render
//   return (
//     <>
//       <Card noborder>
//         <div className="md:flex pb-6 items-center">
//           <h6 className="flex-1 md:mb-0">Club Joining Requests</h6>
//           <div className="md:flex md:space-x-3 items-center flex-none rtl:space-x-reverse">
//             <GlobalFilter
//               filter={globalFilterValue}
//               setFilter={setGlobalFilterValue}
//             />
//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto -mx-6">
//           <div className="inline-block min-w-full align-middle">
//             <div className="overflow-hidden">
//               {loading ? (
//                 <div className="flex justify-center items-center py-8">
//                   <img src={Logo} alt="Loading..." className="w-52 h-24" />
//                 </div>
//               ) : (
//                 <table
//                   className="min-w-full divide-y divide-slate-100 table-fixed"
//                   {...getTableProps()}
//                 >
//                   <thead className="bg-gradient-to-r from-[#18BB90] to-[#0C6B47]">
//                     {headerGroups.map((headerGroup, index) => (
//                       <tr {...headerGroup.getHeaderGroupProps()} key={index}>
//                         {headerGroup.headers.map((column) => (
//                           <th
//                             {...column.getHeaderProps(column.getSortByToggleProps())}
//                             className="table-th text-white"
//                             key={column.id}
//                           >
//                             {column.render("Header")}
//                             <span>
//                               {column.isSorted
//                                 ? column.isSortedDesc
//                                   ? " 🔽"
//                                   : " 🔼"
//                                 : ""}
//                             </span>
//                           </th>
//                         ))}
//                       </tr>
//                     ))}
//                   </thead>
//                   <tbody {...getTableBodyProps()}>
//                     {page.length === 0 ? (
//                       <tr>
//                         <td
//                           colSpan={columns.length + 1}
//                           className="text-center py-4"
//                         >
//                           No requests available.
//                         </td>
//                       </tr>
//                     ) : (
//                       page.map((row) => {
//                         prepareRow(row);
//                         return (
//                           <tr {...row.getRowProps()} className="even:bg-gray-50">
//                             {row.cells.map((cell) => (
//                               <td
//                                 {...cell.getCellProps()}
//                                 className="px-6 py-4 whitespace-nowrap"
//                               >
//                                 {cell.render("Cell")}
//                               </td>
//                             ))}
//                           </tr>
//                         );
//                       })
//                     )}
//                   </tbody>
//                 </table>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Pagination */}
//         <div className="md:flex md:space-y-0 space-y-5 justify-between mt-6 items-center">
//           <div className="flex items-center space-x-3 rtl:space-x-reverse">
//             <span className="text-sm font-medium text-slate-600">
//               Page <span>{pageIndex + 1} of {pageCount}</span>
//             </span>
//           </div>

//           <ul className="flex items-center space-x-3 rtl:space-x-reverse">
//             <li>
//               <button
//                 onClick={() => gotoPage(0)}
//                 disabled={!canPreviousPage}
//                 className={`${!canPreviousPage ? "opacity-50 cursor-not-allowed" : ""}`}
//               >
//                 <Icon icon="heroicons:chevron-double-left-solid" />
//               </button>
//             </li>
//             <li>
//               <button
//                 onClick={() => previousPage()}
//                 disabled={!canPreviousPage}
//                 className={`${!canPreviousPage ? "opacity-50 cursor-not-allowed" : ""}`}
//               >
//                 Prev
//               </button>
//             </li>

//             {pageOptions.map((pageNum, idx) => (
//               <li key={idx}>
//                 <button
//                   className={`${
//                     idx === pageIndex
//                       ? "bg-slate-900 text-white font-medium"
//                       : "bg-slate-100 text-slate-900 font-normal"
//                   } text-sm rounded h-6 w-6 flex items-center justify-center`}
//                   onClick={() => gotoPage(idx)}
//                 >
//                   {pageNum + 1}
//                 </button>
//               </li>
//             ))}

//             <li>
//               <button
//                 onClick={() => nextPage()}
//                 disabled={!canNextPage}
//                 className={`${!canNextPage ? "opacity-50 cursor-not-allowed" : ""}`}
//               >
//                 Next
//               </button>
//             </li>
//             <li>
//               <button
//                 onClick={() => gotoPage(pageCount - 1)}
//                 disabled={!canNextPage}
//                 className={`${!canNextPage ? "opacity-50 cursor-not-allowed" : ""}`}
//               >
//                 <Icon icon="heroicons:chevron-double-right-solid" />
//               </button>
//             </li>
//           </ul>

//           <div className="flex items-center space-x-3">
//             <span className="text-sm font-medium text-slate-600">Show</span>
//             <select
//               value={pageSize}
//               onChange={(e) => tableInstance.setPageSize(Number(e.target.value))}
//               className="form-select py-2"
//             >
//               {[10, 20, 30, 50].map((size) => (
//                 <option key={size} value={size}>
//                   {size}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </Card>
//     </>
//   );
// };

// export default ClubRequestListing;
import React, { useState, useEffect, useMemo } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  useTable,
  useRowSelect,
  useSortBy,
  usePagination,
} from "react-table";
import GlobalFilter from "@/pages/table/react-tables/GlobalFilter";
import Logo from "@/assets/images/logo/logo.png";

//  Checkbox Component
const IndeterminateCheckbox = React.forwardRef(({ indeterminate, ...rest }, ref) => {
  const defaultRef = React.useRef();
  const resolvedRef = ref || defaultRef;

  React.useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);

  return <input type="checkbox" ref={resolvedRef} {...rest} className="table-checkbox" />;
});

const ClubRequestListing = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  //  Columns to show only student + club details
  const COLUMNS = [
    {
      Header: "Sr No",
      accessor: "id",
      Cell: ({ row }) => <span>{row.index + 1}</span>,
    },
    { Header: "Student Name", accessor: "studentName" },
    { Header: "Student ID", accessor: "studentId" },
    { Header: "Club Name", accessor: "clubName" },
    { Header: "Club Category", accessor: "clubCategory" },
    { Header: "Motivation", accessor: "motivation" },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ value }) => (
        <span
          className={`capitalize px-2 py-1 rounded text-xs font-medium ${
            value === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : value === "approved"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      Header: "Actions",
      accessor: "_id",
      Cell: ({ cell, row }) => (
        <div className="flex space-x-2">
          {row.original.status === "pending" ? (
            <>
              <Button
                text="Accept"
                className="btn-sm bg-green-500 text-white"
                onClick={() => handleAccept(cell.value)}
              />
              <Button
                text="Reject"
                className="btn-sm bg-red-500 text-white"
                onClick={() => handleReject(cell.value)}
              />
            </>
          ) : (
            <span className="text-gray-500 italic">Action Taken</span>
          )}
        </div>
      ),
    },
  ];

  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => records, [records]);

  const tableInstance = useTable(
    {
      columns,
      data,
      manualPagination: true,
      pageCount,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: "selection",
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
          ),
          Cell: ({ row }) => (
            <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
          ),
        },
        ...columns,
      ]);
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
    state,
  } = tableInstance;

  const { pageIndex, pageSize } = state;

  //  Fetch Requests
  const fetchJoinRequests = async (search = "") => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/Joining-requests/all`,
        {
          headers: { Authorization: `${localStorage.getItem("token")}` },
          params: { page: pageIndex + 1, limit: pageSize, search },
        }
      );

      const rawData = res.data?.data || [];

      //  Map only required fields (student + club)
      const mapped = rawData.map((item) => ({
        _id: item._id,
        studentName: item.userId?.name || "—",
        studentId: item.userId?.studentId || "—",
        clubName: item.clubId?.clubName || "—",
        clubCategory: item.clubId?.clubCategory || "—",
        motivation: item.motivation || "—",
        status: item.status || "pending",
      }));

      setRecords(mapped);
      setPageCount(1); // You can adjust this if backend sends pagination info
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  //  UseEffect for Fetching
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchJoinRequests(globalFilterValue);
    }, 400);
    return () => clearTimeout(delay);
  }, [globalFilterValue, pageIndex, pageSize]);

  //  Accept Request
  const handleAccept = async (id) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BASE_URL}/Joining-requests/${id}`,
        { status: "approved" },
        { headers: { Authorization: `${localStorage.getItem("token")}` } }
      );
      toast.success("Request approved successfully");
      fetchJoinRequests();
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve request");
    }
  };

  //  Reject Request
  const handleReject = async (id) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BASE_URL}/Joining-requests/${id}`,
        { status: "rejected" },
        { headers: { Authorization: `${localStorage.getItem("token")}` } }
      );
      toast.success("Request rejected successfully");
      fetchJoinRequests();
    } catch (err) {
      console.error(err);
      toast.error("Failed to reject request");
    }
  };

  //  UI Render
  return (
    <Card noborder>
      <div className="md:flex pb-6 items-center">
        <h6 className="flex-1 md:mb-0">Club Joining Requests</h6>
        <div className="md:flex md:space-x-3 items-center flex-none rtl:space-x-reverse">
          <GlobalFilter
            filter={globalFilterValue}
            setFilter={setGlobalFilterValue}
          />
        </div>
      </div>

      <div className="overflow-x-auto -mx-6">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <img src={Logo} alt="Loading..." className="w-52 h-24" />
              </div>
            ) : (
              <table
                className="min-w-full divide-y divide-slate-100 table-fixed"
                {...getTableProps()}
              >
                <thead className="bg-gradient-to-r from-[#18BB90] to-[#0C6B47]">
                  {headerGroups.map((headerGroup, index) => (
                    <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps(column.getSortByToggleProps())}
                          className="table-th text-white"
                          key={column.id}
                        >
                          {column.render("Header")}
                          <span>
                            {column.isSorted
                              ? column.isSortedDesc
                                ? " 🔽"
                                : " 🔼"
                              : ""}
                          </span>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                  {page.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length + 1} className="text-center py-4">
                        No requests available.
                      </td>
                    </tr>
                  ) : (
                    page.map((row) => {
                      prepareRow(row);
                      return (
                        <tr {...row.getRowProps()} className="even:bg-gray-50">
                          {row.cells.map((cell) => (
                            <td
                              {...cell.getCellProps()}
                              className="px-6 py-3 whitespace-nowrap"
                            >
                              {cell.render("Cell")}
                            </td>
                          ))}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ClubRequestListing;
