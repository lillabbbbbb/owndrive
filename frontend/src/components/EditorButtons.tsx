import React, { ReactElement, useState, RefObject, useEffect } from 'react'
import { Tooltip, TooltipTrigger, TooltipContent } from "../components/ui/tooltip"
import { HiShare } from "react-icons/hi2";
import SharePopup from './popups/SharePopup';
import { ClonePopup } from './popups/ClonePopup';
import { useFiles } from '../hooks/useFiles'
import { usePDF } from 'react-to-pdf';
import { useAppContext } from "./context/globalContext";
import CustomDialog from './popups/CustomDialog';
import { toast } from 'sonner';
import { THEME } from "../theme" 
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { Label } from "./ui/label"
import { Button } from "./ui/button"
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

interface EditorButtonsProps {
  htmlContent: string
}

const EditorButtons = ({ htmlContent }: EditorButtonsProps) => {

  const { t } = useTranslation()
const { lightMode } = useAppContext()
  const { downloadPDF, currentFileId, createFile, updateFile, filesLoading, filesError } = useAppContext()
  const [PDFDialogOpen, setPDFDialogOpen] = useState<boolean>(false)

  console.log(currentFileId)

  useEffect(() => {
    toast.error(filesError)
    if (filesLoading) {
      toast.loading("Loading...")
    }
  }, [filesError, filesLoading])

  const handlePDFButtonClick = () => {
    console.log("PDF button clicked, cool sonner banner should appear after successful download")

    //setPDFDialogOpen(true)

    //Handle PDF download logic
    console.log(htmlContent)
    downloadPDF(htmlContent)

    //display sonner

  }
  const handleDeleteButtonClick = () => {
    console.log("Delete button clicked, reassuring window should pop up")
    //set file's status to "archived"
    updateFile(currentFileId!, { status: "archived" })
  }


  return (
    <div>

      <Tooltip>
        <TooltipTrigger asChild>
          <SharePopup />

        </TooltipTrigger>
        <TooltipContent className={clsx(THEME.tooltip(lightMode),)} side="top">
          {t("editor-buttons.share")}
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <ClonePopup />
        </TooltipTrigger>
        <TooltipContent className={clsx(THEME.tooltip(lightMode),)} side="top">
          {t("editor-buttons.clone")}
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => handlePDFButtonClick()}
            className={clsx(THEME.button.primary(lightMode),
              "rounded bg-sky-600 px-4 py-2 text-sm text-white data-active:bg-sky-700 data-hover:bg-sky-500")}
          >
            {("PDF")}
          </button>
        </TooltipTrigger>
        <TooltipContent className={clsx(THEME.tooltip(lightMode),)} side="top">
          {t("editor-buttons.download-PDF")}
        </TooltipContent>
      </Tooltip>

      <Dialog open={PDFDialogOpen} onOpenChange={setPDFDialogOpen}>
        <DialogContent>
          {/*<DialogHeader>
            <DialogTitle>Yes</DialogTitle>
          </DialogHeader>*/}

          <div className="flex flex-col gap-4">

            <Label>{("This feature is not available yet.")}</Label>

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
            onClick={() => handleDeleteButtonClick()}
            className={clsx(THEME.button.primary(lightMode),
              "rounded bg-sky-600 px-4 py-2 text-sm text-white data-active:bg-sky-700 data-hover:bg-sky-500")}
          >
            D
          </button>
        </TooltipTrigger>
        <TooltipContent className={clsx(THEME.tooltip(lightMode),)} side="top">
          {t("archive.delete")}
        </TooltipContent>
      </Tooltip>

    </div>
  )
}

export default EditorButtons
