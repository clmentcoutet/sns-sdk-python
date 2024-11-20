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
exports.retrieveRecords = void 0;
const spl_token_1 = require("@solana/spl-token");
const state_1 = require("./state");
const getRecordFromMint_1 = require("./getRecordFromMint");
const getFilter = (owner) => {
    const filters = [
        {
            memcmp: { offset: 32, bytes: owner },
        },
        { memcmp: { offset: 64, bytes: "2" } },
    ];
    return filters;
};
const closure = (connection, acc) => __awaiter(void 0, void 0, void 0, function* () {
    const record = yield (0, getRecordFromMint_1.getRecordFromMint)(connection, acc.mint);
    if (record.length === 1) {
        return state_1.NftRecord.deserialize(record[0].account.data);
    }
});
const retrieveRecords = (connection, owner) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = [
        ...getFilter(owner.toBase58()),
        { dataSize: 165 },
    ];
    const result = yield connection.getProgramAccounts(spl_token_1.TOKEN_PROGRAM_ID, {
        filters,
    });
    const tokenAccs = result.map((e) => spl_token_1.AccountLayout.decode(e.account.data));
    const promises = tokenAccs.map((acc) => closure(connection, acc));
    const records = yield Promise.all(promises);
    return records.filter((e) => e !== undefined);
});
exports.retrieveRecords = retrieveRecords;
