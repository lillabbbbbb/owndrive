import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../components/ui/select";

type FilterProps = {
    individualFilterOptions: string[]
  value?: string;
  onChange?: (value: string) => void;
};

export default function FilterDropdown({ individualFilterOptions, value, onChange }: FilterProps) {


  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(individualFilterOptions).map(([key, value]) => (
          <SelectItem value="value..">
            some value
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}