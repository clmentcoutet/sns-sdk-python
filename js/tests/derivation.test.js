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
const globals_1 = require("@jest/globals");
const utils_1 = require("../src/deprecated/utils");
const getDomainKeySync_1 = require("../src/utils/getDomainKeySync");
const items = [
    {
        domain: "bonfida",
        address: "Crf8hzfthWGbGbLTVCiqRqV5MVnbpHB1L9KQMd6gsinb",
    },
    {
        domain: "bonfida.sol",
        address: "Crf8hzfthWGbGbLTVCiqRqV5MVnbpHB1L9KQMd6gsinb",
    },
    {
        domain: "dex.bonfida",
        address: "HoFfFXqFHAC8RP3duuQNzag1ieUwJRBv1HtRNiWFq4Qu",
    },
    {
        domain: "dex.bonfida.sol",
        address: "HoFfFXqFHAC8RP3duuQNzag1ieUwJRBv1HtRNiWFq4Qu",
    },
];
(0, globals_1.test)("Derivation", () => __awaiter(void 0, void 0, void 0, function* () {
    for (let item of items) {
        const { pubkey } = yield (0, utils_1.getDomainKey)(item.domain);
        (0, globals_1.expect)(pubkey.toBase58()).toBe(item.address);
    }
    items.forEach((e) => (0, globals_1.expect)((0, getDomainKeySync_1.getDomainKeySync)(e.domain).pubkey.toBase58()).toBe(e.address));
}));
