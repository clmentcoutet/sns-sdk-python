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
const deserializeRecordV2Content_1 = require("../src/record_v2/deserializeRecordV2Content");
const getMultipleRecordsV2_1 = require("../src/record_v2/getMultipleRecordsV2");
const getRecordV2_1 = require("../src/record_v2/getRecordV2");
const getRecordV2Key_1 = require("../src/record_v2/getRecordV2Key");
const serializeRecordV2Content_1 = require("../src/record_v2/serializeRecordV2Content");
const record_1 = require("../src/types/record");
const web3_js_1 = require("@solana/web3.js");
const createRecordV2Instruction_1 = require("../src/bindings/createRecordV2Instruction");
const deleteRecordV2_1 = require("../src/bindings/deleteRecordV2");
const ethValidateRecordV2Content_1 = require("../src/bindings/ethValidateRecordV2Content");
const updateRecordV2Instruction_1 = require("../src/bindings/updateRecordV2Instruction");
const validateRecordV2Content_1 = require("../src/bindings/validateRecordV2Content");
const writRoaRecordV2_1 = require("../src/bindings/writRoaRecordV2");
jest.setTimeout(50000);
const connection = new web3_js_1.Connection(process.env.RPC_URL);
(0, globals_1.test)("Records V2 des/ser", () => {
    const items = [
        { content: "this is a test", record: record_1.Record.TXT },
        {
            content: web3_js_1.Keypair.generate().publicKey.toBase58(),
            record: record_1.Record.SOL,
            length: 32,
        },
        {
            content: "inj13glcnaum2xqv5a0n0hdsmv0f6nfacjsfvrh5j9",
            record: record_1.Record.Injective,
            length: 20,
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
            length: 20,
        },
        {
            content: "1.1.1.4",
            record: record_1.Record.A,
            length: 4,
        },
        {
            content: "2345:425:2ca1::567:5673:23b5",
            record: record_1.Record.AAAA,
            length: 16,
        },
        {
            content: "username",
            record: record_1.Record.Discord,
        },
        {
            content: "k51qzi5uqu5dlvj2baxnqndepeb86cbk3ng7n3i46uzyxzyqj2xjonzllnv0v8",
            record: record_1.Record.IPNS,
        },
    ];
    items.forEach((e) => {
        const ser = (0, serializeRecordV2Content_1.serializeRecordV2Content)(e.content, e.record);
        const des = (0, deserializeRecordV2Content_1.deserializeRecordV2Content)(ser, e.record);
        (0, globals_1.expect)(des).toBe(e.content);
        if (e.length) {
            (0, globals_1.expect)(ser.length).toBe(e.length);
        }
    });
});
(0, globals_1.test)("Create record", () => __awaiter(void 0, void 0, void 0, function* () {
    const domain = "wallet-guide-9";
    const owner = new web3_js_1.PublicKey("Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8");
    const ix = (0, createRecordV2Instruction_1.createRecordV2Instruction)(domain, record_1.Record.Github, "bonfida", owner, owner);
    const tx = new web3_js_1.Transaction().add(ix);
    tx.feePayer = owner;
    tx.recentBlockhash = (yield connection.getLatestBlockhash()).blockhash;
    const { value } = yield connection.simulateTransaction(tx);
    (0, globals_1.expect)(value.err).toBe(null);
}));
(0, globals_1.test)("Update record", () => __awaiter(void 0, void 0, void 0, function* () {
    const domain = "wallet-guide-9";
    const owner = new web3_js_1.PublicKey("Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8");
    const tx = new web3_js_1.Transaction();
    const ix_1 = (0, createRecordV2Instruction_1.createRecordV2Instruction)(domain, record_1.Record.Github, "bonfida", owner, owner);
    tx.add(ix_1);
    const ix_2 = (0, updateRecordV2Instruction_1.updateRecordV2Instruction)(domain, record_1.Record.Github, "some text", owner, owner);
    tx.add(ix_2);
    tx.feePayer = owner;
    tx.recentBlockhash = (yield connection.getLatestBlockhash()).blockhash;
    const { value } = yield connection.simulateTransaction(tx);
    (0, globals_1.expect)(value.err).toBe(null);
}));
(0, globals_1.test)("Delete record", () => __awaiter(void 0, void 0, void 0, function* () {
    const domain = "wallet-guide-9";
    const owner = new web3_js_1.PublicKey("Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8");
    const tx = new web3_js_1.Transaction();
    const ix_1 = (0, createRecordV2Instruction_1.createRecordV2Instruction)(domain, record_1.Record.Github, "bonfida", owner, owner);
    tx.add(ix_1);
    const ix_2 = (0, deleteRecordV2_1.deleteRecordV2)(domain, record_1.Record.Github, owner, owner);
    tx.add(ix_2);
    tx.feePayer = owner;
    tx.recentBlockhash = (yield connection.getLatestBlockhash()).blockhash;
    const { value } = yield connection.simulateTransaction(tx);
    (0, globals_1.expect)(value.err).toBe(null);
}));
(0, globals_1.test)("Solana Verify", () => __awaiter(void 0, void 0, void 0, function* () {
    const domain = "wallet-guide-9";
    const owner = new web3_js_1.PublicKey("Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8");
    const tx = new web3_js_1.Transaction();
    const ix_1 = (0, createRecordV2Instruction_1.createRecordV2Instruction)(domain, record_1.Record.Github, "bonfida", owner, owner);
    tx.add(ix_1);
    const ix_2 = (0, validateRecordV2Content_1.validateRecordV2Content)(true, domain, record_1.Record.Github, owner, owner, owner);
    tx.add(ix_2);
    tx.feePayer = owner;
    tx.recentBlockhash = (yield connection.getLatestBlockhash()).blockhash;
    const { value } = yield connection.simulateTransaction(tx);
    (0, globals_1.expect)(value.err).toBe(null);
}));
(0, globals_1.test)("ETH Verify", () => __awaiter(void 0, void 0, void 0, function* () {
    const domain = "wallet-guide-9";
    const owner = new web3_js_1.PublicKey("Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8");
    // Record key: E4MZzSfkf59UVFYVux5WEufghvWxUktf6e5EaUuDExAc
    const tx = new web3_js_1.Transaction();
    const ix_1 = (0, createRecordV2Instruction_1.createRecordV2Instruction)(domain, record_1.Record.ETH, "0x4bfbfd1e018f9f27eeb788160579daf7e2cd7da7", owner, owner);
    tx.add(ix_1);
    const ix_2 = (0, validateRecordV2Content_1.validateRecordV2Content)(true, domain, record_1.Record.ETH, owner, owner, owner);
    tx.add(ix_2);
    const ix_3 = (0, ethValidateRecordV2Content_1.ethValidateRecordV2Content)(domain, record_1.Record.ETH, owner, owner, Buffer.from([
        78, 235, 200, 2, 51, 5, 225, 127, 83, 156, 25, 226, 53, 239, 196, 189,
        196, 197, 121, 2, 91, 2, 99, 11, 31, 179, 5, 233, 52, 246, 137, 252, 72,
        27, 67, 15, 86, 42, 62, 117, 140, 223, 159, 142, 86, 227, 233, 185, 149,
        111, 92, 122, 147, 23, 217, 1, 66, 72, 63, 150, 27, 219, 152, 10, 28,
    ]), Buffer.from([
        75, 251, 253, 30, 1, 143, 159, 39, 238, 183, 136, 22, 5, 121, 218, 247,
        226, 205, 125, 167,
    ]));
    tx.add(ix_3);
    tx.feePayer = owner;
    tx.recentBlockhash = (yield connection.getLatestBlockhash()).blockhash;
    const { value } = yield connection.simulateTransaction(tx);
    (0, globals_1.expect)(value.err).toBe(null);
}));
(0, globals_1.test)("RoA record", () => __awaiter(void 0, void 0, void 0, function* () {
    const domain = "wallet-guide-9";
    const owner = new web3_js_1.PublicKey("Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8");
    const tx = new web3_js_1.Transaction();
    const ix_1 = (0, createRecordV2Instruction_1.createRecordV2Instruction)(domain, record_1.Record.Github, "bonfida", owner, owner);
    tx.add(ix_1);
    const ix_2 = (0, writRoaRecordV2_1.writRoaRecordV2)(domain, record_1.Record.Github, owner, owner, owner);
    tx.add(ix_2);
    tx.feePayer = owner;
    tx.recentBlockhash = (yield connection.getLatestBlockhash()).blockhash;
    const { value } = yield connection.simulateTransaction(tx);
    (0, globals_1.expect)(value.err).toBe(null);
}));
(0, globals_1.test)("Create record for sub", () => __awaiter(void 0, void 0, void 0, function* () {
    const domain = "sub-0.wallet-guide-9";
    const owner = new web3_js_1.PublicKey("Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8");
    const ix = (0, createRecordV2Instruction_1.createRecordV2Instruction)(domain, record_1.Record.Github, "bonfida", owner, owner);
    const tx = new web3_js_1.Transaction().add(ix);
    tx.feePayer = owner;
    tx.recentBlockhash = (yield connection.getLatestBlockhash()).blockhash;
    const { value } = yield connection.simulateTransaction(tx);
    (0, globals_1.expect)(value.err).toBe(null);
}));
(0, globals_1.test)("Create record for sub & update & verify staleness & delete", () => __awaiter(void 0, void 0, void 0, function* () {
    const domain = "sub-0.wallet-guide-9";
    const owner = new web3_js_1.PublicKey("Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8");
    const tx = new web3_js_1.Transaction();
    const ix_create = (0, createRecordV2Instruction_1.createRecordV2Instruction)(domain, record_1.Record.Github, "bonfida", owner, owner);
    tx.add(ix_create);
    const ix_update = (0, updateRecordV2Instruction_1.updateRecordV2Instruction)(domain, record_1.Record.Github, "somethingelse", owner, owner);
    tx.add(ix_update);
    const ix_verify = (0, validateRecordV2Content_1.validateRecordV2Content)(true, domain, record_1.Record.Github, owner, owner, owner);
    tx.add(ix_verify);
    const ix_delete = (0, deleteRecordV2_1.deleteRecordV2)(domain, record_1.Record.Github, owner, owner);
    tx.add(ix_delete);
    tx.feePayer = owner;
    tx.recentBlockhash = (yield connection.getLatestBlockhash()).blockhash;
    const { value } = yield connection.simulateTransaction(tx);
    (0, globals_1.expect)(value.err).toBe(null);
}));
(0, globals_1.test)("getRecordV2", () => __awaiter(void 0, void 0, void 0, function* () {
    const domain = "wallet-guide-9.sol";
    const items = [
        { record: record_1.Record.IPFS, value: "ipfs://test" },
        { record: record_1.Record.Email, value: "test@gmail.com" },
        { record: record_1.Record.Url, value: "https://google.com" },
    ];
    for (let item of items) {
        const res = yield (0, getRecordV2_1.getRecordV2)(connection, domain, item.record, {
            deserialize: true,
        });
        (0, globals_1.expect)(res.deserializedContent).toBe(item.value);
    }
}));
(0, globals_1.test)("getMultipleRecordsV2", () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const domain = "wallet-guide-9.sol";
    const items = [
        { record: record_1.Record.IPFS, value: "ipfs://test" },
        { record: record_1.Record.Email, value: "test@gmail.com" },
        { record: record_1.Record.Url, value: "https://google.com" },
    ];
    const res = yield (0, getMultipleRecordsV2_1.getMultipleRecordsV2)(connection, domain, items.map((e) => e.record), {
        deserialize: true,
    });
    for (let i = 0; i < items.length; i++) {
        (0, globals_1.expect)(items[i].value).toBe((_a = res[i]) === null || _a === void 0 ? void 0 : _a.deserializedContent);
        (0, globals_1.expect)(items[i].record).toBe((_b = res[i]) === null || _b === void 0 ? void 0 : _b.record);
    }
}));
describe("getRecordV2Key", () => {
    globals_1.test.each([
        {
            domain: "domain1.sol",
            record: record_1.Record.SOL,
            expected: "GBrd6Q53eu1T2PiaQAtm92r3DwxmoGvZ2D6xjtVtN1Qt",
        },
        {
            domain: "sub.domain2.sol",
            record: record_1.Record.SOL,
            expected: "A3EFmyCmK5rp73TdgLH8aW49PJ8SJw915arhydRZ6Sws",
        },
        {
            domain: "domain3.sol",
            record: record_1.Record.Url,
            expected: "DMZmnjcAnUwSje4o2LGJhipCfNZ5b37GEbbkwbQBWEW1",
        },
        {
            domain: "sub.domain4.sol",
            record: record_1.Record.Url,
            expected: "6o8JQ7vss6r9sw9GWNVugZktwfEJ67iUz6H63hhmg4sj",
        },
        {
            domain: "domain5.sol",
            record: record_1.Record.IPFS,
            expected: "DQHeVmAj9Nz4uAn2dneEsgBZWcfhUqLdtbDcfWhGL47D",
        },
        {
            domain: "sub.domain6.sol",
            record: record_1.Record.IPFS,
            expected: "Dj7tnTTaktrrmdtatRuLG3YdtGZk8XEBMb4w5WtCBHvr",
        },
    ])("$domain", (e) => {
        (0, globals_1.expect)((0, getRecordV2Key_1.getRecordV2Key)(e.domain, e.record).toBase58()).toBe(e.expected);
    });
});
