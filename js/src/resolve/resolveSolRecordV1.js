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
exports.resolveSolRecordV1 = void 0;
const web3_js_1 = require("@solana/web3.js");
const getRecordKeySync_1 = require("../record/getRecordKeySync");
const getSolRecord_1 = require("../record/helpers/getSolRecord");
const checkSolRecord_1 = require("../record/checkSolRecord");
const record_1 = require("../types/record");
const buffer_1 = require("buffer");
const error_1 = require("../error");
const resolveSolRecordV1 = (connection, owner, domain) => __awaiter(void 0, void 0, void 0, function* () {
    const recordKey = (0, getRecordKeySync_1.getRecordKeySync)(domain, record_1.Record.SOL);
    const solRecord = yield (0, getSolRecord_1.getSolRecord)(connection, domain);
    if (!(solRecord === null || solRecord === void 0 ? void 0 : solRecord.data)) {
        throw new error_1.NoRecordDataError("The SOL record V1 data is empty");
    }
    const encoder = new TextEncoder();
    const expectedBuffer = buffer_1.Buffer.concat([
        solRecord.data.slice(0, 32),
        recordKey.toBuffer(),
    ]);
    const expected = encoder.encode(expectedBuffer.toString("hex"));
    const valid = (0, checkSolRecord_1.checkSolRecord)(expected, solRecord.data.slice(32), owner);
    if (!valid) {
        throw new error_1.InvalidSignatureError("The SOL record V1 signature is invalid");
    }
    return new web3_js_1.PublicKey(solRecord.data.slice(0, 32));
});
exports.resolveSolRecordV1 = resolveSolRecordV1;
