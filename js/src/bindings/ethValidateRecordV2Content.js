"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ethValidateRecordV2Content = void 0;
const constants_1 = require("../constants");
const getDomainKeySync_1 = require("../utils/getDomainKeySync");
const record_1 = require("../types/record");
const sns_records_1 = require("@bonfida/sns-records");
const error_1 = require("../error");
const ethValidateRecordV2Content = (domain, record, owner, payer, signature, expectedPubkey) => {
    let { pubkey, parent, isSub } = (0, getDomainKeySync_1.getDomainKeySync)(`${record}.${domain}`, record_1.RecordVersion.V2);
    if (isSub) {
        parent = (0, getDomainKeySync_1.getDomainKeySync)(domain).pubkey;
    }
    if (!parent) {
        throw new error_1.InvalidParrentError("Parent could not be found");
    }
    const ix = (0, sns_records_1.validateEthSignature)(payer, pubkey, parent, owner, constants_1.NAME_PROGRAM_ID, sns_records_1.Validation.Ethereum, signature, expectedPubkey, sns_records_1.SNS_RECORDS_ID);
    return ix;
};
exports.ethValidateRecordV2Content = ethValidateRecordV2Content;
