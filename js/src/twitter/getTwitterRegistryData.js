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
exports.getTwitterRegistryData = void 0;
const buffer_1 = require("buffer");
const web3_js_1 = require("@solana/web3.js");
const constants_1 = require("../constants");
const state_1 = require("../state");
const error_1 = require("../error");
// Uses the RPC node filtering feature, execution speed may vary
// Does not give you the handle, but is an alternative to getHandlesAndKeysFromVerifiedPubkey + getTwitterRegistry to get the data
function getTwitterRegistryData(connection, verifiedPubkey) {
    return __awaiter(this, void 0, void 0, function* () {
        const filters = [
            {
                memcmp: {
                    offset: 0,
                    bytes: constants_1.TWITTER_ROOT_PARENT_REGISTRY_KEY.toBase58(),
                },
            },
            {
                memcmp: {
                    offset: 32,
                    bytes: verifiedPubkey.toBase58(),
                },
            },
            {
                memcmp: {
                    offset: 64,
                    bytes: new web3_js_1.PublicKey(buffer_1.Buffer.alloc(32, 0)).toBase58(),
                },
            },
        ];
        const filteredAccounts = yield connection.getProgramAccounts(constants_1.NAME_PROGRAM_ID, { filters });
        if (filteredAccounts.length > 1) {
            throw new error_1.MultipleRegistriesError("More than 1 accounts were found");
        }
        return filteredAccounts[0].account.data.slice(state_1.NameRegistryState.HEADER_LEN);
    });
}
exports.getTwitterRegistryData = getTwitterRegistryData;
