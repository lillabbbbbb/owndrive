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

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function SortingDropdown({ value, onChange }: Props) {

  const {t} = useTranslation()


  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(sortingTypes).map(([key, value]) => (
          <SelectItem key={key} value={value}>
            {t(value)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}