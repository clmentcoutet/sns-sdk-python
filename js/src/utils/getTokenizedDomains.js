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
exports.getTokenizedDomains = void 0;
const retrieveRecords_1 = require("../nft/retrieveRecords");
const reverseLookupBatch_1 = require("./reverseLookupBatch");
/**
 * This function can be used to retrieve all the tokenized domains of an owner
 * @param connection The Solana RPC connection object
 * @param owner The owner of the tokenized domains
 * @returns
 */
const getTokenizedDomains = (connection, owner) => __awaiter(void 0, void 0, void 0, function* () {
    const nftRecords = yield (0, retrieveRecords_1.retrieveRecords)(connection, owner);
    const names = yield (0, reverseLookupBatch_1.reverseLookupBatch)(connection, nftRecords.map((e) => e.nameAccount));
    return names
        .map((e, idx) => {
        return {
            key: nftRecords[idx].nameAccount,
            mint: nftRecords[idx].nftMint,
            reverse: e,
        };
    })
        .filter((e) => !!e.reverse);
});
exports.getTokenizedDomains = getTokenizedDomains;
