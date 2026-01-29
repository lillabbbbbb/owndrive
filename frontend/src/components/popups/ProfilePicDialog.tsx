import { useState } from "react"
import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../ui/avatar"
import { useUser } from "../../hooks/useUser"
import { useAppContext } from "../context/globalContext";
import CustomDialog from '../popups/CustomDialog';

import { Button } from "../ui/button"

type ProfilePicDialogProps = {
    open: boolean,
    setOpen: (value: boolean) => void
}

const ProfilePicDialog = ({ open, setOpen }: ProfilePicDialogProps) => {

    const { updateProfilePic, userLoading, userError } = useAppContext()

    const [preview, setPreview] = useState<string | null>(null)
    const [chosenFile, setChosenFile] = useState<File>(null)

    //AI-generated code snippet
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return
        setChosenFile(file)
        setPreview(URL.createObjectURL(file))
    }

    const handleSave = () => {
        console.log("Save button clicked... image should be updated in DB...")

        //store new image in DB (overwrite the reference in user..)
        updateProfilePic(chosenFile, "my new avatar")
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Change profile picture</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center gap-4">
                    <Avatar className="h-28 w-28">
                        <AvatarImage src={preview ?? undefined} />
                        <AvatarFallback>JD</AvatarFallback>
                    </Avatar>

                    <Button asChild variant="outline">
                        <label>
                            Upload image
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={handleChange}
                            />
                        </label>
                    </Button>
                </div>

                <Button asChild>
                        <label>
                            Save
                            <input
                                hidden
                                onChange={handleSave}
                            />
                        </label>
                    </Button>
                    {userError && <CustomDialog text="User error"/>}
                    {userLoading && <p>Loading...</p>}
            
            </DialogContent>
        </Dialog>
    )
}

export default ProfilePicDialog
