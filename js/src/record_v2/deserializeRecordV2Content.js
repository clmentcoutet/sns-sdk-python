"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserializeRecordV2Content = void 0;
const record_1 = require("../types/record");
const error_1 = require("../error");
const web3_js_1 = require("@solana/web3.js");
const punycode_1 = require("punycode");
const base_1 = require("@scure/base");
const ipaddr_js_1 = require("ipaddr.js");
const const_1 = require("./const");
/**
 * This function deserializes a buffer based on the type of record it corresponds to
 * If the record is not properly serialized according to SNS-IP 1 this function will throw an error
 * @param content The content to deserialize
 * @param record The type of record
 * @returns The deserialized content as a string
 */
const deserializeRecordV2Content = (content, record) => {
    const utf8Encoded = const_1.UTF8_ENCODED.has(record);
    if (utf8Encoded) {
        const decoded = content.toString("utf-8");
        if (record === record_1.Record.CNAME || record === record_1.Record.TXT) {
            return (0, punycode_1.decode)(decoded);
        }
        return decoded;
    }
    else if (record === record_1.Record.SOL) {
        return new web3_js_1.PublicKey(content).toBase58();
    }
    else if (const_1.EVM_RECORDS.has(record)) {
        return "0x" + content.toString("hex");
    }
    else if (record === record_1.Record.Injective) {
        return base_1.bech32.encode("inj", base_1.bech32.toWords(content));
    }
    else if (record === record_1.Record.A || record === record_1.Record.AAAA) {
        return (0, ipaddr_js_1.fromByteArray)([...content]).toString();
    }
    else {
        throw new error_1.InvalidRecordDataError("The record content is malformed");
    }
};
exports.deserializeRecordV2Content = deserializeRecordV2Content;
