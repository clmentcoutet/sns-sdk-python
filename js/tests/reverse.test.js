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
const constants_1 = require("../src/constants");
const resolve_1 = require("../src/resolve/resolve");
globals_1.jest.setTimeout(50000);
const connection = new web3_js_1.Connection(process.env.RPC_URL);
(0, globals_1.test)("Create sub", () => __awaiter(void 0, void 0, void 0, function* () {
    const sub = "gvbhnjklmjnhb";
    const parent = "bonfida.sol";
    const parentOwner = yield (0, resolve_1.resolve)(connection, parent);
    const ix = yield (0, createSubdomain_1.createSubdomain)(connection, sub + "." + parent, parentOwner, 1000);
    const tx = new web3_js_1.Transaction();
    tx.add(...ix);
    const { blockhash } = yield connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = constants_1.VAULT_OWNER;
    const res = yield connection.simulateTransaction(tx);
    (0, globals_1.expect)(res.value.err).toBe(null);
}));
