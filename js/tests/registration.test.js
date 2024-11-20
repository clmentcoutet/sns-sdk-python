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
require("dotenv").config();
const globals_1 = require("@jest/globals");
const web3_js_1 = require("@solana/web3.js");
const registerDomainNameV2_1 = require("../src/bindings/registerDomainNameV2");
const registerWithNft_1 = require("../src/bindings/registerWithNft");
const crypto_1 = require("crypto");
const constants_1 = require("../src/constants");
const spl_token_1 = require("@solana/spl-token");
const getDomainKeySync_1 = require("../src/utils/getDomainKeySync");
const getReverseKeySync_1 = require("../src/utils/getReverseKeySync");
const js_1 = require("@metaplex-foundation/js");
globals_1.jest.setTimeout(20000);
globals_1.jest.retryTimes(3);
const FIDA_MINT = new web3_js_1.PublicKey("EchesyfXePKdLtoiZSL8pBe8Myagyy8ZRqsACNCFGnvp");
const PYTH_MINT = new web3_js_1.PublicKey("HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3");
const connection = new web3_js_1.Connection(process.env.RPC_URL);
const VAULT_OWNER = new web3_js_1.PublicKey("5D2zKog251d6KPCyFyLMt3KroWwXXPWSgTPyhV22K2gR");
(0, globals_1.test)("Register with NFT", () => __awaiter(void 0, void 0, void 0, function* () {
    const tx = new web3_js_1.Transaction();
    const domain = (0, crypto_1.randomBytes)(10).toString("hex");
    const { pubkey } = (0, getDomainKeySync_1.getDomainKeySync)(domain);
    const reverse = (0, getReverseKeySync_1.getReverseKeySync)(domain);
    // https://solscan.io/collection/3c138f8640f62b62016f8020f0532ff888bb0866363c26fb2241bcf28c0776ad#holders
    const holder = new web3_js_1.PublicKey("FiUYY19eXuVcEAHSJ87KEzYjYnfKZm6KbHoVtdQBNGfk");
    const source = new web3_js_1.PublicKey("Df9Jz3NrGVd5jjjrXbedwuHbCc1hL131bUXq2143tTfQ");
    const metaplex = new js_1.Metaplex(connection);
    const nftMint = new web3_js_1.PublicKey("7cpq5U6ze5PPcTPVxGifXA8xyDp8rgAJQNwBDj8eWd8w");
    const nftMetadata = metaplex.nfts().pdas().metadata({ mint: nftMint });
    const masterEdition = metaplex.nfts().pdas().masterEdition({ mint: nftMint });
    const ix = (0, registerWithNft_1.registerWithNft)(domain, 1000, pubkey, reverse, holder, source, nftMetadata, nftMint, masterEdition);
    tx.add(ix);
    const { blockhash } = yield connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = VAULT_OWNER;
    const res = yield connection.simulateTransaction(tx);
    expect(res.value.err).toBe(null);
}));
(0, globals_1.test)("Indempotent ATA creation ref", () => __awaiter(void 0, void 0, void 0, function* () {
    const tx = new web3_js_1.Transaction();
    for (let i = 0; i < 3; i++) {
        const ix = yield (0, registerDomainNameV2_1.registerDomainNameV2)(connection, (0, crypto_1.randomBytes)(10).toString("hex"), 1000, VAULT_OWNER, (0, spl_token_1.getAssociatedTokenAddressSync)(PYTH_MINT, VAULT_OWNER, true), PYTH_MINT, constants_1.REFERRERS[0]);
        tx.add(...ix);
    }
    const { blockhash } = yield connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = VAULT_OWNER;
    const res = yield connection.simulateTransaction(tx);
    expect(res.value.err).toBe(null);
}));
(0, globals_1.test)("Register V2", () => __awaiter(void 0, void 0, void 0, function* () {
    const tx = new web3_js_1.Transaction();
    const ix = yield (0, registerDomainNameV2_1.registerDomainNameV2)(connection, (0, crypto_1.randomBytes)(10).toString("hex"), 1000, VAULT_OWNER, (0, spl_token_1.getAssociatedTokenAddressSync)(FIDA_MINT, VAULT_OWNER, true), FIDA_MINT, constants_1.REFERRERS[1]);
    tx.add(...ix);
    const { blockhash } = yield connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = VAULT_OWNER;
    const res = yield connection.simulateTransaction(tx);
    expect(res.value.err).toBe(null);
}));
(0, globals_1.test)("Registration V2 with ref", () => __awaiter(void 0, void 0, void 0, function* () {
    const tx = new web3_js_1.Transaction();
    const ix = yield (0, registerDomainNameV2_1.registerDomainNameV2)(connection, (0, crypto_1.randomBytes)(10).toString("hex"), 1000, VAULT_OWNER, (0, spl_token_1.getAssociatedTokenAddressSync)(FIDA_MINT, VAULT_OWNER, true), FIDA_MINT, constants_1.REFERRERS[1]);
    tx.add(...ix);
    const { blockhash } = yield connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = VAULT_OWNER;
    const res = yield connection.simulateTransaction(tx);
    expect(res.value.err).toBe(null);
}));
