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
exports.retrieveNftOwner = void 0;
const web3_js_1 = require("@solana/web3.js");
const getDomainMint_1 = require("./getDomainMint");
const spl_token_1 = require("@solana/spl-token");
/**
 * This function can be used to retrieve the owner of a tokenized domain name
 *
 * @param connection The solana connection object to the RPC node
 * @param nameAccount The key of the domain name
 * @returns
 */
const retrieveNftOwner = (connection, nameAccount) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mint = (0, getDomainMint_1.getDomainMint)(nameAccount);
        const mintInfo = yield (0, spl_token_1.getMint)(connection, mint);
        if (mintInfo.supply.toString() === "0") {
            return undefined;
        }
        const filters = [
            {
                memcmp: {
                    offset: 0,
                    bytes: mint.toBase58(),
                },
            },
            {
                memcmp: {
                    offset: 64,
                    bytes: "2",
                },
            },
            { dataSize: 165 },
        ];
        const result = yield connection.getProgramAccounts(spl_token_1.TOKEN_PROGRAM_ID, {
            filters,
        });
        if (result.length != 1) {
            return undefined;
        }
        return new web3_js_1.PublicKey(result[0].account.data.slice(32, 64));
    }
    catch (_a) {
        return undefined;
    }
});
exports.retrieveNftOwner = retrieveNftOwner;
