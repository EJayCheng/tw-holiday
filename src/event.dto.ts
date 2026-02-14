/**
 * Raw holiday data structure from the API response
 * 從 API 回應取得的原始假日資料結構
 */
export interface HolidayRaw {
  /** Date string | 日期字串 */
  date: string;
  /** Holiday or memorial day name | 節日或紀念日名稱 */
  name: string;
  /** Year | 年份 */
  year: string;
  /** Is it a holiday (是: Yes, 否: No) | 是否為假日 */
  isholiday: '是' | '否';
  /** Holiday category | 假日類別 */
  holidaycategory: string;
  /** Description | 說明 */
  description: string;
}

/**
 * Processed holiday event data structure
 * 處理後的假日事件資料結構
 */
export interface HolidayEvent {
  /** Date in YYYY-MM-DD format | 日期 YYYY-MM-DD 格式 */
  date: string;
  /** Holiday or memorial day name | 節日或紀念日名稱 */
  name: string;
  /** Whether it is a holiday | 是否為休假日 */
  isHoliday: boolean;
  /** Holiday category | 放假類別 */
  holidayCategory: string;
  /** Description | 說明 */
  description: string;
  /**
   * ISO day of the week
   * ISO 星期幾
   * - 1: Monday | 星期一
   * - 2: Tuesday | 星期二
   * - 3: Wednesday | 星期三
   * - 4: Thursday | 星期四
   * - 5: Friday | 星期五
   * - 6: Saturday | 星期六
   * - 7: Sunday | 星期日
   */
  week: number;
  /** Year | 年份 */
  year: string;
}
