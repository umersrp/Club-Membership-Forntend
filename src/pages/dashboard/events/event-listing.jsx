import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import {
  useTable,
  useRowSelect,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import GlobalFilter from "../../table/react-tables/GlobalFilter";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light-border.css";
import { toast } from "react-toastify";
import DefaultImage from "@/assets/images/all-img/widget-bg-5.png";


// Checkbox utility
const IndeterminateCheckbox = React.forwardRef(({ indeterminate, ...rest }, ref) => {
  const defaultRef = React.useRef();
  const resolvedRef = ref || defaultRef;
  React.useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);
  return <input type="checkbox" ref={resolvedRef} {...rest} className="table-checkbox" />;
});

const EventListing = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/event/get`, {
          headers: { Authorization: token },
        });
        const allEvents = res.data.data || [];

        const formatted = allEvents.map((e) => ({
          ...e,
          dateTime: e.dateTime ? new Date(e.dateTime).toLocaleString() : "-",
          registrationDeadline: e.registrationDeadline
            ? new Date(e.registrationDeadline).toLocaleDateString()
            : "-",
          registrationRequired: e.registrationRequired ? "Yes" : "No",
          certificateOffered: e.certificateOffered ? "Yes" : "No",
          volunteerHoursAwarded: e.volunteerHoursAwarded || 0,
        }));

        setEvents(formatted);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Table Columns
  const COLUMNS = useMemo(
    () => [
      {
        Header: "S.No",
        id: "serialNo",
        Cell: ({ row }) => row.index + 1,
      },
      {
        Header: "Event Image",
        accessor: "eventImage",
        Cell: ({ value }) =>
            <img
              src={value || DefaultImage}
              alt="event"
              className="w-16 h-16 rounded object-cover"
            />    
      },
      { Header: "Event Title", accessor: "eventTitle" },
      { Header: "Description", accessor: "eventDescription" },
      { Header: "Category", accessor: "eventCategory" },
      { Header: "Date & Time", accessor: "dateTime" },
      { Header: "Location", accessor: "location" },
      { Header: "Duration", accessor: "duration" },
      { Header: "Capacity Limit", accessor: "capacityLimit" },
      { Header: "Registration Deadline", accessor: "registrationDeadline" },
      { Header: "Target Gender", accessor: "targetGender" },
      { Header: "Target Audience", accessor: "targetAudience" },
      {
        Header: "Specific Majors",
        accessor: (row) =>
          Array.isArray(row.specificMajor) ? row.specificMajor.join(", ") : "-",
      },
      { Header: "Registration Required", accessor: "registrationRequired" },
      { Header: "Additional Requirements", accessor: "additionalRequirements" },
      { Header: "Certificate Offered", accessor: "certificateOffered" },
      { Header: "Volunteer Hours", accessor: "volunteerHoursAwarded" },
      {
        Header: "Actions",
        accessor: "_id",
        Cell: ({ cell }) => (
          <div className="flex space-x-3">
            <Tippy content="View">
              <button
                onClick={() =>
                  navigate(`/event-form/${cell.value}`, { state: { mode: "view" } })
                }
              >
                <Icon className="text-green-600" icon="heroicons:eye" />
              </button>
            </Tippy>
            <Tippy content="Edit">
              <button
                onClick={() =>
                  navigate(`/event-form/${cell.value}`, { state: { mode: "edit" } })
                }
              >
                <Icon className="text-blue-600" icon="heroicons:pencil-square" />
              </button>
            </Tippy>
            <Tippy content="Delete">
              <button
                onClick={() =>
                  handleAction("delete", cell.row.original)
                }
              >
                <Icon className="text-red-700" icon="heroicons:trash" />
              </button>
            </Tippy>
          </div>
        ),
      },
    ],
    []
  );

  // Handle delete
  const handleAction = async (action, row) => {
    if (action === "delete") {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${process.env.REACT_APP_BASE_URL}/event/${row._id}`, {
          headers: { Authorization: token },
        });
        setEvents((prev) => prev.filter((e) => e._id !== row._id));
        toast.success("Event Deleted Successfully");
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    }
  };

  // React Table instance with built-in pagination
  const tableInstance = useTable(
    { columns: COLUMNS, data: events, initialState: { pageIndex: 0, pageSize: 10 } },
    useGlobalFilter,
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
    page, // <- table rows for the current page
    prepareRow,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    pageOptions,
    state: { pageIndex, pageSize },
    setPageSize,
    gotoPage,
  } = tableInstance;

  if (loading)
    return <p className="text-center mt-8 text-gray-500">Loading events...</p>;

  return (
    <div>
      <Card noborder>
        {/*  Header with search + add */}
        <div className="md:flex pb-6 items-center">
          <h6 className="flex-1 md:mb-0 text-lg font-semibold">Events</h6>
          <div className="md:flex md:space-x-3 items-center flex-none rtl:space-x-reverse">
            <GlobalFilter filter={globalFilterValue} setFilter={setGlobalFilterValue} />
            <Button
              icon="heroicons-outline:plus-sm"
              text="Add Event"
              className="btn font-normal btn-sm bg-gradient-to-r from-[#18BB90] to-[#0C6B47] text-white border-0 hover:opacity-90"
              iconClass="text-lg"
              onClick={() => navigate("/event-form/add", { state: { mode: "add" } })}
            />
          </div>
        </div>

          {/* table */}
         <div className="overflow-x-auto -mx-6">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              <table
                {...getTableProps()}
                className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700"
              >
                <thead className="border-t border-slate-100 dark:border-slate-800">
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()} className="bg-gradient-to-r from-[#18BB90] to-[#0C6B47]">
                      {headerGroup.headers.map((column) => (
                        <th {...column.getHeaderProps(column.getSortByToggleProps())} className="table-th">
                          {column.render("Header")}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody
                  {...getTableBodyProps()}
                  className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700"
                >
                  {page.map((row) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map((cell) => (
                          <td {...cell.getCellProps()} className="table-td">
                            {cell.render("Cell")}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <div>
            Page{" "}
            <input
              type="number"
              min={1}
              max={pageOptions.length}
              value={pageIndex + 1}
              onChange={(e) => gotoPage(Number(e.target.value) - 1)}
              className="border w-12 p-1 rounded text-center"
            />{" "}
            of {pageOptions.length}
          </div>
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
    </div>
  );
};

export default EventListing;
