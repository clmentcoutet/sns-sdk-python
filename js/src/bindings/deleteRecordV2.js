"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRecordV2 = void 0;
const constants_1 = require("../constants");
const getDomainKeySync_1 = require("../utils/getDomainKeySync");
const record_1 = require("../types/record");
const sns_records_1 = require("@bonfida/sns-records");
const error_1 = require("../error");
/**
 * This function deletes a record v2 and returns the rent to the fee payer
 * @param domain The .sol domain name
 * @param record  The record type enum
 * @param owner The owner of the record to delete
 * @param payer The fee payer of the transaction
 * @returns The delete transaction instruction
 */
const deleteRecordV2 = (domain, record, owner, payer) => {
    let { pubkey, parent, isSub } = (0, getDomainKeySync_1.getDomainKeySync)(`${record}.${domain}`, record_1.RecordVersion.V2);
    if (isSub) {
        parent = (0, getDomainKeySync_1.getDomainKeySync)(domain).pubkey;
    }
    if (!parent) {
        throw new error_1.InvalidParrentError("Parent could not be found");
    }
    const ix = (0, sns_records_1.deleteRecord)(payer, parent, owner, pubkey, constants_1.NAME_PROGRAM_ID, sns_records_1.SNS_RECORDS_ID);
    return ix;
};
exports.deleteRecordV2 = deleteRecordV2;
