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
import { IFileFrontend } from '../../types/File';
import Login from './Login';
import { useTranslation } from 'react-i18next';
import PdfViewer from '../PDFViewer';
import { toast } from 'sonner';
import { THEME } from "../../theme"
import clsx from 'clsx';

const Editor = () => {

        const { t } = useTranslation()
        const { lightMode } = useAppContext()

        const [guestDialogOpen, setGuestDialogOpen] = useState<boolean>(true)

        const [jwt, setJwt] = useState<string | null>(null)
        const [file, setFile] = useState<{ file: IFileFrontend, permissions: string[], base64data: string } | null>(null)
        const [filename, setFilename] = useState<string>("New file")
        const [beingUsed, setBeingUsed] = useState<boolean>(false)
        const [usedBy, setUsedBy] = useState<string | null>(null)
        const [content, setContent] = useState<string>("Write here...")
        //const [lastEditedAt, setLastEditedAt] = useState<string>("")
        const [canView, setCanView] = useState<string[]>([])
        const [canEdit, setCanEdit] = useState<string[]>([])
        const [visibleToGuest, setVisibleToGuest] = useState<boolean>(false)
        const [isPrivate, setIsPrivate] = useState<boolean>(false)
        const [editable, setEditable] = useState<boolean>(false) //turn this into useEffect

        useEffect(() => {

            const isOtherUser: boolean = (!!beingUsed && !!user && usedBy != user._id)

            setEditable(!isOtherUser)
        }, [beingUsed, usedBy])

        // PDF hook
        const { toPDF, targetRef } = usePDF({
            filename: filename,
            page: { margin: 20 }
        });

        // Use this ref to forward to EditorField
        const editorRef = useRef<HTMLDivElement>(null);



        const navigate = useNavigate()
        const { user, currentFileId, setCurrentFileId, getCurrentFile, getFile, createFile, updateFile, lockFile, userLoading, userError, filesLoading, filesError } = useAppContext()

        useEffect(() => {
            setJwt(localStorage.getItem("token"))
        }, [user])

        useEffect(() => {
            if (!currentFileId) {
                //this means that this is a new file
                setCurrentFileId(sessionStorage.getItem("fileId"))
                setContent("Write here...")
            } else {
                const loadFile = async () => {
                    if (!currentFileId) return
                    const fetchedFile = await getCurrentFile(currentFileId)
                    if (fetchedFile) {
                        setFilename(fetchedFile.file.filename)
                        setBeingUsed(true) // while testing
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
            }
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

        const username = user?.username || user?.email


        console.log(`File content is now: ${content}`)
        console.log(`File name is now: ${filename}`)
        console.log(`File name is now: ${file?.file.filename}`)

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
                    filename: newFileName,
                    file_type: "json",
                    mime_type: "application/json",
                    content: content,
                    inUse: true,
                    usedBy: user._id
                })
                setFilename(newFileName)
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
                setFilename(newFileName)
                console.log("New filename saved")
            }

            //and display the new one
            //needs state or sum?
            //refresh URL with correct new filename
            navigate(`/${user._id}/${currentFileId}`, { replace: true })

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
                    {!editable && <ConcurrentEditingPopup />}

                    <Button className={clsx(THEME.button.primary(lightMode), )} onClick={() => handleSave()}>Save</Button>
                    <div ref={targetRef}>


                        <EditorButtons htmlContent={content} />
                        <EditableText value={filename} onSave={(v) => handleSaveFileName(v)} />
                        {(file?.file.file_type === ".pdf") && <PdfViewer url="/public/files/sample.pdf" />}
                        <EditorField ref={editorRef} content={file?.file.content ? content : content} setContent={setContent} editable={editable} />



                    </div>


                    {/* Render this if user is NOT logged in */}
                    {!jwt &&
                        <>

                            <Dialog open={guestDialogOpen} onOpenChange={setGuestDialogOpen}>
                                <DialogContent>

                                    <div className={clsx(THEME.background(lightMode), "flex flex-col gap-4")} >

                                        <Label className={clsx(THEME.text.primary(lightMode), )}>{t("guest-dialog.heading")}</Label>

                                        <Label className={clsx(THEME.text.primary(lightMode), )}>
                                            {t("guest-dialog.prompt")}</Label>

                                    </div>
                                    <DialogClose asChild>
                                        <Button className={clsx(THEME.button.primary(lightMode), )} variant="outline">{t("guest-dialog.no-button")}</Button>
                                    </DialogClose>
                                    <Button className={clsx(THEME.button.primary(lightMode), )}>{t("guest-dialog.yes-button")}</Button>

                                </DialogContent>
                            </Dialog>
                        </>
                    }

                </>}
            </>
        )
    }

    export default Editor
