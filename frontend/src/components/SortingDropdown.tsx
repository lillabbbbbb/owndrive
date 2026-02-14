import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../components/ui/select";
import { sortingTypes } from "./main_components/Home";
import { useTranslation } from "react-i18next";
import { THEME } from "../theme"
import { useAppContext } from "./context/globalContext";
import clsx from "clsx";
import {useTheme} from "../components/context/ThemeContext"

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function SortingDropdown({ value, onChange }: Props) {

  const {t} = useTranslation()
const { lightMode } = useTheme()


  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger className={clsx(THEME.button.secondary(lightMode), "w-48")} >
        <SelectValue placeholder="Select an option" className={clsx(THEME.dropdown.text(lightMode))}/>
      </SelectTrigger>
      <SelectContent className={clsx(THEME.dropdown.menu(lightMode))}>
        {Object.entries(sortingTypes).map(([key, value]) => (
          <SelectItem className={clsx(THEME.dropdown.item(lightMode), )} key={key} value={value}>
            {t(value)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}