import axios from "axios";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { HolidayEvent, HolidayRaw } from "./event.dto";
export * from "./event.dto";
dayjs.extend(isoWeek);

const DataUrl =
  "https://data.ntpc.gov.tw/api/datasets/308DCD75-6434-45BC-A95F-584DA4FED251/json";

export class Holiday {
  /**
   * 是否開啟快取功能
   * 預設:關閉
   */
  public static enabledCache: boolean = false;

  /** 快取時間
   * 預設: 24 小時
   * 單位: 毫秒
   */
  public static cacheTime: number = 24 * 60 * 60 * 1000;

  private static cacheTimer: any;

  private static cache: Promise<HolidayEvent[]> = null;

  public static async fetchEvents(
    /** 強制重新載入 */
    forceReload: boolean = false
  ): Promise<HolidayEvent[]> {
    if (!Holiday.enabledCache) return this.loadAllEvents();
    if (Holiday.cache && !forceReload) return Holiday.cache;
    Holiday.cache = this.loadAllEvents();
    if (Holiday.cacheTimer) {
      clearTimeout(Holiday.cacheTimer);
    }
    Holiday.cacheTimer = setTimeout(() => {
      Holiday.cache = null;
      Holiday.cacheTimer = null;
    }, Holiday.cacheTime);
    return Holiday.cache;
  }

  private static async loadAllEvents(): Promise<HolidayEvent[]> {
    let events: HolidayEvent[] = [];
    for (let page = 0; page <= 10; page++) {
      let data = await Holiday.loadEventByPage(page);
      if (!data.length) break;
      events = events.concat(data);
    }
    return events;
  }

  private static loadEventByPage(
    page: number = 0,
    size: number = 1000
  ): Promise<HolidayEvent[]> {
    return axios
      .get(DataUrl, { params: { page, size } })
      .then((r) => r.data)
      .then((rows: HolidayRaw[]) => {
        return rows.map((r) => {
          let date = dayjs(r.date);
          r.date = date.format("YYYY-MM-DD");
          r.week = date.isoWeekday();
          r.isHoliday = r.isHoliday === "是";
          return r as HolidayEvent;
        });
      })
      .catch((error) => {
        console.error("Error Holiday.loadEventByPage:", {
          DataUrl,
          page,
          size,
          error,
        });
        throw error;
      });
  }

  public static async isHoliday(date: string): Promise<boolean> {
    let events = await Holiday.fetchEvents();
    return !!events.find((event) => event.date === date && event.isHoliday);
  }
}
