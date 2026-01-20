import { useState } from 'react'
import { TextField, Autocomplete } from "@mui/material";
import SortingDropdown from './SortingDropdown';
import FilesTable from './Table';
import EditorButtons from './EditorButtons';

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
  { filename: "report4.docx", file_type: "Document", creator: "Alice", last_modified: "2026-01-07 12:00" },
  { filename: "presentation4.pptx", file_type: "Presentation", creator: "Bob", last_modified: "2026-01-06 16:45" },
  { filename: "photo4.png", file_type: "Image", creator: "Charlie", last_modified: "2026-01-05 09:30" },
  { filename: "data4.csv", file_type: "Spreadsheet", creator: "Alice", last_modified: "2026-01-04 14:10" },
  { filename: "report5.docx", file_type: "Document", creator: "Bob", last_modified: "2026-01-03 11:20" },
  { filename: "presentation5.pptx", file_type: "Presentation", creator: "Charlie", last_modified: "2026-01-02 17:35" },
  { filename: "photo5.png", file_type: "Image", creator: "Alice", last_modified: "2026-01-01 08:50" },
  { filename: "data5.csv", file_type: "Spreadsheet", creator: "Bob", last_modified: "2025-12-31 19:15" },
];

const Home = () => {

    const fileNames = ["file1", "dummyfile2", "sth else", "Another one"]


    const [isClicked, setClicked] = useState(true)
    const [selectedSorting, setSelectedSorting] = useState(sortingTypes.by_last_modified)
    const [sortedData, setSortedData] = useState(usersData)

    const data = usersData

    console.log(sortedData)
    console.log(selectedSorting)

    //apply sorting to the table data and set the sortedData's new state
    const sortTable = () => {
        console.log("sorting the data in progress..")
    
        const array = [...data]
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

    

    return (
        <div>

            <Autocomplete
                options={fileNames}
                getOptionLabel={(option) => option}
                renderInput={(params) => <TextField {...params} label="Search files" />}
            />

            <div>
                <button onClick={() => handleCreateNewClick()}>Create new</button>
                <SortingDropdown value={selectedSorting} onChange={(value) => handleChangeSorting(value)}/>
                <button onClick={() => handleFilterClick()}>Filter</button>
            </div>

        {isClicked && <EditorButtons/>}


            <FilesTable onRowClick={() => handleRowClick()} sortedData={sortedData}/>
            {/* Home

      //search input

      //buttons:
        //create new (button) -- open editor
        //sort (dropdown menu)
        //filter
            //from filter -- filter popup

        

    //table

    //pagination*/}
        </div>
    )
}

export default Home
