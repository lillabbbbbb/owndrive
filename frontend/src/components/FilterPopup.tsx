import React from 'react'


import { useState } from "react"
import { User } from './Home'
//https://ui.shadcn.com/docs/components/radix/dialog
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../components/ui/select";
import { Button } from "./ui/button"
import { MultiSelect } from './Multiselect'

export type Option = {
  label: string
  value: string
}

enum dateOptions {
  NONE = "None",
  EDITED_TODAY = "Edited today",
  EDITED_30_DAYS = "Edited this month",
  EDITED_6_MONTHS = "Edited in 6 months",
  EDITED_1_YEAR = "Edited in a year",
  OLDER_THAN_1_YEAR = "Older than a year"
}


type FilterDialogProps = {
  files: User[]
}

export function ControlledFilterDialog({ files }: FilterDialogProps) {

  const usernames = [...new Set(files.map((user) => user.creator))]
  const creatorOptions: Set<Option> = new Set(usernames.map(username => ({
    label: username,
    value: username,
  })))

  const fileTypes = [...new Set(files.map((user) => user.file_type))]

  const fileTypeOptions: Set<Option> = new Set(fileTypes.map(fileType => ({
    label: fileType,
    value: fileType,
  })))

  const [open, setOpen] = useState<boolean>(false)
  const [creatorFilters, setCreatorFilters] = useState<Set<string>>(new Set())
  const [dateFilter, setDateFilter] = useState(dateOptions.NONE)
  const [fileTypeFilters, setFileTypeFilters] = useState<Set<string>>(new Set())


  const handleDateFilterChange = (c: string) => {
    console.log("Date filter is being changed")

    Object.values(dateOptions).forEach((dateOption) => {
      if (dateOption === c) {
        setDateFilter(c)
      }
    })

  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>Filter</Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yes</DialogTitle>
          </DialogHeader>

          <div>
            <p>Creator:</p>
            {/*This creator dropdown is multiselect*/}
            <MultiSelect onChange={setCreatorFilters} options={creatorOptions} value={creatorFilters} />

          </div>

          <div>

            <Select onValueChange={(c) => handleDateFilterChange(c)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(dateOptions).map(([key, value]) => (
                  <SelectItem value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <MultiSelect onChange={setFileTypeFilters} options={fileTypeOptions} value={fileTypeFilters} />
          </div>

          {/*<Button onClick={() => setOpen(false)}>Close</Button>*/}
        </DialogContent>
      </Dialog>
    </>
  )
}

/*
const FilterPopup = () => {


  return (
    <div>
      <div>
        <div>
          <p>Creator:</p>
          <FilterDropdown individualFilterOptions={dateOptions} />
        </div>
      </div>
    </div>
  )
}

export default FilterPopup
*/
