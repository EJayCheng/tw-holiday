import dayjs from "dayjs";
import {TaiwanHoliday} from "./";
TaiwanHoliday.enabledCache = true;
let d = dayjs();
(async () => {
  for (let i = 0; i < 100; i++) {
    let date = d.format("YYYY-MM-DD");
    console.log(date, await TaiwanHoliday.isHoliday(date));
    d = d.add(1, "day");
  }
})();
