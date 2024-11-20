"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.burnInstruction = void 0;
const buffer_1 = require("buffer");
const web3_js_1 = require("@solana/web3.js");
const borsh_1 = require("borsh");
class burnInstruction {
    constructor() {
        this.tag = 16;
    }
    serialize() {
        return (0, borsh_1.serialize)(burnInstruction.schema, this);
    }
    getInstruction(programId, nameServiceId, systemProgram, domain, reverse, resellingState, state, centralState, owner, target) {
        const data = buffer_1.Buffer.from(this.serialize());
        let keys = [];
        keys.push({
            pubkey: nameServiceId,
            isSigner: false,
            isWritable: false,
        });
        keys.push({
            pubkey: systemProgram,
            isSigner: false,
            isWritable: false,
        });
        keys.push({
            pubkey: domain,
            isSigner: false,
            isWritable: true,
        });
        keys.push({
            pubkey: reverse,
            isSigner: false,
            isWritable: true,
        });
        keys.push({
            pubkey: resellingState,
            isSigner: false,
            isWritable: true,
        });
        keys.push({
            pubkey: state,
            isSigner: false,
            isWritable: true,
        });
        keys.push({
            pubkey: centralState,
            isSigner: false,
            isWritable: false,
        });
        keys.push({
            pubkey: owner,
            isSigner: true,
            isWritable: false,
        });
        keys.push({
            pubkey: target,
            isSigner: false,
            isWritable: true,
        });
        return new web3_js_1.TransactionInstruction({
            keys,
            programId,
            data,
        });
    }
}
exports.burnInstruction = burnInstruction;
burnInstruction.schema = {
    struct: {
        tag: "u8",
    },
};
