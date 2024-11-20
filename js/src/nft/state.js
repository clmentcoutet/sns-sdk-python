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
exports.NftRecord = exports.Tag = void 0;
const borsh_1 = require("borsh");
const web3_js_1 = require("@solana/web3.js");
const buffer_1 = require("buffer");
const error_1 = require("../error");
var Tag;
(function (Tag) {
    Tag[Tag["Uninitialized"] = 0] = "Uninitialized";
    Tag[Tag["CentralState"] = 1] = "CentralState";
    Tag[Tag["ActiveRecord"] = 2] = "ActiveRecord";
    Tag[Tag["InactiveRecord"] = 3] = "InactiveRecord";
})(Tag || (exports.Tag = Tag = {}));
class NftRecord {
    constructor(obj) {
        this.tag = obj.tag;
        this.nonce = obj.nonce;
        this.nameAccount = new web3_js_1.PublicKey(obj.nameAccount);
        this.owner = new web3_js_1.PublicKey(obj.owner);
        this.nftMint = new web3_js_1.PublicKey(obj.nftMint);
    }
    static deserialize(data) {
        return new NftRecord((0, borsh_1.deserialize)(this.schema, data));
    }
    static retrieve(connection, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const accountInfo = yield connection.getAccountInfo(key);
            if (!accountInfo || !accountInfo.data) {
                throw new error_1.NftRecordNotFoundError("NFT record not found: " + key.toBase58());
            }
            return this.deserialize(accountInfo.data);
        });
    }
    static findKey(nameAccount, programId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield web3_js_1.PublicKey.findProgramAddress([buffer_1.Buffer.from("nft_record"), nameAccount.toBuffer()], programId);
        });
    }
    static findKeySync(nameAccount, programId) {
        return web3_js_1.PublicKey.findProgramAddressSync([buffer_1.Buffer.from("nft_record"), nameAccount.toBuffer()], programId);
    }
}
exports.NftRecord = NftRecord;
NftRecord.LEN = 1 + 1 + 32 + 32 + 32;
NftRecord.schema = {
    struct: {
        tag: "u8",
        nonce: "u8",
        nameAccount: { array: { type: "u8", len: 32 } },
        owner: { array: { type: "u8", len: 32 } },
        nftMint: { array: { type: "u8", len: 32 } },
    },
};
