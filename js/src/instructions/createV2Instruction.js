"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createV2Instruction = void 0;
const buffer_1 = require("buffer");
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
const borsh_1 = require("borsh");
class createV2Instruction {
    constructor(obj) {
        this.tag = 9;
        this.name = obj.name;
        this.space = obj.space;
    }
    serialize() {
        return (0, borsh_1.serialize)(createV2Instruction.schema, this);
    }
    getInstruction(programId, rentSysvarAccount, nameProgramId, rootDomain, nameAccount, reverseLookupAccount, centralState, buyer, buyerTokenAccount, usdcVault, state) {
        const data = buffer_1.Buffer.from(this.serialize());
        const keys = [
            {
                pubkey: rentSysvarAccount,
                isSigner: false,
                isWritable: false,
            },
            {
                pubkey: nameProgramId,
                isSigner: false,
                isWritable: false,
            },
            {
                pubkey: rootDomain,
                isSigner: false,
                isWritable: false,
            },
            {
                pubkey: nameAccount,
                isSigner: false,
                isWritable: true,
            },
            {
                pubkey: reverseLookupAccount,
                isSigner: false,
                isWritable: true,
            },
            {
                pubkey: web3_js_1.SystemProgram.programId,
                isSigner: false,
                isWritable: false,
            },
            {
                pubkey: centralState,
                isSigner: false,
                isWritable: false,
            },
            {
                pubkey: buyer,
                isSigner: true,
                isWritable: true,
            },
            {
                pubkey: buyerTokenAccount,
                isSigner: false,
                isWritable: true,
            },
            {
                pubkey: usdcVault,
                isSigner: false,
                isWritable: true,
            },
            {
                pubkey: spl_token_1.TOKEN_PROGRAM_ID,
                isSigner: false,
                isWritable: false,
            },
            {
                pubkey: state,
                isSigner: false,
                isWritable: false,
            },
        ];
        return new web3_js_1.TransactionInstruction({
            keys,
            programId,
            data,
        });
    }
}
exports.createV2Instruction = createV2Instruction;
createV2Instruction.schema = {
    struct: {
        tag: "u8",
        name: "string",
        space: "u32",
    },
};
