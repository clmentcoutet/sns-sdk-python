"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHashedNameSync = void 0;
const buffer_1 = require("buffer");
const sha256_1 = require("@noble/hashes/sha256");
const constants_1 = require("../constants");
const getHashedNameSync = (name) => {
    const input = constants_1.HASH_PREFIX + name;
    const hashed = (0, sha256_1.sha256)(buffer_1.Buffer.from(input, "utf8"));
    return buffer_1.Buffer.from(hashed);
};
exports.getHashedNameSync = getHashedNameSync;
