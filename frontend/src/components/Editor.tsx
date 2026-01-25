import React, {useState} from 'react'
import EditorButtons from './EditorButtons'
import EditorField from "./EditorField"
import { ControlledFilterDialog } from './popups/FilterPopup';
import { Label } from "./ui/label"
import { Button } from "./ui/button"
import {
    Dialog,
    DialogContent,
    DialogClose,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog"
import ConcurrentEditingPopup from './popups/ConcurrentEditingPopup';


type EditorProps = {
    jwt: string | null,
    setJwt?: (c: string | null) => void;
}

const Editor = ({jwt}: EditorProps) => {

  const [guestDialogOpen, setGuestDialogOpen] = useState<boolean>(true)
  const [beingUsed, setBeingUsed] = useState<boolean>(true)

  const handleSave = () => {
    //NOTE: create IFile instance, and push the changes to the existing/new record in DB

    //if a file with this name doesnt exist in the user's drive
        //create new file record and append it to the user

    //if this file exists, but the content has been modified
        //save new content


  }


  return (
    <>
    {/* Render this if user is logged in */}
    {beingUsed && <ConcurrentEditingPopup />}

    <Button onClick={() => handleSave()}>Save</Button>
    {<div>
      <EditorButtons />
      <div>
        <EditorField jwt={jwt}/>
        <div>Word count</div>
      </div>


    </div>}

{/* Render this if user is NOT logged in */}
      {!jwt && 
        <>

        <Dialog open={guestDialogOpen} onOpenChange={setGuestDialogOpen}>
                <DialogContent>

                    <div className="flex flex-col gap-4">

                        <Label>You are not logged in, you are in view-only guest mode.</Label>

                        <Label>
                            Log in or sign up to access more features.</Label>

                    </div>
                    <DialogClose asChild>
                        <Button variant="outline">Maybe later</Button>
                    </DialogClose>
                    <Button>Let's do it!</Button>

                </DialogContent>
            </Dialog>
        </>
        }

    </>
  )
}

export default Editor
