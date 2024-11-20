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
exports.getDomainKeysWithReverses = void 0;
const reverseLookupBatch_1 = require("./reverseLookupBatch");
const getAllDomains_1 = require("./getAllDomains");
/**
 * This function can be used to retrieve all domain names owned by `wallet` in a human readable format
 * @param connection The Solana RPC connection object
 * @param wallet The wallet you want to search domain names for
 * @returns Array of pubkeys and the corresponding human readable domain names
 */
function getDomainKeysWithReverses(connection, wallet) {
    return __awaiter(this, void 0, void 0, function* () {
        const encodedNameArr = yield (0, getAllDomains_1.getAllDomains)(connection, wallet);
        const names = yield (0, reverseLookupBatch_1.reverseLookupBatch)(connection, encodedNameArr);
        return encodedNameArr.map((pubKey, index) => ({
            pubKey,
            domain: names[index],
        }));
    });
}
exports.getDomainKeysWithReverses = getDomainKeysWithReverses;
