"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MINT_PREFIX = exports.NAME_TOKENIZER_ID = void 0;
const web3_js_1 = require("@solana/web3.js");
const buffer_1 = require("buffer");
exports.NAME_TOKENIZER_ID = new web3_js_1.PublicKey("nftD3vbNkNqfj2Sd3HZwbpw4BxxKWr4AjGb9X38JeZk");
exports.MINT_PREFIX = buffer_1.Buffer.from("tokenized_name");
