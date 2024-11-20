"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReverseKeySync = void 0;
const constants_1 = require("../constants");
const getHashedNameSync_1 = require("./getHashedNameSync");
const getNameAccountKeySync_1 = require("./getNameAccountKeySync");
const getDomainKeySync_1 = require("./getDomainKeySync");
/**
 * This function can be used to get the key of the reverse account
 * @param domain The domain to compute the reverse for
 * @param isSub Whether the domain is a subdomain or not
 * @returns The public key of the reverse account
 */
const getReverseKeySync = (domain, isSub) => {
    const { pubkey, parent } = (0, getDomainKeySync_1.getDomainKeySync)(domain);
    const hashedReverseLookup = (0, getHashedNameSync_1.getHashedNameSync)(pubkey.toBase58());
    const reverseLookupAccount = (0, getNameAccountKeySync_1.getNameAccountKeySync)(hashedReverseLookup, constants_1.REVERSE_LOOKUP_CLASS, isSub ? parent : undefined);
    return reverseLookupAccount;
};
exports.getReverseKeySync = getReverseKeySync;
