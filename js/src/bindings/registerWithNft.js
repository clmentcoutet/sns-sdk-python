"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerWithNft = void 0;
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const createWithNftInstruction_1 = require("../instructions/createWithNftInstruction");
const constants_1 = require("../constants");
const registerWithNft = (name, space, nameAccount, reverseLookupAccount, buyer, nftSource, nftMetadata, nftMint, masterEdition) => {
    const [state] = web3_js_1.PublicKey.findProgramAddressSync([nameAccount.toBuffer()], constants_1.REGISTER_PROGRAM_ID);
    const ix = new createWithNftInstruction_1.createWithNftInstruction({ space, name }).getInstruction(constants_1.REGISTER_PROGRAM_ID, constants_1.NAME_PROGRAM_ID, constants_1.ROOT_DOMAIN_ACCOUNT, nameAccount, reverseLookupAccount, web3_js_1.SystemProgram.programId, constants_1.REVERSE_LOOKUP_CLASS, buyer, nftSource, nftMetadata, nftMint, masterEdition, constants_1.WOLVES_COLLECTION_METADATA, spl_token_1.TOKEN_PROGRAM_ID, web3_js_1.SYSVAR_RENT_PUBKEY, state, constants_1.METAPLEX_ID);
    return ix;
};
exports.registerWithNft = registerWithNft;
