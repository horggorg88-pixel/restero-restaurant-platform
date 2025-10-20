import React from "react";
import './style.css'

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@shared/components/ui/select";

interface DateOption {
  value: string;
  label: string;
}

const dateOptions: DateOption[] = [
  { value: "2024-09-20", label: "20.09.2024" },
  { value: "2024-09-21", label: "21.09.2024" },
  { value: "2024-09-22", label: "22.09.2024" },
  { value: "2024-09-23", label: "23.09.2024" },
  { value: "2024-09-24", label: "24.09.2024" },
];

const CustomDateSelector: React.FC<{
  selectedDate: string;
  onChange: (date: string) => void;
}> = ({ selectedDate = "2024-09-20", onChange }) => {
  return (
    <Select value={selectedDate} onValueChange={onChange}>
      <SelectTrigger
        style={{
          border: 'none',
          outline: 'none',
          boxShadow: 'none',
          background: 'transparent',
        }}
        className="custom-select-trigger"
      >
        <SelectValue>
          {dateOptions.find((option) => option.value === selectedDate)?.label ||
            "Выберите дату"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent
        style={{ zIndex: 1000, background: 'white' }}
        className="custom-select-content"
      >
        {dateOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CustomDateSelector;