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
const getAllDomains_1 = require("../src/utils/getAllDomains");
globals_1.jest.setTimeout(10000);
const items = [
    {
        user: new web3_js_1.PublicKey("Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8"),
        domain: [
            "2NsGScxHd9bS6gA7tfY3xucCcg6H9qDqLdXLtAYFjCVR",
            "6Yi9GyJKoFAv77pny4nxBqYYwFaAZ8dNPZX9HDXw5Ctw",
            "8XXesVR1EEsCEePAEyXPL9A4dd9Bayhu9MRkFBpTkibS",
            "9wcWEXmtUbmiAaWdhQ1nSaZ1cmDVdbYNbaeDcKoK5H8r",
            "CZFQJkE2uBqdwHH53kBT6UStyfcbCWzh6WHwRRtaLgrm",
            "ChkcdTKgyVsrLuD9zkUBoUkZ1GdZjTHEmgh5dhnR4haT",
        ],
    },
];
const connection = new web3_js_1.Connection(process.env.RPC_URL);
(0, globals_1.test)("Get domains", () => __awaiter(void 0, void 0, void 0, function* () {
    for (let item of items) {
        const domains = (yield (0, getAllDomains_1.getAllDomains)(connection, item.user)).map((e) => e.toBase58());
        domains.sort();
        (0, globals_1.expect)(domains).toEqual(item.domain);
    }
}));
