import axios from "axios";
import * as dayjs from "dayjs";
import * as isoWeek from "dayjs/plugin/isoWeek";
import { HolidayEvent, HolidayRaw } from "event.dto";
dayjs.extend(isoWeek);

const DataUrl =
  "https://data.ntpc.gov.tw/api/datasets/308DCD75-6434-45BC-A95F-584DA4FED251/json";

export class Holiday {
  public static enabledCache: boolean = false;
  private static cacheTimer: any;
  /** 快取時間 */
  public static cacheTime: number = 24 * 60 * 60 * 1000;
  private static cache: Promise<HolidayEvent[]>;

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
        console.error("Error Holiday.loadEvent:", {
          DataUrl,
          page,
          size,
          error,
        });
        throw error;
      });
  }
}

async function main() {
  console.time("fetchEvents 1");
  await Holiday.fetchEvents();
  console.timeEnd("fetchEvents 1");
  console.time("fetchEvents 2");
  await Holiday.fetchEvents();
  console.timeEnd("fetchEvents 2");
  return;
}

main();
