import { useState, useEffect, useRef } from 'react'
import EditorButtons from '../EditorButtons'
import EditorField from "../EditorField"
import { Button } from "../ui/button"
import ConcurrentEditingPopup from '../popups/ConcurrentEditingPopup';
import { EditableText } from '../EditableText';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from "../context/globalContext";
import { isValidFilename } from '../../utils/validateFilename';
import Login from './Login';
import { useTranslation } from 'react-i18next';
import { THEME } from "../../theme"
import clsx from 'clsx';

const Editor = () => {

    //import variables and functions from hooks
    const { t } = useTranslation()
    const { lightMode } = useAppContext()
    const navigate = useNavigate()
    const { user, currentFileId, currentFile, setCurrentFileId, getFile, createFile, updateFile, lockFile } = useAppContext()

    //Editor's states
    const [guestDialogOpen, setGuestDialogOpen] = useState<boolean>(true)
    const [jwt, setJwt] = useState<string | null>(null)
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

    //update the editable state whenever user, beingUsed or usedBy changes
    useEffect(() => {
        console.log(usedBy)
        const isOtherUser: boolean = (beingUsed && !!user && usedBy != user._id)
        const isOwner = currentFile?.permissions.accessType === "owner"
        setEditable(isOwner && (!isOtherUser || !!user))
    }, [user, beingUsed, usedBy])

    //Automatically navigate to the login screen if the file is set to private
    if (currentFile?.permissions.private) {
        navigate("/login")
    }


    // Use this ref to forward to EditorField
    const editorRef = useRef<HTMLDivElement>(null);

    //Refresh the jwt state when the user changes
    useEffect(() => {
        setJwt(localStorage.getItem("token"))
    }, [user])

    //Update the states connected to file data and metadata whenever currentFile changes
    useEffect(() => {
        console.log("Current file updated:", currentFile);
        if (!currentFileId || !currentFile) {
            //this means that this is a new file
            setCurrentFileId(sessionStorage.getItem("fileId"))
            setContent("Write here...")
        } else {

            const loadFile = async () => {
                setFilename(currentFile.file.filename)
                setBeingUsed(true) // while testing
                setVisibleToGuest(currentFile.file.visibleToGuests)
                setCanEdit(currentFile.file.canEdit)
                setCanView(currentFile.file.canView)
                setIsPrivate(currentFile.file.private)
                setUsedBy(currentFile.file.usedBy?.toString() || null)

                console.log(currentFile.file.content)
                console.log(currentFile)
            }
            loadFile()
        }
    }, [currentFile])


    //console.log(`File content is now: ${content}`)
    //console.log(`File name is now: ${filename}`)
    //console.log(`File name is now: ${currentFile?.file.filename}`)

    //Lock the file (= mark it as being used) whenever a file is opened in the editor (= runs on screen load)
    useEffect(() => {
        if (currentFileId && user) {
            lockFile(currentFileId, user._id)
        }
    }, [])

    //Helper arrow function ot detemine whether a file with a specific ID exists or not
    const isExistingFile = async (id: string | null) => {
        if (!id) return false
        console.log(currentFileId)
        return !!(await getFile(id))
    }

    //Event handler for clicking save in the editor
    const handleSave = async () => {
        console.log("Save button is clicked")
        console.log(user)

        //Make sure user exists before doing anything else
        if (!user) return

        console.log(filename)
        //Make sure the chosen filename is valid
        if (!isValidFilename(filename)) return

        //Check if the current file's id is really a file in the database
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
        //if a file with this name doesnt exist in the user's drive
        //call the corresponding hook to create new file record and append it to the user
        else {
            createFile({
                created_by: user._id,
                filename: filename,
                file_type: ".json",
                mime_type: "application/json", //Every file that is created with OwnDrive is automatically saved in JSON format because of the rich-text editor
                content: content,
                inUse: true,
                usedBy: user._id
            })
            console.log("File created")
        }

    }

    //This arrow function below is not used right now
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
        <div className={clsx("min-h-screen w-full flex-col")}>

            {/* Toolbar */}
            <div className={clsx("flex items-center justify-between px-6 py-4 shadow-md")}>
                <EditableText
                    value={filename}
                    validate={(v) => isValidFilename(v)}
                    onSave={(v) => setFilename(v)}
                    className="text-xl font-semibold"
                />
                <div className="flex gap-2">
                    {user && <Button className={clsx(THEME.button.primary(lightMode))} onClick={handleSave} disabled={!editable}>
                        {t("editor.save")}
                    </Button>}

                    <EditorButtons htmlContent={content}/>
                </div>
            </div>

            <EditorField
                ref={editorRef}
                content={content}
                setContent={setContent}
                editable={editable}
            />

            {(!editable && user) && <ConcurrentEditingPopup />}

        </div>
    );
};

export default Editor
