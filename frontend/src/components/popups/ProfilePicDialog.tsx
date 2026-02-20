import { useEffect, useState } from "react"
import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "../ui/avatar"
import { useAppContext } from "../context/globalContext";
import { Button } from "../ui/button"
import { useTranslation } from "react-i18next"
import { THEME } from "../../theme"
import clsx from "clsx"
import { LucideUpload, LucideSave } from "lucide-react"

type ProfilePicDialogProps = {
    open: boolean,
    setOpen: (value: boolean) => void
}

const ProfilePicDialog = ({ open, setOpen }: ProfilePicDialogProps) => {

    //import variables and functions from hooks
    const { t } = useTranslation()
    const { lightMode, updateProfilePic, getProfilePic, userLoading, userError } = useAppContext()

    //States
    const [preview, setPreview] = useState<string | null>(null)
    const [chosenFile, setChosenFile] = useState<File>()

    //Load preview of current profile pic, if found, upon page load
    useEffect(() => {
        const loadProfilePic = async () => {
            const pic = await getProfilePic()
            if (!pic) return
            setPreview(`http://localhost:8000${pic.path}`)
        }
        loadProfilePic()
    }, [])

    //Reset the image blob after closing the dialog (this is important so that a previously previewed image that was not saved should not be shown there next time.)
    useEffect(() => {
        if (!open) {
            setPreview(null)
            setChosenFile(undefined)
        }
    }, [open])

    //Set the image preview according to the chosen file
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return
        setChosenFile(file)
        setPreview(URL.createObjectURL(file))
    }

    //Event handler for saving profile pic change
    const handleSave = async () => {
        if (!chosenFile) return
        await updateProfilePic(chosenFile)
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className={clsx(
                THEME.background.card(lightMode),
                "w-[280px] sm:w-[320px] md:w-[360px] p-0 overflow-hidden"
            )}>
                {/* Header */}
                <DialogHeader className="px-6 pt-6 pb-0">
                    <DialogTitle className={clsx(THEME.text.primary(lightMode), "text-lg font-semibold")}>
                        {t("settings.profile-picture")}
                    </DialogTitle>
                </DialogHeader>

                {/* Avatar preview - centered focal point */}
                <div className="flex flex-col items-center gap-3 px-6 py-6">
                    <div className="relative group">
                        <Avatar className="h-24 w-24 sm:h-32 sm:w-32 md:h-40 md:w-40 ring-4 ring-offset-2 ring-offset-transparent ring-white/10">
                            <AvatarImage key={preview} src={preview ?? undefined} className="object-cover" />
                            <AvatarFallback className={clsx(
                                THEME.text.primary(lightMode),
                                "text-3xl font-semibold"
                            )}>
                                JD
                            </AvatarFallback>
                        </Avatar>

                        {/* Overlay hint on hover */}
                        <label className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <LucideUpload className="text-white w-6 h-6" />
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={handleChange}
                            />
                        </label>
                    </div>

                </div>

                {/* Actions */}
                <div className={clsx(
                    "flex justify-end gap-2 px-6 py-4 border-t",
                    lightMode ? "border-black/10" : "border-white/10"
                )}>
                    <Button
                        asChild
                        variant="outline"
                        className={clsx(THEME.button.secondary(lightMode))}
                    >
                        <label className="cursor-pointer flex items-center justify-center gap-2">
                            <LucideUpload className="w-4 h-4" />
                            {t("dialog.change-profile-pic.upload-image")}
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={handleChange}
                            />
                        </label>
                    </Button>

                    <Button
                        className={clsx(THEME.button.highlightedPrimary(lightMode), "gap-2")}
                        onClick={handleSave}
                        disabled={userLoading || !chosenFile}
                    >
                        <LucideSave className="w-4 h-4" />
                        {userLoading ? t("editor.saving...") : t("editor.save")}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ProfilePicDialog