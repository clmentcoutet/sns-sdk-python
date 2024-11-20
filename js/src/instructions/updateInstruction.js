"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateInstruction = void 0;
const buffer_1 = require("buffer");
const web3_js_1 = require("@solana/web3.js");
const int_1 = require("../int");
function updateInstruction(nameProgramId, nameAccountKey, offset, input_data, nameUpdateSigner) {
    const buffers = [
        buffer_1.Buffer.from(Int8Array.from([1])),
        offset.toBuffer(),
        new int_1.Numberu32(input_data.length).toBuffer(),
        input_data,
    ];
    const data = buffer_1.Buffer.concat(buffers);
    const keys = [
        {
            pubkey: nameAccountKey,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: nameUpdateSigner,
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
exports.updateInstruction = updateInstruction;
