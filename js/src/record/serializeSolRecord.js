"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeSolRecord = void 0;
const buffer_1 = require("buffer");
const check_1 = require("../utils/check");
const error_1 = require("../error");
const checkSolRecord_1 = require("./checkSolRecord");
/**
 * This function can be used to build the content of a SOL record
 * @param content The public key being stored in the SOL record
 * @param recordKey The record public key
 * @param signer The signer of the record i.e the domain owner
 * @param signature The signature of the record's content
 * @returns
 */
const serializeSolRecord = (content, recordKey, signer, signature) => {
    const expected = buffer_1.Buffer.concat([content.toBuffer(), recordKey.toBuffer()]);
    const encodedMessage = new TextEncoder().encode(expected.toString("hex"));
    const valid = (0, checkSolRecord_1.checkSolRecord)(encodedMessage, signature, signer);
    (0, check_1.check)(valid, new error_1.InvalidSignatureError("The SOL signature is invalid"));
    return buffer_1.Buffer.concat([content.toBuffer(), signature]);
};
exports.serializeSolRecord = serializeSolRecord;
