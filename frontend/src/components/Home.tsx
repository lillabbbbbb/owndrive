import React, { useState } from 'react'
import { TextField, Autocomplete } from "@mui/material";
import SortingDropdown from './SortingDropdown';
import FilesTable from './Table';
import EditorButtons from './EditorButtons';

const Home = () => {

    const fileNames = ["file1", "dummyfile2", "sth else", "Another one"]

    const [isClicked, setClicked] = useState(true)

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

    return (
        <div>

            <Autocomplete
                options={fileNames}
                getOptionLabel={(option) => option}
                renderInput={(params) => <TextField {...params} label="Search users" />}
            />

            <div>
                <button onClick={() => handleCreateNewClick()}>Create new</button>
                <SortingDropdown />
                <button onClick={() => handleFilterClick()}>Filter</button>
            </div>

        {isClicked && <EditorButtons/>}


            <FilesTable onClick={() => handleRowClick()}/>
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
