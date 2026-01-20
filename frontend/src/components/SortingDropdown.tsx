import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../components/ui/select";
import { sortingTypes } from "./Home";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function SortingDropdown({ value, onChange }: Props) {


  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(sortingTypes).map(([key, value]) => (
          <SelectItem key={key} value={value}>
            {value}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}