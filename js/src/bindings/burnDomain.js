"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.burnDomain = void 0;
const web3_js_1 = require("@solana/web3.js");
const burnInstruction_1 = require("../instructions/burnInstruction");
const constants_1 = require("../constants");
const getDomainKeySync_1 = require("../utils/getDomainKeySync");
const getReverseKeySync_1 = require("../utils/getReverseKeySync");
const burnDomain = (domain, owner, target) => {
    const { pubkey } = (0, getDomainKeySync_1.getDomainKeySync)(domain);
    const [state] = web3_js_1.PublicKey.findProgramAddressSync([pubkey.toBuffer()], constants_1.REGISTER_PROGRAM_ID);
    const [resellingState] = web3_js_1.PublicKey.findProgramAddressSync([pubkey.toBuffer(), Uint8Array.from([1, 1])], constants_1.REGISTER_PROGRAM_ID);
    const ix = new burnInstruction_1.burnInstruction().getInstruction(constants_1.REGISTER_PROGRAM_ID, constants_1.NAME_PROGRAM_ID, web3_js_1.SystemProgram.programId, pubkey, (0, getReverseKeySync_1.getReverseKeySync)(domain), resellingState, state, constants_1.REVERSE_LOOKUP_CLASS, owner, target);
    return ix;
};
exports.burnDomain = burnDomain;
