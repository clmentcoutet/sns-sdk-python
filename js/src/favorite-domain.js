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
exports.getMultiplePrimaryDomains = exports.getMultipleFavoriteDomains = exports.getPrimaryDomain = exports.getFavoriteDomain = exports.PrimaryDomain = exports.FavouriteDomain = exports.NAME_OFFERS_ID = void 0;
const buffer_1 = require("buffer");
const borsh_1 = require("borsh");
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
const deserializeReverse_1 = require("./utils/deserializeReverse");
const getReverseKeyFromDomainKey_1 = require("./utils/getReverseKeyFromDomainKey");
const reverseLookup_1 = require("./utils/reverseLookup");
const error_1 = require("./error");
const getDomainMint_1 = require("./nft/getDomainMint");
const state_1 = require("./state");
const constants_1 = require("./constants");
exports.NAME_OFFERS_ID = new web3_js_1.PublicKey("85iDfUvr3HJyLM2zcq5BXSiDvUWfw6cSE1FfNBo8Ap29");
class FavouriteDomain {
    constructor(obj) {
        this.tag = obj.tag;
        this.nameAccount = new web3_js_1.PublicKey(obj.nameAccount);
    }
    /**
     * This function can be used to deserialize a Buffer into a FavouriteDomain object
     * @param data The buffer to deserialize
     * @returns
     */
    static deserialize(data) {
        return new FavouriteDomain((0, borsh_1.deserialize)(this.schema, data));
    }
    /**
     * This function can be used to retrieve and deserialize a favorite domain
     * @param connection The Solana RPC connection object
     * @param key The favorite account key
     * @returns
     */
    static retrieve(connection, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const accountInfo = yield connection.getAccountInfo(key);
            if (!accountInfo || !accountInfo.data) {
                throw new error_1.FavouriteDomainNotFoundError("The favourite account does not exist");
            }
            return this.deserialize(accountInfo.data);
        });
    }
    /**
     * This function can be used to derive the key of a favorite domain
     * @param programId The name offer program ID
     * @param owner The owner to retrieve the favorite domain for
     * @returns
     */
    static getKey(programId, owner) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield web3_js_1.PublicKey.findProgramAddress([buffer_1.Buffer.from("favourite_domain"), owner.toBuffer()], programId);
        });
    }
    /**
     * This function can be used to derive the key of a favorite domain
     * @param programId The name offer program ID
     * @param owner The owner to retrieve the favorite domain for
     * @returns
     */
    static getKeySync(programId, owner) {
        return web3_js_1.PublicKey.findProgramAddressSync([buffer_1.Buffer.from("favourite_domain"), owner.toBuffer()], programId);
    }
}
exports.FavouriteDomain = FavouriteDomain;
exports.PrimaryDomain = FavouriteDomain;
FavouriteDomain.schema = {
    struct: {
        tag: "u8",
        nameAccount: { array: { type: "u8", len: 32 } },
    },
};
/**
 * This function can be used to retrieve the favorite domain of a user
 * @param connection The Solana RPC connection object
 * @param owner The owner you want to retrieve the favorite domain for
 * @returns
 */
const getFavoriteDomain = (connection, owner) => __awaiter(void 0, void 0, void 0, function* () {
    const [favKey] = FavouriteDomain.getKeySync(exports.NAME_OFFERS_ID, new web3_js_1.PublicKey(owner));
    const favorite = yield FavouriteDomain.retrieve(connection, favKey);
    const { registry, nftOwner } = yield state_1.NameRegistryState.retrieve(connection, favorite.nameAccount);
    const domainOwner = nftOwner || registry.owner;
    let reverse = yield (0, reverseLookup_1.reverseLookup)(connection, favorite.nameAccount, registry.parentName.equals(constants_1.ROOT_DOMAIN_ACCOUNT)
        ? undefined
        : registry.parentName);
    if (!registry.parentName.equals(constants_1.ROOT_DOMAIN_ACCOUNT)) {
        const parentReverse = yield (0, reverseLookup_1.reverseLookup)(connection, registry.parentName);
        reverse += `.${parentReverse}`;
    }
    return {
        domain: favorite.nameAccount,
        reverse,
        stale: !owner.equals(domainOwner),
    };
});
exports.getFavoriteDomain = getFavoriteDomain;
exports.getPrimaryDomain = exports.getFavoriteDomain;
/**
 * This function can be used to retrieve the favorite domains for multiple wallets, up to a maximum of 100.
 * If a wallet does not have a favorite domain, the result will be 'undefined' instead of the human readable domain as a string.
 * This function is optimized for network efficiency, making only four RPC calls, three of which are executed in parallel using Promise.all, thereby reducing the overall execution time.
 * @param connection The Solana RPC connection object
 * @param wallets An array of PublicKeys representing the wallets
 * @returns A promise that resolves to an array of strings or undefined, representing the favorite domains or lack thereof for each wallet
 */
const getMultipleFavoriteDomains = (connection, wallets) => __awaiter(void 0, void 0, void 0, function* () {
    const result = [];
    const favKeys = wallets.map((e) => FavouriteDomain.getKeySync(exports.NAME_OFFERS_ID, e)[0]);
    const favDomains = (yield connection.getMultipleAccountsInfo(favKeys)).map((e) => {
        if (!!(e === null || e === void 0 ? void 0 : e.data)) {
            return FavouriteDomain.deserialize(e === null || e === void 0 ? void 0 : e.data).nameAccount;
        }
        return web3_js_1.PublicKey.default;
    });
    const domainInfos = yield connection.getMultipleAccountsInfo(favDomains);
    const parentRevKeys = [];
    const revKeys = domainInfos.map((e, idx) => {
        var _a;
        const parent = new web3_js_1.PublicKey((_a = e === null || e === void 0 ? void 0 : e.data.slice(0, 32)) !== null && _a !== void 0 ? _a : buffer_1.Buffer.alloc(32));
        const isSub = (e === null || e === void 0 ? void 0 : e.owner.equals(constants_1.NAME_PROGRAM_ID)) && !parent.equals(constants_1.ROOT_DOMAIN_ACCOUNT);
        parentRevKeys.push(isSub ? (0, getReverseKeyFromDomainKey_1.getReverseKeyFromDomainKey)(parent) : web3_js_1.PublicKey.default);
        return (0, getReverseKeyFromDomainKey_1.getReverseKeyFromDomainKey)(favDomains[idx], isSub ? parent : undefined);
    });
    const atas = favDomains.map((e, idx) => {
        const mint = (0, getDomainMint_1.getDomainMint)(e);
        const ata = (0, spl_token_1.getAssociatedTokenAddressSync)(mint, wallets[idx], true);
        return ata;
    });
    const [revs, tokenAccs, parentRevs] = yield Promise.all([
        connection.getMultipleAccountsInfo(revKeys),
        connection.getMultipleAccountsInfo(atas),
        connection.getMultipleAccountsInfo(parentRevKeys),
    ]);
    for (let i = 0; i < wallets.length; i++) {
        let parentRev = "";
        const domainInfo = domainInfos[i];
        const rev = revs[i];
        const parentRevAccount = parentRevs[i];
        const tokenAcc = tokenAccs[i];
        if (!domainInfo || !rev) {
            result.push(undefined);
            continue;
        }
        if (parentRevAccount && parentRevAccount.owner.equals(constants_1.NAME_PROGRAM_ID)) {
            const des = (0, deserializeReverse_1.deserializeReverse)(parentRevAccount.data.slice(96));
            parentRev += `.${des}`;
        }
        const nativeOwner = new web3_js_1.PublicKey(domainInfo === null || domainInfo === void 0 ? void 0 : domainInfo.data.slice(32, 64));
        if (nativeOwner.equals(wallets[i])) {
            console.log("Non tokenized", i);
            result.push((0, deserializeReverse_1.deserializeReverse)(rev === null || rev === void 0 ? void 0 : rev.data.slice(96), true) + parentRev);
            continue;
        }
        // Either tokenized or stale
        if (!tokenAcc) {
            result.push(undefined);
            continue;
        }
        const decoded = spl_token_1.AccountLayout.decode(tokenAcc.data);
        // Tokenized
        if (Number(decoded.amount) === 1) {
            console.log("Tokenized", i);
            result.push((0, deserializeReverse_1.deserializeReverse)(rev === null || rev === void 0 ? void 0 : rev.data.slice(96)) + parentRev);
            continue;
        }
        // Stale
        result.push(undefined);
    }
    return result;
});
exports.getMultipleFavoriteDomains = getMultipleFavoriteDomains;
exports.getMultiplePrimaryDomains = exports.getMultipleFavoriteDomains;
