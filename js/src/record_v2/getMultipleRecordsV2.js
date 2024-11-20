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
exports.getMultipleRecordsV2 = void 0;
const sns_records_1 = require("@bonfida/sns-records");
const getRecordV2Key_1 = require("./getRecordV2Key");
const deserializeRecordV2Content_1 = require("./deserializeRecordV2Content");
/**
 * This function can be used to retrieve multiple records V2 for a given domain
 * @param connection The Solana RPC connection object
 * @param domain The .sol domain name
 * @param record The record to search for
 * @returns
 */
function getMultipleRecordsV2(connection_1, domain_1, records_1) {
    return __awaiter(this, arguments, void 0, function* (connection, domain, records, options = {}) {
        const pubkeys = records.map((record) => (0, getRecordV2Key_1.getRecordV2Key)(domain, record));
        const retrievedRecords = yield sns_records_1.Record.retrieveBatch(connection, pubkeys);
        if (options.deserialize) {
            return retrievedRecords.map((e, idx) => {
                if (!e)
                    return undefined;
                return {
                    retrievedRecord: e,
                    record: records[idx],
                    deserializedContent: (0, deserializeRecordV2Content_1.deserializeRecordV2Content)(e.getContent(), records[idx]),
                };
            });
        }
        return retrievedRecords.map((e, idx) => {
            if (!e)
                return undefined;
            return {
                retrievedRecord: e,
                record: records[idx],
            };
        });
    });
}
exports.getMultipleRecordsV2 = getMultipleRecordsV2;
