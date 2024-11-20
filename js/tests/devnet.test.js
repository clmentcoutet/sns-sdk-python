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
const devnet_1 = require("../src/devnet");
const crypto_1 = require("crypto");
const spl_token_1 = require("@solana/spl-token");
const state_1 = require("../src/state");
globals_1.jest.setTimeout(20000);
// Use custom devnet rpc if rate limited
const connection = new web3_js_1.Connection(process.env.RPC_URL_DEVNET || "https://api.devnet.solana.com");
const OWNER = new web3_js_1.PublicKey("3f9fRjLaDSDVxd26xMEm4WuSXv62cGt5qVfEVGwMfTz6");
const OWNER2 = new web3_js_1.PublicKey("DjXsn34uz8hnC4KLiSkEVNmzqX5ZFP2Q7aErTBH8LWxe");
(0, globals_1.test)("Registration", () => __awaiter(void 0, void 0, void 0, function* () {
    const tx = new web3_js_1.Transaction();
    const [, ix] = yield devnet_1.devnet.bindings.registerDomainName(connection, (0, crypto_1.randomBytes)(10).toString("hex"), 1000, OWNER2, (0, spl_token_1.getAssociatedTokenAddressSync)(spl_token_1.NATIVE_MINT, OWNER2, true), spl_token_1.NATIVE_MINT);
    tx.add(...ix);
    const { blockhash } = yield connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = OWNER2;
    const res = yield connection.simulateTransaction(tx);
    (0, globals_1.expect)(res.value.err).toBe(null);
}));
(0, globals_1.test)("Registration V2", () => __awaiter(void 0, void 0, void 0, function* () {
    const tx = new web3_js_1.Transaction();
    const ix = yield devnet_1.devnet.bindings.registerDomainNameV2(connection, (0, crypto_1.randomBytes)(10).toString("hex"), 1000, OWNER2, (0, spl_token_1.getAssociatedTokenAddressSync)(spl_token_1.NATIVE_MINT, OWNER2, true), spl_token_1.NATIVE_MINT);
    tx.add(...ix);
    const { blockhash } = yield connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = OWNER2;
    const res = yield connection.simulateTransaction(tx);
    (0, globals_1.expect)(res.value.err).toBe(null);
}));
(0, globals_1.test)("Create", () => __awaiter(void 0, void 0, void 0, function* () {
    const tx = new web3_js_1.Transaction();
    const lamports = yield connection.getMinimumBalanceForRentExemption(1000 + state_1.NameRegistryState.HEADER_LEN);
    const ix = yield devnet_1.devnet.bindings.createNameRegistry(connection, "devnet-test-2", 1000, OWNER, OWNER, lamports);
    tx.add(ix);
    const { blockhash } = yield connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = OWNER;
    const res = yield connection.simulateTransaction(tx);
    (0, globals_1.expect)(res.value.err).toBe(null);
}));
(0, globals_1.test)("Delete", () => __awaiter(void 0, void 0, void 0, function* () {
    const tx = new web3_js_1.Transaction();
    const ix = yield devnet_1.devnet.bindings.deleteNameRegistry(connection, "devnet-test-1", OWNER);
    tx.add(ix);
    const { blockhash } = yield connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = OWNER;
    const res = yield connection.simulateTransaction(tx);
    (0, globals_1.expect)(res.value.err).toBe(null);
}));
(0, globals_1.test)("Burn", () => __awaiter(void 0, void 0, void 0, function* () {
    const tx = new web3_js_1.Transaction();
    const ix = devnet_1.devnet.bindings.burnDomain("devnet-test-1", OWNER, OWNER);
    tx.add(ix);
    const { blockhash } = yield connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = OWNER;
    const res = yield connection.simulateTransaction(tx);
    (0, globals_1.expect)(res.value.err).toBe(null);
}));
(0, globals_1.test)("Update", () => __awaiter(void 0, void 0, void 0, function* () {
    const tx = new web3_js_1.Transaction();
    const ix = yield devnet_1.devnet.bindings.updateNameRegistryData(connection, "devnet-test-1", 0, Buffer.from("testing-data"));
    tx.add(ix);
    const { blockhash } = yield connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = OWNER;
    const res = yield connection.simulateTransaction(tx);
    (0, globals_1.expect)(res.value.err).toBe(null);
}));
(0, globals_1.test)("Transfer", () => __awaiter(void 0, void 0, void 0, function* () {
    const tx = new web3_js_1.Transaction();
    const ix = yield devnet_1.devnet.bindings.transferNameOwnership(connection, "devnet-test-1", OWNER2);
    tx.add(ix);
    const { blockhash } = yield connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = OWNER;
    const res = yield connection.simulateTransaction(tx);
    (0, globals_1.expect)(res.value.err).toBe(null);
}));
(0, globals_1.test)("Create sub", () => __awaiter(void 0, void 0, void 0, function* () {
    const sub = "gvbhnjklmjnhb";
    const parent = "devnet-test-1";
    const tx = new web3_js_1.Transaction();
    const [, ix] = yield devnet_1.devnet.bindings.createSubdomain(connection, sub + "." + parent, OWNER, 2000);
    tx.add(...ix);
    const { blockhash } = yield connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = devnet_1.devnet.constants.VAULT_OWNER;
    const res = yield connection.simulateTransaction(tx);
    (0, globals_1.expect)(res.value.err).toBe(null);
}));
(0, globals_1.test)("Create reverse", () => __awaiter(void 0, void 0, void 0, function* () {
    const tx = new web3_js_1.Transaction();
    const { pubkey: subkey } = yield devnet_1.devnet.utils._deriveSync("subdomain-test.devnet-test-1");
    const [, ix] = yield devnet_1.devnet.bindings.createReverseName(subkey, "subdomain-test.devnet-test-1", OWNER);
    tx.add(...ix);
    const { blockhash } = yield connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = OWNER;
    const res = yield connection.simulateTransaction(tx);
    (0, globals_1.expect)(res.value.err).toBe(null);
}));
(0, globals_1.test)("Transfer sub", () => __awaiter(void 0, void 0, void 0, function* () {
    const tx = new web3_js_1.Transaction();
    const ix = yield devnet_1.devnet.bindings.transferSubdomain(connection, "subdomain-test.devnet-test-1", OWNER2);
    tx.add(ix);
    const { blockhash } = yield connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = OWNER;
    const res = yield connection.simulateTransaction(tx);
    (0, globals_1.expect)(res.value.err).toBe(null);
}));
