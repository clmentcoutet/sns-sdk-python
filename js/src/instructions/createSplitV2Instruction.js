"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSplitV2Instruction = void 0;
const buffer_1 = require("buffer");
const web3_js_1 = require("@solana/web3.js");
const borsh_1 = require("borsh");
class createSplitV2Instruction {
    constructor(obj) {
        this.tag = 20;
        this.name = obj.name;
        this.space = obj.space;
        this.referrerIdxOpt = obj.referrerIdxOpt;
    }
    serialize() {
        return (0, borsh_1.serialize)(createSplitV2Instruction.schema, this);
    }
    getInstruction(programId, namingServiceProgram, rootDomain, name, reverseLookup, systemProgram, centralState, buyer, domainOwner, feePayer, buyerTokenSource, pythFeedAccount, vault, splTokenProgram, rentSysvar, state, referrerAccountOpt) {
        const data = buffer_1.Buffer.from(this.serialize());
        console.log(data.toString("hex"));
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
            pubkey: domainOwner,
            isSigner: false,
            isWritable: false,
        });
        keys.push({
            pubkey: feePayer,
            isSigner: true,
            isWritable: true,
        });
        keys.push({
            pubkey: buyerTokenSource,
            isSigner: false,
            isWritable: true,
        });
        keys.push({
            pubkey: pythFeedAccount,
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
exports.createSplitV2Instruction = createSplitV2Instruction;
createSplitV2Instruction.schema = {
    struct: {
        tag: "u8",
        name: "string",
        space: "u32",
        referrerIdxOpt: { option: "u16" },
    },
};
