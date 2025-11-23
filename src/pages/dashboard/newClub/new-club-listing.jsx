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

const NewClubListing = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedBuildingId, setSelectedBuildingId] = useState(null);

  //  Table Columns
  const COLUMNS = [
    {
      Header: "Sr no",
      accessor: "id",
      Cell: ({ row }) => <span>{row.index + 1}</span>,
    },
    {
      Header: "Logo",
      accessor: "clubLogo",
      Cell: ({ cell }) =>
        cell.value ? (
          <img
            src={cell.value}
            alt="Club Logo"
            className="w-12 h-12 rounded-full object-cover border"
          />
        ) : (
          <span>-</span>
        ),
    },
    { Header: "Club Name", accessor: "clubName" },
    { Header: "Category", accessor: "clubCategory" },
    { Header: "Target Gender", accessor: "targetGender" },
    {
      Header: "Target Major",
      accessor: "targetMajor",
      Cell: ({ cell }) =>
        Array.isArray(cell.value) && cell.value.length > 0
          ? cell.value.join(", ")
          : "-",
    },
    {
      Header: "Target Year",
      accessor: "targetYear",
      Cell: ({ cell }) =>
        Array.isArray(cell.value) && cell.value.length > 0
          ? cell.value.join(", ")
          : "-",
    },
    {
      Header: "Proposed Activities",
      accessor: "proposedActivities",
      Cell: ({ cell }) =>
        Array.isArray(cell.value) && cell.value.length > 0
          ? cell.value.join(", ")
          : "-",
    },
    {
      Header: "Social Links",
      accessor: "socialLinks",
      Cell: ({ cell }) =>
        Array.isArray(cell.value) && cell.value.length > 0 ? (
          <a
            href={cell.value[0]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            {cell.value[0]}
          </a>
        ) : (
          "-"
        ),
    },
    { Header: "President", accessor: "presidentName" },
    { Header: "Vice President", accessor: "vicePresidentName" },
    {
      Header: "Expected Members",
      accessor: "expectedMembers",
      Cell: ({ cell }) => cell.value || "-",
    },
    {
      Header: "Created At",
      accessor: "createdAt",
      Cell: ({ cell }) =>
        cell.value ? new Date(cell.value).toLocaleDateString() : "-",
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ cell }) => {
        const status = cell.value || "Pending";

        const getColor = (status) => {
          switch (status) {
            case "Approved":
              return "bg-green-100 text-green-700 border border-green-300";
            case "Rejected":
              return "bg-red-100 text-red-700 border border-red-300";
            default:
              return "bg-yellow-100 text-yellow-700 border border-yellow-300";
          }
        };

        return (
          <span
            className={`px-2 py-1 rounded text-sm font-medium ${getColor(status)}`}
          >
            {status}
          </span>
        );
      },
    },

    // {
    //   Header: "Actions",
    //   accessor: "_id",
    //   Cell: ({ cell }) => (
    //     <div className="flex space-x-3 rtl:space-x-reverse">
    //       <Tippy content="View">
    //         <button
    //           className="action-btn"
    //           onClick={() => navigate(`new-club-form/${cell.value}`)}
    //         >
    //           <Icon className="text-green-600" icon="heroicons:eye" />
    //         </button>
    //       </Tippy>
    //       <Tippy content="Edit">
    //         <button
    //           className="action-btn"
    //           onClick={() => navigate(`new-club-form/${cell.value}`)}
    //         >
    //           <Icon className="text-blue-600" icon="heroicons:pencil-square" />
    //         </button>
    //       </Tippy>
    //       <Tippy content="Delete">
    //         <button
    //           className="action-btn"
    //           onClick={() => confirmDelete(cell.value)}
    //         >
    //           <Icon className="text-red-700" icon="heroicons:trash" />
    //         </button>
    //       </Tippy>
    //     </div>
    //   ),
    // },
    {
      Header: "Actions",
      accessor: "_id",
      Cell: ({ cell }) => (
        <div className="flex space-x-3">
          {/* View */}
          <Tippy content="view" theme="light" >
            <button
              onClick={() =>
                navigate(`/new-club-form/${cell.value}`, {
                  state: { mode: "view" },
                })
              }
            >
              <Icon className="text-green-600" icon="heroicons:eye" />
            </button>
          </Tippy>

          {/*  Edit */}
          <Tippy content="edit" theme="light">
            <button
              onClick={() =>
                navigate(`/new-club-form/${cell.value}`, {
                  state: { mode: "edit" },
                })
              }
            >
              <Icon className="text-blue-600" icon="heroicons:pencil-square" />
            </button>
          </Tippy>

          {/*  Delete */}
          <Tippy content="delete" theme="light" >
            <button onClick={() => confirmDelete(cell.value)}>
              <Icon className="text-red-700" icon="heroicons:trash" />
            </button>
          </Tippy>
          <button onClick={() => approveClub(cell.value)}>
            <Icon className="text-green-700" icon="heroicons:check-circle" />
          </button>

          {/* Reject */}
          <button onClick={() => rejectClub(cell.value)}>
            <Icon className="text-red-600" icon="heroicons:x-circle" />
          </button>
        </div>
      ),
    }

  ];

  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => records, [records]);

  //  React Table Instance
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

  //  Fetch Data
  const fetchStationaryRecords = async (search = "") => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/club/get`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        params: { page: pageIndex + 1, limit: pageSize, search },
      });

      const data = res.data?.data?.records || res.data?.data || [];
      const pagination = res.data?.data?.pagination || {};

      setRecords(data);
      setPageCount(pagination.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //  UseEffect for Fetching
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchStationaryRecords(globalFilterValue);
    }, 400);
    return () => clearTimeout(delay);
  }, [globalFilterValue, pageIndex, pageSize]);

  //  Delete Function
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}/club/delete/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Record deleted successfully");
      fetchStationaryRecords();
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

      const token = localStorage.getItem("token");

      const res = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/club/${id}`,
        { status: "Approved" },
        { headers: { Authorization: `${localStorage.getItem("token")}` } }
      );

      toast.success("Club approved successfully");
    } catch (err) {
      console.error(err.response?.data?.message || "Error approving club");
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
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/club/${id}`,
        {
          status: "Rejected",
          rejectionReason: reason,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Club rejected successfully");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error rejecting club");
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
                          No data available.
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
        </div>

        {/*  Pagination (CompanyTable Style) */}
        <div className="md:flex md:space-y-0 space-y-5 justify-between mt-6 items-center">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <span className="text-sm font-medium text-slate-600">
              Page <span>{pageIndex + 1} of {pageCount}</span>
            </span>
          </div>

          <ul className="flex items-center space-x-3 rtl:space-x-reverse">
            <li>
              <button
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
                className={`${!canPreviousPage ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <Icon icon="heroicons:chevron-double-left-solid" />
              </button>
            </li>
            <li>
              <button
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
                className={`${!canPreviousPage ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                Prev
              </button>
            </li>

            {pageOptions.map((pageNum, idx) => (
              <li key={idx}>
                <button
                  className={`${idx === pageIndex
                    ? "bg-slate-900 text-white font-medium"
                    : "bg-slate-100 text-slate-900 font-normal"
                    } text-sm rounded h-6 w-6 flex items-center justify-center`}
                  onClick={() => gotoPage(idx)}
                >
                  {pageNum + 1}
                </button>
              </li>
            ))}

            <li>
              <button
                onClick={() => nextPage()}
                disabled={!canNextPage}
                className={`${!canNextPage ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                Next
              </button>
            </li>
            <li>
              <button
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
                className={`${!canNextPage ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <Icon icon="heroicons:chevron-double-right-solid" />
              </button>
            </li>
          </ul>

          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-slate-600">Show</span>
            <select
              value={pageSize}
              onChange={(e) => tableInstance.setPageSize(Number(e.target.value))}
              className="form-select py-2"
            >
              {[10, 20, 30, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
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


