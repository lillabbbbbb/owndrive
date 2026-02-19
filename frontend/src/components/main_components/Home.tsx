import { useMemo, useState, useEffect, type ChangeEvent } from 'react'
import SortingDropdown from '../SortingDropdown';
import FilesTable from '../Table';
import { Input } from "../ui/input";
import { Button } from "../ui/button"
import { ControlledFilterDialog } from '../popups/FilterPopup';
import { customOption } from '../popups/FilterPopup';
import UploadFileDialog from "../popups/UploadFileDialog"
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/globalContext";
import { IFileFrontend } from '../../types/File';
import { useTranslation } from 'react-i18next'
import { THEME } from "../../theme"
import clsx from 'clsx';

export const sortingTypes = {
  by_last_modified: "home.sort-option.last-modified",
  by_name_ascending: "home.sort-option.by-name-ascending",
  by_name_descending: "home.sort-option.by-name-descending",
  by_user_descending: "home.sort-option.by-creator-descending",
  by_user_ascending: "home.sort-option.by-creator-ascending"
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

export const statuses = {
  ACTIVE: { label: "filter-options.status.active", value: "Active" },
  ARCHIVED: { label: "filter-options.status.archived", value: "Archived" }
} as const;
enum datesEnum {
  NONE = "filter-options.date-options.none",
  EDITED_TODAY = "filter-options.date-options.edited-today",
  EDITED_30_DAYS = "filter-options.date-options.edited-30-days",
  EDITED_6_MONTHS = "filter-options.date-options.edited-6-months",
  EDITED_1_YEAR = "filter-options.date-options.edited-1-year",
  OLDER_THAN_1_YEAR = "filter-options.date-options.older-than-1-year"
}

const Home = () => {

  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, files = [], getFiles, getUsername, getFile, updateFile, setCurrentFileId, restoreAllArchived, deleteAllArchived, userLoading, userError, filesLoading, filesError } = useAppContext()

  const { lightMode } = useAppContext()
  const [isClicked, setClicked] = useState(false)
  const [selectedSorting, setSelectedSorting] = useState(sortingTypes.by_last_modified)
  const [searchKeyword, setSearchKeyword] = useState("")
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showingArchives, setShowingArchives] = useState<boolean>(false)
  const [ownerOptions, setOwnerOptions] = useState<customOption[]>([]);

  //console.log(localStorage.getItem("token"))

  useEffect(() => {
    getFiles();
    setCurrentFileId(null)
    sessionStorage.removeItem("fileId")
  }, []);

  const fileTypes = [...new Set((files || []).map((file: IFileFrontend) => file.file_type))]
  const ownerNames = [...new Set((files || []).map((file: IFileFrontend) => file.created_by))]
  //console.log(fileTypes)
  //console.log(ownerNames)
  //console.log(files.toLocaleString)

  useEffect(() => {
  const loadOwners = async () => {
    const results = await Promise.all(
      ownerNames.map(async (id) => {
        const name = await getUsername(id);
        return {
          label: name ?? "Unknown",
          value: id,
        };
      })
    );

    setOwnerOptions(results);
  };

  loadOwners();
}, [ownerNames]);

  const [filters, setFilters] = useState<Filters>({
    fileTypes: new Set(),
    owners: new Set(),
    date: datesEnum.NONE,
    status: statuses.ACTIVE.value
  })

  const fileTypeFilter: Filter<customOption> = {
    label: "filter-options.by-file-type",
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
    label: "filter-options.by-owner",
    options: ownerOptions,
    type: "multi",
    selected: filters.owners,
    onChange: (newSet) => {
      const newFilters: Filters = { ...filters, owners: newSet as Set<string> }
      setFilters(newFilters)
    }
  }
  const dateFilter: Filter<customOption> = {
    label: "filter-options.by-date",
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
    label: "filter-options.by-status",
    options: Object.values(statuses),
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
    //console.log("sorting the data in progress..")


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
    if (!keyword || keyword.trim() === "") return data


    return data.filter((file) => {
      const filename = file.filename.toLowerCase()
      const creator = file.created_by.toLowerCase()
      const content = file.content?.toLowerCase()

      const matchesFilename = filename.includes(keyword.toLowerCase());
      const matchesCreator = creator.includes(keyword.toLowerCase());
      const matchesContent = content?.includes(keyword.toLowerCase()) || false;

      console.log(
        `Checking user: filename="${filename}", creator="${creator}", content="${content}", keyword="${keyword}" => filenameMatch=${matchesFilename}, creatorMatch=${matchesCreator}, contentMatch=${matchesContent}`
      );

      return matchesFilename || matchesCreator || matchesContent;
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
    setShowingArchives(passedFilters.status === statuses.ARCHIVED.value)
    console.log(passedFilters.status)
    console.log(statuses.ARCHIVED.value)

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

      const statusMatch = passedFilters.status.toLowerCase() === file.status

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

  const handleChangeSorting = (sorting: string) => {
    setSelectedSorting(sorting)
  }

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
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
    <div className="min-h-screen bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* Search, Sorting, and Filter - all on same row */}
        <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-3 mb-6 items-center">
          {/* Sorting and Filter buttons - LEFT SIDE */}
          <div className="flex gap-2 sm:gap-3 shrink-0 order-1 sm:order-2">
            <SortingDropdown value={selectedSorting} onChange={handleChangeSorting} />
            <ControlledFilterDialog
              filters={filterConfigs}
              onChange={(newFilters: Filters) => setFilters(newFilters)}
            />
          </div>

          {/* Search bar with icon on right - TAKES REMAINING SPACE */}
          <div className="relative flex-1 w-full sm:w-auto order-2 sm:order-1">
            <Input
              type="text"
              placeholder={t("home.search-placeholder")}
              value={searchKeyword}
              onChange={handleSearchChange}
              className={clsx(
                THEME.input.field(lightMode),
                "w-full text-sm sm:text-base pr-10"
              )}
            />

            {/* Search icon on the right */}
            {!searchKeyword && (
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}

            {/* Clear button */}
            {searchKeyword && (
              <button
                onClick={() => setSearchKeyword("")}
                className={clsx(
                  "absolute right-3 top-1/2 -translate-y-1/2 transition-colors rounded-full p-1",
                 )}
                aria-label="Clear search"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          {/* ===== Action Buttons ===== */}
          <div className="relative flex-1 sm:w-auto order-3 sm:order-3">
            {!showingArchives && (
              <>
                <Button
                  className={clsx(THEME.button.primary(lightMode), "text-sm sm:text-base px-3 sm:px-4 py-2")}
                  onClick={handleCreateNewClick}
                >
                  {t("home.create-new")}
                </Button>
                <UploadFileDialog />
              </>
            )}

            {showingArchives && (
              <>
                <Button
                  className={clsx(THEME.button.secondary(lightMode), "text-sm sm:text-base px-3 sm:px-4 py-2")}
                  onClick={handleRestoreAll}
                >
                  {t("archive.restore-all")}
                </Button>
                <Button
                  className={clsx(THEME.button.dangerous(lightMode), "text-sm sm:text-base px-3 sm:px-4 py-2")}
                  onClick={handleDeleteAll}
                >
                  {t("archive.delete-all")}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* ===== Files Table / Main Content ===== */}
        <div className="w-full overflow-x-auto">
          {sortedFilteredData.length > 0 ? (
            <FilesTable
              sortedFilteredData={sortedFilteredData}
            />
          ) : (
            <div className="text-center py-12 sm:py-20">
              <p className={clsx(
                THEME.text.muted(lightMode),
                "text-sm sm:text-base"
              )}>
                {t("home.no-results")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div >
  )
}

export default Home