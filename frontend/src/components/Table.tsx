import React, { useState } from "react";
import { sortingTypes, type User } from "./Home"

//whole doc from chatGPT
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { useNavigate } from "react-router-dom";


type TableProps = {
  onRowClick: (info: User) => void;
  sortedData: User[];
}

export default function FilesTable({ onRowClick, sortedData }: TableProps) {
  const navigate = useNavigate()
  const [columns, setColumns] = useState<string[]>(["filename", "file_type", "creator", "last_modified"]);
  const [currentPage, setCurrentPage] = useState(1);
  const ROWS_PER_PAGE = 5;



  const handleRowDoubleClick = (user: User) => {
    console.log(`${user.filename} double-clicked, file should be opened in editor...`)
    navigate(`/${user.creator}/${user.filename}`)
  }

  const toggleColumn = (col: string) => {
    setColumns((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    );
  };

  const totalPages = Math.ceil(sortedData.length / ROWS_PER_PAGE);
  const currentRows = sortedData.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  return (
    <div className="space-y-4">
      {/* Column selectors */}
      <div className="flex gap-2 flex-wrap">
        {["filename", "file_type", "creator", "last_modified"].map((col) => (
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
            <TableRow >
              {columns.includes("filename") && <TableHead>Name</TableHead>}
              {columns.includes("file_type") && <TableHead>Type</TableHead>}
              {columns.includes("last_modified") && <TableHead>Last modified</TableHead>}
              {columns.includes("creator") && <TableHead>Creator</TableHead>}
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentRows.map((user) => (
              <TableRow key={user.filename} onClick={() => onRowClick(user)} onDoubleClick={() => handleRowDoubleClick(user)}>
                {columns.includes("filename") && <TableCell>{user.filename}</TableCell>}
                {columns.includes("file_type") && <TableCell>{user.file_type}</TableCell>}
                {columns.includes("last_modified") && <TableCell>{user.last_modified}</TableCell>}
                {columns.includes("creator") && <TableCell>{user.creator}</TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination controls */}
      <div className="flex justify-center gap-2 items-center">
        <button
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}