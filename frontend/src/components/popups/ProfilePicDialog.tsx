import { useEffect, useState } from "react"
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
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

type ProfilePicDialogProps = {
    open: boolean,
    setOpen: (value: boolean) => void
}

const ProfilePicDialog = ({ open, setOpen }: ProfilePicDialogProps) => {

    const { t } = useTranslation()
    const { updateProfilePic, getProfilePic, userLoading, userError } = useAppContext()

    const [preview, setPreview] = useState<string | null>(null)
    const [chosenFile, setChosenFile] = useState<File>()

    useEffect(() => {
        toast.error(userError)
        if (userLoading) {
            toast.loading("Loading...")
        }
    }, [userLoading, userError])


    //AI-generated code snippet
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return
        setChosenFile(file)
        setPreview(URL.createObjectURL(file))
    }

    console.log(preview)

    const handleSave = async () => {
        console.log("Save button clicked... image should be updated in DB...")

        //store new image in DB (overwrite the reference in user..)
        await updateProfilePic(chosenFile!)
        console.log("new profile pic saved")
        await getProfilePic()
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("settings.profile-picture")}</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center gap-4">
                    <Avatar className="h-28 w-28">
                        <AvatarImage src={preview ?? undefined} />
                        <AvatarFallback>JD</AvatarFallback>
                    </Avatar>

                    <Button asChild variant="outline">
                        <label>
                            {t("dialog.change-profile-pic.upload-image")}
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={handleChange}
                            />
                        </label>
                    </Button>
                </div>

                <Button onClick={handleSave} disabled={userLoading || !chosenFile}>
                    {userLoading ? t("Saving...") : t("Save")}
                </Button>

            </DialogContent>
        </Dialog>
    )
}

export default ProfilePicDialog
