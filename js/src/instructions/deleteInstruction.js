"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteInstruction = void 0;
const buffer_1 = require("buffer");
const web3_js_1 = require("@solana/web3.js");
function deleteInstruction(nameProgramId, nameAccountKey, refundTargetKey, nameOwnerKey) {
    const buffers = [buffer_1.Buffer.from(Int8Array.from([3]))];
    const data = buffer_1.Buffer.concat(buffers);
    const keys = [
        {
            pubkey: nameAccountKey,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: nameOwnerKey,
            isSigner: true,
            isWritable: false,
        },
        {
            pubkey: refundTargetKey,
            isSigner: false,
            isWritable: true,
        },
    ];
    return new web3_js_1.TransactionInstruction({
        keys,
        programId: nameProgramId,
        data,
    });
}
exports.deleteInstruction = deleteInstruction;
