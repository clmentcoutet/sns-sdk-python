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
const client_1 = require("@pythnetwork/client");
const web3_js_1 = require("@solana/web3.js");
const constants_1 = require("../src/constants");
const getPythFeedAccountKey_1 = require("../src/utils/getPythFeedAccountKey");
const connection = new web3_js_1.Connection(process.env.RPC_URL);
test("Price & Product keys", () => __awaiter(void 0, void 0, void 0, function* () {
    const pythConnection = new client_1.PythHttpClient(connection, (0, client_1.getPythProgramKeyForCluster)("mainnet-beta"));
    const data = yield pythConnection.getData();
    for (let mint of constants_1.TOKENS_SYM_MINT.keys()) {
        const symbol = constants_1.TOKENS_SYM_MINT.get(mint);
        const priceData = data.productPrice.get("Crypto." + symbol + "/USD");
        const productData = data.productFromSymbol.get("Crypto." + symbol + "/USD");
        const { product, price } = constants_1.PYTH_FEEDS.get(mint);
        expect(priceData.productAccountKey.toBase58()).toBe(product);
        expect(productData.price_account).toBe(price);
    }
}));
test("Pyth Pull derivation", () => {
    const sample = [
        {
            mint: "So11111111111111111111111111111111111111112",
            key: "7UVimffxr9ow1uXYxsr4LHAcV58mLzhmwaeKvJ1pjLiE",
        },
        {
            mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
            key: "Dpw1EAVrSB1ibxiDQyTAW6Zip3J4Btk2x4SgApQCeFbX",
        },
        {
            mint: "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So",
            key: "5CKzb9j4ChgLUt8Gfm5CNGLN6khXKiqMbnGAW4cgXgxK",
        },
        {
            mint: "EchesyfXePKdLtoiZSL8pBe8Myagyy8ZRqsACNCFGnvp",
            key: "2cfmeuVBf7bvBJcjKBQgAwfvpUvdZV7K8NZxUEuccrub",
        },
    ];
    sample.forEach((e) => {
        const [key] = (0, getPythFeedAccountKey_1.getPythFeedAccountKey)(0, constants_1.PYTH_PULL_FEEDS.get(e.mint));
        expect(key.toBase58()).toBe(e.key);
    });
});
