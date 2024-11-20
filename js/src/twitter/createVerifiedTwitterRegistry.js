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
exports.createVerifiedTwitterRegistry = void 0;
const web3_js_1 = require("@solana/web3.js");
const constants_1 = require("../constants");
const createInstruction_1 = require("../instructions/createInstruction");
const state_1 = require("../state");
const getHashedNameSync_1 = require("../utils/getHashedNameSync");
const getNameAccountKeySync_1 = require("../utils/getNameAccountKeySync");
const int_1 = require("../int");
const createReverseTwitterRegistry_1 = require("./createReverseTwitterRegistry");
// Signed by the authority, the payer and the verified pubkey
function createVerifiedTwitterRegistry(connection, twitterHandle, verifiedPubkey, space, // The space that the user will have to write data into the verified registry
payerKey) {
    return __awaiter(this, void 0, void 0, function* () {
        // Create user facing registry
        const hashedTwitterHandle = (0, getHashedNameSync_1.getHashedNameSync)(twitterHandle);
        const twitterHandleRegistryKey = (0, getNameAccountKeySync_1.getNameAccountKeySync)(hashedTwitterHandle, undefined, constants_1.TWITTER_ROOT_PARENT_REGISTRY_KEY);
        const lamports = yield connection.getMinimumBalanceForRentExemption(space + state_1.NameRegistryState.HEADER_LEN);
        let instructions = [
            (0, createInstruction_1.createInstruction)(constants_1.NAME_PROGRAM_ID, web3_js_1.SystemProgram.programId, twitterHandleRegistryKey, verifiedPubkey, payerKey, hashedTwitterHandle, new int_1.Numberu64(lamports), new int_1.Numberu32(space), undefined, constants_1.TWITTER_ROOT_PARENT_REGISTRY_KEY, constants_1.TWITTER_VERIFICATION_AUTHORITY),
        ];
        instructions = instructions.concat(yield (0, createReverseTwitterRegistry_1.createReverseTwitterRegistry)(connection, twitterHandle, twitterHandleRegistryKey, verifiedPubkey, payerKey));
        return instructions;
    });
}
exports.createVerifiedTwitterRegistry = createVerifiedTwitterRegistry;
