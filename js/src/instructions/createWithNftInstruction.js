"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWithNftInstruction = void 0;
const buffer_1 = require("buffer");
const web3_js_1 = require("@solana/web3.js");
const borsh_1 = require("borsh");
class createWithNftInstruction {
    constructor(obj) {
        this.tag = 17;
        this.name = obj.name;
        this.space = obj.space;
    }
    serialize() {
        return (0, borsh_1.serialize)(createWithNftInstruction.schema, this);
    }
    getInstruction(programId, namingServiceProgram, rootDomain, name, reverseLookup, systemProgram, centralState, buyer, nftSource, nftMetadata, nftMint, masterEdition, collection, splTokenProgram, rentSysvar, state, mplTokenMetadata) {
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
            pubkey: nftSource,
            isSigner: false,
            isWritable: true,
        });
        keys.push({
            pubkey: nftMetadata,
            isSigner: false,
            isWritable: true,
        });
        keys.push({
            pubkey: nftMint,
            isSigner: false,
            isWritable: true,
        });
        keys.push({
            pubkey: masterEdition,
            isSigner: false,
            isWritable: true,
        });
        keys.push({
            pubkey: collection,
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
        keys.push({
            pubkey: mplTokenMetadata,
            isSigner: false,
            isWritable: false,
        });
        return new web3_js_1.TransactionInstruction({
            keys,
            programId,
            data,
        });
    }
}
exports.createWithNftInstruction = createWithNftInstruction;
createWithNftInstruction.schema = {
    struct: {
        tag: "u8",
        name: "string",
        space: "u32",
    },
};
