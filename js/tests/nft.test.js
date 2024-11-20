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
require("dotenv").config();
const globals_1 = require("@jest/globals");
const web3_js_1 = require("@solana/web3.js");
const getDomainKeySync_1 = require("../src/utils/getDomainKeySync");
const getTokenizedDomains_1 = require("../src/utils/getTokenizedDomains");
const getDomainMint_1 = require("../src/nft/getDomainMint");
globals_1.jest.setTimeout(10000);
const connection = new web3_js_1.Connection(process.env.RPC_URL);
const items = [
    {
        owner: new web3_js_1.PublicKey("Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8"),
        domains: [
            {
                key: "iSNVgWfb31aTWa58UxZ6fp7n3TTrUk5Gojggub5stXk",
                mint: "2RJhBbxTiPT2bZq5bhjaTZbsnhbDB7VtTAMmCdBrwBZP",
                reverse: "wallet-guide-5",
            },
            {
                key: "uDTBDfKrJSBTgmWUZLcENPk5YrHfWbcrUbNFLjsvNpn",
                mint: "Eskv5Ns4gyREvNPPgANojNPsz6x1cbn9YwT7esAnxPhP",
                reverse: "wallet-guide-0",
            },
        ],
    },
];
(0, globals_1.test)("Get tokenized domains", () => __awaiter(void 0, void 0, void 0, function* () {
    const domains = (yield (0, getTokenizedDomains_1.getTokenizedDomains)(connection, new web3_js_1.PublicKey("Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8"))).map((e) => {
        return {
            key: e.key.toBase58(),
            mint: e.mint.toBase58(),
            reverse: e.reverse,
        };
    });
    domains.sort((a, b) => b.reverse.localeCompare(a.reverse));
    for (let item of items) {
        expect(domains).toEqual(item.domains);
    }
}));
describe("getDomainMint", () => {
    globals_1.test.each([
        {
            domain: "domain1.sol",
            address: "3YTxXhhVue9BVjgjPwJbbJ4uGPsnwN453DDf72rYE5WN",
        },
        {
            domain: "sub.domain2.sol",
            address: "66CnogoXDBqYeYRGYzQf19VyrMnB4uGxpZQDuDYfbKCX",
        },
    ])("$domain", (e) => {
        expect((0, getDomainMint_1.getDomainMint)((0, getDomainKeySync_1.getDomainKeySync)(e.domain).pubkey).toBase58()).toBe(e.address);
    });
});
