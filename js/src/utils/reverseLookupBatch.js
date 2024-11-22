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
exports.reverseLookupBatch = void 0;
const state_1 = require("../state");
const deserializeReverse_1 = require("./deserializeReverse");
const getReverseKeyFromDomainKey_1 = require("./getReverseKeyFromDomainKey");
/**
 * This function can be used to perform a reverse look up
 * @param connection The Solana RPC connection
 * @param nameAccounts The public keys of the domains to look up
 * @returns The human readable domain names
 */
function reverseLookupBatch(connection, nameAccounts) {
    return __awaiter(this, void 0, void 0, function* () {
        let reverseLookupAccounts = [];
        for (let nameAccount of nameAccounts) {
            reverseLookupAccounts.push((0, getReverseKeyFromDomainKey_1.getReverseKeyFromDomainKey)(nameAccount));
        }
        let names = yield state_1.NameRegistryState.retrieveBatch(connection, reverseLookupAccounts);
        return names.map((name) => {
            if (name === undefined || name.data === undefined) {
                return undefined;
            }
            return (0, deserializeReverse_1.deserializeReverse)(name.data);
        });
    });
}
exports.reverseLookupBatch = reverseLookupBatch;
