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
exports.resolveSolRecordV2 = void 0;
const web3_js_1 = require("@solana/web3.js");
const record_1 = require("../types/record");
const getRecordV2Key_1 = require("../record_v2/getRecordV2Key");
const sns_records_1 = require("@bonfida/sns-records");
const resolveSolRecordV2 = (connection, owner, domain) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recordV2Key = (0, getRecordV2Key_1.getRecordV2Key)(domain, record_1.Record.SOL);
        const solV2Record = yield sns_records_1.Record.retrieve(connection, recordV2Key);
        const stalenessId = solV2Record.getStalenessId();
        const roaId = solV2Record.getRoAId();
        const content = solV2Record.getContent();
        if (
        // The record must signed by the current owner
        stalenessId.compare(owner.toBuffer()) === 0 &&
            solV2Record.header.stalenessValidation === sns_records_1.Validation.Solana &&
            // The record must signed by the destination
            roaId.compare(content) === 0 &&
            solV2Record.header.rightOfAssociationValidation === sns_records_1.Validation.Solana) {
            return new web3_js_1.PublicKey(content);
        }
    }
    catch (err) {
        if (err instanceof Error) {
            if (err.name === "FetchError") {
                throw err;
            }
        }
    }
});
exports.resolveSolRecordV2 = resolveSolRecordV2;
