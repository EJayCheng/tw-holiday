"use strict";
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
const dayjs_1 = __importDefault(require("dayjs"));
const fs_1 = require("fs");
const _1 = require("./");
_1.TaiwanHoliday.enabledCache = true;
_1.TaiwanHoliday.fetchEvents().then((events) => {
    (0, fs_1.writeFileSync)('./events.json', JSON.stringify(events, null, 2));
});
let d = (0, dayjs_1.default)();
(() => __awaiter(void 0, void 0, void 0, function* () {
    for (let i = 0; i < 100; i++) {
        let date = d.format('YYYY-MM-DD');
        console.log(date, yield _1.TaiwanHoliday.isHoliday(date));
        d = d.add(1, 'day');
    }
    _1.TaiwanHoliday.clearCache();
}))();
//# sourceMappingURL=test.js.map