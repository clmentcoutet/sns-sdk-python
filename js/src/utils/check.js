"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.check = void 0;
const check = (bool, error) => {
    if (!bool) {
        throw error;
    }
};
exports.check = check;
