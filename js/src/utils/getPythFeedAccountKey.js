"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPythFeedAccountKey = void 0;
const buffer_1 = require("buffer");
const web3_js_1 = require("@solana/web3.js");
const constants_1 = require("../constants");
const getPythFeedAccountKey = (shard, priceFeed) => {
    const buffer = buffer_1.Buffer.alloc(2);
    buffer.writeUint16LE(shard);
    return web3_js_1.PublicKey.findProgramAddressSync([buffer, buffer_1.Buffer.from(priceFeed)], constants_1.DEFAULT_PYTH_PUSH_PROGRAM);
};
exports.getPythFeedAccountKey = getPythFeedAccountKey;
