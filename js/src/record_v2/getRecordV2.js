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
exports.getRecordV2 = void 0;
const sns_records_1 = require("@bonfida/sns-records");
const getRecordV2Key_1 = require("./getRecordV2Key");
const deserializeRecordV2Content_1 = require("./deserializeRecordV2Content");
/**
 * This function can be used to retrieve a specified record V2 for the given domain name
 * @param connection The Solana RPC connection object
 * @param domain The .sol domain name
 * @param record The record to search for
 * @returns
 */
function getRecordV2(connection_1, domain_1, record_1) {
    return __awaiter(this, arguments, void 0, function* (connection, domain, record, options = {}) {
        const pubkey = (0, getRecordV2Key_1.getRecordV2Key)(domain, record);
        const retrievedRecord = yield sns_records_1.Record.retrieve(connection, pubkey);
        if (options.deserialize) {
            return {
                retrievedRecord,
                deserializedContent: (0, deserializeRecordV2Content_1.deserializeRecordV2Content)(retrievedRecord.getContent(), record),
            };
        }
        return { retrievedRecord };
    });
}
exports.getRecordV2 = getRecordV2;
