import React from 'react'
import { useState } from "react"
import Select, { components } from 'react-select';
//https://ui.shadcn.com/docs/components/radix/dialog
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Filter, Filters } from '../main_components/Home';
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
    FieldTitle,
} from "../ui/field"

export type customOption = {
    label: string
    value: string
}



type ClonePopupProps = {
    fileData?: Filter<customOption>[],
    onChange: (newFilters: Filters) => void   // callback to update parent
}

const fileName = "testFileNameNotreal"

export function ClonePopup() {


    const [open, setOpen] = useState<boolean>(false)
    const [changed, setChanged] = useState<boolean>(false);
    const [isInvalidName, setIsInvalidName] = useState<boolean>(false)
    const [newName, setNewName] = useState("New document")


    const handleSave = async () => {

        //
    };

    const isValidFilename = () => {
        //check if special characters are used like "/", etc.

        //check if a file with this name in the user's drive already exists
        //GET - FETCH ALL FILENAMES IN THIS USER'S DRIVE
        fetch..
        setIsInvalidName(true)
    }

    return (
        <>
            <Button onClick={() => setOpen(true)}>Clone</Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    {/*<DialogHeader>
            <DialogTitle>Yes</DialogTitle>
          </DialogHeader>*/}

                    <div className="flex flex-col gap-4">
                        <form>
                            <FieldGroup>
                                <Field>
                                    <FieldDescription>
                                        The new document will be saved in your Drive.
                                    </FieldDescription>
                                    <FieldLabel htmlFor="checkout-7j9-cvv">Name: </FieldLabel>
                                    <Input id="checkout-7j9-cvv" placeholder="123" required />
                                    {isInvalidName && <FieldError>Invalid file name / File with this name already exists</FieldError>}

                                </Field>
                            </FieldGroup>

                            <Button onClick={() => handleSave()}>Save copy</Button>
                        </form>

                    </div>


                </DialogContent>
            </Dialog >
        </>
    )
}

export default ClonePopup
