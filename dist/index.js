"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaiwanHoliday = void 0;
const axios_1 = __importDefault(require("axios"));
const dayjs_1 = __importDefault(require("dayjs"));
const isoWeek_1 = __importDefault(require("dayjs/plugin/isoWeek"));
__exportStar(require("./event.dto"), exports);
dayjs_1.default.extend(isoWeek_1.default);
const DataUrl = "https://data.ntpc.gov.tw/api/datasets/308DCD75-6434-45BC-A95F-584DA4FED251/json";
class TaiwanHoliday {
    static fetchEvents(forceReload = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!TaiwanHoliday.enabledCache)
                return this.loadAllEvents();
            if (TaiwanHoliday.cache && !forceReload)
                return TaiwanHoliday.cache;
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
        });
    }
    static loadAllEvents() {
        return __awaiter(this, void 0, void 0, function* () {
            let events = [];
            for (let page = 0; page <= 10; page++) {
                let data = yield TaiwanHoliday.loadEventByPage(page);
                if (!data.length)
                    break;
                events = events.concat(data);
            }
            return events;
        });
    }
    static loadEventByPage(page = 0, size = 1000) {
        return axios_1.default
            .get(DataUrl, { params: { page, size } })
            .then((r) => r.data)
            .then((rows) => {
            return rows.map((r) => {
                let date = dayjs_1.default(r.date);
                r.date = date.format("YYYY-MM-DD");
                r.week = date.isoWeekday();
                r.name = r.chinese || "";
                r.isHoliday = r.isHoliday === "是";
                delete r.chinese;
                return r;
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
    static isHoliday(date) {
        return __awaiter(this, void 0, void 0, function* () {
            let d = dayjs_1.default(date);
            if (!d.isValid()) {
                throw new Error("Error TaiwanHoliday.isHoliday: Invalid date input.");
            }
            let events = yield TaiwanHoliday.fetchEvents();
            date = d.format("YYYY-MM-DD");
            return !!events.find((e) => e.date === date && e.isHoliday);
        });
    }
}
exports.TaiwanHoliday = TaiwanHoliday;
TaiwanHoliday.enabledCache = false;
TaiwanHoliday.cacheTime = 24 * 60 * 60 * 1000;
TaiwanHoliday.cache = null;
//# sourceMappingURL=index.js.map