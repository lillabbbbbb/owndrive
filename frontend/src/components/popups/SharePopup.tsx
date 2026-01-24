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
import { Switch } from "../ui/switch"
import { Button } from "../ui/button"
import { MultiSelect } from '../Multiselect'
import { Filter, Filters } from '../Home';
import { Text } from 'lucide-react';
import { HiShare } from "react-icons/hi2";

export type customOption = {
  label: string
  value: string
}



type SharePopupProps = {
  fileData?: Filter<customOption>[],
  onChange: (newFilters: Filters) => void   // callback to update parent
}

const usernames: string[] = ["elisbet29", "9dbaskj2", "lillabbbbbbb"]

const allUsers = usernames.map((u) => ({
  value: u,
  label: u
}))


export function SharePopup() {


  const [open, setOpen] = useState<boolean>(false)
  const [copied, setCopied] = useState(false);
  const [shortUrl, setShortUrl] = useState(`http://localhost:3000/user/file`);
  const [addUsersMenuOpen, setAddUsersMenuOpen] = useState<boolean>(false)


  //https://medium.com/@plsreeparvathy/copy-to-clipboard-feature-with-react-and-mui-065afa55f866
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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

            <Label>{shortUrl}</Label>

            <Button onClick={() => handleCopy()}>Copy link</Button>

            <Label htmlFor="airplane-mode">Allow guests to see file</Label>
            <Switch id="airplane-mode" />


            <Select
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
            />
          </div>


        </DialogContent>
      </Dialog>
    </>
  )
}

export default SharePopup
