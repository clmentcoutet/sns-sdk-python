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
exports.getReverseKey = exports.getDomainKey = exports.performReverseLookupBatch = exports.performReverseLookup = exports.getNameAccountKey = exports.getHashedName = exports.getNameOwner = void 0;
const web3_js_1 = require("@solana/web3.js");
const sha256_1 = require("@noble/hashes/sha256");
const constants_1 = require("../constants");
const state_1 = require("../state");
const constants_2 = require("../constants");
const buffer_1 = require("buffer");
const error_1 = require("../error");
/**
 * @deprecated Use {@link resolve} instead
 */
function getNameOwner(connection, nameAccountKey) {
    return __awaiter(this, void 0, void 0, function* () {
        const nameAccount = yield connection.getAccountInfo(nameAccountKey);
        if (!nameAccount) {
            throw new error_1.AccountDoesNotExistError("The name account does exist");
        }
        return state_1.NameRegistryState.retrieve(connection, nameAccountKey);
    });
}
exports.getNameOwner = getNameOwner;
/**
 * @deprecated Use {@link getHashedNameSync} instead
 */
function getHashedName(name) {
    return __awaiter(this, void 0, void 0, function* () {
        const input = constants_1.HASH_PREFIX + name;
        const hashed = (0, sha256_1.sha256)(buffer_1.Buffer.from(input, "utf8"));
        return buffer_1.Buffer.from(hashed);
    });
}
exports.getHashedName = getHashedName;
/**
 * @deprecated Use {@link getNameAccountKeySync} instead
 */
function getNameAccountKey(hashed_name, nameClass, nameParent) {
    return __awaiter(this, void 0, void 0, function* () {
        const seeds = [hashed_name];
        if (nameClass) {
            seeds.push(nameClass.toBuffer());
        }
        else {
            seeds.push(buffer_1.Buffer.alloc(32));
        }
        if (nameParent) {
            seeds.push(nameParent.toBuffer());
        }
        else {
            seeds.push(buffer_1.Buffer.alloc(32));
        }
        const [nameAccountKey] = yield web3_js_1.PublicKey.findProgramAddress(seeds, constants_1.NAME_PROGRAM_ID);
        return nameAccountKey;
    });
}
exports.getNameAccountKey = getNameAccountKey;
/**
 * This function can be used to perform a reverse look up
 * @deprecated Use {@link reverseLookup} instead
 * @param connection The Solana RPC connection
 * @param nameAccount The public key of the domain to look up
 * @returns The human readable domain name
 */
function performReverseLookup(connection, nameAccount) {
    return __awaiter(this, void 0, void 0, function* () {
        const hashedReverseLookup = yield getHashedName(nameAccount.toBase58());
        const reverseLookupAccount = yield getNameAccountKey(hashedReverseLookup, constants_2.REVERSE_LOOKUP_CLASS);
        const { registry } = yield state_1.NameRegistryState.retrieve(connection, reverseLookupAccount);
        if (!registry.data) {
            throw new error_1.NoAccountDataError("The registry data is empty");
        }
        const nameLength = registry.data.slice(0, 4).readUInt32LE(0);
        return registry.data.slice(4, 4 + nameLength).toString();
    });
}
exports.performReverseLookup = performReverseLookup;
/**
 * This function can be used to perform a reverse look up
 * @deprecated Use {@link reverseLookupBatch} instead
 * @param connection The Solana RPC connection
 * @param nameAccount The public keys of the domains to look up
 * @returns The human readable domain names
 */
function performReverseLookupBatch(connection, nameAccounts) {
    return __awaiter(this, void 0, void 0, function* () {
        let reverseLookupAccounts = [];
        for (let nameAccount of nameAccounts) {
            const hashedReverseLookup = yield getHashedName(nameAccount.toBase58());
            const reverseLookupAccount = yield getNameAccountKey(hashedReverseLookup, constants_2.REVERSE_LOOKUP_CLASS);
            reverseLookupAccounts.push(reverseLookupAccount);
        }
        let names = yield state_1.NameRegistryState.retrieveBatch(connection, reverseLookupAccounts);
        return names.map((name) => {
            if (name === undefined || name.data === undefined) {
                return undefined;
            }
            const nameLength = name.data.slice(0, 4).readUInt32LE(0);
            return name.data.slice(4, 4 + nameLength).toString();
        });
    });
}
exports.performReverseLookupBatch = performReverseLookupBatch;
const _derive = (name_1, ...args_1) => __awaiter(void 0, [name_1, ...args_1], void 0, function* (name, parent = constants_1.ROOT_DOMAIN_ACCOUNT) {
    let hashed = yield getHashedName(name);
    let pubkey = yield getNameAccountKey(hashed, undefined, parent);
    return { pubkey, hashed };
});
/**
 * This function can be used to compute the public key of a domain or subdomain
 * @deprecated Use {@link getDomainKeySync} instead
 * @param domain The domain to compute the public key for (e.g `bonfida.sol`, `dex.bonfida.sol`)
 * @param record Optional parameter: If the domain being resolved is a record
 * @returns
 */
const getDomainKey = (domain_1, ...args_2) => __awaiter(void 0, [domain_1, ...args_2], void 0, function* (domain, record = false) {
    if (domain.endsWith(".sol")) {
        domain = domain.slice(0, -4);
    }
    const splitted = domain.split(".");
    if (splitted.length === 2) {
        const prefix = buffer_1.Buffer.from([record ? 1 : 0]).toString();
        const sub = prefix.concat(splitted[0]);
        const { pubkey: parentKey } = yield _derive(splitted[1]);
        const result = yield _derive(sub, parentKey);
        return Object.assign(Object.assign({}, result), { isSub: true, parent: parentKey });
    }
    else if (splitted.length === 3 && record) {
        // Parent key
        const { pubkey: parentKey } = yield _derive(splitted[2]);
        // Sub domain
        const { pubkey: subKey } = yield _derive("\0".concat(splitted[1]), parentKey);
        // Sub record
        const recordPrefix = buffer_1.Buffer.from([1]).toString();
        const result = yield _derive(recordPrefix.concat(splitted[0]), subKey);
        return Object.assign(Object.assign({}, result), { isSub: true, parent: parentKey, isSubRecord: true });
    }
    else if (splitted.length >= 3) {
        throw new error_1.InvalidInputError("The domain is malformed");
    }
    const result = yield _derive(domain, constants_1.ROOT_DOMAIN_ACCOUNT);
    return Object.assign(Object.assign({}, result), { isSub: false, parent: undefined });
});
exports.getDomainKey = getDomainKey;
/**
 * This function can be used to get the key of the reverse account
 * @deprecated Use {@link getReverseKeySync} instead
 * @param domain The domain to compute the reverse for
 * @param isSub Whether the domain is a subdomain or not
 * @returns The public key of the reverse account
 */
const getReverseKey = (domain, isSub) => __awaiter(void 0, void 0, void 0, function* () {
    const { pubkey, parent } = yield (0, exports.getDomainKey)(domain);
    const hashedReverseLookup = yield getHashedName(pubkey.toBase58());
    const reverseLookupAccount = yield getNameAccountKey(hashedReverseLookup, constants_2.REVERSE_LOOKUP_CLASS, isSub ? parent : undefined);
    return reverseLookupAccount;
});
exports.getReverseKey = getReverseKey;
