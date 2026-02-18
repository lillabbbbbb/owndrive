import React, { useState, useEffect } from 'react'
import { Tooltip, TooltipTrigger, TooltipContent } from "../components/ui/tooltip"
import SharePopup from './popups/SharePopup';
import { ClonePopup } from './popups/ClonePopup';
import { useAppContext } from "./context/globalContext";
import { toast } from 'sonner';
import { THEME } from "../theme"
import {
  Dialog,
  DialogContent,
  DialogClose,
} from "./ui/dialog"
import { Label } from "./ui/label"
import { Button } from "./ui/button"
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { useTheme } from "../components/context/ThemeContext"

interface EditorButtonsProps {
  htmlContent: string
}

const EditorButtons = ({ htmlContent }: EditorButtonsProps) => {

  const { t } = useTranslation()
  const { lightMode } = useTheme()
  const { downloadPDF, currentFileId, currentFile, updateFile, filesLoading, filesError } = useAppContext()
  const [PDFDialogOpen, setPDFDialogOpen] = useState<boolean>(false)

  console.log(currentFileId)

  useEffect(() => {
    toast.error(filesError)
    if (filesLoading) {
    }
  }, [filesError, filesLoading])

  const handlePDFButtonClick = () => {
    //console.log("PDF button clicked, cool sonner banner should appear after successful download")

    //setPDFDialogOpen(true)

    //Handle PDF download logic
    //console.log(htmlContent)
    downloadPDF(htmlContent)

    //display sonner

  }
  const handleDeleteButtonClick = () => {
    //console.log("Delete button clicked, reassuring window should pop up")
    //set file's status to "archived"
    updateFile(currentFileId!, { status: "archived" })
  }


  return (
    <div>

      <Tooltip>
        <TooltipTrigger asChild>
          <SharePopup />

        </TooltipTrigger>
        <TooltipContent className={clsx(THEME.tooltip.base(lightMode),)} side="top">
          {t("editor-buttons.share")}
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <ClonePopup />
        </TooltipTrigger>
        <TooltipContent className={clsx(THEME.tooltip.base(lightMode),)} side="top">
          {t("editor-buttons.clone")}
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => handlePDFButtonClick()}
            className={clsx(THEME.button.primary(lightMode),)}
          >
            {("PDF")}
          </button>
        </TooltipTrigger>
        <TooltipContent className={clsx(THEME.tooltip.base(lightMode))} side="top">
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

      {currentFile?.file.status === "active" ? 
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => handleDeleteButtonClick()}
            className={clsx(THEME.button.dangerous(lightMode),)}
          >
            Delete
          </button>
        </TooltipTrigger>
        <TooltipContent className={clsx(THEME.tooltip.base(lightMode),)} side="top">
          {t("archive.delete")}
        </TooltipContent>
      </Tooltip>
        :
        <Tooltip>
      <TooltipTrigger asChild>
          <button
            onClick={() => handleDeleteButtonClick()}
            className={clsx(THEME.button.secondary(lightMode),)}
          >
            Restore
          </button>
        </TooltipTrigger>
        <TooltipContent className={clsx(THEME.tooltip.base(lightMode),)} side="top">
          {t("archive.restore")}
        </TooltipContent>
      </Tooltip>
      }
      

    </div >
  )
}

export default EditorButtons
