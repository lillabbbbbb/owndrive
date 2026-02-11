import React, { useState, useEffect, useRef } from 'react'
import { usePDF } from 'react-to-pdf';
import EditorButtons from '../EditorButtons'
import EditorField from "../EditorField"
import { ControlledFilterDialog } from '../popups/FilterPopup';
import { Label } from "../ui/label"
import { Button } from "../ui/button"
import {
    Dialog,
    DialogContent,
    DialogClose,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog"
import ConcurrentEditingPopup from '../popups/ConcurrentEditingPopup';
import { IUserTest } from '../../App';
import { EditableText } from '../EditableText';
import CustomDialog from '../popups/CustomDialog';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from "../context/globalContext";
import { useFiles } from '../../hooks/useFiles';
import { useUser } from '../../hooks/useUser';
import { IFileFrontend } from '../../types/File';
import Login from './Login';
import { useTranslation } from 'react-i18next';
import PdfViewer from '../PDFViewer';
import { toast } from 'sonner';

const Editor = () => {

    const { t } = useTranslation()
    const [guestDialogOpen, setGuestDialogOpen] = useState<boolean>(true)

    const [jwt, setJwt] = useState<string | null>(null)
    const [file, setFile] = useState<{file: IFileFrontend, permissions: string[], base64data: string } | null>(null)
    const [filename, setFilename] = useState<string>("New file")
    const [beingUsed, setBeingUsed] = useState<boolean>(false)
    const [content, setContent] = useState<string>("Write here...")
    //const [lastEditedAt, setLastEditedAt] = useState<string>("")
    const [canView, setCanView] = useState<string[]>([])
    const [canEdit, setCanEdit] = useState<string[]>([])
    const [visibleToGuest, setVisibleToGuest] = useState<boolean>(false)
    const [isPrivate, setIsPrivate] = useState<boolean>(false)
    const [editable, setEditable] = useState<boolean>(false) //turn this into useEffect

    

    // PDF hook
    const { toPDF, targetRef } = usePDF({
        filename: filename,
        page: { margin: 20 }
    });

    // Use this ref to forward to EditorField
    const editorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setEditable(!beingUsed)
    }, [beingUsed])


    const navigate = useNavigate()
    const { user, currentFileId, setCurrentFileId, getCurrentFile, getFile, createFile, updateFile, lockFile, userLoading, userError, filesLoading, filesError } = useAppContext()

    useEffect(() => {
        setJwt(localStorage.getItem("token"))
    }, [user])

    useEffect(() => {
        toast.error(filesError)
        if(filesLoading || userLoading){
            toast.loading("Loading...")
        }
        toast.error(userError)
    }, [filesError, filesLoading, userError, userLoading])

    useEffect(() => {
        setCurrentFileId(sessionStorage.getItem("fileId"))
        if (!currentFileId) return
        const loadFile = async () => {
            const fetchedFile = await getCurrentFile(currentFileId)
            if (fetchedFile) {
                setFilename(fetchedFile.file.filename)
                setBeingUsed(true)
                setFile(fetchedFile)
                setVisibleToGuest(fetchedFile.file.visibleToGuests)
                setCanEdit(fetchedFile.file.canEdit)
                setCanView(fetchedFile.file.canView)
                setIsPrivate(fetchedFile.file.private)

                console.log(fetchedFile.file.content)
                console.log(fetchedFile)
            }
        }
        loadFile()
    }, [currentFileId])

    useEffect(() => {
        console.log("Current file updated:", file);
    }, [file]);

    // Update local content when file changes
    useEffect(() => {
        if (file) {
            setContent(file.file.content ?? ""); // empty string fallback
        }
        console.log(`Content set to ${content}`)
    }, [file]);

    console.log(user)
    console.log(file)

    const username = user?.username || user?.email


    console.log(`File content is now: ${content}`)

    useEffect(() => {
        if (currentFileId && user) {
            lockFile(currentFileId, user._id)
        }
    }, [])

    const isValidFilename = (filename: string) => {

        //check if there's any forbidden characters

        //check for exact match between other files of user

        return true
    }

    const isExistingFile = async (id: string | null) => {
        if (!id) return false
        console.log(currentFileId)
        return !!(await getFile(id))
    }

    const handleSave = async () => {
        console.log("Save button is clicked")
        console.log(user)
        if (!user) return

        console.log(filename)
        if (!isValidFilename(filename)) return

        const isExisting: boolean = await isExistingFile(currentFileId)
        console.log(isExisting)
        if (isExisting && currentFileId) {
            //if this file exists, but the content has been modified
            updateFile(currentFileId, {
                last_edited_at: new Date(),
                content: content,
                inUse: true,
                usedBy: user._id,
                status: "active",
            })
            console.log("File updated")
            return
        }
        //if a file with this name doesnt exist in the user's drive (go through userData.files array in search of a match)
        //create new file record and append it to the user
        else {
            createFile({
                created_by: user._id,
                filename: filename,
                file_type: ".json",
                mime_type: "application/json",
                content: content,
                inUse: true,
                usedBy: user._id
            })
            console.log("File created")
        }

    }

    const handleSaveFileName = (newFileName: string) => {

        if (!user) return

        //check if filename is valid and unique,
        if (!isValidFilename(filename)) return

        if (!currentFileId) {
            //if a file with this name doesnt exist in the user's drive (go through userData.files array in search of a match)
            //create new file record and append it to the user

            createFile({
                created_by: user._id,
                filename: filename,
                file_type: "json",
                mime_type: "application/json",
                content: content,
                inUse: true,
                usedBy: user._id
            })
            return
        }

        else {
            //if so, save the new name of the file in the DB (PATCH call)
            updateFile(currentFileId, {
                last_edited_at: new Date(),
                filename: newFileName,
                inUse: true,
                usedBy: user._id,
                status: "active",
            })
        }

        //and display the new one
        //needs state or sum?
        //refresh URL with correct new filename
        navigate(`/${username}/${currentFileId}`, { replace: true })

        //if not valid, set the value to be the previous file name
    }

    return (
        <>
            {!(jwt || visibleToGuest) &&
                <>
                    <Login />
                </>
            }

            {(jwt || visibleToGuest) && <>
                {/* Render this if user is logged in */}
                {beingUsed && <ConcurrentEditingPopup />}

                <Button onClick={() => handleSave()}>Save</Button>
                <div ref={targetRef}>


                    <EditorButtons htmlContent={content} />
                    <EditableText value={file?.file.filename ?? filename} onSave={handleSaveFileName} />

                    {(file?.file.file_type === ".pdf") && <PdfViewer url="/public/files/sample.pdf" />}
                    <EditorField ref={editorRef} content={file?.file.content ? content : content} setContent={setContent} editable={editable} />



                </div>


                {/* Render this if user is NOT logged in */}
                {!jwt &&
                    <>

                        <Dialog open={guestDialogOpen} onOpenChange={setGuestDialogOpen}>
                            <DialogContent>

                                <div className="flex flex-col gap-4">

                                    <Label>{t("guest-dialog.heading")}</Label>

                                    <Label>
                                        {t("guest-dialog.prompt")}</Label>

                                </div>
                                <DialogClose asChild>
                                    <Button variant="outline">{t("guest-dialog.no-button")}</Button>
                                </DialogClose>
                                <Button>{t("guest-dialog.yes-button")}</Button>

                            </DialogContent>
                        </Dialog>
                    </>
                }

            </>}
        </>
    )
}

export default Editor
