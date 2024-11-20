"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecordKeySync = void 0;
const record_1 = require("../types/record");
const getDomainKeySync_1 = require("../utils/getDomainKeySync");
/**
 * This function can be used to derive a record key
 * @param domain The .sol domain name
 * @param record The record to derive the key for
 * @returns
 */
const getRecordKeySync = (domain, record) => {
    const { pubkey } = (0, getDomainKeySync_1.getDomainKeySync)(record + "." + domain, record_1.RecordVersion.V1);
    return pubkey;
};
exports.getRecordKeySync = getRecordKeySync;
