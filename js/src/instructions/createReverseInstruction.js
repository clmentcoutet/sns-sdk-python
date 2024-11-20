"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReverseInstruction = void 0;
const buffer_1 = require("buffer");
const web3_js_1 = require("@solana/web3.js");
const borsh_1 = require("borsh");
class createReverseInstruction {
    constructor(obj) {
        this.tag = 12;
        this.name = obj.name;
    }
    serialize() {
        return (0, borsh_1.serialize)(createReverseInstruction.schema, this);
    }
    getInstruction(programId, namingServiceProgram, rootDomain, reverseLookup, systemProgram, centralState, feePayer, rentSysvar, parentName, parentNameOwner) {
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
            pubkey: feePayer,
            isSigner: true,
            isWritable: true,
        });
        keys.push({
            pubkey: rentSysvar,
            isSigner: false,
            isWritable: false,
        });
        if (!!parentName) {
            keys.push({
                pubkey: parentName,
                isSigner: false,
                isWritable: true,
            });
        }
        if (!!parentNameOwner) {
            keys.push({
                pubkey: parentNameOwner,
                isSigner: true,
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
exports.createReverseInstruction = createReverseInstruction;
createReverseInstruction.schema = {
    struct: {
        tag: "u8",
        name: "string",
    },
};
