"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkSolRecord = void 0;
const ed25519_1 = require("@noble/curves/ed25519");
/**
 * This function can be used to verify the validity of a SOL record
 * @param record The record data to verify
 * @param signedRecord The signed data
 * @param pubkey The public key of the signer
 * @returns
 */
const checkSolRecord = (record, signedRecord, pubkey) => {
    return ed25519_1.ed25519.verify(signedRecord, record, pubkey.toBytes());
};
exports.checkSolRecord = checkSolRecord;
