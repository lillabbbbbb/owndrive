import { useState, type ChangeEvent } from 'react'
import { TextField, Autocomplete } from "@mui/material";
import SortingDropdown from './SortingDropdown';
import FilesTable from './Table';
import EditorButtons from './EditorButtons';
import { Input } from "../components/ui/input";
import { ControlledFilterDialog } from './FilterPopup';
import { customOption } from './FilterPopup';

export const sortingTypes = {
  by_last_modified: "Last modified",
  by_name_ascending: "By Name (Z-A)",
  by_name_descending: "By Name (A-Z)",
  by_user_descending: "By User (A-Z)",
  by_user_ascending: "By User (Z-A)"
}

export interface User {
  filename: string;
  file_type: string;
  creator: string;
  last_modified: string;
}

const usersData: User[] = [
  { filename: "report1", file_type: ".docx", creator: "Alice", last_modified: "2026-01-19 09:30" },
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
  { filename: "report4.docx", file_type: "Document", creator: "Alice", last_modified: "2026-01-07 12:00" },
  { filename: "presentation4.pptx", file_type: "Presentation", creator: "Bob", last_modified: "2026-01-06 16:45" },
  { filename: "photo4.png", file_type: "Image", creator: "Charlie", last_modified: "2026-01-05 09:30" },
  { filename: "data4.csv", file_type: "Spreadsheet", creator: "Alice", last_modified: "2026-01-04 14:10" },
  { filename: "report5.docx", file_type: "Document", creator: "Bob", last_modified: "2026-01-03 11:20" },
  { filename: "presentation5.pptx", file_type: "Presentation", creator: "Charlie", last_modified: "2026-01-02 17:35" },
  { filename: "photo5.png", file_type: "Image", creator: "Alice", last_modified: "2026-01-01 08:50" },
  { filename: "data5.csv", file_type: "Spreadsheet", creator: "Bob", last_modified: "2025-12-31 19:15" },
];


type FilterValue = string | Set<string>
export interface Filter<customOption> {
  label: string,                    // human-readable label
  options: customOption[],                   // available choices
  selected: FilterValue               // current selected value(s)
  type: "single" | "multi"        // type of filter
  onChange: (newValue: FilterValue) => void // update callback
}

export interface Filters {
  fileTypes: Set<string>
  owners: Set<string>
  date: Set<string>
}

const Home = () => {

  const [isClicked, setClicked] = useState(true)
  const [selectedSorting, setSelectedSorting] = useState(sortingTypes.by_last_modified)
  const [sortedData, setSortedData] = useState(usersData)
  const [searchKeyword, setSearchKeyword] = useState("")
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);


  const data = usersData

  const fileTypes = [...new Set(data.map((user) => user.file_type))]
  const ownerNames = [...new Set(data.map((user) => user.creator))]
  enum datesEnum {
  NONE = "None",
  EDITED_TODAY = "Edited today",
  EDITED_30_DAYS = "Edited this month",
  EDITED_6_MONTHS = "Edited in 6 months",
  EDITED_1_YEAR = "Edited in a year",
  OLDER_THAN_1_YEAR = "Older than a year"
}

  const [filters, setFilters] = useState<Filters>({
    fileTypes: new Set(),
    owners: new Set(),
    date: new Set(),
  })

  console.log(Array.from(filters.fileTypes))
  console.log(filters.owners)
  console.log(filters.date)


  const fileTypeFilter: Filter<customOption> = {
    label: "By file type:",
    options: fileTypes.map(fileType => ({      // fileTypes = [...new Set(data.map(d => d.file_type))]
      label: fileType,
      value: fileType,
    })),
    type: "multi",
    selected: filters.fileTypes,           // from parent state
    onChange: (newSet) =>
      setFilters(prev => ({ ...prev, fileTypes: newSet as Set<string> }))
  }

  const ownerFilter: Filter<customOption> = {
    label: "By owner:",
    options: ownerNames.map(owner => ({      // fileTypes = [...new Set(data.map(d => d.file_type))]
      label: owner,
      value: owner,
    })),
    type: "multi",
    selected: filters.owners,
    onChange: (newSet) =>
      setFilters(prev => ({ ...prev, owners: newSet as Set<string> }))
  }

  const dateFilter: Filter<customOption> = {
    label: "By date:",
    options: Object.values(datesEnum).map(date => ({      // fileTypes = [...new Set(data.map(d => d.file_type))]
      label: date,
      value: date,
    })),
    type: "single",
    selected: filters.date,
    onChange: (newValue) =>
      setFilters(prev => ({ ...prev, date: newValue as string })),
  }

  const filterConfigs = [fileTypeFilter, ownerFilter, dateFilter]


  console.log(selectedSorting)

  //apply sorting to the table data and set the sortedData's new state
  const sortTable = (keyword?: string) => {
    console.log("sorting the data in progress..")


    //filter the results based on the search yet
    const array = matchSearch([...data], keyword)

    console.log(array)


    let sortedArray: User[] = []

    if (selectedSorting === sortingTypes.by_last_modified) {
      sortedArray = array.sort(
        (a, b) =>
          new Date(b.last_modified).getTime() -
          new Date(a.last_modified).getTime()
      );
    } else if (selectedSorting === sortingTypes.by_name_ascending) {
      sortedArray = array.sort((a, b) =>
        a.filename.localeCompare(b.filename)
      );

    } else if (selectedSorting === sortingTypes.by_name_descending) {
      sortedArray = array.sort((a, b) =>
        b.filename.localeCompare(a.filename)
      );
    } else if (selectedSorting === sortingTypes.by_user_ascending) {
      sortedArray = array.sort((a, b) =>
        a.creator.localeCompare(b.creator)
      );

    } else if (selectedSorting === sortingTypes.by_user_descending) {
      sortedArray = array.sort((a, b) =>
        b.creator.localeCompare(a.creator)
      );
    }
    setSortedData(sortedArray)
  }

  const matchSearch = (data: User[], keyword?: string) => {

    //show all results if no keyword is given
    if (!keyword) return data


    return data.filter((user) => {
      const filename = user.filename.toLowerCase();
      const creator = user.creator.toLowerCase();

      const matchesFilename = filename.includes(keyword);
      const matchesCreator = creator.includes(keyword);

      console.log(
        `Checking user: filename="${filename}", creator="${creator}", keyword="${keyword}" => filenameMatch=${matchesFilename}, creatorMatch=${matchesCreator}`
      );

      return matchesFilename || matchesCreator;
    });

  }

  const handleCreateNewClick = () => {
    console.log("Create new button clicked")

    //should redirect to editor page
  }

  const handleFilterClick = () => {
    console.log("Filter button clicked")

    //bring dialog popup window small


  }
  const handleRowClick = () => {
    setClicked(true) //file-scoped menu appears now
  }

  const handleChangeSorting = (sorting: string) => {
    setSelectedSorting(sorting)
    sortTable()
  }

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim()
    setSearchKeyword(value)
    console.log("Keyword changed to " + value)

    // Clear previous timeout if user keeps typing
    if (debounceTimeout) clearTimeout(debounceTimeout);


    // Set a new timeout to call sortTable after 300ms
    const timeout = setTimeout(() => {
      sortTable(value); // pass the latest value
    }, 300);

    setDebounceTimeout(timeout);
  }



  return (
    <div>

      <Input
        type="text"
        placeholder="Search files..."
        value={searchKeyword}
        onChange={(e) => { handleSearchChange(e) }}
        className="w-full"
      />

      <div>
        <button onClick={() => handleCreateNewClick()}>Create new</button>
        <SortingDropdown value={selectedSorting} onChange={(value) => handleChangeSorting(value)} />

        <ControlledFilterDialog filters={filterConfigs} onChange={(newFilters: Filters) => setFilters(newFilters)} />
      </div>

      {isClicked && <EditorButtons />}


      <FilesTable onRowClick={() => handleRowClick()} sortedData={sortedData} />
      {/* 

        //filter
            //from filter -- filter popup
          */}
    </div>
  )
}

export default Home
