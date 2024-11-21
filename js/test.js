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
// reverseLookup.test.ts
const web3_js_1 = require("@solana/web3.js");
const src_1 = require("./src");
const runTest = () => __awaiter(void 0, void 0, void 0, function* () {
    const connection = new web3_js_1.Connection("https://quaint-cold-snow.solana-mainnet.quiknode.pro/39ddb64963c9a34975f35d7508d67751de89e1a2");
    const nameAccount = new web3_js_1.PublicKey("HKKp49qGWXd639QsuH7JiLijfVW5UtCVY4s1n2HANwEA"); // Replace with a valid domain public key
    const domain = "IPFS.bonfida.sol"; // Replace with a valid domain name
    try {
        // Perform reverse lookup and verify it returns a valid string
        const res = yield (0, src_1.getAllDomains)(connection, nameAccount);
        // Example expectation: It should return a non-empty string
        console.log("res runTest:", res);
    }
    catch (error) {
        console.error("Error during reverse lookup:", error);
    }
});
// Run the test
runTest();
