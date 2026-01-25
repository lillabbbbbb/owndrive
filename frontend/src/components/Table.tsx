import React, { useState } from "react";
import { sortingTypes } from "./main_components/Home"
import {IFileTest} from "../App"

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
  onRowClick: (info: IFileTest) => void;
  sortedFilteredData: IFileTest[];
}

export default function FilesTable({ onRowClick, sortedFilteredData }: TableProps) {
  const navigate = useNavigate()
  const [columns, setColumns] = useState<string[]>(["filename", "file_type", "created_by", "last_edited_at", "created_at"]);
  const [currentPage, setCurrentPage] = useState(1);
  const ROWS_PER_PAGE = 12;



  const handleRowDoubleClick = (user: IFileTest) => {
    console.log(`${user.filename} double-clicked, file should be opened in editor...`)
    navigate(`/${user.created_by}/${user.filename}`)
  }

  const toggleColumn = (col: string) => {
    setColumns((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    );
  };

  const totalPages = Math.ceil(sortedFilteredData.length / ROWS_PER_PAGE);
  const currentRows = sortedFilteredData.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  return (
    <div className="space-y-4">
      {/* Column selectors */}
      <div className="flex gap-2 flex-wrap">
        {["filename", "file_type", "created_by", "last_edited_at", "created_at"].map((col) => (
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
      <div className="inline-block overflow-x-auto border rounded-md">
        <Table>
          <TableHeader>
            <TableRow >
              {columns.includes("filename") && <TableHead>Name</TableHead>}
              {columns.includes("file_type") && <TableHead>Type</TableHead>}
              {columns.includes("created_by") && <TableHead>Created By</TableHead>}
              {columns.includes("last_edited_at") && <TableHead>Last modified</TableHead>}
              {columns.includes("created_at") && <TableHead className="text-right">Created At</TableHead>}
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentRows.map((user) => (
              <TableRow className="text-left w-auto whitespace-nowrap px-4 py-2" key={user.filename} onClick={() => onRowClick(user)} onDoubleClick={() => handleRowDoubleClick(user)}>
                {columns.includes("filename") && <TableCell className="whitespace-nowrap pr-16 py-2">{user.filename}</TableCell>}
                {columns.includes("file_type") && <TableCell className="whitespace-nowrap pr-16 py-2">{user.file_type}</TableCell>}
                {columns.includes("last_edited_at") && <TableCell className="whitespace-nowrap pr-16 py-2">{user.last_edited_at.toLocaleDateString()}</TableCell>}
                {columns.includes("created_by") && <TableCell className="whitespace-nowrap pr-16 py-2">{user.created_by}</TableCell>}
                {columns.includes("created_at") && <TableCell className="whitespace-nowrap pl-16 py-2">{user.created_at.toLocaleDateString()}</TableCell>}
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