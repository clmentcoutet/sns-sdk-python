"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInstructionV3 = void 0;
const buffer_1 = require("buffer");
const web3_js_1 = require("@solana/web3.js");
const borsh_1 = require("borsh");
class createInstructionV3 {
    constructor(obj) {
        this.tag = 13;
        this.name = obj.name;
        this.space = obj.space;
        this.referrerIdxOpt = obj.referrerIdxOpt;
    }
    serialize() {
        return (0, borsh_1.serialize)(createInstructionV3.schema, this);
    }
    getInstruction(programId, namingServiceProgram, rootDomain, name, reverseLookup, systemProgram, centralState, buyer, buyerTokenSource, pythMappingAcc, pythProductAcc, pythPriceAcc, vault, splTokenProgram, rentSysvar, state, referrerAccountOpt) {
        const data = buffer_1.Buffer.from(this.serialize());
        let keys = [];
        keys.push({
            pubkey: namingServiceProgram,
            isSigner: false,
            isWritable: false,
        });
        keys.push({
            pubkey: rootDomain,
            isSigner: false,
            isWritable: false,
        });
        keys.push({
            pubkey: name,
            isSigner: false,
            isWritable: true,
        });
        keys.push({
            pubkey: reverseLookup,
            isSigner: false,
            isWritable: true,
        });
        keys.push({
            pubkey: systemProgram,
            isSigner: false,
            isWritable: false,
        });
        keys.push({
            pubkey: centralState,
            isSigner: false,
            isWritable: false,
        });
        keys.push({
            pubkey: buyer,
            isSigner: true,
            isWritable: true,
        });
        keys.push({
            pubkey: buyerTokenSource,
            isSigner: false,
            isWritable: true,
        });
        keys.push({
            pubkey: pythMappingAcc,
            isSigner: false,
            isWritable: false,
        });
        keys.push({
            pubkey: pythProductAcc,
            isSigner: false,
            isWritable: false,
        });
        keys.push({
            pubkey: pythPriceAcc,
            isSigner: false,
            isWritable: false,
        });
        keys.push({
            pubkey: vault,
            isSigner: false,
            isWritable: true,
        });
        keys.push({
            pubkey: splTokenProgram,
            isSigner: false,
            isWritable: false,
        });
        keys.push({
            pubkey: rentSysvar,
            isSigner: false,
            isWritable: false,
        });
        keys.push({
            pubkey: state,
            isSigner: false,
            isWritable: false,
        });
        if (!!referrerAccountOpt) {
            keys.push({
                pubkey: referrerAccountOpt,
                isSigner: false,
                isWritable: true,
            });
        }
        return new web3_js_1.TransactionInstruction({
            keys,
            programId,
            data,
        });
    }
}
exports.createInstructionV3 = createInstructionV3;
createInstructionV3.schema = {
    struct: {
        tag: "u8",
        name: "string",
        space: "u32",
        referrerIdxOpt: { option: "u16" },
    },
};
