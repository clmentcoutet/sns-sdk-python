"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerFavoriteInstruction = void 0;
const buffer_1 = require("buffer");
const web3_js_1 = require("@solana/web3.js");
const borsh_1 = require("borsh");
class registerFavoriteInstruction {
    constructor() {
        this.tag = 6;
    }
    serialize() {
        return (0, borsh_1.serialize)(registerFavoriteInstruction.schema, this);
    }
    getInstruction(programId, nameAccount, favouriteAccount, owner, systemProgram, optParent) {
        const data = buffer_1.Buffer.from(this.serialize());
        let keys = [];
        keys.push({
            pubkey: nameAccount,
            isSigner: false,
            isWritable: false,
        });
        keys.push({
            pubkey: favouriteAccount,
            isSigner: false,
            isWritable: true,
        });
        keys.push({
            pubkey: owner,
            isSigner: true,
            isWritable: true,
        });
        keys.push({
            pubkey: systemProgram,
            isSigner: false,
            isWritable: false,
        });
        if (!!optParent) {
            keys.push({
                pubkey: optParent,
                isSigner: false,
                isWritable: false,
            });
        }
        return new web3_js_1.TransactionInstruction({
            keys,
            programId,
            data,
        });
    }
}
exports.registerFavoriteInstruction = registerFavoriteInstruction;
registerFavoriteInstruction.schema = {
    struct: {
        tag: "u8",
    },
};
