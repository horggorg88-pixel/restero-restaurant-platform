import { FC, useState } from "react";
import { Button } from "@shared/components/ui/button";
import { Calendar } from "@shared/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@shared/components/ui/popover";
import { cn } from "@shared/lib/utils";
import { format, isBefore, startOfDay } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { ru } from "date-fns/locale";

interface DatePickerProps {
  selectedRange: DateRange | undefined;
  setSelectedRange: (range: DateRange | undefined) => void;
  outputText?: string;
  mode: "single" | "range";
  width?: string;
  bgColor?: boolean;
  height?: string;
  onlyFresh?: boolean;
  radius?: string;
  disabled: boolean
}

export const DatePicker: FC<DatePickerProps> = ({
  selectedRange,
  setSelectedRange,
  outputText,
  mode,
  width,
  bgColor,
  height,
  onlyFresh,
  radius,
  disabled
}) => {
  const [isOpen, setIsOpen] = useState(false);
  let formattedDate = "";

  if (mode === "range") {
    const range = selectedRange as DateRange;
    if (range?.from) {
      formattedDate = range.to
        ? `${format(range.from, "dd.MM.yyyy")} - ${format(
          range.to,
          "dd.MM.yyyy"
        )}`
        : `${format(range.from, "dd.MM.yyyy")}`;
    }
  } else if (mode === "single") {
    const date = (selectedRange as DateRange)?.from;
    if (date) {
      formattedDate = format(date, "dd.MM.yyyy");
    }
  }

  const handleSelect = (date: DateRange | undefined) => {
    const today = startOfDay(new Date());

    if (onlyFresh && date?.from && isBefore(date.from, today)) {
      return;
    }

    setSelectedRange(date);

    if (mode === "single" || (mode === "range" && date?.from && date.to)) {
      setIsOpen(false);
    }
  };

  const handleOpen = () => {
    if (disabled) {
      return
    }

    setIsOpen(!isOpen)
  }


  return (
    <Popover open={isOpen} onOpenChange={handleOpen}>
      <PopoverTrigger disabled={disabled} asChild>
        <Button
          variant={"outline"}
          onClick={handleOpen}
          className={cn(
            "flex justify-between items-center text-left font-normal",
            !selectedRange && !outputText && "text-muted-foreground",
            "border-none min-w-[146px] w-full",
            bgColor ? `bg-white` : "bg-gray-100",
            width ? `w-[${width}]` : "w-[146px]",
            height ? `h-[${height}]` : "40px",
            radius ? `rounded-[${radius}]` : "rounded-[10px]",
          )}
        >
          <span className="font-semibold text-base">
            {formattedDate || outputText || "Выберите дату"}
          </span>
          <CalendarIcon className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white border border-gray-300 rounded shadow-lg">
        {mode === "range" ? (
          <Calendar
            mode="range"
            selected={selectedRange as DateRange}
            onSelect={(date) => handleSelect(date as DateRange)}
            locale={ru}
            classNames={{
              months:
                "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-sm font-medium text-gray-900",
              nav: "space-x-1 flex items-center",
              nav_button: "h-7 w-7 p-0 opacity-50",
              table: "w-full space-y-1",
              head_row: "bg-[#F3F4F6] flex",
              head_cell: "text-black font-normal text-sm w-9 text-center",
              row: "flex w-full mt-2",
              cell: "h-9 w-9 text-center text-sm p-0 relative",
              day: "h-9 w-9 p-0 font-normal",
              day_range_end: "bg-blue-500 text-white",
              day_selected: "bg-blue-500 text-white",
              day_outside: "text-gray-400",
              day_disabled: "text-gray-300",
              day_range_middle: "bg-blue-500 text-white",
              day_hidden: "invisible",
            }}
          />
        ) : (
          <Calendar
            disabled={onlyFresh ? { before: new Date() } : undefined}
            mode="single"
            selected={(selectedRange as DateRange)?.from}
            onSelect={(date) =>
              handleSelect(date ? { from: date, to: undefined } : undefined)
            }
            locale={ru}
            classNames={{
              months:
                "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-sm font-medium text-gray-900",
              nav: "space-x-1 flex items-center",
              nav_button: "h-7 w-7 p-0 opacity-50",
              table: "w-full space-y-1",
              head_row: "bg-[#F3F4F6] flex",
              head_cell: "text-black font-normal text-sm w-9 text-center",
              row: "flex w-full mt-2",
              cell: "h-9 w-9 text-center text-sm p-0 relative",
              day: "h-9 w-9 p-0 font-normal",
              day_range_end: "bg-blue-500 text-white",
              day_selected: "bg-blue-500 text-white",
              day_outside: "text-gray-400",
              day_disabled: "text-[#666666] bg-[#E8E8E8] ",
              day_range_middle: "bg-blue-500 text-white",
              day_hidden: "invisible",
            }}
          />
        )}
      </PopoverContent>
    </Popover >
  );
};
