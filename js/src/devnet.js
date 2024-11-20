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
exports.devnet = void 0;
const buffer_1 = require("buffer");
const web3_js_1 = require("@solana/web3.js");
const createInstruction_1 = require("./instructions/createInstruction");
const deleteInstruction_1 = require("./instructions/deleteInstruction");
const transferInstruction_1 = require("./instructions/transferInstruction");
const updateInstruction_1 = require("./instructions/updateInstruction");
const createReverseInstruction_1 = require("./instructions/createReverseInstruction");
const createInstructionV3_1 = require("./instructions/createInstructionV3");
const burnInstruction_1 = require("./instructions/burnInstruction");
const createSplitV2Instruction_1 = require("./instructions/createSplitV2Instruction");
const state_1 = require("./state");
const int_1 = require("./int");
const utils_1 = require("./deprecated/utils");
const spl_token_1 = require("@solana/spl-token");
const error_1 = require("./error");
const deserializeReverse_1 = require("./utils/deserializeReverse");
const getHashedNameSync_1 = require("./utils/getHashedNameSync");
const getPythFeedAccountKey_1 = require("./utils/getPythFeedAccountKey");
const constants_1 = require("./constants");
const constants = {
    /**
     * The Solana Name Service program ID
     */
    NAME_PROGRAM_ID: new web3_js_1.PublicKey("namesLPneVptA9Z5rqUDD9tMTWEJwofgaYwp8cawRkX"),
    /**
     * Hash prefix used to derive domain name addresses
     */
    HASH_PREFIX: "SPL Name Service",
    /**
     * The `.sol` TLD
     */
    ROOT_DOMAIN_ACCOUNT: new web3_js_1.PublicKey("5eoDkP6vCQBXqDV9YN2NdUs3nmML3dMRNmEYpiyVNBm2"),
    /**
     * The Registry program ID
     */
    REGISTER_PROGRAM_ID: new web3_js_1.PublicKey("snshBoEQ9jx4QoHBpZDQPYdNCtw7RMxJvYrKFEhwaPJ"),
    /**
     * The reverse look up class
     */
    REVERSE_LOOKUP_CLASS: new web3_js_1.PublicKey("7NbD1vprif6apthEZAqhRfYuhrqnuderB8qpnfXGCc8H"),
    USDC_MINT: new web3_js_1.PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"),
    REFERRERS: [
        new web3_js_1.PublicKey("3ogYncmMM5CmytsGCqKHydmXmKUZ6sGWvizkzqwT7zb1"), // Test wallet,
    ],
    TOKENS_SYM_MINT: new Map([
        ["4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU", "USDC"],
        ["EJwZgeZrdC8TXTQbQBoL6bfuAnFUUy1PVCMB4DYPzVaS", "USDT"],
        ["So11111111111111111111111111111111111111112", "SOL"],
        ["fidaWCioBQjieRrUQDxxS5Uxmq1CLi2VuVRyv4dEBey", "FIDA"],
        ["DL4ivZm3NVHWk9ZvtcqTchxoKArDK4rT3vbDx2gYVr7P", "INJ"],
    ]),
    PYTH_FEEDS: new Map([
        [
            "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
            {
                price: "5SSkXsEKQepHHAewytPVwdej4epN1nxgLVM84L4KXgy7",
                product: "6NpdXrQEpmDZ3jZKmM2rhdmkd3H6QAk23j2x8bkXcHKA",
            },
        ],
        [
            "EJwZgeZrdC8TXTQbQBoL6bfuAnFUUy1PVCMB4DYPzVaS",
            {
                price: "38xoQ4oeJCBrcVvca2cGk7iV1dAfrmTR1kmhSCJQ8Jto",
                product: "C5wDxND9E61RZ1wZhaSTWkoA8udumaHnoQY6BBsiaVpn",
            },
        ],
        [
            "So11111111111111111111111111111111111111112",
            {
                price: "J83w4HKfqxwcq3BEMMkPFSppX3gqekLyLJBexebFVkix",
                product: "3Mnn2fX6rQyUsyELYms1sBJyChWofzSNRoqYzvgMVz5E",
            },
        ],
        [
            "EchesyfXePKdLtoiZSL8pBe8Myagyy8ZRqsACNCFGnvp",
            {
                price: "7teETxN9Y8VK6uJxsctHEwST75mKLLwPH1jaFdvTQCpD",
                product: "5kWV4bhHeZANzg5MWaYCQYEEKHjur5uz1mu5vuLHwiLB",
            },
        ],
        [
            "DL4ivZm3NVHWk9ZvtcqTchxoKArDK4rT3vbDx2gYVr7P",
            {
                price: "44uRsNnT35kjkscSu59MxRr9CfkLZWf6gny8bWqUbVxE",
                product: "7UHB783Nh4avW3Yw9yoktf2KjxipU56KPahA51RnCCYE",
            },
        ],
    ]),
    PYTH_MAPPING_ACC: new web3_js_1.PublicKey("BmA9Z6FjioHJPpjT39QazZyhDRUdZy2ezwx4GiDdE2u2"),
    VAULT_OWNER: new web3_js_1.PublicKey("SNSaTJbEv2iT3CUrCQYa9zpGjbBVWhFCPaSJHkaJX34"),
};
const getNameAccountKeySync = (hashed_name, nameClass, nameParent) => {
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
    const [nameAccountKey] = web3_js_1.PublicKey.findProgramAddressSync(seeds, constants.NAME_PROGRAM_ID);
    return nameAccountKey;
};
const reverseLookup = (connection, nameAccount) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedReverseLookup = (0, getHashedNameSync_1.getHashedNameSync)(nameAccount.toBase58());
    const reverseLookupAccount = getNameAccountKeySync(hashedReverseLookup, constants.REVERSE_LOOKUP_CLASS);
    const { registry } = yield state_1.NameRegistryState.retrieve(connection, reverseLookupAccount);
    if (!registry.data) {
        throw new error_1.NoAccountDataError("The registry data is empty");
    }
    return (0, deserializeReverse_1.deserializeReverse)(registry.data);
});
const _deriveSync = (name, parent = constants.ROOT_DOMAIN_ACCOUNT, classKey) => {
    let hashed = (0, getHashedNameSync_1.getHashedNameSync)(name);
    let pubkey = getNameAccountKeySync(hashed, classKey, parent);
    return { pubkey, hashed };
};
const getDomainKeySync = (domain) => {
    if (domain.endsWith(".sol")) {
        domain = domain.slice(0, -4);
    }
    const splitted = domain.split(".");
    if (splitted.length === 2) {
        const prefix = "\0";
        const sub = prefix.concat(splitted[0]);
        const { pubkey: parentKey } = _deriveSync(splitted[1]);
        const result = _deriveSync(sub, parentKey);
        return Object.assign(Object.assign({}, result), { isSub: true, parent: parentKey });
    }
    else if (splitted.length >= 3) {
        throw new error_1.InvalidInputError("The domain is malformed");
    }
    const result = _deriveSync(domain, constants.ROOT_DOMAIN_ACCOUNT);
    return Object.assign(Object.assign({}, result), { isSub: false, parent: undefined });
};
const getReverseKeySync = (domain, isSub) => {
    const { pubkey, parent } = getDomainKeySync(domain);
    const hashedReverseLookup = (0, getHashedNameSync_1.getHashedNameSync)(pubkey.toBase58());
    const reverseLookupAccount = getNameAccountKeySync(hashedReverseLookup, constants.REVERSE_LOOKUP_CLASS, isSub ? parent : undefined);
    return reverseLookupAccount;
};
/**
 * Creates a name account with the given rent budget, allocated space, owner and class.
 *
 * @param connection The solana connection object to the RPC node
 * @param name The name of the new account
 * @param space The space in bytes allocated to the account
 * @param payerKey The allocation cost payer
 * @param nameOwner The pubkey to be set as owner of the new name account
 * @param lamports The budget to be set for the name account. If not specified, it'll be the minimum for rent exemption
 * @param nameClass The class of this new name
 * @param parentName The parent name of the new name. If specified its owner needs to sign
 * @returns
 */
function createNameRegistry(connection, name, space, payerKey, nameOwner, lamports, nameClass, parentName) {
    return __awaiter(this, void 0, void 0, function* () {
        const hashed_name = yield (0, utils_1.getHashedName)(name);
        const nameAccountKey = yield getNameAccountKeySync(hashed_name, nameClass, parentName);
        const balance = lamports
            ? lamports
            : yield connection.getMinimumBalanceForRentExemption(space);
        let nameParentOwner;
        if (parentName) {
            const { registry: parentAccount } = yield (0, utils_1.getNameOwner)(connection, parentName);
            nameParentOwner = parentAccount.owner;
        }
        const createNameInstr = (0, createInstruction_1.createInstruction)(constants.NAME_PROGRAM_ID, web3_js_1.SystemProgram.programId, nameAccountKey, nameOwner, payerKey, hashed_name, new int_1.Numberu64(balance), new int_1.Numberu32(space), nameClass, parentName, nameParentOwner);
        return createNameInstr;
    });
}
/**
 * Overwrite the data of the given name registry.
 *
 * @param connection The solana connection object to the RPC node
 * @param name The name of the name registry to update
 * @param offset The offset to which the data should be written into the registry
 * @param input_data The data to be written
 * @param nameClass The class of this name, if it exsists
 * @param nameParent The parent name of this name, if it exists
 */
function updateNameRegistryData(connection, name, offset, input_data, nameClass, nameParent) {
    return __awaiter(this, void 0, void 0, function* () {
        const hashed_name = yield (0, utils_1.getHashedName)(name);
        const nameAccountKey = getNameAccountKeySync(hashed_name, nameClass, nameParent);
        let signer;
        if (nameClass) {
            signer = nameClass;
        }
        else {
            signer = (yield state_1.NameRegistryState.retrieve(connection, nameAccountKey))
                .registry.owner;
        }
        const updateInstr = (0, updateInstruction_1.updateInstruction)(constants.NAME_PROGRAM_ID, nameAccountKey, new int_1.Numberu32(offset), input_data, signer);
        return updateInstr;
    });
}
/**
 * Change the owner of a given name account.
 *
 * @param connection The solana connection object to the RPC node
 * @param name The name of the name account
 * @param newOwner The new owner to be set
 * @param nameClass The class of this name, if it exsists
 * @param nameParent The parent name of this name, if it exists
 * @param parentOwner Parent name owner
 * @returns
 */
function transferNameOwnership(connection, name, newOwner, nameClass, nameParent, parentOwner) {
    return __awaiter(this, void 0, void 0, function* () {
        const hashed_name = yield (0, utils_1.getHashedName)(name);
        const nameAccountKey = getNameAccountKeySync(hashed_name, nameClass, nameParent);
        let curentNameOwner;
        if (nameClass) {
            curentNameOwner = nameClass;
        }
        else {
            curentNameOwner = (yield state_1.NameRegistryState.retrieve(connection, nameAccountKey)).registry.owner;
        }
        const transferInstr = (0, transferInstruction_1.transferInstruction)(constants.NAME_PROGRAM_ID, nameAccountKey, newOwner, curentNameOwner, nameClass, nameParent, parentOwner);
        return transferInstr;
    });
}
/**
 * Delete the name account and transfer the rent to the target.
 *
 * @param connection The solana connection object to the RPC node
 * @param name The name of the name account
 * @param refundTargetKey The refund destination address
 * @param nameClass The class of this name, if it exsists
 * @param nameParent The parent name of this name, if it exists
 * @returns
 */
function deleteNameRegistry(connection, name, refundTargetKey, nameClass, nameParent) {
    return __awaiter(this, void 0, void 0, function* () {
        const hashed_name = yield (0, utils_1.getHashedName)(name);
        const nameAccountKey = getNameAccountKeySync(hashed_name, nameClass, nameParent);
        let nameOwner;
        if (nameClass) {
            nameOwner = nameClass;
        }
        else {
            nameOwner = (yield state_1.NameRegistryState.retrieve(connection, nameAccountKey))
                .registry.owner;
        }
        const changeAuthoritiesInstr = (0, deleteInstruction_1.deleteInstruction)(constants.NAME_PROGRAM_ID, nameAccountKey, refundTargetKey, nameOwner);
        return changeAuthoritiesInstr;
    });
}
/**
 * @deprecated This function is deprecated and will be removed in future releases. Use `registerDomainNameV2` instead.
 * This function can be used to register a .sol domain
 * @param connection The Solana RPC connection object
 * @param name The domain name to register e.g bonfida if you want to register bonfida.sol
 * @param space The domain name account size (max 10kB)
 * @param buyer The public key of the buyer
 * @param buyerTokenAccount The buyer token account (USDC)
 * @param mint Optional mint used to purchase the domain, defaults to USDC
 * @param referrerKey Optional referrer key
 * @returns
 */
const registerDomainName = (connection_1, name_1, space_1, buyer_1, buyerTokenAccount_1, ...args_1) => __awaiter(void 0, [connection_1, name_1, space_1, buyer_1, buyerTokenAccount_1, ...args_1], void 0, function* (connection, name, space, buyer, buyerTokenAccount, mint = constants.USDC_MINT, referrerKey) {
    // Basic validation
    if (name.includes(".") || name.trim().toLowerCase() !== name) {
        throw new error_1.InvalidDomainError("The domain is malformed");
    }
    const [cs] = web3_js_1.PublicKey.findProgramAddressSync([constants.REGISTER_PROGRAM_ID.toBuffer()], constants.REGISTER_PROGRAM_ID);
    const hashed = (0, getHashedNameSync_1.getHashedNameSync)(name);
    const nameAccount = getNameAccountKeySync(hashed, undefined, constants.ROOT_DOMAIN_ACCOUNT);
    const hashedReverseLookup = (0, getHashedNameSync_1.getHashedNameSync)(nameAccount.toBase58());
    const reverseLookupAccount = getNameAccountKeySync(hashedReverseLookup, cs);
    const [derived_state] = web3_js_1.PublicKey.findProgramAddressSync([nameAccount.toBuffer()], constants.REGISTER_PROGRAM_ID);
    const refIdx = constants.REFERRERS.findIndex((e) => referrerKey === null || referrerKey === void 0 ? void 0 : referrerKey.equals(e));
    let refTokenAccount = undefined;
    const ixs = [];
    if (refIdx !== -1 && !!referrerKey) {
        refTokenAccount = (0, spl_token_1.getAssociatedTokenAddressSync)(mint, referrerKey, true);
        const acc = yield connection.getAccountInfo(refTokenAccount);
        if (!(acc === null || acc === void 0 ? void 0 : acc.data)) {
            const ix = (0, spl_token_1.createAssociatedTokenAccountIdempotentInstruction)(buyer, refTokenAccount, referrerKey, mint);
            ixs.push(ix);
        }
    }
    const vault = (0, spl_token_1.getAssociatedTokenAddressSync)(mint, constants.VAULT_OWNER);
    const pythFeed = exports.devnet.constants.PYTH_FEEDS.get(mint.toBase58());
    if (!pythFeed) {
        throw new error_1.PythFeedNotFoundError("The Pyth account for the provided mint was not found");
    }
    const ix = new createInstructionV3_1.createInstructionV3({
        name,
        space,
        referrerIdxOpt: refIdx != -1 ? refIdx : null,
    }).getInstruction(constants.REGISTER_PROGRAM_ID, constants.NAME_PROGRAM_ID, constants.ROOT_DOMAIN_ACCOUNT, nameAccount, reverseLookupAccount, web3_js_1.SystemProgram.programId, cs, buyer, buyerTokenAccount, constants.PYTH_MAPPING_ACC, new web3_js_1.PublicKey(pythFeed.product), new web3_js_1.PublicKey(pythFeed.price), vault, spl_token_1.TOKEN_PROGRAM_ID, web3_js_1.SYSVAR_RENT_PUBKEY, derived_state, refTokenAccount);
    ixs.push(ix);
    return [[], ixs];
});
/**
 *
 * @param nameAccount The name account to create the reverse account for
 * @param name The name of the domain
 * @param feePayer The fee payer of the transaction
 * @param parentName The parent name account
 * @param parentNameOwner The parent name owner
 * @returns
 */
const createReverseName = (nameAccount, name, feePayer, parentName, parentNameOwner) => __awaiter(void 0, void 0, void 0, function* () {
    let [centralState] = yield web3_js_1.PublicKey.findProgramAddress([constants.REGISTER_PROGRAM_ID.toBuffer()], constants.REGISTER_PROGRAM_ID);
    let hashedReverseLookup = yield (0, utils_1.getHashedName)(nameAccount.toBase58());
    let reverseLookupAccount = getNameAccountKeySync(hashedReverseLookup, centralState, parentName);
    let initCentralStateInstruction = new createReverseInstruction_1.createReverseInstruction({
        name,
    }).getInstruction(constants.REGISTER_PROGRAM_ID, constants.NAME_PROGRAM_ID, constants.ROOT_DOMAIN_ACCOUNT, reverseLookupAccount, web3_js_1.SystemProgram.programId, centralState, feePayer, web3_js_1.SYSVAR_RENT_PUBKEY, parentName, parentNameOwner);
    let instructions = [initCentralStateInstruction];
    return [[], instructions];
});
/**
 * This function can be used to create a subdomain
 * @param connection The Solana RPC connection object
 * @param subdomain The subdomain to create with or without .sol e.g something.bonfida.sol or something.bonfida
 * @param owner The owner of the parent domain creating the subdomain
 * @param space The space to allocate to the subdomain (defaults to 2kb)
 */
const createSubdomain = (connection_2, subdomain_1, owner_1, ...args_2) => __awaiter(void 0, [connection_2, subdomain_1, owner_1, ...args_2], void 0, function* (connection, subdomain, owner, space = 2000) {
    const ixs = [];
    const sub = subdomain.split(".")[0];
    if (!sub) {
        throw new error_1.InvalidSubdomainError("The subdomain is malformed");
    }
    const { parent, pubkey } = getDomainKeySync(subdomain);
    // Space allocated to the subdomains
    const lamports = yield connection.getMinimumBalanceForRentExemption(space + state_1.NameRegistryState.HEADER_LEN);
    const ix_create = yield createNameRegistry(connection, "\0".concat(sub), space, // Hardcode space to 2kB
    owner, owner, lamports, undefined, parent);
    ixs.push(ix_create);
    // Create the reverse name
    const reverseKey = getReverseKeySync(subdomain, true);
    const info = yield connection.getAccountInfo(reverseKey);
    if (!(info === null || info === void 0 ? void 0 : info.data)) {
        const [, ix_reverse] = yield createReverseName(pubkey, "\0".concat(sub), owner, parent, owner);
        ixs.push(...ix_reverse);
    }
    return [[], ixs];
});
const burnDomain = (domain, owner, target) => {
    const { pubkey } = getDomainKeySync(domain);
    const [state] = web3_js_1.PublicKey.findProgramAddressSync([pubkey.toBuffer()], constants.REGISTER_PROGRAM_ID);
    const [resellingState] = web3_js_1.PublicKey.findProgramAddressSync([pubkey.toBuffer(), Uint8Array.from([1, 1])], constants.REGISTER_PROGRAM_ID);
    const ix = new burnInstruction_1.burnInstruction().getInstruction(constants.REGISTER_PROGRAM_ID, constants.NAME_PROGRAM_ID, web3_js_1.SystemProgram.programId, pubkey, getReverseKeySync(domain), resellingState, state, constants.REVERSE_LOOKUP_CLASS, owner, target);
    return ix;
};
/**
 * This function is used to transfer the ownership of a subdomain in the Solana Name Service.
 *
 * @param {Connection} connection - The Solana RPC connection object.
 * @param {string} subdomain - The subdomain to transfer. It can be with or without .sol suffix (e.g., 'something.bonfida.sol' or 'something.bonfida').
 * @param {PublicKey} newOwner - The public key of the new owner of the subdomain.
 * @param {boolean} [isParentOwnerSigner=false] - A flag indicating whether the parent name owner is signing this transfer.
 * @param {PublicKey} [owner] - The public key of the current owner of the subdomain. This is an optional parameter. If not provided, the owner will be resolved automatically. This can be helpful to build transactions when the subdomain does not exist yet.
 *
 * @returns {Promise<TransactionInstruction>} - A promise that resolves to a Solana instruction for the transfer operation.
 */
const transferSubdomain = (connection, subdomain, newOwner, isParentOwnerSigner, owner) => __awaiter(void 0, void 0, void 0, function* () {
    const { pubkey, isSub, parent } = getDomainKeySync(subdomain);
    if (!parent || !isSub) {
        throw new error_1.InvalidSubdomainError("The subdomain is not valid");
    }
    if (!owner) {
        const { registry } = yield state_1.NameRegistryState.retrieve(connection, pubkey);
        owner = registry.owner;
    }
    let nameParent = undefined;
    let nameParentOwner = undefined;
    if (isParentOwnerSigner) {
        nameParent = parent;
        nameParentOwner = (yield state_1.NameRegistryState.retrieve(connection, parent))
            .registry.owner;
    }
    const ix = (0, transferInstruction_1.transferInstruction)(constants.NAME_PROGRAM_ID, pubkey, newOwner, owner, undefined, nameParent, nameParentOwner);
    return ix;
});
/**
 * This function can be used to register a .sol domain
 * @param connection The Solana RPC connection object
 * @param name The domain name to register e.g bonfida if you want to register bonfida.sol
 * @param space The domain name account size (max 10kB)
 * @param buyer The public key of the buyer
 * @param buyerTokenAccount The buyer token account (USDC)
 * @param mint Optional mint used to purchase the domain, defaults to USDC
 * @param referrerKey Optional referrer key
 * @returns
 */
const registerDomainNameV2 = (connection_3, name_2, space_2, buyer_2, buyerTokenAccount_2, ...args_3) => __awaiter(void 0, [connection_3, name_2, space_2, buyer_2, buyerTokenAccount_2, ...args_3], void 0, function* (connection, name, space, buyer, buyerTokenAccount, mint = constants.USDC_MINT, referrerKey) {
    // Basic validation
    if (name.includes(".") || name.trim().toLowerCase() !== name) {
        throw new error_1.InvalidDomainError("The domain name is malformed");
    }
    const [cs] = web3_js_1.PublicKey.findProgramAddressSync([constants.REGISTER_PROGRAM_ID.toBuffer()], constants.REGISTER_PROGRAM_ID);
    const hashed = (0, getHashedNameSync_1.getHashedNameSync)(name);
    const nameAccount = getNameAccountKeySync(hashed, undefined, constants.ROOT_DOMAIN_ACCOUNT);
    const hashedReverseLookup = (0, getHashedNameSync_1.getHashedNameSync)(nameAccount.toBase58());
    const reverseLookupAccount = getNameAccountKeySync(hashedReverseLookup, cs);
    const [derived_state] = web3_js_1.PublicKey.findProgramAddressSync([nameAccount.toBuffer()], constants.REGISTER_PROGRAM_ID);
    const refIdx = constants.REFERRERS.findIndex((e) => referrerKey === null || referrerKey === void 0 ? void 0 : referrerKey.equals(e));
    let refTokenAccount = undefined;
    const ixs = [];
    if (refIdx !== -1 && !!referrerKey) {
        refTokenAccount = (0, spl_token_1.getAssociatedTokenAddressSync)(mint, referrerKey, true);
        const acc = yield connection.getAccountInfo(refTokenAccount);
        if (!(acc === null || acc === void 0 ? void 0 : acc.data)) {
            const ix = (0, spl_token_1.createAssociatedTokenAccountIdempotentInstruction)(buyer, refTokenAccount, referrerKey, mint);
            ixs.push(ix);
        }
    }
    const vault = (0, spl_token_1.getAssociatedTokenAddressSync)(mint, constants.VAULT_OWNER, true);
    const pythFeed = constants_1.PYTH_PULL_FEEDS.get(mint.toBase58());
    if (!pythFeed) {
        throw new error_1.PythFeedNotFoundError("The Pyth account for the provided mint was not found");
    }
    const [pythFeedAccount] = (0, getPythFeedAccountKey_1.getPythFeedAccountKey)(0, pythFeed);
    const ix = new createSplitV2Instruction_1.createSplitV2Instruction({
        name,
        space,
        referrerIdxOpt: refIdx != -1 ? refIdx : null,
    }).getInstruction(constants.REGISTER_PROGRAM_ID, constants.NAME_PROGRAM_ID, constants.ROOT_DOMAIN_ACCOUNT, nameAccount, reverseLookupAccount, web3_js_1.SystemProgram.programId, cs, buyer, buyer, buyer, buyerTokenAccount, pythFeedAccount, vault, spl_token_1.TOKEN_PROGRAM_ID, web3_js_1.SYSVAR_RENT_PUBKEY, derived_state, refTokenAccount);
    ixs.push(ix);
    return ixs;
});
exports.devnet = {
    utils: {
        getNameAccountKeySync,
        reverseLookup,
        _deriveSync,
        getDomainKeySync,
        getReverseKeySync,
    },
    constants,
    bindings: {
        createNameRegistry,
        updateNameRegistryData,
        transferNameOwnership,
        deleteNameRegistry,
        registerDomainName,
        createReverseName,
        createSubdomain,
        burnDomain,
        transferSubdomain,
        registerDomainNameV2,
    },
};
