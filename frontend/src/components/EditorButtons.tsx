import React, { ReactElement, useState } from 'react'
import { Tooltip, TooltipTrigger, TooltipContent } from "../components/ui/tooltip"
import { HiShare } from "react-icons/hi2";
import SharePopup from './popups/SharePopup';
import { ClonePopup } from './popups/ClonePopup';
import { useFiles } from '../hooks/useFiles'
import { useAppContext } from "./context/globalContext";
import CustomDialog from './popups/CustomDialog';
import {
    Dialog,
    DialogContent,
    DialogClose,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog"
import { Label } from "./ui/label"
import { Button } from "./ui/button"

const EditorButtons = () => {

  const [PDFDialogOpen, setPDFDialogOpen] = useState<boolean>(false)
  const {currentFileId, createFile, updateFile, filesLoading, filesError} = useAppContext()


  const handleCloneButtonClick = () => {
    console.log("Clone button clicked, clone window should pop up")


  }
  const handlePDFButtonClick = () => {
    console.log("PDF button clicked, cool sonner banner should appear after successful download")

    setPDFDialogOpen(true)

    //Handle PDF download logic


    //display sonner

  }
  const handleDeleteButtonClick = () => {
    console.log("Delete button clicked, reassuring window should pop up")

    //set file's status to "archived"
    updateFile(currentFileId, {status: "archived"})
  }


  return (
    <div>
      
      {filesError && <CustomDialog heading="Error" text={filesError} />}
      {filesLoading && <p>Loading...</p>}

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
            onClick={() => setPDFDialogOpen(true)}
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

      <Dialog open={PDFDialogOpen} onOpenChange={setPDFDialogOpen}>
                <DialogContent>
                    {/*<DialogHeader>
            <DialogTitle>Yes</DialogTitle>
          </DialogHeader>*/}

                    <div className="flex flex-col gap-4">

                        <Label>This feature is not available yet.</Label>

                        <Label>
                            ...</Label>

                    </div>
                    <DialogClose asChild>
                        <Button variant="outline">OK</Button>
                    </DialogClose>

                </DialogContent>
            </Dialog>

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
