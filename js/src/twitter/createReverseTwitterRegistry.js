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
exports.createReverseTwitterRegistry = void 0;
const borsh_1 = require("borsh");
const buffer_1 = require("buffer");
const web3_js_1 = require("@solana/web3.js");
const constants_1 = require("../constants");
const createInstruction_1 = require("../instructions/createInstruction");
const updateInstruction_1 = require("../instructions/updateInstruction");
const state_1 = require("../state");
const getHashedNameSync_1 = require("../utils/getHashedNameSync");
const getNameAccountKeySync_1 = require("../utils/getNameAccountKeySync");
const int_1 = require("../int");
const ReverseTwitterRegistryState_1 = require("./ReverseTwitterRegistryState");
function createReverseTwitterRegistry(connection, twitterHandle, twitterRegistryKey, verifiedPubkey, payerKey) {
    return __awaiter(this, void 0, void 0, function* () {
        // Create the reverse lookup registry
        const hashedVerifiedPubkey = (0, getHashedNameSync_1.getHashedNameSync)(verifiedPubkey.toString());
        const reverseRegistryKey = (0, getNameAccountKeySync_1.getNameAccountKeySync)(hashedVerifiedPubkey, constants_1.TWITTER_VERIFICATION_AUTHORITY, constants_1.TWITTER_ROOT_PARENT_REGISTRY_KEY);
        let reverseTwitterRegistryStateBuff = (0, borsh_1.serialize)(ReverseTwitterRegistryState_1.ReverseTwitterRegistryState.schema, new ReverseTwitterRegistryState_1.ReverseTwitterRegistryState({
            twitterRegistryKey: twitterRegistryKey.toBytes(),
            twitterHandle,
        }));
        return [
            (0, createInstruction_1.createInstruction)(constants_1.NAME_PROGRAM_ID, web3_js_1.SystemProgram.programId, reverseRegistryKey, verifiedPubkey, payerKey, hashedVerifiedPubkey, new int_1.Numberu64(yield connection.getMinimumBalanceForRentExemption(reverseTwitterRegistryStateBuff.length + state_1.NameRegistryState.HEADER_LEN)), new int_1.Numberu32(reverseTwitterRegistryStateBuff.length), constants_1.TWITTER_VERIFICATION_AUTHORITY, // Twitter authority acts as class for all reverse-lookup registries
            constants_1.TWITTER_ROOT_PARENT_REGISTRY_KEY, // Reverse registries are also children of the root
            constants_1.TWITTER_VERIFICATION_AUTHORITY),
            (0, updateInstruction_1.updateInstruction)(constants_1.NAME_PROGRAM_ID, reverseRegistryKey, new int_1.Numberu32(0), buffer_1.Buffer.from(reverseTwitterRegistryStateBuff), constants_1.TWITTER_VERIFICATION_AUTHORITY),
        ];
    });
}
exports.createReverseTwitterRegistry = createReverseTwitterRegistry;
