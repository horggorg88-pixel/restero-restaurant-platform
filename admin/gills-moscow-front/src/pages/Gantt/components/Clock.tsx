import { IUser } from "@shared/api/types/bookinglist";
import { getWorkingTime } from "@shared/utils/getWorkingTime";
import { FC } from "react";
import TimeArrow from "@assets/icons/timer_arrow.svg";

interface IClockProps {
  time: string;
  user?: IUser | undefined

}

const Clock: FC<IClockProps> = ({ time, user }) => {
  return (
    <div
      className="px-7 relative flex-col top-[51px] z-50 bg-[#F3F4F6] w-[210px] shadow-md rounded-[10px] ml-[5px] mt-[10px]"
      style={{
        background: "#F3F4F6",
        borderRadius: 0,
        height: "100px",
        top: "97px",
        margin: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="flex gap-3 items-center text-1 font-medium text-sm ml-[15px]">
        <p className=" h-[20px] rounded-[10px] bg-6 flex justify-center gap-[8px] items-center">
          <TimeArrow className="w-[16px] h-[16px]" />
          <span className="font-semibold text-[16px]">{getWorkingTime(user)}</span>
        </p>
      </div>
      <span className="text-[58px] font-[700] leading-[60px]">{time}</span>
    </div>
  );
};

export default Clock;
