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
exports.createSubdomain = void 0;
const state_1 = require("../state");
const getDomainKeySync_1 = require("../utils/getDomainKeySync");
const getReverseKeySync_1 = require("../utils/getReverseKeySync");
const error_1 = require("../error");
const createNameRegistry_1 = require("./createNameRegistry");
const createReverseName_1 = require("./createReverseName");
/**
 * This function can be used to create a subdomain
 * @param connection The Solana RPC connection object
 * @param subdomain The subdomain to create with or without .sol e.g something.bonfida.sol or something.bonfida
 * @param owner The owner of the parent domain creating the subdomain
 * @param space The space to allocate to the subdomain (defaults to 2kb)
 * @param feePayer Optional: Specifies a fee payer different from the parent owner
 */
const createSubdomain = (connection_1, subdomain_1, owner_1, ...args_1) => __awaiter(void 0, [connection_1, subdomain_1, owner_1, ...args_1], void 0, function* (connection, subdomain, owner, space = 2000, feePayer) {
    const ixs = [];
    const sub = subdomain.split(".")[0];
    if (!sub) {
        throw new error_1.InvalidDomainError("The subdomain name is malformed");
    }
    const { parent, pubkey } = (0, getDomainKeySync_1.getDomainKeySync)(subdomain);
    // Space allocated to the subdomains
    const lamports = yield connection.getMinimumBalanceForRentExemption(space + state_1.NameRegistryState.HEADER_LEN);
    const ix_create = yield (0, createNameRegistry_1.createNameRegistry)(connection, "\0".concat(sub), space, // Hardcode space to 2kB
    feePayer || owner, owner, lamports, undefined, parent);
    ixs.push(ix_create);
    // Create the reverse name
    const reverseKey = (0, getReverseKeySync_1.getReverseKeySync)(subdomain, true);
    const info = yield connection.getAccountInfo(reverseKey);
    if (!(info === null || info === void 0 ? void 0 : info.data)) {
        const ix_reverse = yield (0, createReverseName_1.createReverseName)(pubkey, "\0".concat(sub), feePayer || owner, parent, owner);
        ixs.push(...ix_reverse);
    }
    return ixs;
});
exports.createSubdomain = createSubdomain;
