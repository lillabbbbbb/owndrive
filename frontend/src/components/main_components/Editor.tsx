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


type EditorProps = {
    jwt: string | null,
    setJwt?: (c: string | null) => void;
    userData: IUserTest,
    setUserData: (modifiedUser: IUserTest) => void,
    fileName: string,
    setFileName: (newValue: string) => void
}

const Editor = ({ jwt, userData, setUserData, fileName, setFileName }: EditorProps) => {

    const [guestDialogOpen, setGuestDialogOpen] = useState<boolean>(true)
    const [beingUsed, setBeingUsed] = useState<boolean>(true)
    const [content, setContent] = useState<string>("")
    const [lastEditedAt, setLastEditedAt] = useState<string>("")
    const [canView, setCanView] = useState<string[]>([])
    const [canEdit, setCanEdit] = useState<string[]>([])
    const [visibleToGuest, setVisibleToGuest] = useState<boolean>(false)
    const [isPrivate, setIsPrivate] = useState<boolean>(false)
    const [editable, setEditable] = useState<boolean>(false) //turn this into useEffect

    const navigate = useNavigate()

    //GET - FETCH DATA OF THIS ONE FILE
    useEffect()

    const username = userData.username || userData.email


    console.log(`File content is now:`)
    console.log(content)

    const handleSave = () => {
        console.log("Save button is clicked")
        //NOTE: create IFile instance, and push the changes to the existing/new record in DB

        //if a file with this name doesnt exist in the user's drive (go through userData.files array in search of a match)
        //create new file record and append it to the user
        //POST Route: 

        //if this file exists, but the content has been modified
        //save new content

        //POST Route: 


    }

    const handleSaveFileName = (newFileName: string) => {

        //check if filename is valid and unique,

        //if so, save the new name of the file in the DB (PATCH call)


        //and display the new one
        setFileName(newFileName)
        //refresh URL with correct new filename
        navigate(`/${username}/${newFileName}`, { replace: true })
        //if not, set the value to be the previous file name


    }


    return (
        <>
            {/* Render this if user is logged in */}
            {beingUsed && <ConcurrentEditingPopup />}

            <Button onClick={() => handleSave()}>Save</Button>
            {<div>
                <EditorButtons canView={canView} setCanView={setCanView} canEdit={canEdit} setCanEdit={setCanEdit} visibleToGuest={visibleToGuest} setVisibleToGuest={setVisibleToGuest} isPrivate={isPrivate} setIsPrivate={setIsPrivate}/>
                <EditableText value={fileName} onSave={handleSaveFileName}/>
                <div>
                    <EditorField jwt={jwt} content={content} setContent={setContent} editable={editable}/>
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
