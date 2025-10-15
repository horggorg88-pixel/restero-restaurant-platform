import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/components/ui/select";
import { cn } from "@shared/lib/utils";
import React, { useState } from "react";

interface ISelectItem {
  value: string;
  label: string;
}

interface ISelectProps {
  items: ISelectItem[];
  value?: string;
  onChange: (value: string) => void;
  width?: string;
  bgColor?: boolean;
  disabled?: boolean;
  isRoom?: boolean;
}

export const CustomSelect: React.FC<ISelectProps> = ({
  items,
  value,
  onChange,
  width,
  bgColor,
  disabled,
  isRoom,
}) => {
  const [internalValue, setInternalValue] = useState(
    value ?? (items.length > 0 ? items[0].value : "")
  );

  const handleChange = (newValue: string) => {
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onChange(newValue);
  };

  const selectedValue = value !== undefined ? value : internalValue;

  return (
    <Select
      disabled={disabled ? disabled : false}
      value={!items.length && selectedValue ? "" : selectedValue}
      onValueChange={handleChange}
    >
      <SelectTrigger
        className={cn(
          width ? `w-[100%]` : "w-[219px]",
          bgColor ? "bg-white font-semibold text-base" : ""
        )}
      >
        <SelectValue
          placeholder="Выбрать"
          className="font-semibold text-base"
        />
      </SelectTrigger>
      <SelectContent
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        className="rounded-[10px] bg-white font-semibold text-base overflow-y-scroll max-h-[200px]">
        {isRoom && !items.length ? (
          //@ts-ignore
          <SelectItem className="text-center ml-[-15px]">
            Нет свободных столиков
          </SelectItem>
        ) : (
          items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
};
