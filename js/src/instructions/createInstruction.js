"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInstruction = void 0;
const buffer_1 = require("buffer");
const web3_js_1 = require("@solana/web3.js");
const int_1 = require("../int");
function createInstruction(nameProgramId, systemProgramId, nameKey, nameOwnerKey, payerKey, hashed_name, lamports, space, nameClassKey, nameParent, nameParentOwner) {
    const buffers = [
        buffer_1.Buffer.from(Int8Array.from([0])),
        new int_1.Numberu32(hashed_name.length).toBuffer(),
        hashed_name,
        lamports.toBuffer(),
        space.toBuffer(),
    ];
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
            pubkey: nameKey,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: nameOwnerKey,
            isSigner: false,
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
    else {
        keys.push({
            pubkey: new web3_js_1.PublicKey(buffer_1.Buffer.alloc(32)),
            isSigner: false,
            isWritable: false,
        });
    }
    if (nameParent) {
        keys.push({
            pubkey: nameParent,
            isSigner: false,
            isWritable: false,
        });
    }
    else {
        keys.push({
            pubkey: new web3_js_1.PublicKey(buffer_1.Buffer.alloc(32)),
            isSigner: false,
            isWritable: false,
        });
    }
    if (nameParentOwner) {
        keys.push({
            pubkey: nameParentOwner,
            isSigner: true,
            isWritable: false,
        });
    }
    return new web3_js_1.TransactionInstruction({
        keys,
        programId: nameProgramId,
        data,
    });
}
exports.createInstruction = createInstruction;
