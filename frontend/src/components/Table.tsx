import React, { useEffect, useState } from "react";
import { sortingTypes } from "./main_components/Home"

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
import { useAppContext } from "./context/globalContext";
import { IFileFrontend } from "../types/File";
import { useTranslation } from "react-i18next";


type TableProps = {
  onRowClick: (info: IFileFrontend) => void;
  sortedFilteredData: IFileFrontend[];
  fileName?: string,
  setFileName?: (newFileName: string) => void;
}

const COLUMN_NAMES = ["filename", "file_type", "created_by", "last_edited_at", "created_at"]

export default function FilesTable({ onRowClick, sortedFilteredData }: TableProps) {

  const { t } = useTranslation()
  const { getAllUsernames } = useAppContext()

  //console.log('📊 TABLE RECEIVED:', sortedFilteredData?.length, 'items');
  console.log('Table data:', sortedFilteredData);

  const navigate = useNavigate()
  const { setCurrentFileId, user } = useAppContext()

  const [usernamesMap, setUsernamesMap] = useState<Record<string, string>>({});
  const [columns, setColumns] = useState<string[]>(COLUMN_NAMES);
  const [currentPage, setCurrentPage] = useState(1);
  const ROWS_PER_PAGE = 12;

  useEffect(() => {
    const fetchAllUsernames = async () => {
      const allUsers = await getAllUsernames(); // fetch once
      const map: Record<string, string> = {};
      if (!allUsers) return
      allUsers.forEach(u => { map[u._id] = u.email; });
      setUsernamesMap(map);
    };
    fetchAllUsernames();
  }, []);

  const handleRowDoubleClick = (file: IFileFrontend) => {
    console.log(`${file.filename} double-clicked, file should be opened in editor...`)

    sessionStorage.setItem("fileId", file._id);
    setCurrentFileId(file._id)
    navigate(`/${file.created_by}/${file._id}`)
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
        {COLUMN_NAMES.map((col) => (
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

      {/* Results summary */}
      <div className="flex justify-between items-center px-1">
        <div className="text-sm text-gray-600">
          {currentRows.length === 0 ? (
            t("home.no-results")
          ) : (
            <>
              {t("home.results-num") + sortedFilteredData.length}
            </>
          )}
        </div>
      </div>

      {/* Table */}
      {sortedFilteredData.length > 0 && <div className="inline-block overflow-x-auto border rounded-md">
        <Table>
          <TableHeader>
            <TableRow >

              {columns.includes(COLUMN_NAMES[0]) && <TableHead>{t(COLUMN_NAMES[0])}</TableHead>}
              {columns.includes(COLUMN_NAMES[1]) && <TableHead>{t(COLUMN_NAMES[1])}</TableHead>}
              {columns.includes(COLUMN_NAMES[2]) && <TableHead>{t(COLUMN_NAMES[2])}</TableHead>}
              {columns.includes(COLUMN_NAMES[3]) && <TableHead>{t(COLUMN_NAMES[3])}</TableHead>}
              {columns.includes(COLUMN_NAMES[4]) && <TableHead className="text-right">{t(COLUMN_NAMES[4])}</TableHead>}
            </TableRow>
          </TableHeader>

          <TableBody>
            {(currentRows || []).map((file) => (

              <TableRow className="text-left w-auto whitespace-nowrap px-4 py-2" key={file._id} onClick={() => onRowClick(file)} onDoubleClick={() => handleRowDoubleClick(file)}>
                {columns.includes(COLUMN_NAMES[0]) && <TableCell className="whitespace-nowrap pr-16 py-2">{`${file.filename} (${file._id})`}</TableCell>}
                {columns.includes(COLUMN_NAMES[1]) && <TableCell className="whitespace-nowrap pr-16 py-2">{file.file_type}</TableCell>}
                {columns.includes(COLUMN_NAMES[3]) && <TableCell className="whitespace-nowrap pr-16 py-2">{usernamesMap[file.created_by]}</TableCell>}
                {columns.includes(COLUMN_NAMES[2]) && <TableCell className="whitespace-nowrap pr-16 py-2">{new Date(file.last_edited_at).toLocaleDateString()}</TableCell>}
                {columns.includes(COLUMN_NAMES[4]) && <TableCell className="whitespace-nowrap pl-16 py-2">{new Date(file.created_at).toLocaleDateString()}</TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>}

      {/* Pagination controls */}
      <div className="flex justify-center gap-2 items-center">
        <button
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          t(Previous)
        </button>
        <span>
          t(Page) {currentPage}/{totalPages}
        </span>
        <button
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          t(Next)
        </button>
      </div>
    </div>
  );
}