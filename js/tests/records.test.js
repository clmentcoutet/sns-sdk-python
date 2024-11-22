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
const getIpfsRecord_1 = require("../src/record/helpers/getIpfsRecord");
const getArweaveRecord_1 = require("../src/record/helpers/getArweaveRecord");
const getEthRecord_1 = require("../src/record/helpers/getEthRecord");
const getBtcRecord_1 = require("../src/record/helpers/getBtcRecord");
const getLtcRecord_1 = require("../src/record/helpers/getLtcRecord");
const getDogeRecord_1 = require("../src/record/helpers/getDogeRecord");
const getEmailRecord_1 = require("../src/record/helpers/getEmailRecord");
const getUrlRecord_1 = require("../src/record/helpers/getUrlRecord");
const getDiscordRecord_1 = require("../src/record/helpers/getDiscordRecord");
const getGithubRecord_1 = require("../src/record/helpers/getGithubRecord");
const getRedditRecord_1 = require("../src/record/helpers/getRedditRecord");
const getTwitterRecord_1 = require("../src/record/helpers/getTwitterRecord");
const getTelegramRecord_1 = require("../src/record/helpers/getTelegramRecord");
const getBscRecord_1 = require("../src/record/helpers/getBscRecord");
const getRecords_1 = require("../src/record/getRecords");
const serializeRecord_1 = require("../src/record/serializeRecord");
const deserializeRecord_1 = require("../src/record/deserializeRecord");
const web3_js_1 = require("@solana/web3.js");
const record_1 = require("../src/types/record");
const createRecordInstruction_1 = require("../src/bindings/createRecordInstruction");
const resolveSolRecordV1_1 = require("../src/resolve/resolveSolRecordV1");
const getRecordKeySync_1 = require("../src/record/getRecordKeySync");
globals_1.jest.setTimeout(20000);
const connection = new web3_js_1.Connection("https://magical-powerful-river.solana-mainnet.quiknode.pro/05acdc3d91f32f7df8072adb49ee7e4e893e8139");
(0, globals_1.test)("Records", () => __awaiter(void 0, void 0, void 0, function* () {
    const domain = "🍍";
    (0, getIpfsRecord_1.getIpfsRecord)(connection, domain).then((e) => {
        (0, globals_1.expect)(e).toBe("QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR");
    });
    (0, getArweaveRecord_1.getArweaveRecord)(connection, domain).then((e) => (0, globals_1.expect)(e).toBe("some-arweave-hash"));
    (0, getEthRecord_1.getEthRecord)(connection, domain).then((e) => (0, globals_1.expect)(e).toBe("0x570eDC13f9D406a2b4E6477Ddf75D5E9cCF51cd6"));
    (0, getBtcRecord_1.getBtcRecord)(connection, domain).then((e) => (0, globals_1.expect)(e).toBe("3JfBcjv7TbYN9yQsyfcNeHGLcRjgoHhV3z"));
    (0, getLtcRecord_1.getLtcRecord)(connection, domain).then((e) => (0, globals_1.expect)(e).toBe("MK6deR3Mi6dUsim9M3GPDG2xfSeSAgSrpQ"));
    (0, getDogeRecord_1.getDogeRecord)(connection, domain).then((e) => (0, globals_1.expect)(e).toBe("DC79kjg58VfDZeMj9cWNqGuDfYfGJg9DjZ"));
    (0, getEmailRecord_1.getEmailRecord)(connection, domain).then((e) => (0, globals_1.expect)(e).toBe("🍍@gmail.com"));
    (0, getUrlRecord_1.getUrlRecord)(connection, domain).then((e) => (0, globals_1.expect)(e).toBe("🍍.io"));
    (0, getDiscordRecord_1.getDiscordRecord)(connection, domain).then((e) => (0, globals_1.expect)(e).toBe("@🍍#7493"));
    (0, getGithubRecord_1.getGithubRecord)(connection, domain).then((e) => (0, globals_1.expect)((0, globals_1.expect)(e).toBe("@🍍_dev")));
    (0, getRedditRecord_1.getRedditRecord)(connection, domain).then((e) => (0, globals_1.expect)(e).toBe("@reddit-🍍"));
    (0, getTwitterRecord_1.getTwitterRecord)(connection, domain).then((e) => (0, globals_1.expect)(e).toBe("@🍍"));
    return (0, getTelegramRecord_1.getTelegramRecord)(connection, domain).then((e) => (0, globals_1.expect)(e).toBe("@🍍-tg"));
}));
const sub = "test.🇺🇸.sol";
(0, globals_1.test)("Sub records", () => __awaiter(void 0, void 0, void 0, function* () {
    (0, getEmailRecord_1.getEmailRecord)(connection, sub).then((e) => (0, globals_1.expect)(e).toBe("test@test.com"));
}));
(0, globals_1.test)("Get multiple records", () => __awaiter(void 0, void 0, void 0, function* () {
    const records = yield (0, getRecords_1.getRecords)(connection, "🍍", [record_1.Record.Telegram, record_1.Record.Github, record_1.Record.Backpack], true);
    (0, globals_1.expect)(records[0]).toBe("@🍍-tg");
    (0, globals_1.expect)(records[1]).toBe("@🍍_dev");
    (0, globals_1.expect)(records[2]).toBe(undefined);
}));
(0, globals_1.test)("BSC", () => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield (0, getBscRecord_1.getBscRecord)(connection, "aanda.sol");
    (0, globals_1.expect)(res).toBe("0x4170ad697176fe6d660763f6e4dfcf25018e8b63");
}));
(0, globals_1.test)("Create", () => __awaiter(void 0, void 0, void 0, function* () {
    const domain = "wallet-guide-3.sol";
    const owner = new web3_js_1.PublicKey("Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8");
    let ix = yield (0, createRecordInstruction_1.createRecordInstruction)(connection, domain, record_1.Record.A, "192.168.0.1", owner, owner);
    const tx = new web3_js_1.Transaction().add(ix);
    tx.recentBlockhash = (yield connection.getLatestBlockhash()).blockhash;
    tx.feePayer = owner;
    let res = yield connection.simulateTransaction(tx);
    (0, globals_1.expect)(res.value.err).toBe(null);
}));
(0, globals_1.test)("Check sol record", () => __awaiter(void 0, void 0, void 0, function* () {
    const domain = "wallet-guide-4";
    const owner = new web3_js_1.PublicKey("Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8");
    const result = yield (0, resolveSolRecordV1_1.resolveSolRecordV1)(connection, owner, domain);
    (0, globals_1.expect)(result.toBase58()).toBe("Hf4daCT4tC2Vy9RCe9q8avT68yAsNJ1dQe6xiQqyGuqZ");
}));
(0, globals_1.test)("Des/ser", () => {
    const items = [
        { content: "this is a test", record: record_1.Record.TXT },
        {
            content: "inj13glcnaum2xqv5a0n0hdsmv0f6nfacjsfvrh5j9",
            record: record_1.Record.Injective,
        },
        {
            content: "example.com",
            record: record_1.Record.CNAME,
        },
        {
            content: "example.com",
            record: record_1.Record.CNAME,
        },
        {
            content: "0xc0ffee254729296a45a3885639ac7e10f9d54979",
            record: record_1.Record.ETH,
        },
        {
            content: "1.1.1.4",
            record: record_1.Record.A,
        },
        {
            content: "2345:425:2ca1::567:5673:23b5",
            record: record_1.Record.AAAA,
        },
        {
            content: "username",
            record: record_1.Record.Discord,
        },
    ];
    items.forEach((e) => {
        const ser = (0, serializeRecord_1.serializeRecord)(e.content, e.record);
        const registry = {
            data: ser,
            parentName: web3_js_1.PublicKey.default,
            class: web3_js_1.PublicKey.default,
            owner: web3_js_1.PublicKey.default,
        };
        const des = (0, deserializeRecord_1.deserializeRecord)(registry, e.record, web3_js_1.PublicKey.default);
        (0, globals_1.expect)(des).toBe(e.content);
    });
});
describe("getRecordKeySync", () => {
    globals_1.test.each([
        {
            domain: "domain1.sol",
            record: record_1.Record.SOL,
            expected: "ATH9akc5pi1PWDB39YY7VCoYzCxmz8XVj23oegSoNSPL",
        },
        {
            domain: "sub.domain2.sol",
            record: record_1.Record.SOL,
            expected: "AEgJVf6zaQfkyYPnYu8Y9Vxa1Sy69EtRSP8iGubx5MnC",
        },
        {
            domain: "domain3.sol",
            record: record_1.Record.Url,
            expected: "EuxtWLCKsdpwM8ftKjnD2Q8vBdzZunh7DY1mHwXhLTqx",
        },
        {
            domain: "sub.domain4.sol",
            record: record_1.Record.Url,
            expected: "64nv6HSbifdUgdWst48V4YUB3Y3uQXVQRD4iDZPd9qGx",
        },
        {
            domain: "domain5.sol",
            record: record_1.Record.IPFS,
            expected: "2uRMeYzKXaYgFVQ1Yh7fKyZWcxsFUMgpEwMi19sVjwjk",
        },
        {
            domain: "sub.domain6.sol",
            record: record_1.Record.IPFS,
            expected: "61JdnEhbd2bEfxnu2uQ38gM2SUry2yY8kBMEseYh8dDy",
        },
    ])("$domain", (e) => {
        (0, globals_1.expect)((0, getRecordKeySync_1.getRecordKeySync)(e.domain, e.record).toBase58()).toBe(e.expected);
    });
});
