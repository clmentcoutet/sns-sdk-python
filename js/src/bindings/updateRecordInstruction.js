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
exports.updateRecordInstruction = void 0;
const deleteInstruction_1 = require("../instructions/deleteInstruction");
const updateInstruction_1 = require("../instructions/updateInstruction");
const int_1 = require("../int");
const constants_1 = require("../constants");
const check_1 = require("../utils/check");
const getDomainKeySync_1 = require("../utils/getDomainKeySync");
const serializeRecord_1 = require("../record/serializeRecord");
const record_1 = require("../types/record");
const error_1 = require("../error");
const createRecordInstruction_1 = require("./createRecordInstruction");
const updateRecordInstruction = (connection, domain, record, data, owner, payer) => __awaiter(void 0, void 0, void 0, function* () {
    (0, check_1.check)(record !== record_1.Record.SOL, new error_1.UnsupportedRecordError("SOL record is not supported for this instruction"));
    const { pubkey } = (0, getDomainKeySync_1.getDomainKeySync)(`${record}.${domain}`, record_1.RecordVersion.V1);
    const info = yield connection.getAccountInfo(pubkey);
    (0, check_1.check)(!!(info === null || info === void 0 ? void 0 : info.data), new error_1.AccountDoesNotExistError("The record account does not exist"));
    const serialized = (0, serializeRecord_1.serializeRecord)(data, record);
    if ((info === null || info === void 0 ? void 0 : info.data.slice(96).length) !== serialized.length) {
        // Delete + create until we can realloc accounts
        return [
            (0, deleteInstruction_1.deleteInstruction)(constants_1.NAME_PROGRAM_ID, pubkey, payer, owner),
            yield (0, createRecordInstruction_1.createRecordInstruction)(connection, domain, record, data, owner, payer),
        ];
    }
    const ix = (0, updateInstruction_1.updateInstruction)(constants_1.NAME_PROGRAM_ID, pubkey, new int_1.Numberu32(0), serialized, owner);
    return ix;
});
exports.updateRecordInstruction = updateRecordInstruction;
