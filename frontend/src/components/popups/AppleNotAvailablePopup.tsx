
import { useState } from 'react';
import Select, { components } from 'react-select';
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


const AppleNotAvailablePopup = () => {

  const { t } = useTranslation()

  const { lightMode } = useAppContext()
  const [open, setOpen] = useState<boolean>(false)

  return (
    <>
      <Button 
      onClick={() => setOpen(true)}
      className={clsx(THEME.button.back(lightMode), "flex-1 border py-2 sm:py-2.5 rounded-md 0 transition text-sm sm:text-base")}
      >Apple</Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          {/*<DialogHeader>
            <DialogTitle>Yes</DialogTitle>
          </DialogHeader>*/}

          <div className="flex flex-col gap-4">

            <Label className={clsx(THEME.text.primary(lightMode),)} >{("This feature is not available yet.")}</Label>

            <Label className={clsx(THEME.text.primary(lightMode),)}>
              {("Maybe one day.\nWondering why? This feature would cost $99.")}</Label>

          </div>
          <DialogClose asChild>
            <Button className={clsx(THEME.button.highlightedPrimary(lightMode),)} variant="outline">OK</Button>
          </DialogClose>

        </DialogContent>
      </Dialog>
    </>
  )

}

export default AppleNotAvailablePopup
