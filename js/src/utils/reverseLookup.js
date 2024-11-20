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
exports.reverseLookup = void 0;
const state_1 = require("../state");
const error_1 = require("../error");
const deserializeReverse_1 = require("./deserializeReverse");
const getReverseKeyFromDomainKey_1 = require("./getReverseKeyFromDomainKey");
/**
 * This function can be used to perform a reverse look up
 * @param connection The Solana RPC connection
 * @param nameAccount The public key of the domain to look up
 * @returns The human readable domain name
 */
function reverseLookup(connection, nameAccount, parent) {
    return __awaiter(this, void 0, void 0, function* () {
        const reverseKey = (0, getReverseKeyFromDomainKey_1.getReverseKeyFromDomainKey)(nameAccount, parent);
        const { registry } = yield state_1.NameRegistryState.retrieve(connection, reverseKey);
        if (!registry.data) {
            throw new error_1.NoAccountDataError("The registry data is empty");
        }
        return (0, deserializeReverse_1.deserializeReverse)(registry.data, !!parent);
    });
}
exports.reverseLookup = reverseLookup;
