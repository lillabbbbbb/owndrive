import React, { useState, useEffect } from 'react'
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

const Editor = () => {

    const [guestDialogOpen, setGuestDialogOpen] = useState<boolean>(true)
    const jwt = localStorage.getItem("token")

    const [file, setFile] = useState<IFileFrontend | null>(null)
    const [filename, setFilename] = useState<string>("New file")
    const [beingUsed, setBeingUsed] = useState<boolean>(false)
    const [content, setContent] = useState<string>("")
    const [lastEditedAt, setLastEditedAt] = useState<string>("")
    const [canView, setCanView] = useState<string[]>([])
    const [canEdit, setCanEdit] = useState<string[]>([])
    const [visibleToGuest, setVisibleToGuest] = useState<boolean>(false)
    const [isPrivate, setIsPrivate] = useState<boolean>(false)
    const [editable, setEditable] = useState<boolean>(false) //turn this into useEffect

    useEffect(() => {
        setEditable(!beingUsed)
    }, [beingUsed])

    const navigate = useNavigate()
    const { user, currentFileId, getFile, createFile, updateFile, lockFile, userLoading, userError, filesLoading, filesError } = useAppContext()

    useEffect(() => {
        if (!currentFileId) return;

        const loadFile = async () => {
            const f = await getFile(currentFileId); // await the Promise
            setFile(f);
        };

        loadFile();
    }, [currentFileId, getFile]);


    const username = user?.username || user?.email


    console.log(`File content is now:`)
    console.log(content)

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

    const isExistingFile = (filename: string) => {
        return file?.filename == filename;
    }

    const handleSave = () => {
        console.log("Save button is clicked")
        console.log(user)
        if (!user) return

        if (!isValidFilename(filename)) return

        if (isExistingFile(filename)) {
            //if this file exists, but the content has been modified
            updateFile(currentFileId, {
                last_edited_at: new Date(),
                inUse: true,
                usedBy: user._id,
                status: "active",
            })
            return
        }

        //if a file with this name doesnt exist in the user's drive (go through userData.files array in search of a match)
        //create new file record and append it to the user
        createFile({
            created_by: user._id,
            filename: filename,
            file_type: ".docx",
            content: content,
            inUse: true,
            usedBy: user._id
        })

    }

    const handleSaveFileName = (newFileName: string) => {

        if (!user) return

        //check if filename is valid and unique,
        if (!isValidFilename(filename)) return

        //if a file with this name doesnt exist in the user's drive (go through userData.files array in search of a match)
        //create new file record and append it to the user
        createFile({
            created_by: user._id,
            filename: "default",
            file_type: "default",
            content: content,
            inUse: true,
            usedBy: user._id
        })

        //if so, save the new name of the file in the DB (PATCH call)
        updateFile(currentFileId, {
            last_edited_at: new Date(),
            filename: newFileName,
            inUse: true,
            usedBy: user._id,
            status: "active",
        })

        //and display the new one
        //needs state or sum?
        //refresh URL with correct new filename
        navigate(`/${username}/${newFileName}`, { replace: true })

        //if not valid, set the value to be the previous file name
    }


    return (
        <>
            {/* Render this if user is logged in */}
            {beingUsed && <ConcurrentEditingPopup />}

            <Button onClick={() => handleSave()}>Save</Button>
            {<div>
                <EditorButtons />
                <EditableText value={file?.filename || filename} onSave={handleSaveFileName} />
                <div>
                    <EditorField content={file?.content || "Write here..."} setContent={setContent} editable={editable} />
                    <div>Word count</div>
                </div>


            </div>
            }

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
            {userError && <CustomDialog text={userError} />}
            {userLoading && <p>Loading...</p>}
            {filesError && <CustomDialog heading="Error" text={filesError} />}
            {filesLoading && <p>Loading...</p>}

        </>
    )
}

export default Editor
