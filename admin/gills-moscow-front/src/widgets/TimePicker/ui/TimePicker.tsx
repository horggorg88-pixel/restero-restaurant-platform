import React, { useState } from "react";

interface TimePickerProps {
  initialHour?: number;
  initialMinute?: number;
  onTimeSelect?: (hour: number, minute: number) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({
  initialHour = 12,
  initialMinute = 30,
  onTimeSelect,
}) => {
  const [hour, setHour] = useState<number>(initialHour);
  const [minute, setMinute] = useState<number>(initialMinute);
  const [is24HourMode, setIs24HourMode] = useState<boolean>(false); // Режим переключения между 1-12 и 13-00

  // Минуты: 00, 15, 30, 45
  const minutes = [0, 15, 30, 45];
  const hours = Array.from({ length: 12 }, (_, i) => i + 1); // Часы 1-12
  const hours24 = [...Array.from({ length: 11 }, (_, i) => i + 13), 0]; // Часы 13-00

  const handleHourClick = (selectedHour: number) => {
    setHour(selectedHour);
  };

  const handleMinuteClick = (selectedMinute: number) => {
    setMinute(selectedMinute);
  };

  const toggleHourMode = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setIs24HourMode((prevMode) => !prevMode);
  };

  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md relative">
      {/* Кнопка переключения режима */}
      <button
        onClick={(e) => toggleHourMode(e)}
        className="absolute top-2 right-2 px-2 py-1 bg-gray-300 rounded"
      >
        {is24HourMode ? "1-12" : "13-00"}
      </button>

      <div className="flex items-center justify-center text-4xl mb-4">
        <span className="cursor-pointer px-2">
          {hour < 10 ? `0${hour}` : hour}
        </span>
        :
        <span className="cursor-pointer px-2">
          {minute < 10 ? `0${minute}` : minute}
        </span>
      </div>

      <div className="relative w-72 h-72">
        {/* Внешний круг — минуты */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full flex justify-center items-center">
            {minutes.map((m, index) => {
              // Угол для минут остается без изменений
              const angle = (index / minutes.length) * 360;
              const style = {
                transform: `rotate(${angle}deg) translate(0, -130px) rotate(-${angle}deg)`,
                zIndex: 10,
              };
              return (
                <div
                  key={m}
                  style={style}
                  className={`text-sm absolute w-[25px] h-[25px] rounded-full flex items-center justify-center cursor-pointer 
                  ${m === minute ? "bg-[#00617a] text-white" : "bg-gray-200"}`}
                  onClick={() => handleMinuteClick(m)}
                >
                  {m < 10 ? `0${m}` : m}
                </div>
              );
            })}
          </div>
        </div>

        {/* Внутренний круг — переключаемые часы */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-[40px] h-[40px] flex justify-center items-center">
            {(is24HourMode ? hours24 : hours).map((h, index) => {
              // Сдвиг угла на 30 градусов вперед для часов
              const angle =
                ((index / (is24HourMode ? hours24.length : hours.length)) *
                  360 +
                  30) %
                360;
              const style = {
                transform: `rotate(${angle}deg) translate(0, -80px) rotate(-${angle}deg)`,
                zIndex: 10,
              };
              return (
                <div
                  key={h}
                  style={style}
                  className={`text-sm absolute w-[25px] h-[25px] rounded-full flex items-center justify-center cursor-pointer 
                  ${h === hour ? "bg-[#00617a] text-white" : "bg-gray-200"}`}
                  onClick={() => handleHourClick(h)}
                >
                  {h === 0 ? "00" : h}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <button
          className="px-4 py-2 bg-[#00617a] text-white rounded w-[200px]"
          onClick={() => onTimeSelect?.(hour, minute)}
        >
          Применить
        </button>
      </div>
    </div>
  );
};

export default TimePicker;
