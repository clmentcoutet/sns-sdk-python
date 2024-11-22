"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDomainKeySync = void 0;
const constants_1 = require("../constants");
const buffer_1 = require("buffer");
const sns_records_1 = require("@bonfida/sns-records");
const record_1 = require("../types/record");
const error_1 = require("../error");
const getHashedNameSync_1 = require("./getHashedNameSync");
const getNameAccountKeySync_1 = require("./getNameAccountKeySync");
const _deriveSync = (name, parent = constants_1.ROOT_DOMAIN_ACCOUNT, classKey) => {
    let hashed = (0, getHashedNameSync_1.getHashedNameSync)(name);
    let pubkey = (0, getNameAccountKeySync_1.getNameAccountKeySync)(hashed, classKey, parent);
    return { pubkey, hashed };
};
/**
 * This function can be used to compute the public key of a domain or subdomain
 * @param domain The domain to compute the public key for (e.g `bonfida.sol`, `dex.bonfida.sol`)
 * @param record Optional parameter: If the domain being resolved is a record
 * @returns
 */
const getDomainKeySync = (domain, record) => {
    if (domain.endsWith(".sol")) {
        domain = domain.slice(0, -4);
    }
    const recordClass = record === record_1.RecordVersion.V2 ? sns_records_1.CENTRAL_STATE_SNS_RECORDS : undefined;
    const splitted = domain.split(".");
    if (splitted.length === 2) {
        const prefix = buffer_1.Buffer.from([record ? record : 0]).toString();
        const sub = prefix.concat(splitted[0]);
        const { pubkey: parentKey } = _deriveSync(splitted[1]);
        const result = _deriveSync(sub, parentKey, recordClass);
        return Object.assign(Object.assign({}, result), { isSub: true, parent: parentKey });
    }
    else if (splitted.length === 3 && !!record) {
        // Parent key
        const { pubkey: parentKey } = _deriveSync(splitted[2]);
        // Sub domain
        const { pubkey: subKey } = _deriveSync("\0".concat(splitted[1]), parentKey);
        // Sub record
        const recordPrefix = record === record_1.RecordVersion.V2 ? `\x02` : `\x01`;
        const result = _deriveSync(recordPrefix.concat(splitted[0]), subKey, recordClass);
        console.log("result:", result);
        return Object.assign(Object.assign({}, result), { isSub: true, parent: parentKey, isSubRecord: true });
    }
    else if (splitted.length >= 3) {
        throw new error_1.InvalidInputError("The domain is malformed");
    }
    const result = _deriveSync(domain, constants_1.ROOT_DOMAIN_ACCOUNT);
    return Object.assign(Object.assign({}, result), { isSub: false, parent: undefined });
};
exports.getDomainKeySync = getDomainKeySync;
