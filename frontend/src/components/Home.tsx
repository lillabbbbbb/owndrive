import React from 'react'
import { TextField, Autocomplete } from "@mui/material";
import SortingDropdown from './SortingDropdown';
import FilesTable from './Table';

const Home = () => {

    const fileNames = ["file1", "dummyfile2", "sth else", "Another one"]

    const handleFilterClick = () => {
        console.log("Filter button clicked")

        //bring dialog popup window small


    }

  return (
    <div>

        <Autocomplete
      options={fileNames}
      getOptionLabel={(option) => option}
      renderInput={(params) => <TextField {...params} label="Search users" />}
    />

    <button>Create new</button>
    <SortingDropdown />
    <button onClick={() => handleFilterClick()}>Filter</button>

    <FilesTable />
       {/* Home

      //search input

      //buttons:
        //create new (button) -- open editor
        //sort (dropdown menu)
        //filter
            //from filter -- filter popup


    //condtionally render: 
        //share (button) -- popup window
        //clone (button) -- clone popup window
        //pdf (icon+text)
        //delete (icon)
        

    //table

    //pagination*/}
    </div>
  )
}

export default Home
