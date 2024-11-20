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
const web3_js_1 = require("@solana/web3.js");
const nft_1 = require("../src/nft");
const mathjs_1 = require("mathjs");
const benchmark = () => __awaiter(void 0, void 0, void 0, function* () {
    const connection = new web3_js_1.Connection(process.env.RPC_URL);
    const nameAccounts = [
        new web3_js_1.PublicKey("5RDpkiLAvYh5StaFbFdvkMnezQCFAN2vGyhVEeQHMTf"),
        new web3_js_1.PublicKey("AVdePc1a3CXg56GzHLz8jxB5MxV4Fh3iKU7z7xbgDTEY"),
        new web3_js_1.PublicKey("AQzjja886kuZpY3Bm8ataXDvJemwrwV91dHypZ45vaei"),
        new web3_js_1.PublicKey("2nD7dijypykUCBxzLmPc21trzAZd2CWoQurWBRt5qg3D"),
        new web3_js_1.PublicKey("Fwyp251aoe5LEis4WNjAvs9D7z4bSZSi4inangghgwf3"),
        new web3_js_1.PublicKey("CT3kcSzzkaay8UpYJmYvGvXJLQPziFqJCgyetr7GhSpB"),
        new web3_js_1.PublicKey("797fVNoYuyMcLf3d6oztSCAJSrevJ4dWrGy9B9xKWujy"),
        new web3_js_1.PublicKey("F9ESKiA79dsHxhC3h7iLGTnVU5iPcaCKWaRDmTm9tiEa"),
    ];
    const results = [];
    const times1 = [];
    const times2 = [];
    for (const nameAccount of nameAccounts) {
        const accountBase58 = nameAccount.toBase58();
        console.time(`retrieveNftOwner-${accountBase58}`);
        const start1 = performance.now();
        const owner1 = yield (0, nft_1.retrieveNftOwner)(connection, nameAccount);
        const end1 = performance.now();
        console.timeEnd(`retrieveNftOwner-${accountBase58}`);
        const time1 = end1 - start1;
        times1.push(time1);
        console.time(`retrieveNftOwnerV2-${accountBase58}`);
        const start2 = performance.now();
        const owner2 = yield (0, nft_1.retrieveNftOwnerV2)(connection, nameAccount);
        const end2 = performance.now();
        console.timeEnd(`retrieveNftOwnerV2-${accountBase58}`);
        const time2 = end2 - start2;
        times2.push(time2);
        results.push({
            Account: accountBase58,
            Owner1: (owner1 === null || owner1 === void 0 ? void 0 : owner1.toBase58()) || "N/A",
            Time1: `${time1.toFixed(2)} ms`,
            Owner2: (owner2 === null || owner2 === void 0 ? void 0 : owner2.toBase58()) || "N/A",
            Time2: `${time2.toFixed(2)} ms`,
        });
    }
    console.table(results);
    const avgTime1 = (0, mathjs_1.mean)(times1);
    const medianTime1 = (0, mathjs_1.median)(times1);
    const avgTime2 = (0, mathjs_1.mean)(times2);
    const medianTime2 = (0, mathjs_1.median)(times2);
    console.table([
        {
            Metric: "Average Time (retrieveNftOwner)",
            Value: `${avgTime1.toFixed(2)} ms`,
        },
        {
            Metric: "Median Time (retrieveNftOwner)",
            Value: `${medianTime1.toFixed(2)} ms`,
        },
        {
            Metric: "Average Time (retrieveNftOwnerV2)",
            Value: `${avgTime2.toFixed(2)} ms`,
        },
        {
            Metric: "Median Time (retrieveNftOwnerV2)",
            Value: `${medianTime2.toFixed(2)} ms`,
        },
    ]);
});
benchmark().catch(console.error);
