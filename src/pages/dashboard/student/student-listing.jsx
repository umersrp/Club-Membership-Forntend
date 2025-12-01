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

// const StudentListing = () => {
//   const navigate = useNavigate();
//   const [students, setStudents] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [globalFilterValue, setGlobalFilterValue] = useState("");
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [selectedStudentId, setSelectedStudentId] = useState(null);

//   //  Fetch Students
//   const fetchStudents = async (search = "") => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get(
//         `${process.env.REACT_APP_BASE_URL}/user/getStudentByAdmin`,
//         {
//           headers: { Authorization: `${token}` },
//           params: { search },
//         }
//       );
//       const data = res.data?.data || [];
//       setStudents(data);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to fetch students");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const delay = setTimeout(() => {
//       fetchStudents(globalFilterValue);
//     }, 400);
//     return () => clearTimeout(delay);
//   }, [globalFilterValue]);

//   //  Toggle Active/Inactive Status
//   const toggleStatus = async (id, currentStatus) => {
//     try {
//       const token = localStorage.getItem("token");
//       const newStatus = !currentStatus;

//       await axios.put(
//         `${process.env.REACT_APP_BASE_URL}/user/update-student-status/${id}`,
//         { isActive: newStatus },
//         { headers: { Authorization: `${token}` } }
//       );

//       // Update UI instantly
//       setStudents((prev) =>
//         prev.map((s) => (s._id === id ? { ...s, isActive: newStatus } : s))
//       );

//       toast.success(`Student is now ${newStatus ? "Active" : "Inactive"}`);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to update status");
//     }
//   };

//   //  Delete Student
//   const handleDelete = async (id) => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.delete(
//         `${process.env.REACT_APP_BASE_URL}/user/admin-remove/${id}`,
//         { headers: { Authorization: `${token}` } }
//       );
//       toast.success("Student deleted successfully");
//       fetchStudents();
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to delete student");
//     }
//   };

//   const confirmDelete = (id) => {
//     setSelectedStudentId(id);
//     setDeleteModalOpen(true);
//   };

//   //  Define Table Columns
//   const COLUMNS = [
//     {
//       Header: "Sr No",
//       Cell: ({ row }) => <span>{row.index + 1}</span>,
//     },
//     { Header: "Student ID", accessor: "studentId" },
//     { Header: "Name", accessor: "name" },
//     { Header: "Username", accessor: "username" },
//     { Header: "Email", accessor: "email" },
//     { Header: "Major", accessor: "major" },
//     { Header: "Year of Study", accessor: "yearOfStudy" },
//     {
//       Header: "Gender",
//       accessor: "gender",
//       Cell: ({ value }) => (
//         <span
//           className={`px-2 py-1 rounded text-sm font-medium ${
//             value === "Male"
//               ? "bg-blue-100 text-blue-700"
//               : "bg-pink-100 text-pink-700"
//           }`}
//         >
//           {value}
//         </span>
//       ),
//     },
//     {
//       Header: "Status",
//       accessor: "isActive",
//       Cell: ({ row }) => {
//         const { _id, isActive } = row.original;
//         return (
//           <label className="relative inline-flex items-center cursor-pointer">
//             <input
//               type="checkbox"
//               checked={isActive}
//               onChange={() => toggleStatus(_id, isActive)}
//               className="sr-only peer"
//             />
//             <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500 transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
//             <span className="ml-2 text-sm font-medium text-gray-700">
//               {isActive ? "Active" : "Inactive"}
//             </span>
//           </label>
//         );
//       },
//     },
//     {
//       Header: "Phone",
//       accessor: "phone",
//     },
//     {
//       Header: "Interests",
//       accessor: "interests",
//       Cell: ({ value }) => (value && value.length > 0 ? value.join(", ") : "-"),
//     },
//     // {
//     //   Header: "Actions",
//     //   accessor: "_id",
//     //   Cell: ({ cell }) => (
//     //     <div className="flex space-x-3 rtl:space-x-reverse">
//     //       <Tippy content="View">
//     //         <button
//     //           className="action-btn"
//     //           onClick={() =>
//     //             navigate(`/student-view/${cell.value}`, {
//     //               state: { mode: "view" },
//     //             })
//     //           }
//     //         >
//     //           <Icon className="text-green-600" icon="heroicons:eye" />
//     //         </button>
//     //       </Tippy>
//     //       <Tippy content="Edit">
//     //         <button
//     //           className="action-btn"
//     //           onClick={() =>
//     //             navigate(`/student-edit/${cell.value}`, {
//     //               state: { mode: "edit" },
//     //             })
//     //           }
//     //         >
//     //           <Icon className="text-blue-600" icon="heroicons:pencil-square" />
//     //         </button>
//     //       </Tippy>
//     //       <Tippy content="Delete">
//     //         <button
//     //           className="action-btn"
//     //           onClick={() => confirmDelete(cell.value)}
//     //         >
//     //           <Icon className="text-red-700" icon="heroicons:trash" />
//     //         </button>
//     //       </Tippy>
//     //     </div>
//     //   ),
//     // },
//   ];

//   const columns = useMemo(() => COLUMNS, [students]);
//   const data = useMemo(() => students, [students]);

//   //  React Table Setup
//   const tableInstance = useTable(
//     {
//       columns,
//       data,
//       manualPagination: false,
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
//   } = tableInstance;

import React, { useState, useEffect, useMemo } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Tippy from "@tippyjs/react";
import {
  useTable,
  useRowSelect,
  useSortBy,
  usePagination,
} from "react-table";
import GlobalFilter from "@/pages/table/react-tables/GlobalFilter";
import Logo from "@/assets/images/logo/logo.png";
import Modal from "@/components/ui/Modal";

const IndeterminateCheckbox = React.forwardRef(({ indeterminate, ...rest }, ref) => {
  const defaultRef = React.useRef();
  const resolvedRef = ref || defaultRef;
  React.useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);
  return <input type="checkbox" ref={resolvedRef} {...rest} className="table-checkbox" />;
});

const StudentListing = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  // Fetch Students
  const fetchStudents = async (search = "") => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/user/getStudentByAdmin`, {
        headers: { Authorization: `${token}` },
        params: { search },
      });
      const data = res.data?.data || [];
      setStudents(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchStudents(globalFilterValue);
    }, 400);
    return () => clearTimeout(delay);
  }, [globalFilterValue]);

  // Toggle Active/Inactive Status
  const toggleStatus = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      const newStatus = !currentStatus;
      await axios.put(`${process.env.REACT_APP_BASE_URL}/user/update-student-status/${id}`, { isActive: newStatus }, { headers: { Authorization: `${token}` } });

      setStudents((prev) => prev.map((s) => (s._id === id ? { ...s, isActive: newStatus } : s)));
      toast.success(`Student is now ${newStatus ? "Active" : "Inactive"}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  // Delete Student
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${process.env.REACT_APP_BASE_URL}/user/admin-remove/${id}`, { headers: { Authorization: `${token}` } });
      toast.success("Student deleted successfully");
      fetchStudents();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete student");
    }
  };

  const confirmDelete = (id) => {
    setSelectedStudentId(id);
    setDeleteModalOpen(true);
  };

  // Table Columns
  const COLUMNS = [
    { Header: "Sr No", Cell: ({ row }) => <span>{row.index + 1}</span> },
    { Header: "Student ID", accessor: "studentId" },
    { Header: "Name", accessor: "name" },
    { Header: "Username", accessor: "username" },
    { Header: "Email", accessor: "email" },
    { Header: "Major", accessor: "major" },
    { Header: "Year of Study", accessor: "yearOfStudy" },
    {
      Header: "Gender",
      accessor: "gender",
      Cell: ({ value }) => (
        <span className={`px-2 py-1 rounded text-sm font-medium ${value === "Male" ? "bg-blue-100 text-blue-700" : "bg-pink-100 text-pink-700"}`}>
          {value}
        </span>
      ),
    },
    {
      Header: "Status",
      accessor: "isActive",
      Cell: ({ row }) => {
        const { _id, isActive } = row.original;
        return (
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={isActive} onChange={() => toggleStatus(_id, isActive)} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500 transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
            <span className="ml-2 text-sm font-medium text-gray-700">{isActive ? "Active" : "Inactive"}</span>
          </label>
        );
      },
    },
    { Header: "Phone", accessor: "phone" },
    { Header: "Interests", accessor: "interests", Cell: ({ value }) => (value && value.length > 0 ? value.join(", ") : "-") },
  ];

  const columns = useMemo(() => COLUMNS, [students]);
  const data = useMemo(() => students, [students]);

  const tableInstance = useTable(
    { columns, data, initialState: { pageIndex: 0, pageSize: 10 } },
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
    setPageSize,
    state,
  } = tableInstance;

  const { pageIndex, pageSize } = state;


  //  UI
  return (
    <>
      <Card noborder>
        <div className="md:flex pb-6 items-center">
          <h6 className="flex-1 md:mb-0">Students</h6>
          <div className="md:flex md:space-x-3 items-center flex-none rtl:space-x-reverse">
            <GlobalFilter
              filter={globalFilterValue}
              setFilter={setGlobalFilterValue}
            />
          </div>
        </div>

        {/*  Table */}
        {/* <div className="overflow-x-auto -mx-6">
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
                            {...column.getHeaderProps(
                              column.getSortByToggleProps()
                            )}
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
                        <td
                          colSpan={columns.length + 1}
                          className="text-center py-4"
                        >
                          No student data available.
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
                                className="px-6 py-4 whitespace-nowrap"
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
        </div> */}
          <div className="overflow-x-auto -mx-6">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <img src={Logo} alt="Loading..." className="w-52 h-24" />
                </div>
              ) : (
                <table className="min-w-full divide-y divide-slate-100 table-fixed" {...getTableProps()}>
                  <thead className="bg-gradient-to-r from-[#18BB90] to-[#0C6B47]">
                    {headerGroups.map((headerGroup, index) => (
                      <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                        {headerGroup.headers.map((column) => (
                          <th {...column.getHeaderProps(column.getSortByToggleProps())} className="table-th text-white" key={column.id}>
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
                        <td colSpan={columns.length + 1} className="text-center py-4">
                          No student data available.
                        </td>
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
          <div>Page {pageIndex + 1} of {pageOptions.length}</div>
          <div className="flex items-center space-x-2">
            <button onClick={previousPage} disabled={!canPreviousPage} className="px-2 py-1 border rounded disabled:opacity-50">Prev</button>
            <button onClick={nextPage} disabled={!canNextPage} className="px-2 py-1 border rounded disabled:opacity-50 bg-primary-600 text-white">Next</button>
            <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} className="border p-1 rounded">
              {[5, 10, 25, 50].map((size) => (
                <option key={size} value={size}>Show {size}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/*  Delete Confirmation Modal */}
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
                await handleDelete(selectedStudentId);
                setDeleteModalOpen(false);
              }}
            />
          </>
        }
      >
        <p className="text-gray-700 text-center">
          Are you sure you want to delete this student? This action cannot be undone.
        </p>
      </Modal>
    </>
  );
};

export default StudentListing;
