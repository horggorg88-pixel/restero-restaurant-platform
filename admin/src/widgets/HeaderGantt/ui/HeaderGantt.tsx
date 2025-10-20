import { Button } from "@shared/components/ui/button";
import { Input } from "@shared/components/ui/input";
import Logo from "@assets/icons/logo.png";
import { useNavigate } from "react-router-dom";
import { useModalStore } from "@shared/store";
import { FC, useEffect, useRef, useState } from "react";
import { useDebounce } from "@shared/hooks/useDebounce";
import PopupUser from "@shared/widgets/PopupUser";
import { getBookingsByPhone, getCurrentUser } from "@shared/api/bookinglist";
import { convertDate } from "@shared/utils/convertDate";
import { defaultPaginationParams } from "@pages/BookingList/constants/tableParams";
import { IBookingList, IUser } from "@shared/api/types/bookinglist";
import { removeSeconds } from "@shared/utils/removeSeconds";
import { useQuery } from "@tanstack/react-query";
import { SearchGantSpinner } from "@shared/components/ui/SearchGantSpinner";
import { IHistory } from "@pages/Gantt/ui/Gantt";
import EditRestaurant, { IOldParams } from "@shared/widgets/EditRestaurant";

interface HeaderGanttProps {
  setSearchRes: ({ }) => void;
  setHistoryData: React.Dispatch<React.SetStateAction<IHistory | undefined>>;
}

interface SubstringProps {
  text: string;
  substring: string;
}

const escapeRegExp = (string: string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export const HighlightSubstring: FC<SubstringProps> = ({ text, substring }) => {
  if (!substring) return <span>{text}</span>;

  const escapedSubstring = escapeRegExp(substring);
  const regex = new RegExp(`(${escapedSubstring})`, "gi");
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, index) =>
        part.toLowerCase() === substring.toLowerCase() ? (
          <span key={index} className="text-[#3D8B95]">
            {part}
          </span>
        ) : (
          <span key={index} className="text-[#161616]">
            {part}
          </span>
        )
      )}
    </span>
  );
};

const HeaderGantt: FC<HeaderGanttProps> = ({
  setSearchRes,
  setHistoryData,
}) => {
  const {
    openBookingModal,
    isOpenUser,
    openUser,
    closeUser,
    openEdit,
    setEmpty,
    isEditRestaurant,
    closeEditRestaurant,
  } = useModalStore();

  const [search, setSearch] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const debouncedSearch = useDebounce(search, 500);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };


  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setTimeout(() => setIsFocused(false), 200);
  };

  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/bookinglist");
  };

  const [searchResult, setSearchResult] = useState<IBookingList[] | []>([]);

  const {
    data: searchR,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["bookings", debouncedSearch],
    queryFn: () => {
      if (!debouncedSearch) {
        setSearchResult([]);
        return Promise.resolve({ data: [], meta: { pagination: defaultPaginationParams } });
      }
      const params = {
        status: 0,
        client_phone: debouncedSearch,
        limit: 300,
      };
      return getBookingsByPhone(params);
    },
  });

  useEffect(() => {
    if (searchR) {
      setSearchResult(searchR?.data || []);
    } else {
      setSearchResult([]);
    }
  }, [searchR, error, debouncedSearch]);

  const handleResultClick = (result: IBookingList) => {
    const data = {
      created_at: result?.created_at,
      administrator: result?.administrator?.name,
      histories: result?.histories?.data,
    };

    openEdit();
    setSearchRes(result);
    setHistoryData(data);

    setTimeout(() => setIsFocused(false), 200);
  };

  const { data: user } = useQuery<IUser>({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearchButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleOpen = () => {
    localStorage.removeItem('isEdit')
    setEmpty();
    openBookingModal();
  };

  const [initialParams, setInitialParams] = useState<IOldParams | {}>({});

  return (
    <>
      <PopupUser
        setInitialParams={setInitialParams}
        isOpen={isOpenUser}
        onClose={closeUser}
      />

      <EditRestaurant
        oldParams={initialParams as IOldParams}
        isOpen={isEditRestaurant}
        onClose={closeEditRestaurant}
      />

      <div className="px-6 py-[10px] flex items-center justify-between shadow-lightGray">
        <div className="flex">

          <div className="flex gap-[20px] items-center">
            <div>
              <img src={Logo} alt="logo" />
            </div>
            <Button onClick={handleNavigate} className="bg-[#3D8B95]">
              Все бронирования
            </Button>

            <Button
              onClick={openUser}
              className="bg-1 rounded-[10px] h-[40px]"
            >
              {user?.name}
            </Button>


          </div>
        </div>

        <div className="flex items-center gap-[20px]">
          <div className="relative">
            <Input
              placeholder="Поиск по номеру телефона"
              hasButton
              onChange={handleInputChange}
              value={search}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="w-[286px] pl-[20px] rounded-[0px]"
              ref={inputRef}
              onButtonClick={handleSearchButtonClick}
              isFocused={isFocused}
            />
            {isFocused && (
              <div
                className="absolute bg-[white] w-full max-h-[236px] overflow-y-scroll"
                style={{ zIndex: 31 }}
              >
                {isLoading ? (
                  <div className="flex justify-center items-center py-4">
                    <SearchGantSpinner />
                  </div>
                ) : searchResult.length === 0 && debouncedSearch ? (
                  <div className="px-[20px] py-[15px] text-center text-[#c86162] order border-solid	border-[1px]">
                    По вашему запросу ничего не найдено
                  </div>
                ) : (
                  searchResult.map((result, index) => (
                    <div
                      key={index}
                      className="box-border border-solid	border-[1px] px-[20px] py-[15px]"
                      onClick={() => handleResultClick(result)}
                    >
                      <p>
                        <span>
                          <HighlightSubstring
                            substring={search}
                            text={result.client_phone}
                          />
                        </span>
                        <span className="ml-[20px]">
                          {result.client_name}
                        </span>
                      </p>
                      <p className="my-[5px]">
                        <span className="bg-[#F3F4F6] p-[5px] rounded-[5px]">
                          {convertDate(result.booking_date)}
                        </span>
                        <span className="ml-[20px] bg-[#F3F4F6] p-[5px] rounded-[5px]">
                          {removeSeconds(result?.booking_time_from)} -
                          {removeSeconds(result?.booking_time_to)}
                        </span>
                      </p>
                      <p>
                        <span>{result.room_name}</span>
                        <span className="ml-[20px]">
                          Стол {result.table_number}
                        </span>
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          <Button onClick={handleOpen}>Зарезервировать стол +</Button>
        </div>
      </div>
    </>
  );
};

export default HeaderGantt;
