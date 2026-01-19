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
  filename: string;
  file_type: string;
  creator: string;
  last_modified: string;
}

const usersData: User[] = [
  { filename: "report1.docx", file_type: "Document", creator: "Alice", last_modified: "2026-01-19 09:30" },
  { filename: "presentation1.pptx", file_type: "Presentation", creator: "Bob", last_modified: "2026-01-18 16:45" },
  { filename: "photo1.png", file_type: "Image", creator: "Charlie", last_modified: "2026-01-17 12:10" },
  { filename: "data1.csv", file_type: "Spreadsheet", creator: "Alice", last_modified: "2026-01-16 08:55" },
  { filename: "report2.docx", file_type: "Document", creator: "Bob", last_modified: "2026-01-15 14:20" },
  { filename: "presentation2.pptx", file_type: "Presentation", creator: "Charlie", last_modified: "2026-01-14 11:05" },
  { filename: "photo2.png", file_type: "Image", creator: "Alice", last_modified: "2026-01-13 18:40" },
  { filename: "data2.csv", file_type: "Spreadsheet", creator: "Bob", last_modified: "2026-01-12 09:15" },
  { filename: "report3.docx", file_type: "Document", creator: "Charlie", last_modified: "2026-01-11 17:30" },
  { filename: "presentation3.pptx", file_type: "Presentation", creator: "Alice", last_modified: "2026-01-10 13:50" },
  { filename: "photo3.png", file_type: "Image", creator: "Bob", last_modified: "2026-01-09 10:25" },
  { filename: "data3.csv", file_type: "Spreadsheet", creator: "Charlie", last_modified: "2026-01-08 15:05" },
]

export default function FilesTable({ onRowClick }: { onRowClick: (info: User) => void }) {
  const [columns, setColumns] = useState<string[]>(["id", "name", "email", "role"]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;


  const handleRowDoubleClick = (user: User) => {
    console.log(`${user.filename} double-clicked, file should be opened in editor...`)
  }

  const toggleColumn = (col: string) => {
    setColumns((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    );
  };

  const totalPages = Math.ceil(usersData.length / rowsPerPage);
  const currentRows = usersData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
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
              <TableRow key={user.filename} onClick={() => onRowClick(user)}  onDoubleClick={() => handleRowDoubleClick(user)}>
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