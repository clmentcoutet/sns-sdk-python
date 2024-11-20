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
exports.getRecordFromMint = void 0;
const const_1 = require("./const");
const state_1 = require("./state");
/**
 * This function can be used to retrieve a NFT Record given a mint
 *
 * @param connection A solana RPC connection
 * @param mint The mint of the NFT Record
 * @returns
 */
const getRecordFromMint = (connection, mint) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = [
        { dataSize: state_1.NftRecord.LEN },
        {
            memcmp: {
                offset: 0,
                bytes: "3",
            },
        },
        {
            memcmp: {
                offset: 1 + 1 + 32 + 32,
                bytes: mint.toBase58(),
            },
        },
    ];
    const result = yield connection.getProgramAccounts(const_1.NAME_TOKENIZER_ID, {
        filters,
    });
    return result;
});
exports.getRecordFromMint = getRecordFromMint;
