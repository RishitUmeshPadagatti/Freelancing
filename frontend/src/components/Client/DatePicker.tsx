import { format, isBefore, startOfToday } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useTranslation } from "react-i18next";
import React, { useEffect } from "react";

const DatePicker: React.FC<{
    date: Date | undefined;
    setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
    time: string;
    setTime: React.Dispatch<React.SetStateAction<string>>;
}> = ({ date, setDate, time, setTime }) => {
    const today = startOfToday();
    const {t} = useTranslation()

    useEffect(() => {
        if (date) {
            const currentHours = String(date.getHours()).padStart(2, '0');
            const currentMinutes = String(date.getMinutes()).padStart(2, '0');
            setTime(`${currentHours}:${currentMinutes}`);
        } else {
            setTime("12:00");
        }
    }, [date, setTime]);

    const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const [hours, minutes] = event.target.value.split(":");
        if (date) {
            const newDate = new Date(date);
            newDate.setHours(parseInt(hours, 10));
            newDate.setMinutes(parseInt(minutes, 10));
            setDate(newDate);
        }
        setTime(event.target.value);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? (
                        <>
                            {format(date, "PPP")} at {time}
                        </>
                    ) : (
                        <span>{t("pick-a-date")}</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(selectedDate) => {
                        // Prevent selection of past dates
                        if (selectedDate && !isBefore(selectedDate, today)) {
                            setDate(selectedDate);
                        }
                    }}
                    initialFocus
                    // Assuming `disabled` is a prop that can take a function to disable dates
                    disabled={(date) => isBefore(date, today)} 
                />
                <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">{t("select-time")}</label>
                    <input
                        type="time"
                        className="input input-bordered w-full"
                        value={time}
                        onChange={handleTimeChange}
                    />
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default DatePicker;
