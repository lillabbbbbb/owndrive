import React, { useState } from 'react'
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
import { useNavigate } from 'react-router-dom';
import { useAppContext } from "../../context/AppContext";
import { useFiles } from '../../hooks/useFiles';
import { useUser } from '../../hooks/useUser';

const Editor = () => {

    const [guestDialogOpen, setGuestDialogOpen] = useState<boolean>(true)
    const jwt = localStorage.getItem("token")

    const [beingUsed, setBeingUsed] = useState<boolean>(true)
    const [content, setContent] = useState<string>("")
    const [lastEditedAt, setLastEditedAt] = useState<string>("")
    const [canView, setCanView] = useState<string[]>([])
    const [canEdit, setCanEdit] = useState<string[]>([])
    const [visibleToGuest, setVisibleToGuest] = useState<boolean>(false)
    const [isPrivate, setIsPrivate] = useState<boolean>(false)
    const [editable, setEditable] = useState<boolean>(false) //turn this into useEffect

    const navigate = useNavigate()
    const {user} = useUser()
    const {getFile, createFile, updateFile} = useFiles()

    const file = getFile(fileId)


    const username = user.username || user.email


    console.log(`File content is now:`)
    console.log(content)

    const handleSave = () => {
        console.log("Save button is clicked")
        //NOTE: create IFile instance, and push the changes to the existing/new record in DB

        //if a file with this name doesnt exist in the user's drive (go through userData.files array in search of a match)
        //create new file record and append it to the user
        createFile()

        //if this file exists, but the content has been modified
        //save new content

        //POST Route: 
        updateFile()

    }

    const handleSaveFileName = (newFileName: string) => {

        //check if filename is valid and unique,

        //if so, save the new name of the file in the DB (PATCH call)
        updateFile()

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
                <EditableText value={file.title} onSave={handleSaveFileName}/>
                <div>
                    <EditorField content={file.content} editable={editable}/>
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
