import React from 'react'
import { useState } from "react"
//https://ui.shadcn.com/docs/components/radix/dialog
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../ui/select";
import { Button } from "../ui/button"
import { MultiSelect } from '../Multiselect'
import { Filter, Filters } from '../main_components/Home';
import { Text } from 'lucide-react';

export type customOption = {
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
  filters: Filter<customOption>[],
  onChange: (newFilters: Filters) => void   // callback to update parent
}

export function ControlledFilterDialog({ filters, onChange }: FilterDialogProps) {


  const [open, setOpen] = useState<boolean>(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Filter</Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          {/*<DialogHeader>
            <DialogTitle>Yes</DialogTitle>
          </DialogHeader>*/}

          <div className="flex flex-col gap-4">
            {filters.map((filter) => {
              return (
                <div key={filter.label} className="flex flex-col gap-2">
                  <Text>{filter.label}</Text>
                  {filter.type === "multi" ? (
                    <MultiSelect
                      options={filter.options}
                      value={filter.selected as Set<string>}
                      onChange={filter.onChange as (val: Set<string>) => void}
                    />
                  ) : (
                    <Select
                      value={filter.selected as string}
                      onValueChange={filter.onChange as (val: string) => void}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder={`Select ${filter.label}`} />
                      </SelectTrigger>
                      <SelectContent position='popper'>
                        {filter.options.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              )
            })}
          </div>


          {/*<Button onClick={() => setOpen(false)}>Close</Button>*/}
        </DialogContent>
      </Dialog>
    </>
  )
}
