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
const getTwitterHandleandRegistryKeyViaFilters_1 = require("../src/twitter/getTwitterHandleandRegistryKeyViaFilters");
const getHandleAndRegistryKey_1 = require("../src/twitter/getHandleAndRegistryKey");
const createVerifiedTwitterRegistry_1 = require("../src/twitter/createVerifiedTwitterRegistry");
const deleteTwitterRegistry_1 = require("../src/twitter/deleteTwitterRegistry");
const getTwitterRegistryKey_1 = require("../src/twitter/getTwitterRegistryKey");
const getTwitterRegistry_1 = require("../src/twitter/getTwitterRegistry");
const ReverseTwitterRegistryState_1 = require("../src/twitter/ReverseTwitterRegistryState");
const web3_js_1 = require("@solana/web3.js");
const crypto_1 = require("crypto");
const constants_1 = require("../src/constants");
jest.setTimeout(50000);
const connection = new web3_js_1.Connection(process.env.RPC_URL);
(0, globals_1.test)("Resolution & derivation", () => __awaiter(void 0, void 0, void 0, function* () {
    // Example randomly taken
    const expected = {
        handle: "plenthor",
        registry: "HrguVp54KnhQcRPaEBULTRhC2PWcyGTQBfwBNVX9SW2i",
        reverse: "C2MB7RDr4wdwSHAPZ8f5qmScYSUHdPKTL6t5meYdcjjW",
    };
    const owner = new web3_js_1.PublicKey("JB27XSKgYFBsuxee5yAS2yi1NKSU6WV5GZrKdrzeTHYC");
    ////////////////////////////////////////////////////////////////////////
    (0, globals_1.expect)((yield (0, getTwitterRegistryKey_1.getTwitterRegistryKey)(expected.handle)).toBase58()).toBe(expected.registry);
    ////////////////////////////////////////////////////////////////////////
    const twitterRegistry = yield (0, getTwitterRegistry_1.getTwitterRegistry)(connection, expected.handle);
    (0, globals_1.expect)(twitterRegistry.class.toBase58()).toBe(web3_js_1.PublicKey.default.toBase58());
    (0, globals_1.expect)(twitterRegistry.parentName.toBase58()).toBe(constants_1.TWITTER_ROOT_PARENT_REGISTRY_KEY.toBase58());
    (0, globals_1.expect)(twitterRegistry.owner.toBase58()).toBe(owner.toBase58());
    ////////////////////////////////////////////////////////////////////////
    const reverse = yield ReverseTwitterRegistryState_1.ReverseTwitterRegistryState.retrieve(connection, new web3_js_1.PublicKey(expected.reverse));
    (0, globals_1.expect)(reverse.twitterHandle).toBe(expected.handle);
    (0, globals_1.expect)(new web3_js_1.PublicKey(reverse.twitterRegistryKey).toBase58()).toBe(expected.registry);
    ////////////////////////////////////////////////////////////////////////
    let [handle, registry] = yield (0, getHandleAndRegistryKey_1.getHandleAndRegistryKey)(connection, owner);
    (0, globals_1.expect)(handle).toBe(expected.handle);
    (0, globals_1.expect)(registry.toBase58()).toBe(expected.registry);
    ////////////////////////////////////////////////////////////////////////
    [handle, registry] = yield (0, getTwitterHandleandRegistryKeyViaFilters_1.getTwitterHandleandRegistryKeyViaFilters)(connection, owner);
    (0, globals_1.expect)(handle).toBe(expected.handle);
    (0, globals_1.expect)(registry.toBase58()).toBe(expected.registry);
}));
(0, globals_1.test)("Create instruction", () => __awaiter(void 0, void 0, void 0, function* () {
    const tx = new web3_js_1.Transaction();
    const handle = (0, crypto_1.randomBytes)(10).toString("hex");
    const user = web3_js_1.Keypair.generate().publicKey;
    const payer = new web3_js_1.PublicKey("JB27XSKgYFBsuxee5yAS2yi1NKSU6WV5GZrKdrzeTHYC");
    const ix = yield (0, createVerifiedTwitterRegistry_1.createVerifiedTwitterRegistry)(connection, handle, user, 10, payer);
    tx.add(...ix);
    tx.feePayer = payer;
    tx.recentBlockhash = (yield connection.getLatestBlockhash()).blockhash;
    const { value } = yield connection.simulateTransaction(tx);
    (0, globals_1.expect)(value.err).toBe(null);
}));
(0, globals_1.test)("Create & delete instruction", () => __awaiter(void 0, void 0, void 0, function* () {
    const tx = new web3_js_1.Transaction();
    const handle = (0, crypto_1.randomBytes)(10).toString("hex");
    const user = web3_js_1.Keypair.generate().publicKey;
    const payer = new web3_js_1.PublicKey("JB27XSKgYFBsuxee5yAS2yi1NKSU6WV5GZrKdrzeTHYC");
    tx.add(...(yield (0, createVerifiedTwitterRegistry_1.createVerifiedTwitterRegistry)(connection, handle, user, 10, payer)));
    tx.add(...(yield (0, deleteTwitterRegistry_1.deleteTwitterRegistry)(handle, user)));
    tx.feePayer = payer;
    tx.recentBlockhash = (yield connection.getLatestBlockhash()).blockhash;
    const { value } = yield connection.simulateTransaction(tx);
    (0, globals_1.expect)(value.err).toBe(null);
}));
