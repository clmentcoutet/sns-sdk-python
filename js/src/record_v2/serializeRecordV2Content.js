"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeRecordV2Content = void 0;
const web3_js_1 = require("@solana/web3.js");
const punycode_1 = require("punycode");
const base_1 = require("@scure/base");
const ipaddr_js_1 = require("ipaddr.js");
const check_1 = require("../utils/check");
const record_1 = require("../types/record");
const error_1 = require("../error");
const buffer_1 = require("buffer");
const const_1 = require("./const");
/**
 * This function serializes a string based on the type of record it corresponds to
 * The serialization follows the SNS-IP 1 guideline
 * @param content The content to serialize
 * @param record The type of record
 * @returns The serialized content as a buffer
 */
const serializeRecordV2Content = (content, record) => {
    const utf8Encoded = const_1.UTF8_ENCODED.has(record);
    if (utf8Encoded) {
        if (record === record_1.Record.CNAME || record === record_1.Record.TXT) {
            content = (0, punycode_1.encode)(content);
        }
        return buffer_1.Buffer.from(content, "utf-8");
    }
    else if (record === record_1.Record.SOL) {
        return new web3_js_1.PublicKey(content).toBuffer();
    }
    else if (const_1.EVM_RECORDS.has(record)) {
        (0, check_1.check)(content.slice(0, 2) === "0x", new error_1.InvalidEvmAddressError("The record content must start with `0x`"));
        return buffer_1.Buffer.from(content.slice(2), "hex");
    }
    else if (record === record_1.Record.Injective) {
        const decoded = base_1.bech32.decodeToBytes(content);
        (0, check_1.check)(decoded.prefix === "inj", new error_1.InvalidInjectiveAddressError("The record content must start with `inj"));
        (0, check_1.check)(decoded.bytes.length === 20, new error_1.InvalidInjectiveAddressError(`The record data must be 20 bytes long`));
        return buffer_1.Buffer.from(decoded.bytes);
    }
    else if (record === record_1.Record.A) {
        const array = (0, ipaddr_js_1.parse)(content).toByteArray();
        (0, check_1.check)(array.length === 4, new error_1.InvalidARecordError("The record content must be 4 bytes long"));
        return buffer_1.Buffer.from(array);
    }
    else if (record === record_1.Record.AAAA) {
        const array = (0, ipaddr_js_1.parse)(content).toByteArray();
        (0, check_1.check)(array.length === 16, new error_1.InvalidAAAARecordError("The record content must be 16 bytes long"));
        return buffer_1.Buffer.from(array);
    }
    else {
        throw new error_1.InvalidRecordInputError("The record content is malformed");
    }
};
exports.serializeRecordV2Content = serializeRecordV2Content;
