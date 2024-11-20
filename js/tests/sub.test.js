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
const createSubdomain_1 = require("../src/bindings/createSubdomain");
const transferSubdomain_1 = require("../src/bindings/transferSubdomain");
const crypto_1 = require("crypto");
const constants_1 = require("../src/constants");
const findSubdomains_1 = require("../src/utils/findSubdomains");
const getDomainKeySync_1 = require("../src/utils/getDomainKeySync");
const resolve_1 = require("../src/resolve/resolve");
globals_1.jest.setTimeout(20000);
const connection = new web3_js_1.Connection(process.env.RPC_URL);
(0, globals_1.test)("Create sub", () => __awaiter(void 0, void 0, void 0, function* () {
    const tx = new web3_js_1.Transaction();
    const ix = yield (0, createSubdomain_1.createSubdomain)(connection, (0, crypto_1.randomBytes)(10).toString("hex") + ".bonfida", new web3_js_1.PublicKey("HKKp49qGWXd639QsuH7JiLijfVW5UtCVY4s1n2HANwEA"), 2000);
    tx.add(...ix);
    const { blockhash } = yield connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = constants_1.VAULT_OWNER;
    const res = yield connection.simulateTransaction(tx);
    expect(res.value.err).toBe(null);
}));
(0, globals_1.test)("Transfer sub", () => __awaiter(void 0, void 0, void 0, function* () {
    let tx = new web3_js_1.Transaction();
    const owner = new web3_js_1.PublicKey("A41TAGFpQkFpJidLwH37ydunE7Q3jpBaS228RkoXiRQk");
    const parentOwner = new web3_js_1.PublicKey("A41TAGFpQkFpJidLwH37ydunE7Q3jpBaS228RkoXiRQk");
    let ix = yield (0, transferSubdomain_1.transferSubdomain)(connection, "test.0x33.sol", web3_js_1.PublicKey.default, false);
    tx.add(ix);
    let blockhash = (yield connection.getLatestBlockhash()).blockhash;
    tx.recentBlockhash = blockhash;
    tx.feePayer = owner;
    let res = yield connection.simulateTransaction(tx);
    expect(res.value.err).toBe(null);
    tx = new web3_js_1.Transaction();
    ix = yield (0, transferSubdomain_1.transferSubdomain)(connection, "test.0x33.sol", web3_js_1.PublicKey.default, true);
    tx.add(ix);
    blockhash = (yield connection.getLatestBlockhash()).blockhash;
    tx.recentBlockhash = blockhash;
    tx.feePayer = parentOwner;
    res = yield connection.simulateTransaction(tx);
    expect(res.value.err).toBe(null);
}));
(0, globals_1.test)("Find sub domain", () => __awaiter(void 0, void 0, void 0, function* () {
    const subs = yield (0, findSubdomains_1.findSubdomains)(connection, (0, getDomainKeySync_1.getDomainKeySync)("bonfida").pubkey);
    const expectedSub = ["dex", "naming", "test"];
    subs.sort().forEach((e, idx) => expect(e).toBe(expectedSub[idx]));
}));
(0, globals_1.test)("Create sub - Fee payer ", () => __awaiter(void 0, void 0, void 0, function* () {
    const sub = "gvbhnjklmjnhb";
    const parent = "bonfida.sol";
    const feePayer = constants_1.VAULT_OWNER;
    const parentOwner = yield (0, resolve_1.resolve)(connection, parent);
    const ix = yield (0, createSubdomain_1.createSubdomain)(connection, sub + "." + parent, parentOwner, 1000, feePayer);
    const tx = new web3_js_1.Transaction();
    tx.add(...ix);
    const { blockhash } = yield connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = constants_1.VAULT_OWNER;
    const res = yield connection.simulateTransaction(tx);
    expect(res.value.err).toBe(null);
}));
