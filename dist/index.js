"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
const DataUrl = 'https://data.ntpc.gov.tw/api/datasets/308DCD75-6434-45BC-A95F-584DA4FED251/json';
class TaiwanHoliday {
    static fetchEvents() {
        return __awaiter(this, arguments, void 0, function* (forceReload = false) {
            if (forceReload) {
                TaiwanHoliday.clearCache();
            }
            if (!TaiwanHoliday.enabledCache) {
                return TaiwanHoliday.loadAllEvents();
            }
            if (TaiwanHoliday.cache) {
                return TaiwanHoliday.cache;
            }
            TaiwanHoliday.cache = this.loadAllEvents().catch((error) => {
                TaiwanHoliday.clearCache();
                throw error;
            });
            TaiwanHoliday.cacheTimer = setTimeout(() => {
                TaiwanHoliday.clearCache();
            }, TaiwanHoliday.cacheTime);
            return TaiwanHoliday.cache;
        });
    }
    static loadAllEvents() {
        return __awaiter(this, void 0, void 0, function* () {
            let events = [];
            for (let page = 0; page <= Infinity; page++) {
                let data = yield TaiwanHoliday.loadEventByPage(page).catch(() => []);
                if (!data.length)
                    break;
                events = events.concat(data);
            }
            return events;
        });
    }
    static rawToHolidayEvent(raw) {
        let date = (0, dayjs_1.default)(raw.date);
        const event = {
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
    static loadEventByPage() {
        return __awaiter(this, arguments, void 0, function* (page = 0, size = 1000) {
            return axios_1.default
                .get(DataUrl, { params: { page, size } })
                .then((r) => r.data)
                .then((rows) => rows.map((r) => TaiwanHoliday.rawToHolidayEvent(r)))
                .catch((error) => {
                console.error('Error Holiday.loadEventByPage:', {
                    DataUrl,
                    page,
                    size,
                    error,
                });
                throw error;
            });
        });
    }
    static isHoliday() {
        return __awaiter(this, arguments, void 0, function* (date = (0, dayjs_1.default)().format('YYYY-MM-DD')) {
            let d = (0, dayjs_1.default)(date);
            if (!d.isValid()) {
                throw new Error('Error TaiwanHoliday.isHoliday: Invalid date input.');
            }
            let events = yield TaiwanHoliday.fetchEvents();
            date = d.format('YYYY-MM-DD');
            return !!events.find((e) => e.date === date && e.isHoliday);
        });
    }
    static clearCache() {
        TaiwanHoliday.cache = null;
        if (TaiwanHoliday.cacheTimer) {
            clearTimeout(TaiwanHoliday.cacheTimer);
            TaiwanHoliday.cacheTimer = null;
        }
    }
}
exports.TaiwanHoliday = TaiwanHoliday;
TaiwanHoliday.enabledCache = false;
TaiwanHoliday.cacheTime = 24 * 60 * 60 * 1000;
TaiwanHoliday.cache = null;
//# sourceMappingURL=index.js.map