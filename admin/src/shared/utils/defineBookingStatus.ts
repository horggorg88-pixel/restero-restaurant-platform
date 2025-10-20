import JoinWhite from "@assets/icons/join_white.svg";
import JoinRed from "@assets/icons/join_red.svg";
import JoinGray from "@assets/icons/join_gray.svg";
import { isAfter, isToday, isYesterday, parse } from "date-fns";

export const defineBookingStatus = (
  start: string,
  end: string,
  currentTime: string
): boolean => {
  const numberStart = +start.split(":").slice(0, 2).join("");
  const numberEnd = +end.split(":").slice(0, 2).join("");
  const numberCurrent = +currentTime.split(":").join("");

  if (numberCurrent >= numberStart && numberCurrent < numberEnd) {
    return true;
  }

  return false;
};

export const defineBookingBg = (
  start: string,
  status: number,
  date: string
): {
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  background: string;
  color: string;
  joinText: string;
} => {
  const inputDateTime = parse(
    `${date} ${start}`,
    "yyyy-MM-dd HH:mm:ss",
    new Date()
  );
  const now = new Date();
  const today = isToday(inputDateTime);
  const after = isAfter(now, inputDateTime);
  const isNow = today && after;
  const yesterday = isYesterday(inputDateTime);

  if (yesterday && status === 0) {
    return {
      background: "#DF8A8A",
      color: "#161616",
      joinText: "#FFFFFF",
      icon: JoinWhite,
    };
  }

  if (status === 3) {
    return {
      background: "#7AB5AF",
      color: "#161616",
      joinText: "#C52222",
      icon: JoinRed,
    };
  }

  if (status === 2) {
    return {
      background: "#E8E9EA",
      color: "#848586",
      joinText: "#848586",
      icon: JoinGray,
    };
  }

  if (isNow) {
    if (status === 0) {
      return {
        background: "#DF8A8A",
        color: "#161616",
        joinText: "#FFFFFF",
        icon: JoinWhite,
      };
    }

    if (status === 3) {
      return {
        background: "#7AB5AF",
        color: "#161616",
        joinText: "#C52222",
        icon: JoinRed,
      };
    }
  }

  return {
    background: "#D3EBE8",
    color: "#161616",
    joinText: "#C52222",
    icon: JoinRed,
  };
};
