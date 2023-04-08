export interface HolidayRaw {
  date: string;
  name: string;
  chinese: string;
  isHoliday: "是" | "否" | boolean;
  holidayCategory: string;
  description: string;
  week?: number;
}

export interface HolidayEvent {
  /** 日期 YYYY-MM-DD */
  date: string;
  /** 節日或紀念日名稱 */
  name: string;
  /** 是否為休假日 */
  isHoliday: boolean;
  /** 放假類別 */
  holidayCategory: string;
  /** 說明 */
  description: string;
  /**
   * gets the current ISO day of the week
   * - 1: 星期一
   * - 2: 星期二
   * - 3: 星期三
   * - 4: 星期四
   * - 5: 星期五
   * - 6: 星期六
   * - 7: 星期日
   */
  week: number;
}
