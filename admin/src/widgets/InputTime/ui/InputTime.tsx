import React, { useState, useRef, useEffect, forwardRef } from "react";
import { cn } from "@shared/lib/utils";
import { UseFormSetValue } from "react-hook-form";
import { IRepeatReservation } from "@shared/api/types/bookinglist";

interface InputTimeProps {
    value?: string;
    onChange?: (value: string) => void;
    onTimeSelect: ((hour: number, minute: number) => void);
    bookingTime: string;
    isError?: string;
    setValue: UseFormSetValue<IRepeatReservation>;
    field: 'booking_time' | 'count_booking_time';
    disabled: boolean,
    wfull?: boolean
}

const generateLoopedData = (count: number, step: number = 1): string[] => {
    const values = Array.from({ length: count }, (_, i) =>
        (i * step).toString().padStart(2, "0")
    );
    return Array(5).fill(values).flat();
};

const InputTime = forwardRef<HTMLDivElement, InputTimeProps>(
  ({ value, onTimeSelect, bookingTime, isError, setValue, field, disabled, wfull }, ref) => {
    const hours: string[] = generateLoopedData(24);
    const minutes: string[] = generateLoopedData(4, 15);


    const defineInitialParams = () => {

        if (!bookingTime) {
            const now: Date = new Date();
            let initialHour: number = now.getHours();
            let initialMinute: number = Math.ceil(now.getMinutes() / 15) * 15;

            return [initialHour, initialMinute]
        }

        return bookingTime.split(':').map(Number)
    }


    let [initialHour, initialMinute] = defineInitialParams()

    if (initialMinute === 60) {
        initialHour += 1;
        initialMinute = 0;
    }
    if (initialHour === 24) {
        initialHour = 0;
    }

    const [selectedHour, setSelectedHour] = useState<string>(
        (initialHour || 0).toString().padStart(2, "0")
    );
    const [selectedMinute, setSelectedMinute] = useState<string>(
        (initialMinute || 0).toString().padStart(2, "0")
    );
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const hourRef = useRef<HTMLUListElement | null>(null);
    const minuteRef = useRef<HTMLUListElement | null>(null);

    const realValues = (items: string[]): string[] => [...new Set(items)];

    const getScrollPosition = (items: string[], value: string, mode: string): number => {
        const uniqueItems = realValues(items);
        const index = uniqueItems.indexOf(value);
        const itemHeight = 40;

        if (index === 0) {
            return mode === 'hour' ? 23 * itemHeight : 3 * itemHeight;
        }

        return index * itemHeight - (3 * itemHeight) / 2 + itemHeight / 2;
    };

    useEffect(() => {
        if (isOpen) {
            const hourToScroll = selectedHour === "24" ? "00" : selectedHour;
            const minuteToScroll = selectedMinute;

            if (hourRef.current) {
                const hourScrollPosition = getScrollPosition(hours, hourToScroll, 'hour');
                hourRef.current.scrollTo({
                    top: hourScrollPosition,
                    behavior: "instant",
                });
            }
            if (minuteRef.current) {
                const minuteScrollPosition = getScrollPosition(minutes, minuteToScroll, 'minute');
                minuteRef.current.scrollTo({
                    top: minuteScrollPosition,
                    behavior: "instant",
                });
            }
        }
    }, [isOpen]);

    const handleScroll = (
        ref: React.RefObject<HTMLUListElement | null>,
        items: string[],
        setSelected: React.Dispatch<React.SetStateAction<string>>
    ): void => {
        if (!ref.current) return;

        const scrollTop = ref.current.scrollTop;
        const uniqueItems = realValues(items);
        const itemHeight = 40;
        const middleIndex = Math.round((scrollTop + itemHeight) / itemHeight);
        const realIndex = middleIndex % uniqueItems.length;

        const selectedValue = uniqueItems[realIndex];
        setSelected(selectedValue);

        if (
            middleIndex < uniqueItems.length ||
            middleIndex >= items.length - uniqueItems.length
        ) {
            setTimeout(() => {
                if (ref.current) {
                    const targetScrollPosition = (realIndex + uniqueItems.length * 2) * itemHeight - itemHeight;
                    ref.current.scrollTo({
                        top: Math.max(targetScrollPosition, 0),
                        behavior: "instant",
                    });
                }
            }, 100);
        }
    };

    const handleConfirm = () => {
        const finalHour = selectedHour === "24" ? "00" : selectedHour;
        const finalMinute = selectedMinute === "60" ? "00" : selectedMinute;

        setSelectedHour(finalHour);
        setSelectedMinute(finalMinute);
        setIsOpen(false);

        setValue(field, `${selectedHour}:${selectedMinute}`)

        onTimeSelect(parseInt(finalHour), parseInt(finalMinute))
    };

    const handleClose = () => {
        const hour = initialHour.toString().padStart(2, "0");
        const minute = initialMinute.toString().padStart(2, "0");

        setSelectedHour(hour);
        setSelectedMinute(minute)
        setIsOpen(false);
    }

    const handleOpen = () => {
        if (disabled) {
            return
        }
        setIsOpen(true)
    }

    const displayTime = `${selectedHour === "24" ? "00" : selectedHour}:${selectedMinute}`;

    return (
        <div ref={ref} className="time-picker-wrapper" style={{ width: wfull ? '100%' : '' }}>
            <input
                type="text"
                value={value || displayTime}
                readOnly
                className={cn('time-input', { 'input-error': isError }, { "disabled-input": disabled })}
                onClick={handleOpen}
            />
            {isOpen && (
                <>
                    <div className="overlay" onClick={handleClose}></div>
                    <div className={`time-picker ${wfull ? "time-picker_full" : ""}`}>
                        <div className="time-values-wrapper">
                            <div className="picker-container">
                                <ul
                                    className="picker"
                                    ref={hourRef}
                                    onScroll={() => handleScroll(hourRef, hours, setSelectedHour)}
                                    style={{ height: "120px", overflowY: "auto" }}
                                >
                                    {hours.map((h, i) => (
                                        <li
                                            key={i}
                                            className={h === selectedHour ? "active" : ""}
                                            style={{ height: "40px", display: "flex", alignItems: "center", justifyContent: "center" }}
                                        >
                                            {h}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="separator">:</div>
                            <div className="picker-container">
                                <ul
                                    className="picker"
                                    ref={minuteRef}
                                    onScroll={() => handleScroll(minuteRef, minutes, setSelectedMinute)}
                                    style={{ height: "120px", overflowY: "auto" }}
                                >
                                    {minutes.map((m, i) => (
                                        <li
                                            key={i}
                                            className={m === selectedMinute ? "active" : ""}
                                            style={{ height: "40px", display: "flex", alignItems: "center", justifyContent: "center" }}
                                        >
                                            {m}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <span className="active-zone"></span>
                        <button className="confirm-btn" onClick={handleConfirm}>Сохранить</button>
                    </div>
                </>
            )}
        </div>
    );
  }
);

InputTime.displayName = 'InputTime';

export default InputTime;