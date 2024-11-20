"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserializeReverse = void 0;
function deserializeReverse(data, trimFirstNullByte = false) {
    if (!data)
        return undefined;
    const nameLength = data.slice(0, 4).readUInt32LE(0);
    return data
        .slice(4, 4 + nameLength)
        .toString()
        .replace(/^\0/, trimFirstNullByte ? "" : "\0");
}
exports.deserializeReverse = deserializeReverse;
