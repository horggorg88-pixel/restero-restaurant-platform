export const rateOptions = [
  {
    value: "booking_date",
    label: "По дате",
    orderBy: "booking_date",
    sortedBy: "asc",
  },
  {
    value: "client_name",
    label: "По имени",
    orderBy: "client_name",
    sortedBy: "asc",
  },
  {
    value: "count_booking_desc",
    label: "По посещениям больше",
    orderBy: "count_booking",
    sortedBy: "desc",
  },
  {
    value: "count_booking_asc",
    label: "По посещениям меньше",
    orderBy: "count_booking",
    sortedBy: "asc",
  },
];

export const databaseHeadingParams = [
  "Дата",
  "Имя гостя",
  "Телефон",
  "Ресторан",
  "Кол-во посещений",
];
