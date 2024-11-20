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
exports.createRecordInstruction = void 0;
const web3_js_1 = require("@solana/web3.js");
const createInstruction_1 = require("../instructions/createInstruction");
const state_1 = require("../state");
const int_1 = require("../int");
const constants_1 = require("../constants");
const check_1 = require("../utils/check");
const getDomainKeySync_1 = require("../utils/getDomainKeySync");
const serializeRecord_1 = require("../record/serializeRecord");
const record_1 = require("../types/record");
const error_1 = require("../error");
/**
 * This function can be used be create a record V1, it handles the serialization of the record data
 * To create a SOL record use `createSolRecordInstruction`
 * @param connection The Solana RPC connection object
 * @param domain The .sol domain name
 * @param record The record enum object
 * @param data The data (as a UTF-8 string) to store in the record account
 * @param owner The owner of the domain
 * @param payer The fee payer of the transaction
 * @returns
 */
const createRecordInstruction = (connection, domain, record, data, owner, payer) => __awaiter(void 0, void 0, void 0, function* () {
    (0, check_1.check)(record !== record_1.Record.SOL, new error_1.UnsupportedRecordError("SOL record is not supported for this instruction"));
    const { pubkey, hashed, parent } = (0, getDomainKeySync_1.getDomainKeySync)(`${record}.${domain}`, record_1.RecordVersion.V1);
    const serialized = (0, serializeRecord_1.serializeRecord)(data, record);
    const space = serialized.length;
    const lamports = yield connection.getMinimumBalanceForRentExemption(space + state_1.NameRegistryState.HEADER_LEN);
    const ix = (0, createInstruction_1.createInstruction)(constants_1.NAME_PROGRAM_ID, web3_js_1.SystemProgram.programId, pubkey, owner, payer, hashed, new int_1.Numberu64(lamports), new int_1.Numberu32(space), undefined, parent, owner);
    return ix;
});
exports.createRecordInstruction = createRecordInstruction;
