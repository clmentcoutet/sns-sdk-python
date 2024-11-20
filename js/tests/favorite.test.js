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
const favorite_domain_1 = require("../src/favorite-domain");
const web3_js_1 = require("@solana/web3.js");
const registerFavorite_1 = require("../src/bindings/registerFavorite");
const getDomainKeySync_1 = require("../src/utils/getDomainKeySync");
globals_1.jest.setTimeout(10000);
const connection = new web3_js_1.Connection(process.env.RPC_URL);
(0, globals_1.test)("Favorite domain", () => __awaiter(void 0, void 0, void 0, function* () {
    const items = [
        {
            user: new web3_js_1.PublicKey("FidaeBkZkvDqi1GXNEwB8uWmj9Ngx2HXSS5nyGRuVFcZ"),
            favorite: {
                domain: new web3_js_1.PublicKey("Crf8hzfthWGbGbLTVCiqRqV5MVnbpHB1L9KQMd6gsinb"),
                reverse: "bonfida",
                stale: true,
            },
        },
        {
            user: new web3_js_1.PublicKey("HKKp49qGWXd639QsuH7JiLijfVW5UtCVY4s1n2HANwEA"),
            favorite: {
                domain: new web3_js_1.PublicKey("Crf8hzfthWGbGbLTVCiqRqV5MVnbpHB1L9KQMd6gsinb"),
                reverse: "bonfida",
                stale: false,
            },
        },
        {
            user: new web3_js_1.PublicKey("A41TAGFpQkFpJidLwH37ydunE7Q3jpBaS228RkoXiRQk"),
            favorite: {
                domain: new web3_js_1.PublicKey("BaQq8Uib3Aw5SPBedC8MdYCvpfEC9iLkUMHc5M74sAjv"),
                reverse: "1.00728",
                stale: false,
            },
        },
    ];
    for (let item of items) {
        const fav = yield (0, favorite_domain_1.getFavoriteDomain)(connection, item.user);
        (0, globals_1.expect)(fav.domain.toBase58()).toBe(item.favorite.domain.toBase58());
        (0, globals_1.expect)(fav.reverse).toBe(item.favorite.reverse);
        (0, globals_1.expect)(fav.stale).toBe(item.favorite.stale);
    }
}));
(0, globals_1.test)("Multiple favorite domains", () => __awaiter(void 0, void 0, void 0, function* () {
    const items = [
        // Non tokenized
        {
            wallet: new web3_js_1.PublicKey("HKKp49qGWXd639QsuH7JiLijfVW5UtCVY4s1n2HANwEA"),
            domain: "bonfida",
        },
        // Stale non tokenized
        {
            wallet: new web3_js_1.PublicKey("FidaeBkZkvDqi1GXNEwB8uWmj9Ngx2HXSS5nyGRuVFcZ"),
            domain: undefined,
        },
        // Random pubkey
        { wallet: web3_js_1.Keypair.generate().publicKey, domain: undefined },
        // Tokenized
        {
            wallet: new web3_js_1.PublicKey("36Dn3RWhB8x4c83W6ebQ2C2eH9sh5bQX2nMdkP2cWaA4"),
            domain: "fav-tokenized",
        },
        {
            wallet: new web3_js_1.PublicKey("A41TAGFpQkFpJidLwH37ydunE7Q3jpBaS228RkoXiRQk"),
            domain: "1.00728",
        },
    ];
    const result = yield (0, favorite_domain_1.getMultipleFavoriteDomains)(connection, items.map((e) => e.wallet));
    result.forEach((x, idx) => (0, globals_1.expect)(x).toBe(items[idx].domain));
}));
(0, globals_1.test)("Register fav", () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = new web3_js_1.PublicKey("Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8");
    const tx = new web3_js_1.Transaction();
    const ix = yield (0, registerFavorite_1.registerFavorite)(connection, (0, getDomainKeySync_1.getDomainKeySync)("wallet-guide-3").pubkey, owner);
    tx.add(ix);
    const { blockhash } = yield connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = owner;
    const res = yield connection.simulateTransaction(tx);
    (0, globals_1.expect)(res.value.err).toBe(null);
}));
