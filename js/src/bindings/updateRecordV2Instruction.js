"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRecordV2Instruction = void 0;
const constants_1 = require("../constants");
const getDomainKeySync_1 = require("../utils/getDomainKeySync");
const record_1 = require("../types/record");
const serializeRecordV2Content_1 = require("../record_v2/serializeRecordV2Content");
const sns_records_1 = require("@bonfida/sns-records");
const error_1 = require("../error");
/**
 * This function updates the content of a record V2. The data serialization follows the SNS-IP 1 guidelines
 * @param connection The Solana RPC connection object
 * @param domain The .sol domain name
 * @param record The record enum object
 * @param recordV2 The `RecordV2` object to serialize into the record
 * @param owner The owner of the record/domain
 * @param payer The fee payer of the transaction
 * @returns The update record instructions
 */
const updateRecordV2Instruction = (domain, record, content, owner, payer) => {
    let { pubkey, parent, isSub } = (0, getDomainKeySync_1.getDomainKeySync)(`${record}.${domain}`, record_1.RecordVersion.V2);
    if (isSub) {
        parent = (0, getDomainKeySync_1.getDomainKeySync)(domain).pubkey;
    }
    if (!parent) {
        throw new error_1.InvalidParrentError("Parent could not be found");
    }
    const ix = (0, sns_records_1.editRecord)(payer, pubkey, parent, owner, constants_1.NAME_PROGRAM_ID, `\x02`.concat(record), (0, serializeRecordV2Content_1.serializeRecordV2Content)(content, record), sns_records_1.SNS_RECORDS_ID);
    return ix;
};
exports.updateRecordV2Instruction = updateRecordV2Instruction;
