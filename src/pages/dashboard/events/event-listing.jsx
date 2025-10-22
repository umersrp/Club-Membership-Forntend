import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Dropdown from "@/components/ui/Dropdown";
import Icon from "@/components/ui/Icon";
import { Menu } from "@headlessui/react";
import {
  useTable,
  useRowSelect,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import GlobalFilter from "../../table/react-tables/GlobalFilter";

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
  const [limit] = useState(10);

  const actions = [
    { name: "view", icon: "heroicons-outline:eye" },
    { name: "edit", icon: "heroicons:pencil-square" },
    { name: "delete", icon: "heroicons-outline:trash" },
  ];

  const handleAction = async (action, row) => {
    if (action === "edit") navigate(`/event-form/${row._id}`, { state: { mode: "edit" } });
    if (action === "view") navigate(`/event-form/${row._id}`, { state: { mode: "view" } });
    if (action === "delete") {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${process.env.REACT_APP_BASE_URL}/events/${row._id}`, {
          headers: { Authorization: `${token}` },
        });
        setEvents((prev) => prev.filter((e) => e._id !== row._id));
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/events`, {
          headers: { Authorization: `${token}` },
        });
        setEvents(res.data.data || []);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  const COLUMNS = useMemo(
    () => [
      {
        Header: "S.No",
        id: "serialNo",
        Cell: (row) => row.row.index + 1 + (page - 1) * limit,
      },
      { Header: "Event Title", accessor: "title" },
      { Header: "Description", accessor: "description" },
      { Header: "Category", accessor: "category" },
      { Header: "Date & Time", accessor: "dateTime" },
      { Header: "Venue", accessor: "location" },
      { Header: "Duration", accessor: "duration" },
      { Header: "Capacity Limit", accessor: "capacityLimit" },
      { Header: "Registration Deadline", accessor: "registrationDeadline" },
      { Header: "Target Gender", accessor: "targetGender" },
      { Header: "Target Audience", accessor: "targetAudience" },
      { Header: "Registration Required", accessor: "registrationRequired" },
      { Header: "Additional Requirements", accessor: "additionalRequirements" },
      { Header: "Certificate Offered", accessor: "certificateOffered" },
      { Header: "Volunteer Hours", accessor: "volunteerHours" },
      {
        Header: "Action",
        accessor: "action",
        Cell: ({ row }) => (
          <Dropdown label={<Icon icon="heroicons-outline:dots-vertical" />}>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {actions.map((item, i) => (
                <Menu.Item key={i}>
                  <div
                    onClick={() => handleAction(item.name, row.original)}
                    className={`w-full px-4 py-2 text-sm cursor-pointer flex items-center gap-2 ${
                      item.name === "delete"
                        ? "bg-danger-500 text-danger-500 bg-opacity-30 hover:bg-opacity-100 hover:text-white"
                        : "hover:bg-slate-900 hover:text-white dark:hover:bg-slate-600 dark:hover:bg-opacity-50"
                    }`}
                  >
                    <Icon icon={item.icon} />
                    <span>{item.name}</span>
                  </div>
                </Menu.Item>
              ))}
            </div>
          </Dropdown>
        ),
      },
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
    setGlobalFilter,
  } = tableInstance;

  const { globalFilter } = state;

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button
          text="+ Add Event"
          className="btn-primary"
          onClick={() => navigate("/event-form/add")}
        />
      </div>
      <Card noborder>
        <div className="md:flex justify-between items-center mb-6">
          <h4 className="card-title">Events</h4>
          <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
        </div>

        <div className="overflow-x-auto -mx-6">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              <table
                {...getTableProps()}
                className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700"
              >
                <thead className="border-t border-slate-100 dark:border-slate-800">
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
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
