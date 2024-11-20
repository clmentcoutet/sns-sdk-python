"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SELF_SIGNED = exports.UTF8_ENCODED = exports.EVM_RECORDS = exports.ETH_ROA_RECORDS = exports.GUARDIANS = void 0;
const record_1 = require("../types/record");
const web3_js_1 = require("@solana/web3.js");
/**
 * A map that associates each record type with a public key, known as guardians.
 */
exports.GUARDIANS = new Map([
    [record_1.Record.Url, new web3_js_1.PublicKey("ExXjtfdQe8JacoqP9Z535WzQKjF4CzW1TTRKRgpxvya3")],
    [record_1.Record.CNAME, new web3_js_1.PublicKey("ExXjtfdQe8JacoqP9Z535WzQKjF4CzW1TTRKRgpxvya3")],
]);
/**
 * Set of records that utilize secp256k1 for verification purposes
 */
exports.ETH_ROA_RECORDS = new Set([
    record_1.Record.ETH,
    record_1.Record.Injective,
    record_1.Record.BSC,
    record_1.Record.BASE,
]);
exports.EVM_RECORDS = new Set([
    record_1.Record.ETH,
    record_1.Record.BSC,
    record_1.Record.BASE,
]);
/**
 * Set of records that are UTF-8 encoded strings
 */
exports.UTF8_ENCODED = new Set([
    record_1.Record.IPFS,
    record_1.Record.ARWV,
    record_1.Record.LTC,
    record_1.Record.DOGE,
    record_1.Record.Email,
    record_1.Record.Url,
    record_1.Record.Discord,
    record_1.Record.Github,
    record_1.Record.Reddit,
    record_1.Record.Twitter,
    record_1.Record.Telegram,
    record_1.Record.Pic,
    record_1.Record.SHDW,
    record_1.Record.POINT,
    record_1.Record.Backpack,
    record_1.Record.TXT,
    record_1.Record.CNAME,
    record_1.Record.BTC,
    record_1.Record.IPNS,
]);
/**
 * Set of records that are self signed i.e signed by the public key contained
 * in the record itself.
 */
exports.SELF_SIGNED = new Set([
    record_1.Record.ETH,
    record_1.Record.Injective,
    record_1.Record.SOL,
]);
