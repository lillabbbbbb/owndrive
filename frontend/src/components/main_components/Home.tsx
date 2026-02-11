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
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner';

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
  ACTIVE = "active",
  ARCHIVED = "archived"
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

  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, files = [], getFiles, getFile, updateFile, setCurrentFileId, restoreAllArchived, deleteAllArchived, userLoading, userError, filesLoading, filesError } = useAppContext()

  const [isClicked, setClicked] = useState(false)
  const [selectedSorting, setSelectedSorting] = useState(sortingTypes.by_last_modified)
  const [searchKeyword, setSearchKeyword] = useState("")
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showingArchives, setShowingArchives] = useState<boolean>(false)

  console.log(localStorage.getItem("token"))

  useEffect(() => {
    getFiles();
    setCurrentFileId(null)
    sessionStorage.removeItem("fileId")
  }, []);

  useEffect(() => {
    toast.error(filesError)
    if (filesLoading || userLoading) {
      toast.loading("Loading...")
    }
    toast.error(userError)
  }, [filesError, filesLoading, userError, userLoading])

  const fileTypes = [...new Set((files || []).map((file: IFileFrontend) => file.file_type))]
  const ownerNames = [...new Set((files || []).map((file: IFileFrontend) => file.created_by))]
  //console.log(fileTypes)
  //console.log(ownerNames)
  //console.log(files.toLocaleString)

  const [filters, setFilters] = useState<Filters>({
    fileTypes: new Set(),
    owners: new Set(),
    date: datesEnum.NONE,
    status: statusEnum.ACTIVE
  })

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
    }
  }
  const filterConfigs = [fileTypeFilter, ownerFilter, dateFilter, statusFilter]

  //console.log(selectedSorting)
  //apply sorting to the table data and set the sortedData's new state
  const sortTable = (files: IFileFrontend[], sorting?: string) => {
    console.log("sorting the data in progress..")


    let sortedArray: IFileFrontend[] = []

    const selectedSorting = sorting ? sorting : sortingTypes.by_last_modified //if no sorting is selected, defaults to sort by last modified

    if (selectedSorting === sortingTypes.by_last_modified) {
      sortedArray = files.sort(
        (a, b) =>
          new Date(b.last_edited_at).getTime() -
          new Date(a.last_edited_at).getTime()
      );
    } else if (selectedSorting === sortingTypes.by_name_ascending) {
      sortedArray = [...files].sort((a, b) =>
        a.filename.localeCompare(b.filename)
      );

    } else if (selectedSorting === sortingTypes.by_name_descending) {
      sortedArray = [...files].sort((a, b) =>
        b.filename.localeCompare(a.filename)
      );
    } else if (selectedSorting === sortingTypes.by_user_ascending) {
      sortedArray = [...files].sort((a, b) =>
        a.created_by.localeCompare(b.created_by)
      );

    } else if (selectedSorting === sortingTypes.by_user_descending) {
      sortedArray = [...files].sort((a, b) =>
        b.created_by.localeCompare(a.created_by)
      );
    }
    return sortedArray
  }

  const matchSearch = (data: IFileFrontend[], keyword?: string) => {

    //show all results if no keyword is given
    if (!keyword || keyword === "") return data


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
    // First, determine if we're showing archives
    setShowingArchives(passedFilters.status === statusEnum.ARCHIVED)

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

      const statusMatch = passedFilters.status === file.status

      console.log(file.filename)
      console.log(file.status)

      return fileTypeMatch && creatorMatch && dateMatch && statusMatch
    })

    console.log(filteredFiles)
    return filteredFiles
  }

  const sortedFilteredData = useMemo(() => {
    if (!files || files.length === 0) return [];

    //console.log('🔄 Recalculating sorted/filtered data...');
    //console.log("Search keyword:", searchKeyword)
    const searched = matchSearch(files, searchKeyword);
    //console.log('✅ Search:', searched.length, 'items');
    //console.log(searched.toString())
    const searchedFiltered = applyFilters(searched, filters);
    //console.log('✅ After filtering:', searchedFiltered.length, 'items');
    const sorted = sortTable(searchedFiltered, selectedSorting);

    //console.log('✅ Result:', sorted.length, 'items');
    return sorted;
  }, [files, filters, searchKeyword, selectedSorting]);

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
  }

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim()
    setSearchKeyword(value)
    //console.log("Keyword changed to " + value)

    // Clear previous timeout if user keeps typing
    if (debounceTimeout) clearTimeout(debounceTimeout);


    // Set a new timeout to call sortTable after 300ms
    const timeout = setTimeout(() => {
      //sortTable(files, value); // pass the latest value
    }, 300);

    setDebounceTimeout(timeout);
  }

  const handleRestoreAll = () => {
    restoreAllArchived()
  }

  const handleDeleteAll = () => {
    deleteAllArchived()
  }



  return (
    <div >

      <Input
        type="text"
        placeholder={t("home.search-placeholder")}
        value={searchKeyword}
        onChange={(e) => { handleSearchChange(e) }}
        className="w-full"
      />

      <div>
        <SortingDropdown value={selectedSorting} onChange={(value) => handleChangeSorting(value)} />

        <ControlledFilterDialog filters={filterConfigs}
          onChange={
            (newFilters: Filters) => {
              setFilters(newFilters)
              console.log("sorttable called in filtering")
            }}
        />
      </div>
      {!showingArchives &&
        <>
          <Button onClick={() => handleCreateNewClick()}>{t("home.create-new")}</Button>
          <UploadFileDialog />
        </>
      }
      {
        showingArchives &&
        <>
          <Button onClick={() => handleRestoreAll()}>{t("restore-all")}</Button>
          <Button onClick={() => handleDeleteAll()}>{t("delete-all")}</Button>
        </>
      }

      {/*
      {!showingArchives && isClicked && <EditorButtons canView={canView} setCanView={setCanView} canEdit={canEdit} setCanEdit={setCanEdit} visibleToGuest={visibleToGuest} setVisibleToGuest={setVisibleToGuest} isPrivate={isPrivate} setIsPrivate={setIsPrivate} />}
      */}

      {sortedFilteredData && <FilesTable onRowClick={() => handleRowClick()} sortedFilteredData={sortedFilteredData} />}
    </div>
  )
}

export default Home
