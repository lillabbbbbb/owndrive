import React, { ReactElement, useState } from 'react'
import { Tooltip, TooltipTrigger, TooltipContent } from "../components/ui/tooltip"
import { HiShare } from "react-icons/hi2";
import SharePopup from './popups/SharePopup';
import { ClonePopup } from './popups/ClonePopup';
import {
    Dialog,
    DialogContent,
    DialogClose,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog"
import { Label } from "./ui/label"
import { Button } from "./ui/button"

interface EditorButtonsProps {
  canView: string[],
  canEdit: string[],
  visibleToGuest: boolean,
  isPrivate: boolean,
  setCanView: (users: string[]) => void,
  setCanEdit: (users: string[]) => void,
  setVisibleToGuest: (b: boolean) => void,
  setIsPrivate: (b: boolean) => void,
}

const EditorButtons = ({canView, canEdit, isPrivate, visibleToGuest, setCanView, setCanEdit, setIsPrivate, setVisibleToGuest} : EditorButtonsProps) => {

  const [PDFDialogOpen, setPDFDialogOpen] = useState<boolean>(false)


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

  }


  return (
    <div>
      

      <Tooltip>
        <TooltipTrigger asChild>
          <SharePopup canView={canView} setCanView={setCanView} canEdit={canEdit} setCanEdit={setCanEdit} visibleToGuest={visibleToGuest} setVisibleToGuest={setVisibleToGuest} isPrivate={isPrivate} setIsPrivate={setIsPrivate}/>
          
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
