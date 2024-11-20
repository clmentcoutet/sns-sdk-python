"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserializeRecord = void 0;
const buffer_1 = require("buffer");
const bs58_1 = require("bs58");
const web3_js_1 = require("@solana/web3.js");
const base_1 = require("@scure/base");
const punycode_1 = require("punycode");
const ipaddr_js_1 = require("ipaddr.js");
const record_1 = require("../types/record");
const error_1 = require("../error");
const checkSolRecord_1 = require("./checkSolRecord");
const trimNullPaddingIdx = (buffer) => {
    const arr = Array.from(buffer);
    const lastNonNull = arr.length - 1 - arr.reverse().findIndex((byte) => byte !== 0);
    return lastNonNull + 1;
};
/**
 * This function can be used to deserialize the content of a record (V1). If the content is invalid it will throw an error
 * @param registry The name registry state object of the record being deserialized
 * @param record The record enum being deserialized
 * @param recordKey The public key of the record being deserialized
 * @returns
 */
const deserializeRecord = (registry, record, recordKey) => {
    const buffer = registry === null || registry === void 0 ? void 0 : registry.data;
    if (!buffer)
        return undefined;
    if (buffer.compare(buffer_1.Buffer.alloc(buffer.length)) === 0)
        return undefined;
    const size = record_1.RECORD_V1_SIZE.get(record);
    const idx = trimNullPaddingIdx(buffer);
    if (!size) {
        const str = buffer.slice(0, idx).toString("utf-8");
        if (record === record_1.Record.CNAME || record === record_1.Record.TXT) {
            return (0, punycode_1.decode)(str);
        }
        return str;
    }
    // Handle SOL record first whether it's over allocated or not
    if (record === record_1.Record.SOL) {
        const encoder = new TextEncoder();
        const expectedBuffer = buffer_1.Buffer.concat([
            buffer.slice(0, 32),
            recordKey.toBuffer(),
        ]);
        const expected = encoder.encode(expectedBuffer.toString("hex"));
        const valid = (0, checkSolRecord_1.checkSolRecord)(expected, buffer.slice(32, 96), registry.owner);
        if (valid) {
            return (0, bs58_1.encode)(buffer.slice(0, 32));
        }
    }
    // Old record UTF-8 encoded
    if (size && idx !== size) {
        const address = buffer.slice(0, idx).toString("utf-8");
        if (record === record_1.Record.Injective) {
            const decoded = base_1.bech32.decodeToBytes(address);
            if (decoded.prefix === "inj" && decoded.bytes.length === 20) {
                return address;
            }
        }
        else if (record === record_1.Record.BSC || record === record_1.Record.ETH) {
            const prefix = address.slice(0, 2);
            const hex = address.slice(2);
            if (prefix === "0x" && buffer_1.Buffer.from(hex, "hex").length === 20) {
                return address;
            }
        }
        else if (record === record_1.Record.A || record === record_1.Record.AAAA) {
            if ((0, ipaddr_js_1.isValid)(address)) {
                return address;
            }
        }
        throw new error_1.InvalidRecordDataError("The record data is malformed");
    }
    if (record === record_1.Record.ETH || record === record_1.Record.BSC) {
        return "0x" + buffer.slice(0, size).toString("hex");
    }
    else if (record === record_1.Record.Injective) {
        return base_1.bech32.encode("inj", base_1.bech32.toWords(buffer.slice(0, size)));
    }
    else if (record === record_1.Record.A || record === record_1.Record.AAAA) {
        return (0, ipaddr_js_1.fromByteArray)([...buffer.slice(0, size)]).toString();
    }
    else if (record === record_1.Record.Background) {
        return new web3_js_1.PublicKey(buffer.slice(0, size)).toString();
    }
    throw new error_1.InvalidRecordDataError("The record data is malformed");
};
exports.deserializeRecord = deserializeRecord;
