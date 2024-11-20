"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecordV2Key = void 0;
const sns_records_1 = require("@bonfida/sns-records");
const getDomainKeySync_1 = require("../utils/getDomainKeySync");
const getHashedNameSync_1 = require("../utils/getHashedNameSync");
const getNameAccountKeySync_1 = require("../utils/getNameAccountKeySync");
/**
 * This function derives a record v2 key
 * @param domain The .sol domain name
 * @param record The record to derive the key for
 * @returns Public key of the record
 */
const getRecordV2Key = (domain, record) => {
    const { pubkey } = (0, getDomainKeySync_1.getDomainKeySync)(domain);
    const hashed = (0, getHashedNameSync_1.getHashedNameSync)(`\x02`.concat(record));
    return (0, getNameAccountKeySync_1.getNameAccountKeySync)(hashed, sns_records_1.CENTRAL_STATE_SNS_RECORDS, pubkey);
};
exports.getRecordV2Key = getRecordV2Key;
