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
const burnDomain_1 = require("../src/bindings/burnDomain");
globals_1.jest.setTimeout(20000);
const connection = new web3_js_1.Connection(process.env.RPC_URL);
const OWNER = new web3_js_1.PublicKey("3Wnd5Df69KitZfUoPYZU438eFRNwGHkhLnSAWL65PxJX");
(0, globals_1.test)("Burn", () => __awaiter(void 0, void 0, void 0, function* () {
    const tx = new web3_js_1.Transaction();
    const ix = (0, burnDomain_1.burnDomain)("1automotive", OWNER, OWNER);
    tx.add(ix);
    const { blockhash } = yield connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = OWNER;
    const res = yield connection.simulateTransaction(tx);
    expect(res.value.err).toBe(null);
}));
