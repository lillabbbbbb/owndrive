import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogClose,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog"
import { Label } from "../ui/label"
import { Button } from "../ui/button"
import { useTranslation } from 'react-i18next';
import { THEME } from "../../theme"
import { useAppContext } from '../context/globalContext';
import clsx from 'clsx';

const ConcurrentEditingPopup = () => {

  const {t} = useTranslation()
const { lightMode } = useAppContext()
  const [open, setOpen] = useState<boolean>(true)

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <div className="flex flex-col gap-4">
                        <Label className={clsx(THEME.text.primary(lightMode))} >{t("dialog.concurrent-editing.heading")}</Label>
                    </div>
                    <Button className={clsx(THEME.button.primary(lightMode))} >{t("dialog.concurrent-editing.refresh-button")}</Button>

                </DialogContent>
            </Dialog>
    </>
  )
}

export default ConcurrentEditingPopup
