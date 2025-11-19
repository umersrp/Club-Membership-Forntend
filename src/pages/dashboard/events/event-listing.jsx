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
import 'tippy.js/dist/tippy.css';      
import 'tippy.js/themes/light-border.css';   


//  Checkbox utility
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
  const [page, setPage] = useState(1);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [limit] = useState(10);
  const [loading, setLoading] = useState(true);

  const actions = [
    { name: "view", icon: "heroicons-outline:eye" },
    { name: "edit", icon: "heroicons:pencil-square" },
    { name: "delete", icon: "heroicons-outline:trash" },
  ];

  //  Handle action buttons
  const handleAction = async (action, row) => {
    if (action === "edit")
      navigate(`/event-form/${row._id}`, { state: { mode: "edit" } });

    if (action === "view")
      navigate(`/event-form/${row._id}`, { state: { mode: "view" } });

    if (action === "delete") {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${process.env.REACT_APP_BASE_URL}/event/delete/${row._id}`, {
          headers: { Authorization: `${token}` },
        });
        setEvents((prev) => prev.filter((e) => e._id !== row._id));
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    }
  };

  //  Fetch all events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/event/get`, {
          headers: { Authorization: `${token}` },
        });

        const allEvents = res.data.data || [];

        // Optional: Format data (dateTime, registrationDeadline)
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

  //  Table Columns
  const COLUMNS = useMemo(
    () => [
      {
        Header: "S.No",
        id: "serialNo",
        Cell: (row) => row.row.index + 1 + (page - 1) * limit,
      },
      {
        Header: "Event Image",
        accessor: "eventImage",
        Cell: ({ value }) =>
          value ? (
            <img
              src={value}
              alt="event"
              className="w-16 h-16 rounded object-cover"
            />
          ) : (
            "—"
          ),
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
            {/* View */}
            <Tippy content="View" >
              <button
                onClick={() =>
                  navigate(`/event-form/${cell.value}`, {
                    state: { mode: "view" },
                  })
                }
              >
                <Icon className="text-green-600" icon="heroicons:eye" />
              </button>
            </Tippy>

            {/* Edit */}
            <Tippy content="Edit" >
              <button
                onClick={() =>
                  navigate(`/event-form/${cell.value}`, {
                    state: { mode: "edit" },
                  })
                }
              >
                <Icon className="text-blue-600" icon="heroicons:pencil-square" />
              </button>
            </Tippy>

            {/*  Delete */}
            <Tippy content="Delete" >
              <button onClick={() => confirmDelete(cell.value)}>
                <Icon className="text-red-700" icon="heroicons:trash" />
              </button>
            </Tippy>
          </div>
        ),
      }

    ],
    [page, limit]
  );

  const tableInstance = useTable(
    { columns: COLUMNS, data: events },
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
    page: tablePage,
    prepareRow,
    state,
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

        {/*  Table */}
        <div className="overflow-x-auto -mx-6">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              <table
                {...getTableProps()}
                className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700"
              >
                <thead className="border-t border-slate-100 dark:border-slate-800">
                  {headerGroups.map((headerGroup) => (
                    <tr
                      {...headerGroup.getHeaderGroupProps()}
                      className="bg-gradient-to-r from-[#18BB90] to-[#0C6B47]"
                    >
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps(column.getSortByToggleProps())}
                          className="table-th"
                        >
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
                  {tablePage.map((row) => {
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
      </Card>
    </div>
  );
};

export default EventListing;
