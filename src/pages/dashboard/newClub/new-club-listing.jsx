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
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import GlobalFilter from "../../table/react-tables/GlobalFilter";

const NewClubsListing = () => {
  const navigate = useNavigate();
  const [clubs, setClubs] = useState([]);

  const actions = [
    { name: "view", icon: "heroicons-outline:eye" },
    { name: "edit", icon: "heroicons:pencil-square" },
    { name: "delete", icon: "heroicons-outline:trash" },
  ];

  const handleAction = async (action, row) => {
    if (action === "edit")
      navigate(`/new-club-form/${row._id}`, { state: { mode: "edit" } });
    if (action === "view")
      navigate(`/new-club-form/${row._id}`, { state: { mode: "view" } });
    if (action === "delete") {
      if (!window.confirm("Are you sure to delete this club?")) return;
      try {
        const token = localStorage.getItem("token");
        await axios.delete(
          `${process.env.REACT_APP_BASE_URL}/new-club/delete/${row._id}`,
          { headers: { Authorization: `${token}` } }
        );
        setClubs((prev) => prev.filter((c) => c._id !== row._id));
      } catch (err) {
        console.error("Error deleting club:", err);
      }
    }
  };

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/new-club/GetAll`,
          { headers: { Authorization: `${token}` } }
        );
        setClubs(res.data.data || []);
      } catch (err) {
        console.error("Error fetching clubs:", err);
      }
    };
    fetchClubs();
  }, []);

  const COLUMNS = useMemo(
    () => [
      { Header: "S.No", id: "index", Cell: (row) => <>{row.row.index + 1}</> },
      { Header: "Club Name", accessor: "clubName" },
      { Header: "Category", accessor: "clubCategory" },
      { Header: "President", accessor: "presidentName" },
      { Header: "Target Gender", accessor: "targetGender" },
      { Header: "Expected Members", accessor: "expectedMembers" },
      {
        Header: "Status",
        accessor: "status",
        Cell: (row) => (
          <span
            className={`${
              row.cell.value === "Approved"
                ? "text-green-600"
                : "text-yellow-600"
            } font-medium`}
          >
            {row.cell.value || "Pending"}
          </span>
        ),
      },
      {
        Header: "Action",
        Cell: ({ row }) => (
          <Dropdown
            label={<Icon icon="heroicons-outline:dots-vertical" />}
            className="w-[130px]"
          >
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {actions.map((item, i) => (
                <Menu.Item key={i}>
                  <div
                    onClick={() => handleAction(item.name, row.original)}
                    className={`${
                      item.name === "delete"
                        ? "bg-danger-500 text-danger-500 bg-opacity-30 hover:bg-opacity-100 hover:text-white"
                        : "hover:bg-slate-900 hover:text-white dark:hover:bg-slate-600"
                    } px-4 py-2 cursor-pointer flex items-center gap-2 text-sm`}
                  >
                    <Icon icon={item.icon} />
                    <span className="capitalize">{item.name}</span>
                  </div>
                </Menu.Item>
              ))}
            </div>
          </Dropdown>
        ),
      },
    ],
    []
  );

  const tableInstance = useTable(
    { columns: COLUMNS, data: clubs },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow, state, setGlobalFilter } =
    tableInstance;

  const { globalFilter } = state;

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button
          text="+ New Club"
          className="btn-primary"
          onClick={() => navigate("/new-club-form/add")}
        />
      </div>

      <Card noborder>
        <div className="flex justify-between mb-6">
          <h4 className="card-title">New Club Proposals</h4>
          <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
        </div>

        <div className="overflow-x-auto">
          <table
            className="min-w-full divide-y divide-slate-100"
            {...getTableProps()}
          >
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className="table-th"
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

            <tbody {...getTableBodyProps()} className="divide-y divide-slate-100">
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
      </Card>
    </div>
  );
};

export default NewClubsListing;
