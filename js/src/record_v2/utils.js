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
exports.verifyStaleness = void 0;
const web3_js_1 = require("@solana/web3.js");
const getRecordV2Key_1 = require("./getRecordV2Key");
const sns_records_1 = require("@bonfida/sns-records");
const state_1 = require("../state");
const getDomainKeySync_1 = require("../utils/getDomainKeySync");
/**
 * This function verifies the staleness of a record.
 * @param {Connection} connection - The Solana RPC connection object
 * @param {Record} record - The record to be verified.
 * @param {string} domain - The domain associated with the record.
 * @returns {Promise<boolean>} - Returns a promise that resolves to a boolean indicating whether the record is stale.
 */
const verifyStaleness = (connection, record, domain) => __awaiter(void 0, void 0, void 0, function* () {
    const recordKey = (0, getRecordV2Key_1.getRecordV2Key)(domain, record);
    const { registry, nftOwner } = yield state_1.NameRegistryState.retrieve(connection, (0, getDomainKeySync_1.getDomainKeySync)(domain).pubkey);
    const owner = nftOwner || registry.owner;
    const recordObj = yield sns_records_1.Record.retrieve(connection, recordKey);
    const stalenessId = recordObj.getStalenessId();
    return ((owner === null || owner === void 0 ? void 0 : owner.equals(new web3_js_1.PublicKey(stalenessId))) &&
        recordObj.header.stalenessValidation === sns_records_1.Validation.Solana);
});
exports.verifyStaleness = verifyStaleness;
