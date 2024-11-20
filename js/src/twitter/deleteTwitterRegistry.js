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
exports.deleteTwitterRegistry = void 0;
const constants_1 = require("../constants");
const deleteInstruction_1 = require("../instructions/deleteInstruction");
const getHashedNameSync_1 = require("../utils/getHashedNameSync");
const getNameAccountKeySync_1 = require("../utils/getNameAccountKeySync");
// Delete the verified registry for a given twitter handle
// Signed by the verified pubkey
function deleteTwitterRegistry(twitterHandle, verifiedPubkey) {
    return __awaiter(this, void 0, void 0, function* () {
        const hashedTwitterHandle = (0, getHashedNameSync_1.getHashedNameSync)(twitterHandle);
        const twitterHandleRegistryKey = (0, getNameAccountKeySync_1.getNameAccountKeySync)(hashedTwitterHandle, undefined, constants_1.TWITTER_ROOT_PARENT_REGISTRY_KEY);
        const hashedVerifiedPubkey = (0, getHashedNameSync_1.getHashedNameSync)(verifiedPubkey.toString());
        const reverseRegistryKey = (0, getNameAccountKeySync_1.getNameAccountKeySync)(hashedVerifiedPubkey, constants_1.TWITTER_VERIFICATION_AUTHORITY, constants_1.TWITTER_ROOT_PARENT_REGISTRY_KEY);
        const instructions = [
            // Delete the user facing registry
            (0, deleteInstruction_1.deleteInstruction)(constants_1.NAME_PROGRAM_ID, twitterHandleRegistryKey, verifiedPubkey, verifiedPubkey),
            // Delete the reverse registry
            (0, deleteInstruction_1.deleteInstruction)(constants_1.NAME_PROGRAM_ID, reverseRegistryKey, verifiedPubkey, verifiedPubkey),
        ];
        return instructions;
    });
}
exports.deleteTwitterRegistry = deleteTwitterRegistry;
