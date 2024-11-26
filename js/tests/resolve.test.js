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
const resolve_1 = require("../src/resolve/resolve");
const error_1 = require("../src/error");
globals_1.jest.setTimeout(50000);
const connection = new web3_js_1.Connection("https://magical-powerful-river.solana-mainnet.quiknode.pro/05acdc3d91f32f7df8072adb49ee7e4e893e8139");
(0, globals_1.describe)("resolve", () => {
    globals_1.test.each([
        {
            domain: "sns-ip-5-wallet-1",
            result: "ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs",
        },
        {
            domain: "sns-ip-5-wallet-2",
            result: "AxwzQXhZNJb9zLyiHUQA12L2GL7CxvUNrp6neee6r3cA",
        },
        {
            domain: "sns-ip-5-wallet-4",
            result: "7PLHHJawDoa4PGJUK3mUnusV7SEVwZwEyV5csVzm86J4",
        },
        {
            domain: "sns-ip-5-wallet-5",
            result: "96GKJgm2W3P8Bae78brPrJf4Yi9AN1wtPJwg2XVQ2rMr",
            config: { allowPda: true, programIds: [web3_js_1.SystemProgram.programId] },
        },
        {
            domain: "sns-ip-5-wallet-5",
            result: "96GKJgm2W3P8Bae78brPrJf4Yi9AN1wtPJwg2XVQ2rMr",
            config: { allowPda: "any" },
        },
        {
            domain: "sns-ip-5-wallet-7",
            result: "53Ujp7go6CETvC7LTyxBuyopp5ivjKt6VSfixLm1pQrH",
            config: undefined,
        },
        // {
        //   domain: "wallet-guide-4",
        //   result: "Hf4daCT4tC2Vy9RCe9q8avT68yAsNJ1dQe6xiQqyGuqZ",
        //   config: undefined,
        // },
        {
            domain: "sns-ip-5-wallet-8",
            result: "ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs",
            config: undefined,
        },
        {
            domain: "sns-ip-5-wallet-9",
            result: "ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs",
        },
        {
            domain: "sns-ip-5-wallet-10",
            result: "96GKJgm2W3P8Bae78brPrJf4Yi9AN1wtPJwg2XVQ2rMr",
            config: { allowPda: true, programIds: [web3_js_1.SystemProgram.programId] },
        },
        {
            domain: "sns-ip-5-wallet-10",
            result: "96GKJgm2W3P8Bae78brPrJf4Yi9AN1wtPJwg2XVQ2rMr",
            config: { allowPda: "any" },
        },
    ])("$domain resolves correctly", (e) => __awaiter(void 0, void 0, void 0, function* () {
        const resolvedValue = yield (0, resolve_1.resolve)(connection, e.domain, e === null || e === void 0 ? void 0 : e.config);
        (0, globals_1.expect)(resolvedValue.toBase58()).toBe(e.result);
    }));
    globals_1.test.each([
        {
            domain: "sns-ip-5-wallet-3",
            error: new EvalError(),
        },
        {
            domain: "sns-ip-5-wallet-6",
            error: new error_1.PdaOwnerNotAllowed(),
        },
        {
            domain: "sns-ip-5-wallet-11",
            error: new error_1.PdaOwnerNotAllowed(),
        },
        {
            domain: "sns-ip-5-wallet-12",
            error: new error_1.PdaOwnerNotAllowed(),
        },
    ])("$domain throws an error", (e) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, globals_1.expect)((0, resolve_1.resolve)(connection, e.domain)).rejects.toThrow(e.error);
    }));
    globals_1.test.each([
        {
            domain: "wallet-guide-5.sol",
            owner: "Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8",
        },
        {
            domain: "wallet-guide-4.sol",
            owner: "Hf4daCT4tC2Vy9RCe9q8avT68yAsNJ1dQe6xiQqyGuqZ",
        },
        {
            domain: "wallet-guide-3.sol",
            owner: "Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8",
        },
        {
            domain: "wallet-guide-2.sol",
            owner: "36Dn3RWhB8x4c83W6ebQ2C2eH9sh5bQX2nMdkP2cWaA4",
        },
        {
            domain: "wallet-guide-1.sol",
            owner: "36Dn3RWhB8x4c83W6ebQ2C2eH9sh5bQX2nMdkP2cWaA4",
        },
        {
            domain: "wallet-guide-0.sol",
            owner: "Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8",
        },
        {
            domain: "sub-0.wallet-guide-3.sol",
            owner: "Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8",
        },
        {
            domain: "sub-1.wallet-guide-3.sol",
            owner: "Hf4daCT4tC2Vy9RCe9q8avT68yAsNJ1dQe6xiQqyGuqZ",
        },
        // Record V2
        {
            domain: "wallet-guide-6",
            owner: "Hf4daCT4tC2Vy9RCe9q8avT68yAsNJ1dQe6xiQqyGuqZ",
        },
        {
            domain: "wallet-guide-8",
            owner: "36Dn3RWhB8x4c83W6ebQ2C2eH9sh5bQX2nMdkP2cWaA4",
        },
    ])("$domain resolves correctly (backward compatibility)", (e) => __awaiter(void 0, void 0, void 0, function* () {
        const resolvedValue = yield (0, resolve_1.resolve)(connection, e.domain);
        (0, globals_1.expect)(resolvedValue.toBase58()).toBe(e.owner);
    }));
});
