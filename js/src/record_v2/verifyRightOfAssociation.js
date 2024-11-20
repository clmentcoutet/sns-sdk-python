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
exports.verifyRightOfAssociation = void 0;
const error_1 = require("../error");
const sns_records_1 = require("@bonfida/sns-records");
const getRecordV2Key_1 = require("./getRecordV2Key");
const const_1 = require("./const");
/**
 *
 * This function verifies the right of association of a record.
 * Note: This function does not verify if the record is stale.
 * Users must verify staleness in addition to the right of association.
 * @param {Connection} connection - The Solana RPC connection object
 * @param {Record} record - The record to be verified.
 * @param {string} domain - The domain associated with the record.
 * @param {Buffer} verifier - The optional verifier to be used in the verification process.
 * @returns {Promise<boolean>} - Returns a promise that resolves to a boolean indicating whether the record has the right of association.
 */
const verifyRightOfAssociation = (connection, record, domain, verifier) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const recordKey = (0, getRecordV2Key_1.getRecordV2Key)(domain, record);
    const recordObj = yield sns_records_1.Record.retrieve(connection, recordKey);
    const roaId = recordObj.getRoAId();
    const validation = const_1.ETH_ROA_RECORDS.has(record)
        ? sns_records_1.Validation.Ethereum
        : sns_records_1.Validation.Solana;
    verifier = verifier !== null && verifier !== void 0 ? verifier : (_a = const_1.GUARDIANS.get(record)) === null || _a === void 0 ? void 0 : _a.toBuffer();
    if (!verifier) {
        throw new error_1.MissingVerifierError("You must specify the verifier");
    }
    return (verifier.compare(roaId) === 0 &&
        recordObj.header.rightOfAssociationValidation === validation);
});
exports.verifyRightOfAssociation = verifyRightOfAssociation;
