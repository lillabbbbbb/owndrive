import React, { useState, useEffect } from 'react'
import { Tooltip, TooltipTrigger, TooltipContent } from "../components/ui/tooltip"
import SharePopup from './popups/SharePopup';
import { ClonePopup } from './popups/ClonePopup';
import { useAppContext } from "./context/globalContext";
import { THEME } from "../theme"
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { useTheme } from "../components/context/ThemeContext"

interface EditorButtonsProps {
  htmlContent: string
}

const EditorButtons = ({ htmlContent }: EditorButtonsProps) => {

  //import variables and functions from hooks
  const { t } = useTranslation()
  const { lightMode } = useTheme()
  const { downloadPDF, currentFileId, currentFile, user, updateFile, filesLoading, filesError } = useAppContext()

  //States
  const [PDFDialogOpen, setPDFDialogOpen] = useState<boolean>(false)

  console.log(currentFileId)

  const handlePDFButtonClick = () => {
    downloadPDF(htmlContent)

    //should display sonner toast, but that is yet to be implemented

  }

  //Event handler for deleting a file
  const handleDeleteButtonClick = () => {
    //set file's status to "archived" by callign appropriate hook
    updateFile(currentFileId!, { status: "archived" })
  }

  //Event handler for restoring a file
  const handleRestoreButtonClick = () => {
    //set file's status to "archived" by calling appropriate hook
    updateFile(currentFileId!, { status: "active" })
  }


  return (
    <div>

      <Tooltip>
        <TooltipTrigger asChild>
          <SharePopup />

        </TooltipTrigger>
        <TooltipContent className={clsx(THEME.tooltip.base(lightMode),)} side="top">
          {t("editor-buttons.share-button")}
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

      {user ? currentFile?.file.status === "active" ?
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
              onClick={() => handleRestoreButtonClick()}
              className={clsx(THEME.button.secondary(lightMode),)}
            >
              Restore
            </button>
          </TooltipTrigger>
          <TooltipContent className={clsx(THEME.tooltip.base(lightMode),)} side="top">
            {t("archive.restore")}
          </TooltipContent>
        </Tooltip>
        :
        <div></div>
      }


    </div >
  )
}

export default EditorButtons
