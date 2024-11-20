"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSolanaConnection = exports.useSolanaConnection = void 0;
const web3_js_1 = require("@solana/web3.js");
const commitment = 'confirmed';
let solanaUtils = {
    connection: null,
};
const useSolanaConnection = () => solanaUtils.connection;
exports.useSolanaConnection = useSolanaConnection;
const initSolanaConnection = () => {
    const connection = new web3_js_1.Connection('https://helius-proxy.bonfida.com', commitment);
    solanaUtils = {
        connection,
    };
};
exports.initSolanaConnection = initSolanaConnection;
