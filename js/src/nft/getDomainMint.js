"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDomainMint = void 0;
const web3_js_1 = require("@solana/web3.js");
const const_1 = require("./const");
const getDomainMint = (domain) => {
    const [mint] = web3_js_1.PublicKey.findProgramAddressSync([const_1.MINT_PREFIX, domain.toBuffer()], const_1.NAME_TOKENIZER_ID);
    return mint;
};
exports.getDomainMint = getDomainMint;
