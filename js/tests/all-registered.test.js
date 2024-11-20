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
const web3_js_1 = require("@solana/web3.js");
const globals_1 = require("@jest/globals");
const getAllRegisteredDomains_1 = require("../src/utils/getAllRegisteredDomains");
globals_1.jest.setTimeout(4 * 60000);
const connection = new web3_js_1.Connection(process.env.RPC_URL);
(0, globals_1.test)("All registered", () => __awaiter(void 0, void 0, void 0, function* () {
    const registered = yield (0, getAllRegisteredDomains_1.getAllRegisteredDomains)(connection);
    (0, globals_1.expect)(registered.length).toBeGreaterThan(130000);
}));
