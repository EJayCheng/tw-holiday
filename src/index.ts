import axios from "axios";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import {HolidayEvent, HolidayRaw} from "./event.dto";
export * from "./event.dto";
dayjs.extend(isoWeek);

const DataUrl =
  "https://data.ntpc.gov.tw/api/datasets/308DCD75-6434-45BC-A95F-584DA4FED251/json";

export class TaiwanHoliday {
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
    if (!TaiwanHoliday.enabledCache) {
      return this.loadAllEvents();
    }
    if (TaiwanHoliday.cache && !forceReload) {
      return TaiwanHoliday.cache;
    }
    TaiwanHoliday.cache = this.loadAllEvents().catch((error) => {
      TaiwanHoliday.cache = null;
      return null;
    });
    if (TaiwanHoliday.cacheTimer) {
      clearTimeout(TaiwanHoliday.cacheTimer);
    }
    TaiwanHoliday.cacheTimer = setTimeout(() => {
      TaiwanHoliday.cache = null;
      TaiwanHoliday.cacheTimer = null;
    }, TaiwanHoliday.cacheTime);
    return TaiwanHoliday.cache;
  }

  private static async loadAllEvents(): Promise<HolidayEvent[]> {
    let events: HolidayEvent[] = [];
    for (let page = 0; page <= 10; page++) {
      let data = await TaiwanHoliday.loadEventByPage(page);
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
      .get(DataUrl, {params: {page, size}})
      .then((r) => r.data)
      .then((rows: HolidayRaw[]) => {
        return rows.map((r: any) => {
          let date = dayjs(r.date);
          r.date = date.format("YYYY-MM-DD");
          r.week = date.isoWeekday();
          r.name = (r.chinese || "").trim();
          r.isHoliday = r.isholiday === "是";
          delete r.chinese;
          delete r.isholiday;
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

  public static async isHoliday(
    date: string = dayjs().format("YYYY-MM-DD")
  ): Promise<boolean> {
    let d = dayjs(date);
    if (!d.isValid()) {
      throw new Error("Error TaiwanHoliday.isHoliday: Invalid date input.");
    }
    let events = await TaiwanHoliday.fetchEvents();
    date = d.format("YYYY-MM-DD");
    return !!events.find((e) => e.date === date && e.isHoliday);
  }
}
