import { useState, useEffect } from "react"
import Select from 'react-select';
import type { MultiValue, ActionMeta } from "react-select";
//https://ui.shadcn.com/docs/components/radix/dialog
import {
  Dialog,
  DialogContent,
} from "../ui/dialog"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "../ui/field"
import { Switch } from "../ui/switch"
import { Button } from "../ui/button"
import { HiShare } from "react-icons/hi2";
import { useAppContext } from "../context/globalContext";
import { fileType, IFileFrontend } from '../../types/File';
import { useTranslation } from 'react-i18next';
import { THEME } from "../../theme"
import clsx from 'clsx';


export type customOption = {
  label: string
  value: string
}


export function SharePopup() {

  const { t } = useTranslation()
  const { lightMode } = useAppContext()
  const { currentFileId, getFile, updateFile, getAllUsernames, user, filesLoading, filesError } = useAppContext()


  const [file, setFile] = useState<fileType | null>(null)
  const [open, setOpen] = useState<boolean>(false)
  const [copied, setCopied] = useState(false);
  const [shortUrl, setShortUrl] = useState(`http://localhost:3000/user/file`);
  const [addUsersMenuOpen, setAddUsersMenuOpen] = useState<boolean>(false)
  const [options, setOptions] = useState<customOption[]>([])
  const [selectedEmails, setSelectedEmails] = useState<customOption[]>([])


  useEffect(() => {
    const fetchUsers = async () => {
      const usernames = await getAllUsernames();
      if (!Array.isArray(usernames)) return [];
      console.log(usernames)

      const mapped = usernames.map(u => ({ value: u._id, label: u.email }));
      setOptions(mapped);
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    setShortUrl(`http://localhost:3000/${user?._id}/${currentFileId}`)
  }, [])

  useEffect(() => {
    if (!file) return

    const filteredEmails = (file.file.canEdit).map(id => {
      const match = options.find(opt => opt.value === id);
      return match;
    })
      .filter((match): match is customOption => !!match); // TypeScript now knows it's string[]

    setSelectedEmails(filteredEmails)
  }, [])

  useEffect(() => {
    if (!currentFileId) return;

    const loadFile = async () => {
      const f = await getFile(currentFileId); // await the Promise
      if(!f) return
      setFile(f);
    };

    loadFile();
    //console.log(file)
  }, [currentFileId, getFile]);


  useEffect(() => {
    if (!file) return
    console.log("This file is " + (!file.file.private ? "not " : "") + "private.");
    console.log("This file is " + (!file.file.visibleToGuests ? "not " : "") + "visible to guests.");
    console.log("Selected options:", file.file.canEdit);
  }, [file])


  //https://medium.com/@plsreeparvathy/copy-to-clipboard-feature-with-react-and-mui-065afa55f866
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      console.log("Link copied to clipboard.")
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };


  return (
    file && <>

      <Button className={clsx(THEME.button.primary(lightMode))} onClick={() => setOpen(true)}><HiShare className="w-5 h-5" /></Button>


      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className={clsx(
            THEME.background.card(lightMode),
            "w-auto max-w-[95vw] sm:max-w-[500px] p-0"
          )}
        >
          {/*<DialogHeader>
            <DialogTitle>Yes</DialogTitle>
          </DialogHeader>*/}

          <Field orientation="horizontal" className='mt-5'>
            <FieldContent>
              <FieldLabel htmlFor="copy-link-text">{shortUrl}</FieldLabel>
            </FieldContent>
            <Button className={clsx(THEME.button.primary(lightMode))} onClick={() => handleCopy()}>{t("share.copy-link")}</Button>
          </Field>

          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor="visible-to-guests">{t("share.show-for-guests")}</FieldLabel>
              <FieldDescription>
                ...
              </FieldDescription>
            </FieldContent>

            <Switch id="visible-to-guest" className={clsx(THEME.toggle.track(lightMode), THEME.toggle.thumb(lightMode), THEME.toggle.focus, "[&>span]:bg-white [&>span]:data-[state=checked]:bg-orange-200")} onCheckedChange={(c) => updateFile(currentFileId!, { visibleToGuests: c })} />
          </Field>


          <Select<customOption, true>
            isMulti
            options={options}
            onInputChange={(value) => {
              //console.log(value)
              if (value.length < 6) {
                // hide dropdown
                setAddUsersMenuOpen(false);
                console.log("menu closed")
              } else {
                setAddUsersMenuOpen(true);
              }
            }}
            value={selectedEmails}
            onChange={(newValue: MultiValue<customOption>, actionMeta: ActionMeta<customOption>) => {
              updateFile(currentFileId!, { canEdit: newValue.map((v: customOption) => v.value) }) //set who can edit
              setSelectedEmails([...newValue])
            }}

            menuIsOpen={addUsersMenuOpen}
            onBlur={() => setAddUsersMenuOpen(false)}
          />

          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor="is-private">{t("editor-buttons.make-private")}</FieldLabel>
              <FieldDescription>
                {t("editor-buttons.make-private")}
              </FieldDescription>
            </FieldContent>
            <Switch
              id="is-private"
              checked={file.file.private}
              onCheckedChange={(c) => { updateFile(currentFileId!, { private: c }) }} //set is private
            />
          </Field>
        </DialogContent>
      </Dialog >
    </>
  )
}

export default SharePopup
