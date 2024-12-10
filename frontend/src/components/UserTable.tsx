import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";

interface User {
  id: number;
  name: string;
  role: string;
  projects: number[];
}

const UserTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const backendUrl =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    axios.get(`${backendUrl}/users`).then((response) => {
      const user = response.data; // Enkel object
      const parsedUser = {
        ...user,
        projects:
          typeof user.projects === "string"
            ? user.projects.split(",").map(Number)
            : user.projects,
      };
      setUsers([parsedUser]); // Plaats het object in een array
    });
  }, [backendUrl]);

  const columns = [
    {
      name: "ID",
      selector: (row: User) => row.id,
      sortable: true,
    },
    {
      name: "Name",
      selector: (row: User) => row.name,
      sortable: true,
    },
    {
      name: "Role",
      selector: (row: User) => row.role,
      sortable: true,
    },
    {
      name: "Projects",
      selector: (row: User) => row.projects.join(", "),
      sortable: false,
    },
  ];

  return (
    <div>
      <DataTable title="User List" columns={columns} data={users} />
    </div>
  );
};

export default UserTable;
