
import { useState } from 'react';
import Select, { components } from 'react-select';
//https://ui.shadcn.com/docs/components/radix/dialog
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

const NotAvailablePopup = () => {

const {t} = useTranslation()
    const [open, setOpen] = useState<boolean>(false)

    return (
        <>
            <Button onClick={() => setOpen(true)}>Feature</Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>

                    <div className="flex flex-col gap-4">

                        <Label>{t("dialog.unavailable.heading")}</Label>

                        <Label>
                            {t("dialog.unavailable.description")}</Label>

                    </div>
                    <DialogClose asChild>
                        <Button variant="outline">OK</Button>
                    </DialogClose>

                </DialogContent>
            </Dialog>
        </>
    )

}

export default NotAvailablePopup
