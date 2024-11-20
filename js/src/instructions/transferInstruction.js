"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transferInstruction = void 0;
const buffer_1 = require("buffer");
const web3_js_1 = require("@solana/web3.js");
function transferInstruction(nameProgramId, nameAccountKey, newOwnerKey, currentNameOwnerKey, nameClassKey, nameParent, parentOwner) {
    const buffers = [buffer_1.Buffer.from(Int8Array.from([2])), newOwnerKey.toBuffer()];
    const data = buffer_1.Buffer.concat(buffers);
    const keys = [
        {
            pubkey: nameAccountKey,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: parentOwner ? parentOwner : currentNameOwnerKey,
            isSigner: true,
            isWritable: false,
        },
    ];
    if (nameClassKey) {
        keys.push({
            pubkey: nameClassKey,
            isSigner: true,
            isWritable: false,
        });
    }
    if (parentOwner && nameParent) {
        if (!nameClassKey) {
            keys.push({
                pubkey: web3_js_1.PublicKey.default,
                isSigner: false,
                isWritable: false,
            });
        }
        keys.push({
            pubkey: nameParent,
            isSigner: false,
            isWritable: false,
        });
    }
    return new web3_js_1.TransactionInstruction({
        keys,
        programId: nameProgramId,
        data,
    });
}
exports.transferInstruction = transferInstruction;
