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
exports.changeVerifiedPubkey = void 0;
const constants_1 = require("../constants");
const deleteNameRegistry_1 = require("../bindings/deleteNameRegistry");
const transferInstruction_1 = require("../instructions/transferInstruction");
const getHashedNameSync_1 = require("../utils/getHashedNameSync");
const getNameAccountKeySync_1 = require("../utils/getNameAccountKeySync");
const createReverseTwitterRegistry_1 = require("./createReverseTwitterRegistry");
// Change the verified pubkey for a given twitter handle
// Signed by the Authority, the verified pubkey and the payer
function changeVerifiedPubkey(connection, twitterHandle, currentVerifiedPubkey, newVerifiedPubkey, payerKey) {
    return __awaiter(this, void 0, void 0, function* () {
        const hashedTwitterHandle = (0, getHashedNameSync_1.getHashedNameSync)(twitterHandle);
        const twitterHandleRegistryKey = (0, getNameAccountKeySync_1.getNameAccountKeySync)(hashedTwitterHandle, undefined, constants_1.TWITTER_ROOT_PARENT_REGISTRY_KEY);
        // Transfer the user-facing registry ownership
        let instructions = [
            (0, transferInstruction_1.transferInstruction)(constants_1.NAME_PROGRAM_ID, twitterHandleRegistryKey, newVerifiedPubkey, currentVerifiedPubkey, undefined),
        ];
        instructions.push(yield (0, deleteNameRegistry_1.deleteNameRegistry)(connection, currentVerifiedPubkey.toString(), payerKey, constants_1.TWITTER_VERIFICATION_AUTHORITY, constants_1.TWITTER_ROOT_PARENT_REGISTRY_KEY));
        // Create the new reverse registry
        instructions = instructions.concat(yield (0, createReverseTwitterRegistry_1.createReverseTwitterRegistry)(connection, twitterHandle, twitterHandleRegistryKey, newVerifiedPubkey, payerKey));
        return instructions;
    });
}
exports.changeVerifiedPubkey = changeVerifiedPubkey;
