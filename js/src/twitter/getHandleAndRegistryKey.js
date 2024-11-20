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
exports.getHandleAndRegistryKey = void 0;
const web3_js_1 = require("@solana/web3.js");
const constants_1 = require("../constants");
const getHashedNameSync_1 = require("../utils/getHashedNameSync");
const getNameAccountKeySync_1 = require("../utils/getNameAccountKeySync");
const ReverseTwitterRegistryState_1 = require("./ReverseTwitterRegistryState");
function getHandleAndRegistryKey(connection, verifiedPubkey) {
    return __awaiter(this, void 0, void 0, function* () {
        const hashedVerifiedPubkey = (0, getHashedNameSync_1.getHashedNameSync)(verifiedPubkey.toString());
        const reverseRegistryKey = (0, getNameAccountKeySync_1.getNameAccountKeySync)(hashedVerifiedPubkey, constants_1.TWITTER_VERIFICATION_AUTHORITY, constants_1.TWITTER_ROOT_PARENT_REGISTRY_KEY);
        let reverseRegistryState = yield ReverseTwitterRegistryState_1.ReverseTwitterRegistryState.retrieve(connection, reverseRegistryKey);
        return [
            reverseRegistryState.twitterHandle,
            new web3_js_1.PublicKey(reverseRegistryState.twitterRegistryKey),
        ];
    });
}
exports.getHandleAndRegistryKey = getHandleAndRegistryKey;
