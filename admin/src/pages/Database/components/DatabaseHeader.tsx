import { DatePicker } from "@shared/components/ui/datepicker";
import { Input } from "@shared/components/ui/input";
import { Link } from "react-router-dom";
import { CustomSelect } from "./Select";
import { rateOptions } from "../constants";
import ArrowLeft from "@assets/icons/arrow-left.svg";
import { DateRange } from "react-day-picker";
import { FC } from "react";

interface IDatabaseHeaderProps {
  dateRange: DateRange | undefined;
  setDateRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  search: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  restaurantOptions: {
    value: string;
    label: string;
  }[];
  handleSelectChangeRestaurant: (value: string) => void;
  handleSelectChange: (value: string) => void;
}

const DatabaseHeader: FC<IDatabaseHeaderProps> = ({
  dateRange,
  setDateRange,
  search,
  handleInputChange,
  restaurantOptions,
  handleSelectChangeRestaurant,
  handleSelectChange,
}) => {
  return (
    <header className="p-4 flex items-center justify-between w-full bg-white min-w-[1200px]">
      <div className="flex items-center gap-5 flex-shrink-0">
        <Link to="/gantt">
          <div className="flex items-center justify-center w-[41px] h-[41px] bg-[#F3F4F6] rounded-full">
            <ArrowLeft />
          </div>
        </Link>
        <Input
          placeholder="Поиск..."
          hasButton
          className="w-[320px]"
          value={search}
          onChange={handleInputChange}
        />
      </div>

      <div className="flex flex items-center gap-5">
        <DatePicker
          disabled={false}
          width="250px"
          outputText="За все время"
          selectedRange={dateRange}
          setSelectedRange={setDateRange}
          mode="range"
        />
        <div className="flex gap-5">
          <CustomSelect
            items={restaurantOptions}
            onChange={handleSelectChangeRestaurant}
          />
          <CustomSelect items={rateOptions} onChange={handleSelectChange} />
        </div>
      </div>
    </header>
  );
};

export default DatabaseHeader;
