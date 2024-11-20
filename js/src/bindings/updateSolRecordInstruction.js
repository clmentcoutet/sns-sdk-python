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
exports.updateSolRecordInstruction = void 0;
const deleteInstruction_1 = require("../instructions/deleteInstruction");
const updateInstruction_1 = require("../instructions/updateInstruction");
const int_1 = require("../int");
const constants_1 = require("../constants");
const check_1 = require("../utils/check");
const getDomainKeySync_1 = require("../utils/getDomainKeySync");
const serializeSolRecord_1 = require("../record/serializeSolRecord");
const record_1 = require("../types/record");
const error_1 = require("../error");
const createSolRecordInstruction_1 = require("./createSolRecordInstruction");
const updateSolRecordInstruction = (connection, domain, content, signer, signature, payer) => __awaiter(void 0, void 0, void 0, function* () {
    const { pubkey } = (0, getDomainKeySync_1.getDomainKeySync)(`${record_1.Record.SOL}.${domain}`, record_1.RecordVersion.V1);
    const info = yield connection.getAccountInfo(pubkey);
    (0, check_1.check)(!!(info === null || info === void 0 ? void 0 : info.data), new error_1.AccountDoesNotExistError("The record account does not exist"));
    if ((info === null || info === void 0 ? void 0 : info.data.length) !== 96) {
        return [
            (0, deleteInstruction_1.deleteInstruction)(constants_1.NAME_PROGRAM_ID, pubkey, payer, signer),
            yield (0, createSolRecordInstruction_1.createSolRecordInstruction)(connection, domain, content, signer, signature, payer),
        ];
    }
    const serialized = (0, serializeSolRecord_1.serializeSolRecord)(content, pubkey, signer, signature);
    const ix = (0, updateInstruction_1.updateInstruction)(constants_1.NAME_PROGRAM_ID, pubkey, new int_1.Numberu32(0), serialized, signer);
    return ix;
});
exports.updateSolRecordInstruction = updateSolRecordInstruction;
