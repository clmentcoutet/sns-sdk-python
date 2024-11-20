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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecordKey = void 0;
const utils_1 = require("./utils");
/**
 * @deprecated Use {@link getRecordKeySync} instead
 * This function can be used to derive a record key
 * @param domain The .sol domain name
 * @param record The record to derive the key for
 * @returns
 */
const getRecordKey = (domain, record) => __awaiter(void 0, void 0, void 0, function* () {
    const { pubkey } = yield (0, utils_1.getDomainKey)(record + "." + domain, true);
    return pubkey;
});
exports.getRecordKey = getRecordKey;
