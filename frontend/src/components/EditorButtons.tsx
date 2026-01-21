import React, { ReactElement } from 'react'
import { Button } from '@mui/material'
import { Tooltip, TooltipTrigger, TooltipContent } from "../components/ui/tooltip"
import { HiShare } from "react-icons/hi2";

interface MenuButtonsConfig {
  tooltip: string         // Tooltip text
  visibleElement: Element        // tsx component
  onClick: () => void   // click handler
}

const EditorButtons = () => {

  const handleShareButtonClick = () => {
    console.log("Share button clicked, small window should pop up")
  }
  const handleCloneButtonClick = () => {
    console.log("Share button clicked, clone window should pop up")
  }
  const handlePDFButtonClick = () => {
    console.log("PDF button clicked, cool sonner banner should appear")
  }
  const handleDeleteButtonClick = () => {
    console.log("Delete button clicked, reassuring window should pop up")
  }

  
  /*
const toolbarButtons: MenuButtonsConfig[] = [
  {
    tooltip: "Share",
    visibleElement: <HiShare />,
    onClick: handleShareButtonClick,
  },
  {
    tooltip: "Clone",
    visibleElement: "/icons/clone.png",
    onClick: handleCloneButtonClick,
  }
  // Add all other buttons here
]
  */

  return (
    <div>
      

      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => handleShareButtonClick}
            className={
              "rounded bg-sky-600 px-4 py-2 text-sm text-white data-active:bg-sky-700 data-hover:bg-sky-500"}
          >
            <HiShare className="w-5 h-5" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top">
          Share
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => handleCloneButtonClick}
            className={
              "rounded bg-sky-600 px-4 py-2 text-sm text-white data-active:bg-sky-700 data-hover:bg-sky-500"}
          >
            C
          </button>
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
