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

const ClubLeaderListing = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedLeaderId, setSelectedLeaderId] = useState(null);

  //  Define Table Columns
  const COLUMNS = [
    {
      Header: "Sr No",
      Cell: ({ row }) => <span>{row.index + 1}</span>,
    },
    { Header: "Student ID", accessor: "studentId" },
    {
      Header: "Club ID",
      accessor: (row) => row.clubLeadership?.clubId?.clubName || "-",
    },
    {
      Header: "Role",
      accessor: (row) => row.clubLeadership?.role || "-",
    },
    {
      Header: "Custom Role",
      accessor: (row) => row.clubLeadership?.customRoleName || "-",
    },
    {
      Header: "Effective Date",
      accessor: (row) =>
        row.clubLeadership?.effectiveDate
          ? new Date(row.clubLeadership.effectiveDate).toLocaleDateString()
          : "-",
    },
    {
      Header: "Notes",
      accessor: (row) => row.clubLeadership?.notes || "-",
    },
    {
      Header: "Actions",
      accessor: "_id",
      Cell: ({ cell }) => (
        <div className="flex space-x-3 rtl:space-x-reverse">
          <Tippy >
            <button
              className="action-btn"
              onClick={() =>
                navigate(`/club-leader-form/${cell.value}`, {
                  state: { mode: "view" },
                })
              }
            >
              <Icon className="text-green-600" icon="heroicons:eye" />
            </button>
          </Tippy>
          <Tippy >
            <button
              className="action-btn"
              onClick={() =>
                navigate(`/club-leader-form/${cell.value}`, {
                  state: { mode: "edit" },
                })
              }
            >
              <Icon className="text-blue-600" icon="heroicons:pencil-square" />
            </button>
          </Tippy>
          <Tippy >
            <button
              className="action-btn"
              onClick={() => confirmDelete(cell.value)}
            >
              <Icon className="text-red-700" icon="heroicons:trash" />
            </button>
          </Tippy>
        </div>
      ),
    },
  ];

  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => records, [records]);

  //  React Table Setup
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

  //  Fetch Club Leaders Data
  const fetchClubLeaders = async (search = "") => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/user/get-all-clubLeader`,
        {
          headers: { Authorization: `${token}` },
          params: { page: pageIndex + 1, limit: pageSize, search },
        }
      );

      const data = res.data?.data || [];
      setRecords(data);
      setPageCount(1); // Static since backend doesn't provide pagination
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch club leaders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchClubLeaders(globalFilterValue);
    }, 400);
    return () => clearTimeout(delay);
  }, [globalFilterValue, pageIndex, pageSize]);

  //  Delete Leader
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/user/admin-remove/${id}`,
        { headers: { Authorization: `${token}` } }
      );
      toast.success("Club Leader deleted successfully");
      fetchClubLeaders();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete leader");
    }
  };

  const confirmDelete = (id) => {
    setSelectedLeaderId(id);
    setDeleteModalOpen(true);
  };

  //  UI
  return (
    <>
      <Card noborder>
        <div className="md:flex pb-6 items-center">
          <h6 className="flex-1 md:mb-0">Club Leaders</h6>
          <div className="md:flex md:space-x-3 items-center flex-none rtl:space-x-reverse">
            <GlobalFilter
              filter={globalFilterValue}
              setFilter={setGlobalFilterValue}
            />
            <Button
              icon="heroicons-outline:plus-sm"
              text="Add Club Leader"
              className="btn font-normal btn-sm bg-gradient-to-r from-[#18BB90] to-[#0C6B47] text-white border-0 hover:opacity-90"
              iconClass="text-lg"
              onClick={() =>
                navigate("/club-leader-form/add", { state: { mode: "add" } })
              }
            />
          </div>
        </div>

        {/*  Table */}
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
                await handleDelete(selectedLeaderId);
                setDeleteModalOpen(false);
              }}
            />
          </>
        }
      >
        <p className="text-gray-700 text-center">
          Are you sure you want to delete this club leader? This action cannot be undone.
        </p>
      </Modal>
    </>
  );
};

export default ClubLeaderListing;
