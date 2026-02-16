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
import { THEME } from "../../theme"
import clsx from "clsx"

type ProfilePicDialogProps = {
    open: boolean,
    setOpen: (value: boolean) => void
}

const ProfilePicDialog = ({ open, setOpen }: ProfilePicDialogProps) => {

    const { t } = useTranslation()

    const { lightMode } = useAppContext()
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
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className={clsx(THEME.text.primary(lightMode), "text-lg sm:text-xl")}>
                        {t("settings.profile-picture")}
                    </DialogTitle>
                </DialogHeader>

                <div className={clsx(
                    THEME.background.popup(lightMode),
                    "flex flex-col items-center gap-4 sm:gap-6 p-4 sm:p-6 rounded-lg"
                )}>
                    <Avatar className="h-24 w-24 sm:h-28 sm:w-28">
                        <AvatarImage src={preview ?? undefined} />
                        <AvatarFallback className={clsx(
                            THEME.text.primary(lightMode),
                            "text-2xl sm:text-3xl font-semibold"
                        )}>
                            JD
                        </AvatarFallback>
                    </Avatar>

                    <Button
                        asChild
                        variant="outline"
                        className={clsx(
                            THEME.button.secondary(lightMode),
                            "w-full sm:w-auto text-sm sm:text-base"
                        )}
                    >
                        <label className="cursor-pointer">
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

                <Button
                    className={clsx(
                        THEME.button.highlightedPrimary(lightMode),
                        "w-full text-sm sm:text-base mt-2"
                    )}
                    onClick={handleSave}
                    disabled={userLoading || !chosenFile}
                >
                    {userLoading ? t("editor.saving...") : t("editor.save")}
                </Button>
            </DialogContent>
        </Dialog>
    )
}

export default ProfilePicDialog
