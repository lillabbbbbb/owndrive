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
import { Label } from "../ui/label"
import { Button } from "../ui/button"
import { MultiSelect } from '../Multiselect'
import { Filter, Filters } from '../main_components/Home';
import { Text } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { THEME } from "../../theme"
import { useAppContext } from '../context/globalContext';
import clsx from 'clsx';

export type customOption = {
  label: string | null
  value: string | null
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

  //Note: active filters could be stored in session storage

  const { t } = useTranslation()
  const { lightMode } = useAppContext()

  const [open, setOpen] = useState<boolean>(false)

  return (
    <>
      <Button className={clsx(THEME.button.secondary(lightMode), THEME.text.muted(lightMode))} onClick={() => setOpen(true)}>{t("home.filter-button")}</Button>

      <div className={clsx(THEME.background.card(lightMode))}>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className={clsx(THEME.background.card(lightMode))}>
            {/*<DialogHeader>
            <DialogTitle>Yes</DialogTitle>
          </DialogHeader>*/}

            <div className={clsx("flex flex-col")} >
              {filters.map((filter) => {
                return (
                  <div key={filter.label} className="flex flex-col gap-2">
                    <Label className={clsx(THEME.text.primary(lightMode))}>{t(filter.label)}</Label>
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
                        <SelectTrigger className={clsx(THEME.dropdown.trigger(lightMode), "w-48")} >
                          <SelectValue placeholder={`Select ${filter.label}`} />
                        </SelectTrigger>
                        <SelectContent className={clsx(THEME.dropdown.menu(lightMode))} position='popper'>
                          {filter.options.map((option) => (
                            <SelectItem key={option.value} className={clsx(THEME.dropdown.item(lightMode))} value={option.value as string}>
                              {t(option.label!)}
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
      </div>
    </>
  )
}
