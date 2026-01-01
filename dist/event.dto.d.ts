export interface HolidayRaw {
    date: string;
    name: string;
    year: string;
    isholiday: '是' | '否';
    holidaycategory: string;
    description: string;
}
export interface HolidayEvent {
    date: string;
    name: string;
    isHoliday: boolean;
    holidayCategory: string;
    description: string;
    week: number;
    year: string;
}
