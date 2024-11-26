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
exports.getRecord = void 0;
const record_1 = require("../types/record");
const state_1 = require("../state");
const error_1 = require("../error");
const getRecordKeySync_1 = require("./getRecordKeySync");
const deserializeRecord_1 = require("./deserializeRecord");
/**
 * This function can be used to retrieve a specified record for the given domain name
 * @param connection The Solana RPC connection object
 * @param domain The .sol domain name
 * @param record The record to search for
 * @returns
 */
function getRecord(connection, domain, record, deserialize) {
    return __awaiter(this, void 0, void 0, function* () {
        const pubkey = (0, getRecordKeySync_1.getRecordKeySync)(domain, record);
        let { registry } = yield state_1.NameRegistryState.retrieve(connection, pubkey);
        if (!registry.data) {
            throw new error_1.NoRecordDataError(`The record data is empty`);
        }
        if (deserialize) {
            return (0, deserializeRecord_1.deserializeRecord)(registry, record, pubkey);
        }
        const recordSize = record_1.RECORD_V1_SIZE.get(record);
        registry.data = registry.data.slice(0, recordSize);
        return registry;
    });
}
exports.getRecord = getRecord;
