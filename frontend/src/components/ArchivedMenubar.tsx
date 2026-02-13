import React, { useState } from 'react'
import { Button } from "./ui/button"
import { IFileFrontend } from '../types/File'
import { useAppContext } from './context/globalContext'
import { useTranslation } from 'react-i18next'
import { THEME } from "../theme"
import clsx from 'clsx'

const ArchivedMenubar = () => {

  const {t} = useTranslation()
const { lightMode } = useAppContext()
    const {updateFile, deleteFile, currentFileId} = useAppContext()

    const handleDelete = () => {
        if(!currentFileId) return
        
        deleteFile(currentFileId)
    }

    const handleRestore = () => {
        if(!currentFileId) return
        
        updateFile(currentFileId, {status: "active"})
    }

    const handleRestoreAll = () => {
        
    }

    const handleDeleteAll = () => {
        
    }


  return (
    <div>

        <Button className={clsx(THEME.button.primary(lightMode), )}
      onClick={() => handleRestore()}
      disabled={!currentFileId}
      >{t("archive.restore-all")}</Button>

        <Button className={clsx(THEME.button.primary(lightMode), )}
      onClick={() => handleRestore()}
      disabled={!currentFileId}
      >{t("archive.restore")}</Button>

      <Button className={clsx(THEME.button.primary(lightMode), )}
      onClick={() => handleDelete()}
      disabled={!currentFileId}
      >{t("archive.delete")}</Button>

      <Button className={clsx(THEME.button.primary(lightMode), )}
      onClick={() => handleRestore()}
      disabled={!currentFileId}
      >{t("archive.delete-all")}</Button>

    </div>
  )
}

export default ArchivedMenubar
