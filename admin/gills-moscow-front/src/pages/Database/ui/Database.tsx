import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { rateOptions } from "../constants";
import { format } from "date-fns";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { IDatabase } from "@shared/api/types/database";
import { getDatabaseData } from "@shared/api/database";
import PaginationFooter from "@widgets/PaginationFooter";
import { useDebounce } from "@shared/hooks/useDebounce";
import { Spinner } from "@shared/components/ui/Spinner";
import { getRestaurantList } from "@shared/api/database";
import { usePagination } from "@shared/hooks/usePagination";
import DatabaseTableBody from "../components/DatabaseTableBody";
import EmptyReponse from "@shared/components/ui/EmptyResponse";
import FetchError from "@shared/components/ui/FetchError";
import DatabaseTableHead from "../components/DatabaseTableHead";
import DatabaseHeader from "../components/DatabaseHeader";
import { Helmet } from "react-helmet-async";

const Database = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [selectedValue, setSelectedValue] = useState<string>(
    rateOptions[0].value
  );
  const [restaurantOptions, setRestaurantOptions] = useState([
    {
      value: "Все",
      label: "Все",
    },
  ]);
  // const [restaurantSelectedValue, setRestaurantSelectedValue] =
  //   useState<string>(restaurantOptions[0].value);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [searchParams, setSearchParams] = useState({
    booking_date_from: "",
    booking_date_to: "",
    limit: 15,
    page: 1,
    query: "",
    orderBy: "booking_date",
    sortedBy: "asc",
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchRestaurantOptions = async () => {
      try {
        const response = await getRestaurantList();
        const restaurants = response.data;

        const newOptions = restaurants.map((restaurant) => ({
          value: restaurant.id,
          label: restaurant.name,
        }));

        setRestaurantOptions((prevOptions) => {
          const existingValues = new Set(
            prevOptions.map((option) => option.value)
          );
          const filteredNewOptions = newOptions.filter(
            (option) => !existingValues.has(option.value)
          );
          return [...prevOptions, ...filteredNewOptions];
        });
      } catch (error) {
        console.error("Error fetching restaurant options:", error);
      }
    };

    fetchRestaurantOptions();
  }, []);

  useEffect(() => {
    setSearchParams((prevParams) => ({
      ...prevParams,
      query: debouncedSearch,
      page: 1,
    }));

    queryClient.invalidateQueries({ queryKey: ["databaseData"] });
  }, [debouncedSearch, queryClient]);

  useEffect(() => {
    setSearchParams((prevParams) => ({
      ...prevParams,
      booking_date_from: dateRange?.from
        ? format(dateRange.from, "yyyy-MM-dd")
        : "",
      booking_date_to: dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : "",
    }));
  }, [dateRange]);

  useEffect(() => {
    setSearchParams((prevParams) => ({
      ...prevParams,
      orderBy:
        rateOptions.find((option) => option.value === selectedValue)?.orderBy ||
        "booking_date",
      sortedBy:
        rateOptions.find((option) => option.value === selectedValue)
          ?.sortedBy || "asc",
    }));

    queryClient.invalidateQueries({ queryKey: ["databaseData"] });
  }, [selectedValue, queryClient]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["databaseData", searchParams],
    queryFn: () =>
      getDatabaseData({
        ...searchParams,
        booking_date_to:
          searchParams.booking_date_to || searchParams.booking_date_from,
      }),
  });

  const databaseList: IDatabase[] = data?.data || [];
  const paginationParams = data?.meta?.pagination || {
    current_page: 1,
    per_page: 15,
    total: 0,
    total_pages: 1,
  };

  const { handlePagination } = usePagination({
    paginationParams,
    onPageChange: (newPage: number) =>
      setSearchParams((prevParams) => ({
        ...prevParams,
        page: newPage,
      })),
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleSelectChange = (value: string) => {
    setSelectedValue(value);
  };

  const handleSelectChangeRestaurant = (value: string) => {
    // setRestaurantSelectedValue(value);

    if (value === "Все" && "restaurant_id" in searchParams) {
      const { restaurant_id, ...newParams } = searchParams;

      setSearchParams(newParams);
    } else {
      setSearchParams((prevParams) => ({
        ...prevParams,
        restaurant_id: value,
      }));
    }
  };

  return (
    <>
      <Helmet>
        <title>База данных</title>
      </Helmet>
      <div className="flex flex-col	h-screen">
        <DatabaseHeader
          dateRange={dateRange}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
          handleSelectChangeRestaurant={handleSelectChangeRestaurant}
          restaurantOptions={restaurantOptions}
          search={search}
          setDateRange={setDateRange}
        />

        {isError ? (
          <FetchError />
        ) : (
          <main className="flex-grow p-4 min-w-[1200px] grow">
            {isLoading ? (
              <Spinner />
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg table-fixed">
                  <DatabaseTableHead />
                  <DatabaseTableBody databaseList={databaseList} />
                </table>
                {!databaseList.length && <EmptyReponse />}
              </div>
            )}
          </main>
        )}

        {!isLoading && !isError && (
          <PaginationFooter
            paginationParams={paginationParams}
            onPageChange={handlePagination}
          />
        )}
      </div>
    </>
  );
};

export default Database;
