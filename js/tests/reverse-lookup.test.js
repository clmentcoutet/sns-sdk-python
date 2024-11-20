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
const reverseLookupBatch_1 = require("../src/utils/reverseLookupBatch");
const reverseLookup_1 = require("../src/utils/reverseLookup");
const web3_js_1 = require("@solana/web3.js");
const utils_1 = require("../src/deprecated/utils");
globals_1.jest.setTimeout(5000);
const connection = new web3_js_1.Connection(process.env.RPC_URL);
const domain = new web3_js_1.PublicKey("Crf8hzfthWGbGbLTVCiqRqV5MVnbpHB1L9KQMd6gsinb");
(0, globals_1.test)("Reverse lookup", () => __awaiter(void 0, void 0, void 0, function* () {
    (0, utils_1.performReverseLookupBatch)(connection, [domain]).then((e) => (0, globals_1.expect)(e).toStrictEqual(["bonfida"]));
    (0, reverseLookupBatch_1.reverseLookupBatch)(connection, [domain]).then((e) => (0, globals_1.expect)(e).toStrictEqual(["bonfida"]));
    (0, reverseLookup_1.reverseLookup)(connection, domain).then((e) => (0, globals_1.expect)(e).toBe("bonfida"));
}));
