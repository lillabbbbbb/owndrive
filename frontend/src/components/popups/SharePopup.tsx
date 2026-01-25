import React from 'react'
import { useState } from "react"
import Select, { components } from 'react-select';
import type { MultiValue, ActionMeta } from "react-select";
//https://ui.shadcn.com/docs/components/radix/dialog
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "../ui/field"
import { Label } from "../ui/label"
import { Switch } from "../ui/switch"
import { Button } from "../ui/button"
import { MultiSelect } from '../Multiselect'
import { Filter, Filters } from '../main_components/Home';
import { Text } from 'lucide-react';
import { HiShare } from "react-icons/hi2";

export type customOption = {
  label: string
  value: string
}



type SharePopupProps = {
  canView: string[],
  canEdit: string[],
  visibleToGuest: boolean,
  isPrivate: boolean,
  setCanView: (users: string[]) => void,
  setCanEdit: (users: string[]) => void,
  setVisibleToGuest: (b: boolean) => void,
  setIsPrivate: (b: boolean) => void,
}

const usernames: string[] = ["elisbet29", "9dbaskj2", "lillabbbbbbb"]

const allUsers = usernames.map((u) => ({
  value: u,
  label: u
}))


export function SharePopup({ canView, canEdit, isPrivate, visibleToGuest, setCanView, setCanEdit, setIsPrivate, setVisibleToGuest }: SharePopupProps) {


  const [open, setOpen] = useState<boolean>(false)
  const [copied, setCopied] = useState(false);
  const [shortUrl, setShortUrl] = useState(`http://localhost:3000/user/file`);
  const [addUsersMenuOpen, setAddUsersMenuOpen] = useState<boolean>(false)

  console.log("This file is " + (!isPrivate ? "not " : "") + "private.");
  console.log("This file is " + (!visibleToGuest ? "not " : "") + "visible to guests.");


  console.log("Selected options:", canEdit);

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
    <>
      <Button onClick={() => setOpen(true)}><HiShare className="w-5 h-5" /></Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          {/*<DialogHeader>
            <DialogTitle>Yes</DialogTitle>
          </DialogHeader>*/}

          <div className="flex flex-col gap-4">

            <Field orientation="horizontal" className='mt-5'>
            <FieldContent>
              <FieldLabel htmlFor="copy-link-text">{shortUrl}</FieldLabel>
            </FieldContent>
            <Button onClick={() => handleCopy()}>Copy link</Button>
          </Field>

            <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor="visible-to-guests">Allow guests to see file</FieldLabel>
              <FieldDescription>
                ...
              </FieldDescription>
            </FieldContent>
            
            <Switch id="visible-to-guest" onCheckedChange={(c) => setVisibleToGuest(!c)} />
          </Field>


            <Select<customOption, true>
              isMulti
              options={allUsers}
              onInputChange={(value) => {
                console.log(value)
                if (value.length < 6) {
                  // hide dropdown
                  setAddUsersMenuOpen(false);
                  console.log("menu closed")
                } else {
                  setAddUsersMenuOpen(true);
                }
              }}
              value={canEdit.map(user => ({ value: user, label: user }))} // controlled component
              onChange={(newValue: MultiValue<customOption>, actionMeta: ActionMeta<customOption>) => {
                setCanEdit(newValue.map((v: customOption) => v.value)); // back to string[]
                console.log(canEdit)
              }}

              menuIsOpen={addUsersMenuOpen}
            />
          </div>

          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor="is-private">Make private</FieldLabel>
              <FieldDescription>
                Hide file from guests and all shared users.
              </FieldDescription>
            </FieldContent>
            <Switch
              id="is-private"
              checked={isPrivate}
              onCheckedChange={(c) => setIsPrivate(c)}
            />
          </Field>


        </DialogContent>
      </Dialog>
    </>
  )
}

export default SharePopup
