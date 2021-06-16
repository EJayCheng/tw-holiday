# TW Holiday

將 政府行政機關辦公日曆表 提供出 javascript 串接介面

## Dataset

政府資料開放平臺 - 政府行政機關辦公日曆表: https://data.gov.tw/dataset/26557

新北市政府資料開放平臺 - 政府行政機關辦公日曆表: https://data.ntpc.gov.tw/datasets/308DCD75-6434-45BC-A95F-584DA4FED251

## Installation

[GitHub](https://github.com/EJayCheng/tw-holiday) / [npm](https://www.npmjs.com/package/tw-holiday)

```
npm install tw-holiday --save
```

## Example

```typescript
interface HolidayEvent {
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
```

```typescript
// javascript
const { Holiday } = require("tw-holiday");
// typescript
import { Holiday } from "tw-holiday";

// 啟用快取, 選用, 預設: false
Holiday.enabledCache = true;

// 設定快取時間, 選用, 預設: 24 * 60 * 60 * 1000, 單位: 毫秒
Holiday.cacheTime = 60 * 1000;

// Holiday.fetchEvents(): Promise<HolidayEvent[]>
Holiday.fetchEvents().then(console.log).catch(console.error);
```

```typescript
// Holiday.isHoliday(date: string): Promise<boolean>
Holiday.isHoliday("2021-12-31");
```
