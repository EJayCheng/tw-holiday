# TW Holiday

[![npm version](https://img.shields.io/npm/v/tw-holiday.svg)](https://www.npmjs.com/package/tw-holiday)
[![license](https://img.shields.io/npm/l/tw-holiday.svg)](https://github.com/EJayCheng/tw-holiday/blob/main/LICENSE)

提供台灣政府行政機關辦公日曆表的 JavaScript/TypeScript 串接介面，輕鬆查詢國定假日與休假日資訊。

## 📦 安裝

```bash
npm install tw-holiday --save
```

或使用 yarn:

```bash
yarn add tw-holiday
```

## 📊 資料來源

[新北市政府資料開放平臺 - 政府行政機關辦公日曆表](https://data.ntpc.gov.tw/datasets/308DCD75-6434-45BC-A95F-584DA4FED251)

## 🚀 快速開始

### JavaScript (CommonJS)

```javascript
const { TaiwanHoliday } = require('tw-holiday');

// 查詢特定日期是否為假日
TaiwanHoliday.isHoliday('2024-01-01').then(isHoliday => {
  console.log(isHoliday); // true (元旦)
});

// 取得所有假日事件
TaiwanHoliday.fetchEvents().then(events => {
  console.log(events);
});
```

### TypeScript (ESM)

```typescript
import { TaiwanHoliday, HolidayEvent } from 'tw-holiday';

// 查詢今天是否為假日
const isToday = await TaiwanHoliday.isHoliday();
console.log('今天是假日嗎？', isToday);

// 取得所有假日資料
const events: HolidayEvent[] = await TaiwanHoliday.fetchEvents();
```

## 📘 API 文件

### `TaiwanHoliday.fetchEvents(forceReload?: boolean): Promise<HolidayEvent[]>`

取得所有假日事件資料。

**參數：**
- `forceReload` (可選): 是否強制重新載入資料，預設為 `false`

**回傳值：** `Promise<HolidayEvent[]>` - 假日事件陣列

**範例：**

```typescript
// 取得所有假日（使用快取）
const events = await TaiwanHoliday.fetchEvents();

// 強制重新載入最新資料
const latestEvents = await TaiwanHoliday.fetchEvents(true);
```

### `TaiwanHoliday.isHoliday(date?: string): Promise<boolean>`

判斷指定日期是否為休假日。

**參數：**
- `date` (可選): 日期字串，格式為 `YYYY-MM-DD`，預設為今天

**回傳值：** `Promise<boolean>` - 是否為休假日

**範例：**

```typescript
// 查詢今天是否為假日
const isTodayHoliday = await TaiwanHoliday.isHoliday();

// 查詢特定日期
const is2024NewYear = await TaiwanHoliday.isHoliday('2024-01-01'); // true
const isWorkday = await TaiwanHoliday.isHoliday('2024-01-02'); // false
```

### `TaiwanHoliday.clearCache(): void`

手動清除快取資料與計時器。

**範例：**

```typescript
TaiwanHoliday.clearCache();
```

## ⚙️ 設定選項

### 啟用快取功能

啟用快取可以減少 API 請求次數，提升效能。

```typescript
// 啟用快取（預設：false）
TaiwanHoliday.enabledCache = true;
```

### 設定快取時間

```typescript
// 設定快取時間為 1 小時（預設：24 小時）
// 單位：毫秒
TaiwanHoliday.cacheTime = 60 * 60 * 1000;
```

## 📝 資料型別

### HolidayEvent

```typescript
interface HolidayEvent {
  /** 日期 (格式: YYYY-MM-DD) */
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
   * ISO 星期編號
   * - 1: 星期一
   * - 2: 星期二
   * - 3: 星期三
   * - 4: 星期四
   * - 5: 星期五
   * - 6: 星期六
   * - 7: 星期日
   */
  week: number;
  
  /** 年份 */
  year: string;
}
```

## 💡 使用範例

### 範例 1：查詢連續日期的假日狀態

```typescript
import { TaiwanHoliday } from 'tw-holiday';
import dayjs from 'dayjs';

let date = dayjs();

for (let i = 0; i < 30; i++) {
  const dateStr = date.format('YYYY-MM-DD');
  const isHoliday = await TaiwanHoliday.isHoliday(dateStr);
  console.log(`${dateStr}: ${isHoliday ? '假日 🎉' : '工作日 💼'}`);
  date = date.add(1, 'day');
}
```

### 範例 2：篩選特定年份的假日

```typescript
import { TaiwanHoliday } from 'tw-holiday';

TaiwanHoliday.enabledCache = true;

const events = await TaiwanHoliday.fetchEvents();

// 篩選 2024 年的假日
const holidays2024 = events.filter(event => 
  event.year === '2024' && event.isHoliday
);

console.log(`2024 年共有 ${holidays2024.length} 天假日`);
holidays2024.forEach(holiday => {
  console.log(`${holiday.date} - ${holiday.name}`);
});
```

### 範例 3：匯出假日資料

```typescript
import { TaiwanHoliday } from 'tw-holiday';
import { writeFileSync } from 'fs';

TaiwanHoliday.enabledCache = true;

const events = await TaiwanHoliday.fetchEvents();
writeFileSync('./events.json', JSON.stringify(events, null, 2));
console.log('假日資料已匯出到 events.json');
```

## 🔧 進階用法

### 快取策略建議

```typescript
import { TaiwanHoliday } from 'tw-holiday';

// 長時間運行的應用（如後端服務）
TaiwanHoliday.enabledCache = true;
TaiwanHoliday.cacheTime = 24 * 60 * 60 * 1000; // 24 小時

// 短期查詢（如 CLI 工具）
TaiwanHoliday.enabledCache = false; // 每次都取得最新資料

// 定期更新快取
setInterval(() => {
  TaiwanHoliday.fetchEvents(true); // 強制重新載入
}, 24 * 60 * 60 * 1000); // 每 24 小時更新
```

## 📄 授權

MIT License - 詳見 [LICENSE](LICENSE) 檔案

## 🔗 連結

- [GitHub Repository](https://github.com/EJayCheng/tw-holiday)
- [npm Package](https://www.npmjs.com/package/tw-holiday)
- [資料來源](https://data.ntpc.gov.tw/datasets/308DCD75-6434-45BC-A95F-584DA4FED251)

## 👤 作者

**EJay Cheng**

## 🤝 貢獻

歡迎提交 Issues 和 Pull Requests！
