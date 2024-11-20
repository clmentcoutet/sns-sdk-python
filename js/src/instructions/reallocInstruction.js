"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reallocInstruction = void 0;
const buffer_1 = require("buffer");
const web3_js_1 = require("@solana/web3.js");
function reallocInstruction(nameProgramId, systemProgramId, payerKey, nameAccountKey, nameOwnerKey, space) {
    const buffers = [buffer_1.Buffer.from(Int8Array.from([4])), space.toBuffer()];
    const data = buffer_1.Buffer.concat(buffers);
    const keys = [
        {
            pubkey: systemProgramId,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: payerKey,
            isSigner: true,
            isWritable: true,
        },
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
    ];
    return new web3_js_1.TransactionInstruction({
        keys,
        programId: nameProgramId,
        data,
    });
}
exports.reallocInstruction = reallocInstruction;
