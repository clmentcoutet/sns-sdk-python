"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Numberu64 = exports.Numberu32 = void 0;
const buffer_1 = require("buffer");
const error_1 = require("./error");
class Numberu32 {
    constructor(value) {
        this.value = BigInt(value);
    }
    /**
     * Convert to Buffer representation
     */
    toBuffer() {
        const a = buffer_1.Buffer.alloc(4);
        a.writeUInt32LE(Number(this.value));
        return a;
    }
    /**
     * Construct a Numberu32 from Buffer representation
     */
    static fromBuffer(buffer) {
        if (buffer.length !== 4) {
            throw new error_1.InvalidBufferLengthError(`Invalid buffer length: ${buffer.length}`);
        }
        const value = BigInt(buffer.readUInt32LE(0));
        return new Numberu32(value);
    }
    toNumber() {
        return Number(this.value);
    }
    toString() {
        return String(this.value);
    }
}
exports.Numberu32 = Numberu32;
class Numberu64 {
    constructor(value) {
        this.value = BigInt(value);
    }
    /**
     * Convert to Buffer representation
     */
    toBuffer() {
        const a = buffer_1.Buffer.alloc(8);
        a.writeBigUInt64LE(this.value);
        return a;
    }
    /**
     * Construct a Numberu64 from Buffer representation
     */
    static fromBuffer(buffer) {
        if (buffer.length !== 8) {
            new error_1.U64OverflowError(`Invalid buffer length: ${buffer.length}`);
        }
        const value = buffer.readBigUInt64LE(0);
        return new Numberu64(value);
    }
    toNumber() {
        return Number(this.value);
    }
    toString() {
        return String(this.value);
    }
}
exports.Numberu64 = Numberu64;
