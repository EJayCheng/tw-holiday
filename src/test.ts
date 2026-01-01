import dayjs from 'dayjs';
import { writeFileSync } from 'fs';
import { TaiwanHoliday } from './';
TaiwanHoliday.enabledCache = true;

TaiwanHoliday.fetchEvents().then((events) => {
  writeFileSync('./events.json', JSON.stringify(events, null, 2));
});

let d = dayjs();
(async () => {
  for (let i = 0; i < 100; i++) {
    let date = d.format('YYYY-MM-DD');
    console.log(date, await TaiwanHoliday.isHoliday(date));
    d = d.add(1, 'day');
  }
  TaiwanHoliday.clearCache();
})();
