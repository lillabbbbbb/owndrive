import React from 'react'
import { useState } from "react"
import Select, { components, createFilter } from 'react-select';
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

import { useAppContext } from "../context/globalContext";
import { useFiles } from '../../hooks/useFiles';
import CustomDialog from '../popups/CustomDialog';
import { isValidFileName } from '../../validators/validateFilename';
import { useTranslation } from 'react-i18next';

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
  const {t} = useTranslation()
  const { currentFileId, user, files, getFile, createFile, filesLoading, filesError } = useAppContext();

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isInvalidName, setIsInvalidName] = useState(false);

  // Check if the input is valid & unique
  const isValidAndUnique = (): boolean => {
    if (!input) return false;
    if (!isValidFileName(input)) return false;
    // check uniqueness
    const existingNames = files?.map(f => f.filename) || [];
    return !existingNames.includes(input);
  };

  const handleSave = async () => {
    if (!user || !currentFileId) return;

    if (!isValidAndUnique()) {
      setIsInvalidName(true);
      return;
    }

    const originalFile = await getFile(currentFileId);
    if (!originalFile) return;

    await createFile({
      created_by: user._id,
      filename: input,
      file_type: originalFile.file_type,
      content: originalFile.content
    });

    setOpen(false); // close dialog
    setInput("");   // reset input
    setIsInvalidName(false);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>{t("dialog.clone.clone-action")}</Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <div className="flex flex-col gap-4">
            <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
              <FieldGroup>
                <Field>
                  <FieldDescription>
                    {t("dialog.clone.description")}
                  </FieldDescription>
                  <FieldLabel htmlFor="file-name-input">{t("dialog.clone.name")}: </FieldLabel>
                  <Input
                    id="file-name-input"
                    placeholder="New file"
                    required
                    value={input}
                    onChange={e => {
                      setInput(e.target.value);
                      setIsInvalidName(false); // reset error while typing
                    }}
                  />
                  {isInvalidName && (
                    <FieldError>
                      {t("dialog.clone.error")}
                    </FieldError>
                  )}
                </Field>
              </FieldGroup>

              <Button
                type="submit"
                disabled={!isValidAndUnique()}
                className={!isValidAndUnique() ? "opacity-50 cursor-not-allowed" : ""}
              >
                {t("dialog.clone.save-copy")}
              </Button>
            </form>
          </div>

          {filesError && <CustomDialog heading="Error" text={filesError} />}
          {filesLoading && <p>{("Loading...")}</p>}
        </DialogContent>
      </Dialog>
    </>
  );
}