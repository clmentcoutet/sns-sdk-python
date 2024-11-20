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
exports.findSubdomains = void 0;
const constants_1 = require("../constants");
const constants_2 = require("../constants");
const deserializeReverse_1 = require("./deserializeReverse");
const getReverseKeyFromDomainKey_1 = require("./getReverseKeyFromDomainKey");
/**
 *
 * @param connection The Solana RPC connection object
 * @param parentKey The parent you want to find sub-domains for
 * @returns
 */
const findSubdomains = (connection, parentKey) => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch reverse accounts
    const filtersRevs = [
        {
            memcmp: {
                offset: 0,
                bytes: parentKey.toBase58(),
            },
        },
        {
            memcmp: {
                offset: 64,
                bytes: constants_2.REVERSE_LOOKUP_CLASS.toBase58(),
            },
        },
    ];
    const reverses = yield connection.getProgramAccounts(constants_1.NAME_PROGRAM_ID, {
        filters: filtersRevs,
    });
    const filtersSubs = [
        {
            memcmp: {
                offset: 0,
                bytes: parentKey.toBase58(),
            },
        },
    ];
    const subs = yield connection.getProgramAccounts(constants_1.NAME_PROGRAM_ID, {
        filters: filtersSubs,
        dataSlice: { offset: 0, length: 0 },
    });
    const map = new Map(reverses.map((e) => [
        e.pubkey.toBase58(),
        (0, deserializeReverse_1.deserializeReverse)(e.account.data.slice(96), true),
    ]));
    const result = [];
    subs.forEach((e) => {
        const revKey = (0, getReverseKeyFromDomainKey_1.getReverseKeyFromDomainKey)(e.pubkey, parentKey).toBase58();
        const rev = map.get(revKey);
        if (!!rev) {
            result.push(rev);
        }
    });
    return result;
});
exports.findSubdomains = findSubdomains;
