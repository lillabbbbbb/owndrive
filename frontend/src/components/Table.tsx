import React, { useState } from "react";

//whole doc from chatGPT
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

const usersData: User[] = [
  { id: 1, name: "Alice", email: "alice@example.com", role: "Admin", status: "Active" },
  { id: 2, name: "Bob", email: "bob@example.com", role: "Editor", status: "Inactive" },
  { id: 3, name: "Charlie", email: "charlie@example.com", role: "Viewer", status: "Active" },
];

export default function FilesTable() {
  const [columns, setColumns] = useState<string[]>(["id", "name", "email", "role"]);

  const toggleColumn = (col: string) => {
    setColumns((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    );
  };

  return (
    <div className="space-y-4">
      {/* Column selectors */}
      <div className="flex gap-2">
        {["id", "name", "email", "role", "status"].map((col) => (
          <label key={col} className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={columns.includes(col)}
              onChange={() => toggleColumn(col)}
              className="accent-blue-500"
            />
            {col.toUpperCase()}
          </label>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.includes("id") && <TableHead>ID</TableHead>}
              {columns.includes("name") && <TableHead>Name</TableHead>}
              {columns.includes("email") && <TableHead>Email</TableHead>}
              {columns.includes("role") && <TableHead>Role</TableHead>}
              {columns.includes("status") && <TableHead>Status</TableHead>}
            </TableRow>
          </TableHeader>

          <TableBody>
            {usersData.map((user) => (
              <TableRow key={user.id}>
                {columns.includes("id") && <TableCell>{user.id}</TableCell>}
                {columns.includes("name") && <TableCell>{user.name}</TableCell>}
                {columns.includes("email") && <TableCell>{user.email}</TableCell>}
                {columns.includes("role") && <TableCell>{user.role}</TableCell>}
                {columns.includes("status") && <TableCell>{user.status}</TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}