export interface HolidayRaw {
    date: string;
    name: string;
    chinese: string;
    isholiday: "是" | "否" | boolean;
    holidayCategory: string;
    description: string;
    week?: number;
}
export interface HolidayEvent {
    date: string;
    name: string;
    isHoliday: boolean;
    holidayCategory: string;
    description: string;
    week: number;
}
