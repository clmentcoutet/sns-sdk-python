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
exports.getRecords = void 0;
const state_1 = require("../state");
const getRecordKeySync_1 = require("./getRecordKeySync");
const deserializeRecord_1 = require("./deserializeRecord");
function getRecords(connection, domain, records, deserialize) {
    return __awaiter(this, void 0, void 0, function* () {
        const pubkeys = records.map((record) => (0, getRecordKeySync_1.getRecordKeySync)(domain, record));
        const registries = yield state_1.NameRegistryState.retrieveBatch(connection, pubkeys);
        if (deserialize) {
            return registries.map((e, idx) => {
                if (!e)
                    return undefined;
                return (0, deserializeRecord_1.deserializeRecord)(e, records[idx], (0, getRecordKeySync_1.getRecordKeySync)(domain, records[idx]));
            });
        }
        return registries;
    });
}
exports.getRecords = getRecords;
