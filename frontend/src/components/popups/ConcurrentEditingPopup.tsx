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

const ConcurrentEditingPopup = () => {

  const {t} = useTranslation()
  const [open, setOpen] = useState<boolean>(true)

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <div className="flex flex-col gap-4">
                        <Label>{t("dialog.concurrent-editing.heading")}</Label>
                    </div>
                    <Button>{t("dialog.concurrent-editing.refresh-button")}</Button>

                </DialogContent>
            </Dialog>
    </>
  )
}

export default ConcurrentEditingPopup
