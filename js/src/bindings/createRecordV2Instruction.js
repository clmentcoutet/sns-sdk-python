"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRecordV2Instruction = void 0;
const sns_records_1 = require("@bonfida/sns-records");
const constants_1 = require("../constants");
const getDomainKeySync_1 = require("../utils/getDomainKeySync");
const record_1 = require("../types/record");
const serializeRecordV2Content_1 = require("../record_v2/serializeRecordV2Content");
const error_1 = require("../error");
/**
 * This function can be used be create a record V2, it handles the serialization of the record data following SNS-IP 1 guidelines
 * @param domain The .sol domain name
 * @param record The record enum object
 * @param recordV2 The `RecordV2` object that will be serialized into the record via the update instruction
 * @param owner The owner of the domain
 * @param payer The fee payer of the transaction
 * @returns
 */
const createRecordV2Instruction = (domain, record, content, owner, payer) => {
    let { pubkey, parent, isSub } = (0, getDomainKeySync_1.getDomainKeySync)(`${record}.${domain}`, record_1.RecordVersion.V2);
    if (isSub) {
        parent = (0, getDomainKeySync_1.getDomainKeySync)(domain).pubkey;
    }
    if (!parent) {
        throw new error_1.InvalidParrentError("Parent could not be found");
    }
    const ix = (0, sns_records_1.allocateAndPostRecord)(payer, pubkey, parent, owner, constants_1.NAME_PROGRAM_ID, `\x02`.concat(record), (0, serializeRecordV2Content_1.serializeRecordV2Content)(content, record), sns_records_1.SNS_RECORDS_ID);
    return ix;
};
exports.createRecordV2Instruction = createRecordV2Instruction;
