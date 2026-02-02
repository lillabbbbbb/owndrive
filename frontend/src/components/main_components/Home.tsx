import { useMemo, useState, useEffect, type ChangeEvent } from 'react'
import { TextField, Autocomplete } from "@mui/material";
import SortingDropdown from '../SortingDropdown';
import FilesTable from '../Table';
import EditorButtons from '../EditorButtons';
import { Input } from "../ui/input";
import { Button } from "../ui/button"
import { ControlledFilterDialog } from '../popups/FilterPopup';
import { customOption } from '../popups/FilterPopup';
import UploadFileDialog from "../popups/UploadFileDialog"
//import { IFile } from "../../../../server/src/models/File"
//import { IUser } from "../../../../server/src/models/User"
import { useNavigate } from "react-router-dom";
import { useUser } from '../../hooks/useUser';
import { useFiles } from '../../hooks/useFiles';
import { useAppContext } from "../context/globalContext";
import CustomDialog from '../popups/CustomDialog';
import { config } from 'process';
import { IFileFrontend } from '../../types/File';


export const sortingTypes = {
  by_last_modified: "Last modified",
  by_name_ascending: "By Name (Z-A)",
  by_name_descending: "By Name (A-Z)",
  by_user_descending: "By User (A-Z)",
  by_user_ascending: "By User (Z-A)"
}

const DEFAULT_FILE_NAME = "New file"

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
  date: string,
  status: string
}

export enum statusEnum {
  ACTIVE = "Active",
  ARCHIVED = "Archived"
}
enum datesEnum {
  NONE = "None",
  EDITED_TODAY = "Edited today",
  EDITED_30_DAYS = "Edited this month",
  EDITED_6_MONTHS = "Edited in 6 months",
  EDITED_1_YEAR = "Edited in a year",
  OLDER_THAN_1_YEAR = "Older than a year"
}

const Home = () => {

  const navigate = useNavigate()
  const { user, files,getFiles, getFile, updateFile, userLoading, userError, filesLoading, filesError } = useAppContext()

  const [isClicked, setClicked] = useState(false)
  const [selectedSorting, setSelectedSorting] = useState(sortingTypes.by_last_modified)
  const [sortedFilteredData, setSortedFilteredData] = useState(files)
  const [searchKeyword, setSearchKeyword] = useState("")
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showingArchives, setShowingArchives] = useState<boolean>(false)

  useEffect(() => {
    setSortedFilteredData(files);
    console.log(files)
  }, [files]);

  useEffect(() => {
    getFiles();
}, []); // empty deps → runs once

  const fileTypes = [...new Set(files.map((file: IFileFrontend) => file.file_type))]
  const ownerNames = [...new Set(files.map((file: IFileFrontend) => file.created_by))]

  const [filters, setFilters] = useState<Filters>({
    fileTypes: new Set(),
    owners: new Set(),
    date: datesEnum.NONE,
    status: statusEnum.ACTIVE
  })

  console.log(Array.from(filters.fileTypes))
  console.log(filters.owners)
  console.log(filters.date)
  console.log(filters.status)


  const fileTypeFilter: Filter<customOption> = {
    label: "By file type:",
    options: fileTypes.map(fileType => ({      // fileTypes = [...new Set(data.map(d => d.file_type))]
      label: fileType,
      value: fileType,
    })),
    type: "multi",
    selected: filters.fileTypes,           // from parent state
    onChange: (newSet) => {
      const newFilters: Filters = { ...filters, fileTypes: newSet as Set<string> }
      setFilters(newFilters)
      sortTable(searchKeyword, selectedSorting, newFilters)
    }
  }
  const ownerFilter: Filter<customOption> = {
    label: "By owner:",
    options: ownerNames.map(owner => ({      // fileTypes = [...new Set(data.map(d => d.file_type))]
      label: owner,
      value: owner,
    })),
    type: "multi",
    selected: filters.owners,
    onChange: (newSet) => {
      const newFilters: Filters = { ...filters, owners: newSet as Set<string> }
      setFilters(newFilters)
      sortTable(searchKeyword, selectedSorting, newFilters)
    }
  }
  const dateFilter: Filter<customOption> = {
    label: "By date:",
    options: Object.values(datesEnum).map(date => ({      // fileTypes = [...new Set(data.map(d => d.file_type))]
      label: date,
      value: date,
    })),
    type: "single",
    selected: filters.date,
    onChange: (newValue) => {
      const newFilters: Filters = { ...filters, date: newValue as string }
      setFilters(newFilters)
      sortTable(searchKeyword, selectedSorting, newFilters)
    }
  }
  const statusFilter: Filter<customOption> = {
    label: "By status:",
    options: Object.values(statusEnum).map(status => ({      // fileTypes = [...new Set(data.map(d => d.file_type))]
      label: status,
      value: status,
    })),
    type: "single",
    selected: filters.status,
    onChange: (newValue) => {
      const newFilters: Filters = { ...filters, status: newValue as string }
      setFilters(newFilters)
      sortTable(searchKeyword, selectedSorting, newFilters)
    }
  }
  const filterConfigs = [fileTypeFilter, ownerFilter, dateFilter, statusFilter]

  console.log(selectedSorting)
  //apply sorting to the table data and set the sortedData's new state
  const sortTable = (keyword?: string, sorting?: string, filters?: Filters) => {
    console.log("sorting the data in progress..")


    const filteredFiles = applyFilters(files, filters)
    console.log(filteredFiles)


    //filter the results based on the search yet
    const array = matchSearch([...filteredFiles], keyword)

    console.log(array)


    let sortedArray: IFileFrontend[] = []

    const selectedSorting = sorting ? sorting : sortingTypes.by_last_modified //if no sorting is selected, defaults to sort by last modified

    if (selectedSorting === sortingTypes.by_last_modified) {
      sortedArray = array.sort(
        (a, b) =>
          new Date(b.last_edited_at).getTime() -
          new Date(a.last_edited_at).getTime()
      );
    } else if (selectedSorting === sortingTypes.by_name_ascending) {
      sortedArray = [...array].sort((a, b) =>
        a.filename.localeCompare(b.filename)
      );

    } else if (selectedSorting === sortingTypes.by_name_descending) {
      sortedArray = [...array].sort((a, b) =>
        b.filename.localeCompare(a.filename)
      );
    } else if (selectedSorting === sortingTypes.by_user_ascending) {
      sortedArray = [...array].sort((a, b) =>
        a.created_by.localeCompare(b.created_by)
      );

    } else if (selectedSorting === sortingTypes.by_user_descending) {
      sortedArray = [...array].sort((a, b) =>
        b.created_by.localeCompare(a.created_by)
      );
    }
    setSortedFilteredData(sortedArray)
  }

  const matchSearch = (data: IFileFrontend[], keyword?: string) => {

    //show all results if no keyword is given
    if (!keyword) return data


    return data.filter((file) => {
      const filename = file.filename.toLowerCase();
      const creator = file.created_by.toLowerCase();

      const matchesFilename = filename.includes(keyword);
      const matchesCreator = creator.includes(keyword);

      console.log(
        `Checking user: filename="${filename}", creator="${creator}", keyword="${keyword}" => filenameMatch=${matchesFilename}, creatorMatch=${matchesCreator}`
      );

      return matchesFilename || matchesCreator;
    });

  }

  function isEditedToday(file: IFileFrontend) {
    const edited = new Date(file.last_edited_at)
    const today = new Date()
    return (
      edited.getDate() === today.getDate() &&
      edited.getMonth() === today.getMonth() &&
      edited.getFullYear() === today.getFullYear()
    )
  }
  function isEditedWithin(file: IFileFrontend, days: number) {
    const edited = new Date(file.last_edited_at)
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - days)
    return edited >= cutoff
  }
  function isOlderThan(file: IFileFrontend, days: number) {
    const edited = new Date(file.last_edited_at)
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - days)
    return edited < cutoff
  }

  const applyFilters = (files: IFileFrontend[], passedFilters: Filters = filters) => {


    const filteredFiles = files.filter(file => {
      const fileTypeMatch =
        passedFilters.fileTypes.size === 0 || passedFilters.fileTypes.has(file.file_type)

      const creatorMatch =
        passedFilters.owners.size === 0 || passedFilters.owners.has(file.created_by)

      // Single-select date
      let dateMatch = true
      switch (passedFilters.date) {
        case "":
          dateMatch = true
          break
        case datesEnum.EDITED_TODAY:
          dateMatch = isEditedToday(file)
          break
        case datesEnum.EDITED_30_DAYS:
          dateMatch = isEditedWithin(file, 30)
          break
        case datesEnum.EDITED_6_MONTHS:
          dateMatch = isEditedWithin(file, 180)
          break
        case datesEnum.EDITED_1_YEAR:
          dateMatch = isEditedWithin(file, 365)
          break
        case datesEnum.OLDER_THAN_1_YEAR:
          dateMatch = isOlderThan(file, 365)
          break
        default:
          dateMatch = true
      }

      const statusMatch =
        passedFilters.status === file.status

      console.log(file.filename)
      console.log(file.status)

      setShowingArchives(passedFilters.status === statusEnum.ARCHIVED)

      return fileTypeMatch && creatorMatch && dateMatch && statusMatch
    })

    console.log(filteredFiles)
    return filteredFiles
  }

  const handleCreateNewClick = () => {
    console.log("Create new button clicked")

    //Redirect to editor page
    navigate(`/${user?.username}/${DEFAULT_FILE_NAME}`)

  }

  const handleRowClick = () => {
    setClicked(true) //file-scoped menu appears now
  }

  const handleChangeSorting = (sorting: string) => {
    setSelectedSorting(sorting)
    sortTable(searchKeyword, sorting, filters)
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
    <div >

      <Input
        type="text"
        placeholder="Search files..."
        value={searchKeyword}
        onChange={(e) => { handleSearchChange(e) }}
        className="w-full"
      />

      <div>
        {!showingArchives &&
          <>
            <Button onClick={() => handleCreateNewClick()}>Create new</Button>
            <UploadFileDialog />
          </>
        }
        <SortingDropdown value={selectedSorting} onChange={(value) => handleChangeSorting(value)} />

        <ControlledFilterDialog filters={filterConfigs}
          onChange={
            (newFilters: Filters) => {
              setFilters(newFilters)
              sortTable()
              console.log("sorttable called in filtering")
            }}
        />
      </div>

      {userError && <CustomDialog text={userError} />}
      {userError && <p>Loading...</p>}
      {filesError && <CustomDialog heading="Error" text={filesError} />}
      {filesLoading && <p>Loading...</p>}

      {/*
      {!showingArchives && isClicked && <EditorButtons canView={canView} setCanView={setCanView} canEdit={canEdit} setCanEdit={setCanEdit} visibleToGuest={visibleToGuest} setVisibleToGuest={setVisibleToGuest} isPrivate={isPrivate} setIsPrivate={setIsPrivate} />}
      */}

      {sortedFilteredData && <FilesTable onRowClick={() => handleRowClick()} sortedFilteredData={sortedFilteredData} />}
    </div>
  )
}

export default Home
