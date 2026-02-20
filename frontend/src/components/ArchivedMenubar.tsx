import { Button } from "./ui/button"
import { useAppContext } from './context/globalContext'
import { useTranslation } from 'react-i18next'
import { THEME } from "../theme"
import clsx from 'clsx'
import { useTheme } from "../components/context/ThemeContext"

const ArchivedMenubar = () => {
  //import variables and functions from hooks
  const { t } = useTranslation()
  const { lightMode } = useTheme()
  const { updateFile, deleteFile, currentFileId } = useAppContext()

  //Event handler for deleting a file
  const handleDelete = () => {
    if (!currentFileId) return

    //Call the appropriate hook to delete the current file based on its id
    deleteFile(currentFileId)
  }

  //Event handler for restoring a file
  const handleRestore = () => {
    if (!currentFileId) return

    //Call the appropriate hook to set the status of the current file based on its id
    updateFile(currentFileId, { status: "active" })
  }

  //Yet to be implemented here
  const handleRestoreAll = () => {

  }
  //Yet to be implemented here
  const handleDeleteAll = () => {

  }


  return (
    <div>

      <Button className={clsx(THEME.button.primary(lightMode),)}
        onClick={() => handleRestore()}
        disabled={!currentFileId}
      >{t("archive.restore-all")}</Button>

      <Button className={clsx(THEME.button.primary(lightMode),)}
        onClick={() => handleRestore()}
        disabled={!currentFileId}
      >{t("archive.restore")}</Button>

      <Button className={clsx(THEME.button.primary(lightMode),)}
        onClick={() => handleDelete()}
        disabled={!currentFileId}
      >{t("archive.delete")}</Button>

      <Button className={clsx(THEME.button.primary(lightMode),)}
        onClick={() => handleRestore()}
        disabled={!currentFileId}
      >{t("archive.delete-all")}</Button>

    </div>
  )
}

export default ArchivedMenubar
