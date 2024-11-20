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
exports.createSolRecordInstruction = void 0;
const web3_js_1 = require("@solana/web3.js");
const createInstruction_1 = require("../instructions/createInstruction");
const state_1 = require("../state");
const int_1 = require("../int");
const constants_1 = require("../constants");
const getDomainKeySync_1 = require("../utils/getDomainKeySync");
const serializeSolRecord_1 = require("../record/serializeSolRecord");
const record_1 = require("../types/record");
/**
 * This function can be used to create a SOL record (V1)
 * @param connection The Solana RPC connection object
 * @param domain The .sol domain name
 * @param content The content of the SOL record i.e the public key to store as destination of the domain
 * @param signer The signer of the SOL record i.e the owner of the domain
 * @param signature The signature of the record
 * @param payer The fee payer of the transaction
 * @returns
 */
const createSolRecordInstruction = (connection, domain, content, signer, signature, payer) => __awaiter(void 0, void 0, void 0, function* () {
    const { pubkey, hashed, parent } = (0, getDomainKeySync_1.getDomainKeySync)(`${record_1.Record.SOL}.${domain}`, record_1.RecordVersion.V1);
    const serialized = (0, serializeSolRecord_1.serializeSolRecord)(content, pubkey, signer, signature);
    const space = serialized.length;
    const lamports = yield connection.getMinimumBalanceForRentExemption(space + state_1.NameRegistryState.HEADER_LEN);
    const ix = (0, createInstruction_1.createInstruction)(constants_1.NAME_PROGRAM_ID, web3_js_1.SystemProgram.programId, pubkey, signer, payer, hashed, new int_1.Numberu64(lamports), new int_1.Numberu32(space), undefined, parent, signer);
    return ix;
});
exports.createSolRecordInstruction = createSolRecordInstruction;
