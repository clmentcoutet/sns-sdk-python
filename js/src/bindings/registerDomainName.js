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
exports.registerDomainName = void 0;
const web3_js_1 = require("@solana/web3.js");
const createInstructionV3_1 = require("../instructions/createInstructionV3");
const constants_1 = require("../constants");
const getHashedNameSync_1 = require("../utils/getHashedNameSync");
const getNameAccountKeySync_1 = require("../utils/getNameAccountKeySync");
const spl_token_1 = require("@solana/spl-token");
const error_1 = require("../error");
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
const registerDomainName = (connection_1, name_1, space_1, buyer_1, buyerTokenAccount_1, ...args_1) => __awaiter(void 0, [connection_1, name_1, space_1, buyer_1, buyerTokenAccount_1, ...args_1], void 0, function* (connection, name, space, buyer, buyerTokenAccount, mint = constants_1.USDC_MINT, referrerKey) {
    // Basic validation
    if (name.includes(".") || name.trim().toLowerCase() !== name) {
        throw new error_1.InvalidDomainError("The domain name is malformed");
    }
    const hashed = (0, getHashedNameSync_1.getHashedNameSync)(name);
    const nameAccount = (0, getNameAccountKeySync_1.getNameAccountKeySync)(hashed, undefined, constants_1.ROOT_DOMAIN_ACCOUNT);
    const hashedReverseLookup = (0, getHashedNameSync_1.getHashedNameSync)(nameAccount.toBase58());
    const reverseLookupAccount = (0, getNameAccountKeySync_1.getNameAccountKeySync)(hashedReverseLookup, constants_1.CENTRAL_STATE);
    const [derived_state] = web3_js_1.PublicKey.findProgramAddressSync([nameAccount.toBuffer()], constants_1.REGISTER_PROGRAM_ID);
    const refIdx = constants_1.REFERRERS.findIndex((e) => referrerKey === null || referrerKey === void 0 ? void 0 : referrerKey.equals(e));
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
    const vault = (0, spl_token_1.getAssociatedTokenAddressSync)(mint, constants_1.VAULT_OWNER, true);
    const pythFeed = constants_1.PYTH_FEEDS.get(mint.toBase58());
    if (!pythFeed) {
        throw new error_1.PythFeedNotFoundError("The Pyth account for the provided mint was not found");
    }
    const ix = new createInstructionV3_1.createInstructionV3({
        name,
        space,
        referrerIdxOpt: refIdx != -1 ? refIdx : null,
    }).getInstruction(constants_1.REGISTER_PROGRAM_ID, constants_1.NAME_PROGRAM_ID, constants_1.ROOT_DOMAIN_ACCOUNT, nameAccount, reverseLookupAccount, web3_js_1.SystemProgram.programId, constants_1.CENTRAL_STATE, buyer, buyerTokenAccount, constants_1.PYTH_MAPPING_ACC, new web3_js_1.PublicKey(pythFeed.product), new web3_js_1.PublicKey(pythFeed.price), vault, spl_token_1.TOKEN_PROGRAM_ID, web3_js_1.SYSVAR_RENT_PUBKEY, derived_state, refTokenAccount);
    ixs.push(ix);
    return ixs;
});
exports.registerDomainName = registerDomainName;
