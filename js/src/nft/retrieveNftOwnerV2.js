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
exports.retrieveNftOwnerV2 = void 0;
const web3_js_1 = require("@solana/web3.js");
const getDomainMint_1 = require("./getDomainMint");
const spl_token_1 = require("@solana/spl-token");
const retrieveNftOwnerV2 = (connection, nameAccount) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mint = (0, getDomainMint_1.getDomainMint)(nameAccount);
        const largestAccounts = yield connection.getTokenLargestAccounts(mint);
        if (largestAccounts.value.length === 0) {
            return null;
        }
        const largestAccountInfo = yield connection.getAccountInfo(largestAccounts.value[0].address);
        if (!largestAccountInfo) {
            return null;
        }
        const decoded = spl_token_1.AccountLayout.decode(largestAccountInfo.data);
        if (decoded.amount.toString() === "1") {
            return decoded.owner;
        }
        return null;
    }
    catch (err) {
        if (err instanceof web3_js_1.SolanaJSONRPCError && err.code === -32602) {
            // Mint does not exist
            return null;
        }
        throw err;
    }
});
exports.retrieveNftOwnerV2 = retrieveNftOwnerV2;
