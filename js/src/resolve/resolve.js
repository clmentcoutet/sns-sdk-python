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
exports.resolve = void 0;
const web3_js_1 = require("@solana/web3.js");
const getDomainKeySync_1 = require("../utils/getDomainKeySync");
const state_1 = require("../nft/state");
const const_1 = require("../nft/const");
const getRecordKeySync_1 = require("../record/getRecordKeySync");
const record_1 = require("../types/record");
const getRecordV2Key_1 = require("../record_v2/getRecordV2Key");
const sns_records_1 = require("@bonfida/sns-records");
const error_1 = require("../error");
const state_2 = require("../state");
const checkSolRecord_1 = require("../record/checkSolRecord");
const retrieveNftOwnerV2_1 = require("../nft/retrieveNftOwnerV2");
/**
 * Resolve function according to SNS-IP 5
 * @param connection
 * @param domain
 * @param config
 * @returns
 */
const resolve = (connection_1, domain_1, ...args_1) => __awaiter(void 0, [connection_1, domain_1, ...args_1], void 0, function* (connection, domain, config = { allowPda: false }) {
    var _a;
    const { pubkey } = (0, getDomainKeySync_1.getDomainKeySync)(domain);
    const [nftRecordKey] = state_1.NftRecord.findKeySync(pubkey, const_1.NAME_TOKENIZER_ID);
    const solRecordV1Key = (0, getRecordKeySync_1.getRecordKeySync)(domain, record_1.Record.SOL);
    const solRecordV2Key = (0, getRecordV2Key_1.getRecordV2Key)(domain, record_1.Record.SOL);
    const [nftRecordInfo, solRecordV1Info, solRecordV2Info, registryInfo] = yield connection.getMultipleAccountsInfo([
        nftRecordKey,
        solRecordV1Key,
        solRecordV2Key,
        pubkey,
    ]);
    if (!(registryInfo === null || registryInfo === void 0 ? void 0 : registryInfo.data)) {
        throw new error_1.DomainDoesNotExist(`Domain ${domain} does not exist`);
    }
    const registry = state_2.NameRegistryState.deserialize(registryInfo.data);
    // If NFT record active -> NFT owner is the owner
    if (nftRecordInfo === null || nftRecordInfo === void 0 ? void 0 : nftRecordInfo.data) {
        const nftRecord = state_1.NftRecord.deserialize(nftRecordInfo.data);
        if (nftRecord.tag === state_1.Tag.ActiveRecord) {
            const nftOwner = yield (0, retrieveNftOwnerV2_1.retrieveNftOwnerV2)(connection, pubkey);
            if (!nftOwner) {
                throw new error_1.CouldNotFindNftOwner();
            }
            return nftOwner;
        }
    }
    // Check SOL record V2
    recordV2: if (solRecordV2Info === null || solRecordV2Info === void 0 ? void 0 : solRecordV2Info.data) {
        const recordV2 = sns_records_1.Record.deserialize(solRecordV2Info.data);
        const stalenessId = recordV2.getStalenessId();
        const roaId = recordV2.getRoAId();
        const content = recordV2.getContent();
        if (content.length !== 32) {
            throw new error_1.RecordMalformed(`Record is malformed`);
        }
        console.log(recordV2.header.rightOfAssociationValidation);
        console.log(recordV2.header.stalenessValidation);
        console.log(sns_records_1.Validation.Solana);
        if (recordV2.header.rightOfAssociationValidation !== sns_records_1.Validation.Solana ||
            recordV2.header.stalenessValidation !== sns_records_1.Validation.Solana) {
            console.log("oui");
            throw new error_1.WrongValidation();
        }
        if (!stalenessId.equals(registry.owner.toBuffer())) {
            break recordV2;
        }
        if (roaId.equals(content)) {
            return new web3_js_1.PublicKey(content);
        }
        console.log("non");
        throw new error_1.InvalidRoAError(`The RoA ID shoudl be ${new web3_js_1.PublicKey(content).toBase58()} but is ${new web3_js_1.PublicKey(roaId).toBase58()} `);
    }
    // Check SOL record V1
    if (solRecordV1Info === null || solRecordV1Info === void 0 ? void 0 : solRecordV1Info.data) {
        const encoder = new TextEncoder();
        const expectedBuffer = Buffer.concat([
            solRecordV1Info.data.slice(state_2.NameRegistryState.HEADER_LEN, state_2.NameRegistryState.HEADER_LEN + 32),
            solRecordV1Key.toBuffer(),
        ]);
        const expected = encoder.encode(expectedBuffer.toString("hex"));
        const valid = (0, checkSolRecord_1.checkSolRecord)(expected, solRecordV1Info.data.slice(state_2.NameRegistryState.HEADER_LEN + 32, state_2.NameRegistryState.HEADER_LEN + 32 + web3_js_1.SIGNATURE_LENGTH_IN_BYTES), registry.owner);
        if (valid) {
            return new web3_js_1.PublicKey(solRecordV1Info.data.slice(state_2.NameRegistryState.HEADER_LEN, state_2.NameRegistryState.HEADER_LEN + 32));
        }
    }
    // Check if the registry owner is a PDA
    const isOnCurve = web3_js_1.PublicKey.isOnCurve(registry.owner);
    if (!isOnCurve) {
        if (config.allowPda === "any") {
            return registry.owner;
        }
        else if (config.allowPda) {
            const ownerInfo = yield connection.getAccountInfo(registry.owner);
            const isAllowed = (_a = config.programIds) === null || _a === void 0 ? void 0 : _a.some((e) => { var _a; return (_a = ownerInfo === null || ownerInfo === void 0 ? void 0 : ownerInfo.owner) === null || _a === void 0 ? void 0 : _a.equals(e); });
            if (isAllowed) {
                return registry.owner;
            }
            throw new error_1.PdaOwnerNotAllowed(`The Program ${ownerInfo === null || ownerInfo === void 0 ? void 0 : ownerInfo.owner.toBase58()} is not allowed`);
        }
        else {
            throw new error_1.PdaOwnerNotAllowed();
        }
    }
    return registry.owner;
});
exports.resolve = resolve;
