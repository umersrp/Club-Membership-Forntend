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

// //  Checkbox Component
// const IndeterminateCheckbox = React.forwardRef(({ indeterminate, ...rest }, ref) => {
//   const defaultRef = React.useRef();
//   const resolvedRef = ref || defaultRef;

//   React.useEffect(() => {
//     resolvedRef.current.indeterminate = indeterminate;
//   }, [resolvedRef, indeterminate]);

//   return <input type="checkbox" ref={resolvedRef} {...rest} className="table-checkbox" />;
// });

// const EventRequestListing = () => {
//   const navigate = useNavigate();
//   const [records, setRecords] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [pageCount, setPageCount] = useState(0);
//   const [globalFilterValue, setGlobalFilterValue] = useState("");

//   //  Columns to show only student + club details
//   const COLUMNS = [
//     {
//       Header: "Sr No",
//       accessor: "id",
//       Cell: ({ row }) => <span>{row.index + 1}</span>,
//     },
//     { Header: "Student Name", accessor: "studentName" },
//     { Header: "Student ID", accessor: "studentId" },
//     { Header: "Event Name", accessor: "eventTitle" },
//     { Header: "Event Category", accessor: "eventCategory" },
//     // { Header: "Motivation", accessor: "motivation" },
//     {
//       Header: "Status",
//       accessor: "status",
//       Cell: ({ value }) => (
//         <span
//           className={`capitalize px-2 py-1 rounded text-xs font-medium ${value === "pending"
//             ? "bg-yellow-100 text-yellow-800"
//             : value === "approved"
//               ? "bg-green-100 text-green-800"
//               : "bg-red-100 text-red-800"
//             }`}
//         >
//           {value}
//         </span>
//       ),
//     },
//     {
//       Header: "Actions",
//       accessor: "_id",
//       Cell: ({ cell, row }) => (
//         <div className="flex space-x-2">
//           {row.original.status === "pending" ? (
//             <>
//               <Button
//                 text="Accept"
//                 className="btn-sm bg-green-500 text-white"
//                 onClick={() => handleAccept(cell.value)}
//               />
//               <Button
//                 text="Reject"
//                 className="btn-sm bg-red-500 text-white"
//                 onClick={() => handleReject(cell.value)}
//               />
//             </>
//           ) : (
//             <span className="text-gray-500 italic">Action Taken</span>
//           )}
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
//         `${process.env.REACT_APP_BASE_URL}/Event-requests/all`,
//         {
//           headers: { Authorization: `${localStorage.getItem("token")}` },
//           params: { page: pageIndex + 1, limit: pageSize, search },
//         }
//       );

//       const rawData = res.data?.data || [];

//       //  Map only required fields (student + club)
//       const mapped = rawData.map((item) => ({
//         _id: item._id,
//         studentName: item.userId?.name || "—",
//         studentId: item.userId?.studentId || "—",

//         // ADD THESE
//         eventTitle: item.eventId?.eventTitle || "—",
//         eventCategory: item.eventId?.eventCategory || "—",



//         motivation: item.motivation || "—",
//         status: item.status || "pending",
//       }));


//       setRecords(mapped);
//       setPageCount(1); // You can adjust this if backend sends pagination info
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

//   //  Accept Request
//   const handleAccept = async (id) => {
//     try {
//       await axios.put(
//         `${process.env.REACT_APP_BASE_URL}/Event-requests/${id}`,
//         { status: "approved" },
//         { headers: { Authorization: `${localStorage.getItem("token")}` } }
//       );
//       toast.success("Request approved successfully");
//       fetchJoinRequests();
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to approve request");
//     }
//   };

//   //  Reject Request
//   const handleReject = async (id) => {
//     try {
//       await axios.put(
//         `${process.env.REACT_APP_BASE_URL}/Event-requests/${id}`,
//         { status: "rejected" },
//         { headers: { Authorization: `${localStorage.getItem("token")}` } }
//       );
//       toast.success("Request rejected successfully");
//       fetchJoinRequests();
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to reject request");
//     }
//   };

//   //  UI Render
//   return (
//     <Card noborder>
//       <div className="md:flex pb-6 items-center">
//         <h6 className="flex-1 md:mb-0">Event Requests</h6>
//         <div className="md:flex md:space-x-3 items-center flex-none rtl:space-x-reverse">
//           <GlobalFilter
//             filter={globalFilterValue}
//             setFilter={setGlobalFilterValue}
//           />
//         </div>
//       </div>

//       <div className="overflow-x-auto -mx-6">
//         <div className="inline-block min-w-full align-middle">
//           <div className="overflow-hidden">
//             {loading ? (
//               <div className="flex justify-center items-center py-8">
//                 <img src={Logo} alt="Loading..." className="w-52 h-24" />
//               </div>
//             ) : (
//               <table
//                 className="min-w-full divide-y divide-slate-100 table-fixed"
//                 {...getTableProps()}
//               >
//                 <thead className="bg-gradient-to-r from-[#18BB90] to-[#0C6B47]">
//                   {headerGroups.map((headerGroup, index) => (
//                     <tr {...headerGroup.getHeaderGroupProps()} key={index}>
//                       {headerGroup.headers.map((column) => (
//                         <th
//                           {...column.getHeaderProps(column.getSortByToggleProps())}
//                           className="table-th text-white"
//                           key={column.id}
//                         >
//                           {column.render("Header")}
//                           <span>
//                             {column.isSorted
//                               ? column.isSortedDesc
//                                 ? " 🔽"
//                                 : " 🔼"
//                               : ""}
//                           </span>
//                         </th>
//                       ))}
//                     </tr>
//                   ))}
//                 </thead>
//                 <tbody {...getTableBodyProps()}>
//                   {page.length === 0 ? (
//                     <tr>
//                       <td colSpan={columns.length + 1} className="text-center py-4">
//                         No requests available.
//                       </td>
//                     </tr>
//                   ) : (
//                     page.map((row) => {
//                       prepareRow(row);
//                       return (
//                         <tr {...row.getRowProps()} className="even:bg-gray-50">
//                           {row.cells.map((cell) => (
//                             <td
//                               {...cell.getCellProps()}
//                               className="px-6 py-3 whitespace-nowrap"
//                             >
//                               {cell.render("Cell")}
//                             </td>
//                           ))}
//                         </tr>
//                       );
//                     })
//                   )}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         </div>
//       </div>
//     </Card>
//   );
// };

// export default EventRequestListing;
import React, { useState, useEffect, useMemo } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
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

// Checkbox Component
const IndeterminateCheckbox = React.forwardRef(({ indeterminate, ...rest }, ref) => {
  const defaultRef = React.useRef();
  const resolvedRef = ref || defaultRef;

  React.useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);

  return <input type="checkbox" ref={resolvedRef} {...rest} className="table-checkbox" />;
});

const EventRequestListing = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  // Columns
  const COLUMNS = [
    {
      Header: "Sr No",
      Cell: ({ row }) => <span>{row.index + 1}</span>,
    },
    { Header: "Student Name", accessor: "studentName" },
    { Header: "Student ID", accessor: "studentId" },
    { Header: "Event Name", accessor: "eventTitle" },
    { Header: "Event Category", accessor: "eventCategory" },
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
      Cell: ({ cell, row }) =>
        row.original.status === "pending" ? (
          <div className="flex space-x-2">
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
          </div>
        ) : (
          <span className="text-gray-500 italic">Action Taken</span>
        ),
    },
  ];

  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => records, [records]);

  // Table instance (client-side pagination)
  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 }, // default 10 rows per page
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
          Cell: ({ row }) => <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />,
        },
        ...columns,
      ]);
    }
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page, // only the rows for the current page
    prepareRow,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state,
    setPageSize,
  } = tableInstance;

  const { pageIndex, pageSize } = state;

  // Fetch all requests once (client-side pagination)
  const fetchJoinRequests = async (search = "") => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/Event-requests/all`, {
        headers: { Authorization: `${localStorage.getItem("token")}` },
      });

      const rawData = res.data?.data || [];

      const mapped = rawData.map((item) => ({
        _id: item._id,
        studentName: item.userId?.name || "—",
        studentId: item.userId?.studentId || "—",
        eventTitle: item.eventId?.eventTitle || "—",
        eventCategory: item.eventId?.eventCategory || "—",
        status: item.status || "pending",
      }));

      setRecords(mapped);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJoinRequests(globalFilterValue);
  }, [globalFilterValue]);

  // Accept Request
  const handleAccept = async (id) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BASE_URL}/Event-requests/${id}`,
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

  // Reject Request
  const handleReject = async (id) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BASE_URL}/Event-requests/${id}`,
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

  return (
    <Card noborder>
      <div className="md:flex pb-6 items-center">
        <h6 className="flex-1 md:mb-0">Event Requests</h6>
        <div className="md:flex md:space-x-3 items-center flex-none rtl:space-x-reverse">
          <GlobalFilter filter={globalFilterValue} setFilter={setGlobalFilterValue} />
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
                            <td {...cell.getCellProps()} className="px-6 py-3 whitespace-nowrap">
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

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <div>
          Page {pageIndex + 1} of {pageOptions.length}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={previousPage}
            disabled={!canPreviousPage}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={nextPage}
            disabled={!canNextPage}
            className="px-2 py-1 border rounded disabled:opacity-50 bg-primary-600 text-white"
          >
            Next
          </button>
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
  );
};

export default EventRequestListing;
