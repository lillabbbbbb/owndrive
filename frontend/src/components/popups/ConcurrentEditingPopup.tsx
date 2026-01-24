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

const ConcurrentEditingPopup = () => {

  const [open, setOpen] = useState<boolean>(true)

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <div className="flex flex-col gap-4">
                        <Label>Oop, someone else is editing this file right now!</Label>
                    </div>
                    <Button>Refresh</Button>

                </DialogContent>
            </Dialog>
    </>
  )
}

export default ConcurrentEditingPopup
