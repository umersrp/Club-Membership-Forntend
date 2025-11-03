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
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [limit] = useState(10);
  const [loading, setLoading] = useState(true);

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
        // Mock delete functionality (since no backend)
        setEvents((prev) => prev.filter((e) => e._id !== row._id));
        console.log(`Deleted event with id: ${row._id}`);
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    }
  };

  // ✅ Mock event data instead of GET API
  useEffect(() => {
    const mockEvents = [
      {
        _id: "1",
        title: "Tech Innovation Workshop",
        description:
          "A hands-on workshop focusing on the latest trends in AI, blockchain, and data science.",
        category: "Workshop",
        dateTime: "2025-11-15T10:00",
        location: "Auditorium Hall A",
        duration: "3 hours",
        capacityLimit: 100,
        registrationDeadline: "2025-11-10",
        targetGender: "All",
        targetAudience: "Computer Science and Engineering Students",
        registrationRequired: "Yes",
        additionalRequirements: "Bring your own laptop with Python installed.",
        certificateOffered: "Yes",
        volunteerHours: 2,
      },
      {
        _id: "2",
        title: "Cultural Fusion Night",
        description:
          "An evening celebrating diverse cultures with music, dance, and food from around the world.",
        category: "Social",
        dateTime: "2025-12-01T18:00",
        location: "University Amphitheatre",
        duration: "4 hours",
        capacityLimit: 300,
        registrationDeadline: "2025-11-28",
        targetGender: "All",
        targetAudience: "All Students and Faculty",
        registrationRequired: "No",
        additionalRequirements: "-",
        certificateOffered: "No",
        volunteerHours: 0,
      },
      {
        _id: "3",
        title: "Interdepartmental Sports Competition",
        description:
          "A competitive sports event between different university departments — cricket, football, and basketball.",
        category: "Competition",
        dateTime: "2025-11-25T09:00",
        location: "Sports Ground",
        duration: "6 hours",
        capacityLimit: 150,
        registrationDeadline: "2025-11-20",
        targetGender: "All",
        targetAudience: "Sports Enthusiasts and Department Teams",
        registrationRequired: "Yes",
        additionalRequirements: "Teams must wear departmental jerseys.",
        certificateOffered: "Yes",
        volunteerHours: 3,
      },
    ];

    setTimeout(() => {
      setEvents(mockEvents);
      setLoading(false);
    }, 800);
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

  if (loading) return <p className="text-center mt-8 text-gray-500">Loading events...</p>;

  return (
    <div>
      <Card noborder>
          <div className="md:flex pb-6 items-center">
                  <h6 className="flex-1 md:mb-0">Events</h6>
                  <div className="md:flex md:space-x-3 items-center flex-none rtl:space-x-reverse">
                    <GlobalFilter
                      filter={globalFilterValue}
                      setFilter={setGlobalFilterValue}
                    />
                    <Button
                      icon="heroicons-outline:plus-sm"
                      text="Add Events"
                      className="btn font-normal btn-sm bg-gradient-to-r from-[#3AB89D] to-[#3A90B8] text-white border-0 hover:opacity-90"
                      iconClass="text-lg"
                      onClick={() =>
                        navigate("/event-form/Add", { state: { mode: "add" } })
                      }
                    />
                  </div>
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
                    <tr {...headerGroup.getHeaderGroupProps()} className="bg-gradient-to-r from-[#3AB89D] to-[#3A90B8]">
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
