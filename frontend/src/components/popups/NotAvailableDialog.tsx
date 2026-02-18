
import { useState } from 'react';
//https://ui.shadcn.com/docs/components/radix/dialog
import {
    Dialog,
    DialogContent,
    DialogClose,
} from "../ui/dialog"
import { Label } from "../ui/label"
import { Button } from "../ui/button"
import { useTranslation } from 'react-i18next';
import { THEME } from "../../theme"
import { useAppContext } from '../context/globalContext';
import clsx from 'clsx';

const NotAvailablePopup = () => {

const {t} = useTranslation()
const { lightMode } = useAppContext()
    const [open, setOpen] = useState<boolean>(false)

    return (
        <>
            <Button onClick={() => setOpen(true)}>Feature</Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>

                    <div className="flex flex-col gap-4">

                        <Label className={clsx(THEME.text.primary(lightMode))}>{t("dialog.unavailable.heading")}</Label>

                        <Label className={clsx(THEME.text.secondary(lightMode))}>
                            {t("dialog.unavailable.description")}</Label>

                    </div>
                    <DialogClose asChild>
                        <Button className={clsx(THEME.button.back(lightMode))} variant="outline">OK</Button>
                    </DialogClose>

                </DialogContent>
            </Dialog>
        </>
    )

}

export default NotAvailablePopup
