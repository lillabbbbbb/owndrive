import { useState, type ChangeEvent } from 'react'
import { TextField, Autocomplete } from "@mui/material";
import SortingDropdown from './SortingDropdown';
import FilesTable from './Table';
import EditorButtons from './EditorButtons';
import { Input } from "../components/ui/input";
import { ControlledFilterDialog } from './FilterPopup';
import { customOption } from './FilterPopup';
import { IFile } from "../../../server/src/models/File"
import { IUser, IUserPopulated } from "../../../server/src/models/User"
import {IUserTest, IFileTest} from "../App"
import { useNavigate } from "react-router-dom";


export const sortingTypes = {
  by_last_modified: "Last modified",
  by_name_ascending: "By Name (Z-A)",
  by_name_descending: "By Name (A-Z)",
  by_user_descending: "By User (A-Z)",
  by_user_ascending: "By User (Z-A)"
}



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
  date: string
}

type HomeProps = {
  userData: IUserTest,
  setUserData: (modifiedUser : IUserTest) => void
}

const Home = ({ userData, setUserData }: HomeProps) => {

  const navigate = useNavigate()

  const getUserFiles = () => {
    return userData.files || []
  }

  const [isClicked, setClicked] = useState(true)
  const [selectedSorting, setSelectedSorting] = useState(sortingTypes.by_last_modified)
  const [sortedData, setSortedData] = useState(getUserFiles())
  const [searchKeyword, setSearchKeyword] = useState("")
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);


  const fileTypes = [...new Set(getUserFiles().map((file) => file.file_type))]
  const ownerNames = [...new Set(getUserFiles().map((file) => file.created_by))]
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
    date: "",
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
    const array = matchSearch([...getUserFiles()], keyword)

    console.log(array)


    let sortedArray: IFileTest[] = []

    if (selectedSorting === sortingTypes.by_last_modified) {
      sortedArray = array.sort(
        (a, b) =>
          new Date(b.last_edited_at).getTime() -
          new Date(a.last_edited_at).getTime()
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
        a.created_by.localeCompare(b.created_by)
      );

    } else if (selectedSorting === sortingTypes.by_user_descending) {
      sortedArray = array.sort((a, b) =>
        b.created_by.localeCompare(a.created_by)
      );
    }
    setSortedData(sortedArray)
  }

  const matchSearch = (data: IFileTest[], keyword?: string) => {

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

  const handleCreateNewClick = () => {
    console.log("Create new button clicked")

    //should redirect to editor page
    navigate(`/${userData.username}/"New file"`)
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
