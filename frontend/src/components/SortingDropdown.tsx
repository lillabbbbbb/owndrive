import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../components/ui/select";

export default function SortingDropdown() {
  const [value, setValue] = useState("");

  return (
    <Select onValueChange={setValue} value={value}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="last_modified">Last modified</SelectItem>
        <SelectItem value="by_name_ascending">By Name (Z-A)</SelectItem>
        <SelectItem value="by_name_descending">By Name (A-Z)</SelectItem>
        <SelectItem value="by_user_descending">By User (A-Z)</SelectItem>
        <SelectItem value="by_user_ascending">By User (Z-A)</SelectItem>
      </SelectContent>
    </Select>
  );
}