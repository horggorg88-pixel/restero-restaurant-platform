import { FC, Dispatch, useState } from "react";
import { DatePicker } from "@shared/components/ui/datepicker";
import ArrowLeft from "@assets/icons/arrow-left.svg";
import { tabs } from "../constants/tableParams";
import { DateRange } from "react-day-picker";
import { IUser } from "@shared/api/types/bookinglist";
import { Link } from "react-router-dom";
import { Input } from "@shared/components/ui/input";

interface IBookingHeaderProps {
  activeTab:
  | {
    text: string;
    id: number;
  }
  | {
    text: string;
    id?: undefined;
  };

  setActiveTab: Dispatch<
    React.SetStateAction<
      | {
        text: string;
        id: number;
      }
      | {
        text: string;
        id?: undefined;
      }
    >
  >;
  dateRange: DateRange | undefined;
  setDateRange: Dispatch<React.SetStateAction<DateRange | undefined>>;
  user: IUser;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  search: string;
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
}

const BookingListHeader: FC<IBookingHeaderProps> = ({
  activeTab,
  setActiveTab,
  dateRange,
  setDateRange,
  setSearch,
  search,
}) => {

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const [isFocused, setIsFocused] = useState(false);

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  return (
    <header className="flex space-x-4 mb-4 rounded-[10px]">
      <Link to="/gantt">
        <div className="flex items-center justify-center w-[45px] h-[45px] bg-[#F3F4F6] rounded-full">
          <ArrowLeft />
        </div>
      </Link>
      <div className="bg-[#F3F4F6] p-[5px] rounded-[10px] w-[750px] flex">
        {tabs.map((tab) => (
          <button
            key={tab.text}
            className={`py-[5px] px-4 rounded text-[14px] grow ${activeTab.text === tab.text
              ? "bg-[#00617A] text-[white] rounded-[10px]"
              : "opacity-50 text-[#161616]"
              }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.text}
          </button>
        ))}
      </div>

      <div style={{ marginLeft: 'auto' }} className="flex w-[max-content] gap-[20px]">
        <DatePicker
          disabled={false}
          mode="range"
          selectedRange={dateRange}
          setSelectedRange={setDateRange}
          height="45px"
          width="250px"
        />

        <div className="relative w-[max-content]  lg:flex-grow">
          <Input
            placeholder="Поиск..."
            className="bg-[whute] border rounded-[10px] w-[255px] h-[45px]"
            value={search}
            onChange={handleInputChange}
            hasButton
            width="45px"
            height="45px"
            onBlur={handleBlur}
            isFocused={isFocused}
            onFocus={handleFocus}
          />
        </div>

      </div>
    </header>
  );
};

export default BookingListHeader;
