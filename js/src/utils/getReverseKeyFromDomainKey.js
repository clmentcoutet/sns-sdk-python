"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReverseKeyFromDomainKey = void 0;
const constants_1 = require("../constants");
const getHashedNameSync_1 = require("./getHashedNameSync");
const getNameAccountKeySync_1 = require("./getNameAccountKeySync");
/**
 * This function can be used to get the reverse key from a domain key
 * @param domainKey The domain key to compute the reverse for
 * @param parent The parent public key
 * @returns The public key of the reverse account
 */
const getReverseKeyFromDomainKey = (domainKey, parent) => {
    const hashedReverseLookup = (0, getHashedNameSync_1.getHashedNameSync)(domainKey.toBase58());
    const reverseLookupAccount = (0, getNameAccountKeySync_1.getNameAccountKeySync)(hashedReverseLookup, constants_1.REVERSE_LOOKUP_CLASS, parent);
    return reverseLookupAccount;
};
exports.getReverseKeyFromDomainKey = getReverseKeyFromDomainKey;
