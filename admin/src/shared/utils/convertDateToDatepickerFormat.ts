import { format, parse } from "date-fns";

export const convertDateToDatepickerFormat = (dateStr: string) => {
  const date = parse(dateStr, "yyyy-MM-dd", new Date());

  const formattedDate = format(
    date,
    "EEE MMM dd yyyy HH:mm:ss 'GMT'xxx (zzzz)"
  );

  return {
    from: formattedDate,
    to: undefined,
  };
};
