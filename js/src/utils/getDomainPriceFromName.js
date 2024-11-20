"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDomainPriceFromName = void 0;
const graphemesplit_1 = __importDefault(require("graphemesplit"));
/**
 * This function can be used to retrieve the registration cost in USD of a domain
 * from its name
 * @param name - Domain name
 * @returns price
 */
const getDomainPriceFromName = (name) => {
    const split = (0, graphemesplit_1.default)(name);
    switch (split.length) {
        case 1:
            return 750;
        case 2:
            return 700;
        case 3:
            return 640;
        case 4:
            return 160;
        default:
            return 20;
    }
};
exports.getDomainPriceFromName = getDomainPriceFromName;
