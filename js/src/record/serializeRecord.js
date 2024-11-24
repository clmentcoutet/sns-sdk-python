"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeRecord = void 0;
const buffer_1 = require("buffer");
const web3_js_1 = require("@solana/web3.js");
const base_1 = require("@scure/base");
const punycode_1 = require("punycode");
const ipaddr_js_1 = require("ipaddr.js");
const record_1 = require("../types/record");
const check_1 = require("../utils/check");
const error_1 = require("../error");
/**
 * This function can be used to serialize a user input string into a buffer that will be stored into a record account data
 * For serializing SOL records use `serializeSolRecord`
 * @param str The string being serialized into the record account data
 * @param record The record enum being serialized
 * @returns
 */
const serializeRecord = (str, record) => {
    const size = record_1.RECORD_V1_SIZE.get(record);
    if (!size) {
        if (record === record_1.Record.CNAME || record === record_1.Record.TXT) {
            str = (0, punycode_1.encode)(str);
        }
        return buffer_1.Buffer.from(str, "utf-8");
    }
    if (record === record_1.Record.SOL) {
        throw new error_1.UnsupportedRecordError("Use `serializeSolRecord` for SOL record");
    }
    else if (record === record_1.Record.ETH || record === record_1.Record.BSC) {
        (0, check_1.check)(str.slice(0, 2) === "0x", new error_1.InvalidEvmAddressError("The record content must start with `0x`"));
        return buffer_1.Buffer.from(str.slice(2), "hex");
    }
    else if (record === record_1.Record.Injective) {
        const decoded = base_1.bech32.decodeToBytes(str);
        (0, check_1.check)(decoded.prefix === "inj", new error_1.InvalidInjectiveAddressError("The record content must start with `inj"));
        (0, check_1.check)(decoded.bytes.length === 20, new error_1.InvalidInjectiveAddressError(`The record data must be 20 bytes long`));
        return buffer_1.Buffer.from(decoded.bytes);
    }
    else if (record === record_1.Record.A) {
        const array = (0, ipaddr_js_1.parse)(str).toByteArray();
        (0, check_1.check)(array.length === 4, new error_1.InvalidARecordError(`The record content must be 4 bytes long`));
        return buffer_1.Buffer.from(array);
    }
    else if (record === record_1.Record.AAAA) {
        const array = (0, ipaddr_js_1.parse)(str).toByteArray();
        (0, check_1.check)(array.length === 16, new error_1.InvalidAAAARecordError(`The record content must be 16 bytes logn`));
        return buffer_1.Buffer.from(array);
    }
    else if (record === record_1.Record.Background) {
        return new web3_js_1.PublicKey(str).toBuffer();
    }
    throw new error_1.InvalidRecordInputError(`The provided record data is invalid`);
};
exports.serializeRecord = serializeRecord;
