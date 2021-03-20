import { HolidayEvent } from "./event.dto";
export * from "./event.dto";
export declare class Holiday {
    static enabledCache: boolean;
    static cacheTime: number;
    private static cacheTimer;
    private static cache;
    static fetchEvents(forceReload?: boolean): Promise<HolidayEvent[]>;
    private static loadAllEvents;
    private static loadEventByPage;
}
