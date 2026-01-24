
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

const NotAvailablePopup = () => {


    const [open, setOpen] = useState<boolean>(false)

    return (
        <>
            <Button onClick={() => setOpen(true)}>Feature</Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    {/*<DialogHeader>
            <DialogTitle>Yes</DialogTitle>
          </DialogHeader>*/}

                    <div className="flex flex-col gap-4">

                        <Label>This feature is not available yet.</Label>

                        <Label>
                            ...</Label>

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
