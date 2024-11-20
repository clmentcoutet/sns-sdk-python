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
exports.createReverseName = void 0;
const web3_js_1 = require("@solana/web3.js");
const createReverseInstruction_1 = require("../instructions/createReverseInstruction");
const constants_1 = require("../constants");
const getHashedNameSync_1 = require("../utils/getHashedNameSync");
const getNameAccountKeySync_1 = require("../utils/getNameAccountKeySync");
/**
 *
 * @param nameAccount The name account to create the reverse account for
 * @param name The name of the domain
 * @param feePayer The fee payer of the transaction
 * @param parentName The parent name account
 * @param parentNameOwner The parent name owner
 * @returns
 */
const createReverseName = (nameAccount, name, feePayer, parentName, parentNameOwner) => __awaiter(void 0, void 0, void 0, function* () {
    let hashedReverseLookup = (0, getHashedNameSync_1.getHashedNameSync)(nameAccount.toBase58());
    let reverseLookupAccount = (0, getNameAccountKeySync_1.getNameAccountKeySync)(hashedReverseLookup, constants_1.CENTRAL_STATE, parentName);
    let initCentralStateInstruction = new createReverseInstruction_1.createReverseInstruction({
        name,
    }).getInstruction(constants_1.REGISTER_PROGRAM_ID, constants_1.NAME_PROGRAM_ID, constants_1.ROOT_DOMAIN_ACCOUNT, reverseLookupAccount, web3_js_1.SystemProgram.programId, constants_1.CENTRAL_STATE, feePayer, web3_js_1.SYSVAR_RENT_PUBKEY, parentName, parentNameOwner);
    let instructions = [initCentralStateInstruction];
    return instructions;
});
exports.createReverseName = createReverseName;
