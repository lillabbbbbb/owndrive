import React, { ReactElement } from 'react'
import { Button } from '@mui/material'
import { Tooltip, TooltipTrigger, TooltipContent } from "../components/ui/tooltip"
import { HiShare } from "react-icons/hi2";
import SharePopup from './popups/SharePopup';
import { ClonePopup } from './popups/ClonePopup';

interface EditorButtonsProps {
  tooltip: string         // Tooltip text
  visibleElement: Element        // tsx component
  onClick: () => void   // click handler
  file: string
}

const EditorButtons = () => {

  const handleShareButtonClick = () => {
    console.log("Share button clicked, small window should pop up")

    //Sharepopup
  }

  const handleCloneButtonClick = () => {
    console.log("Clone button clicked, clone window should pop up")


  }
  const handlePDFButtonClick = () => {
    console.log("PDF button clicked, cool sonner banner should appear after successful download")

    //Handle PDF download logic


    //display sonner

  }
  const handleDeleteButtonClick = () => {
    console.log("Delete button clicked, reassuring window should pop up")

    //set file's status to "archived"

  }


  return (
    <div>
      

      <Tooltip>
        <TooltipTrigger asChild>
          <SharePopup />
          
        </TooltipTrigger>
        <TooltipContent side="top">
          Share
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <ClonePopup />
        </TooltipTrigger>
        <TooltipContent side="top">
          Clone
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => handleCloneButtonClick}
            className={
              "rounded bg-sky-600 px-4 py-2 text-sm text-white data-active:bg-sky-700 data-hover:bg-sky-500"}
          >
            PDF
          </button>
        </TooltipTrigger>
        <TooltipContent side="top">
          Download PDF
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => handleCloneButtonClick}
            className={
              "rounded bg-sky-600 px-4 py-2 text-sm text-white data-active:bg-sky-700 data-hover:bg-sky-500"}
          >
            D
          </button>
        </TooltipTrigger>
        <TooltipContent side="top">
          Delete
        </TooltipContent>
      </Tooltip>

    </div>
  )
}

export default EditorButtons
