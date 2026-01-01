import axios from 'axios';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { HolidayEvent, HolidayRaw } from './event.dto';
export * from './event.dto';
dayjs.extend(isoWeek);

const DataUrl =
  'https://data.ntpc.gov.tw/api/datasets/308DCD75-6434-45BC-A95F-584DA4FED251/json';

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
    forceReload: boolean = false,
  ): Promise<HolidayEvent[]> {
    // 如果強制重新載入，清除快取和計時器
    if (forceReload) {
      TaiwanHoliday.clearCache();
    }

    // 如果未啟用快取，直接載入（不使用也不設定快取）
    if (!TaiwanHoliday.enabledCache) {
      return TaiwanHoliday.loadAllEvents();
    }

    // 如果有快取，直接返回
    if (TaiwanHoliday.cache) {
      return TaiwanHoliday.cache;
    }

    // 建立新的快取
    TaiwanHoliday.cache = this.loadAllEvents().catch((error) => {
      TaiwanHoliday.clearCache();
      throw error;
    });

    // 設定快取過期計時器
    TaiwanHoliday.cacheTimer = setTimeout(() => {
      TaiwanHoliday.clearCache();
    }, TaiwanHoliday.cacheTime);

    return TaiwanHoliday.cache;
  }

  private static async loadAllEvents(): Promise<HolidayEvent[]> {
    // console.log('Loading all holiday events from data source...');
    let events: HolidayEvent[] = [];
    for (let page = 0; page <= Infinity; page++) {
      let data = await TaiwanHoliday.loadEventByPage(page).catch(() => []);
      if (!data.length) break;
      events = events.concat(data);
    }
    return events;
  }

  private static rawToHolidayEvent(raw: HolidayRaw): HolidayEvent {
    let date = dayjs(raw.date);
    const event: HolidayEvent = {
      date: date.format('YYYY-MM-DD'),
      week: date.isoWeekday(),
      year: raw.year || date.format('YYYY'),
      name: (raw.name || raw.holidaycategory || '').trim(),
      description: (raw.description || '').trim(),
      isHoliday: raw.isholiday === '是',
      holidayCategory: (raw.holidaycategory || '').trim(),
    };
    if (event.name === '星期六、星期日' && event.isHoliday) {
      event.name = event.week == 6 ? '星期六' : '星期日';
    }
    return event;
  }

  private static async loadEventByPage(
    page: number = 0,
    size: number = 1000,
  ): Promise<HolidayEvent[]> {
    return axios
      .get(DataUrl, { params: { page, size } })
      .then((r) => r.data)
      .then((rows: HolidayRaw[]) =>
        rows.map((r: HolidayRaw) => TaiwanHoliday.rawToHolidayEvent(r)),
      )
      .catch((error) => {
        console.error('Error Holiday.loadEventByPage:', {
          DataUrl,
          page,
          size,
          error,
        });
        throw error;
      });
  }

  public static async isHoliday(
    date: string = dayjs().format('YYYY-MM-DD'),
  ): Promise<boolean> {
    let d = dayjs(date);
    if (!d.isValid()) {
      throw new Error('Error TaiwanHoliday.isHoliday: Invalid date input.');
    }
    let events = await TaiwanHoliday.fetchEvents();
    date = d.format('YYYY-MM-DD');
    return !!events.find((e) => e.date === date && e.isHoliday);
  }

  public static clearCache() {
    TaiwanHoliday.cache = null;
    if (TaiwanHoliday.cacheTimer) {
      clearTimeout(TaiwanHoliday.cacheTimer);
      TaiwanHoliday.cacheTimer = null;
    }
  }
}
