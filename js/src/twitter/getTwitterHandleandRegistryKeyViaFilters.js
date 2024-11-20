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
exports.getTwitterHandleandRegistryKeyViaFilters = void 0;
const borsh_1 = require("borsh");
const web3_js_1 = require("@solana/web3.js");
const constants_1 = require("../constants");
const state_1 = require("../state");
const error_1 = require("../error");
const ReverseTwitterRegistryState_1 = require("./ReverseTwitterRegistryState");
// Uses the RPC node filtering feature, execution speed may vary
function getTwitterHandleandRegistryKeyViaFilters(connection, verifiedPubkey) {
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
                    bytes: constants_1.TWITTER_VERIFICATION_AUTHORITY.toBase58(),
                },
            },
        ];
        const filteredAccounts = yield connection.getProgramAccounts(constants_1.NAME_PROGRAM_ID, { filters });
        for (const f of filteredAccounts) {
            if (f.account.data.length > state_1.NameRegistryState.HEADER_LEN + 32) {
                const data = f.account.data.slice(state_1.NameRegistryState.HEADER_LEN);
                const state = new ReverseTwitterRegistryState_1.ReverseTwitterRegistryState((0, borsh_1.deserialize)(ReverseTwitterRegistryState_1.ReverseTwitterRegistryState.schema, data));
                return [state.twitterHandle, new web3_js_1.PublicKey(state.twitterRegistryKey)];
            }
        }
        throw new error_1.AccountDoesNotExistError("The twitter account does not exist");
    });
}
exports.getTwitterHandleandRegistryKeyViaFilters = getTwitterHandleandRegistryKeyViaFilters;
