"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNameAccountKeySync = void 0;
const buffer_1 = require("buffer");
const web3_js_1 = require("@solana/web3.js");
const constants_1 = require("../constants");
const getNameAccountKeySync = (hashed_name, nameClass, nameParent) => {
    const seeds = [hashed_name];
    if (nameClass) {
        seeds.push(nameClass.toBuffer());
    }
    else {
        seeds.push(buffer_1.Buffer.alloc(32));
    }
    if (nameParent) {
        seeds.push(nameParent.toBuffer());
    }
    else {
        seeds.push(buffer_1.Buffer.alloc(32));
    }
    const [nameAccountKey] = web3_js_1.PublicKey.findProgramAddressSync(seeds, constants_1.NAME_PROGRAM_ID);
    return nameAccountKey;
};
exports.getNameAccountKeySync = getNameAccountKeySync;
