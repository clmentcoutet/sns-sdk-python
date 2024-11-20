"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const globals_1 = require("@jest/globals");
const getDomainPriceFromName_1 = require("../src/utils/getDomainPriceFromName");
(0, globals_1.describe)("getDomainPriceFromName", () => {
    globals_1.test.each([
        ["1", 750],
        ["✅", 750],
        ["요", 750],
        ["👩‍👩‍👧", 750],
        ["10", 700],
        ["1✅", 700],
        ["👩‍👩‍👧✅", 700],
        ["독도", 700],
        ["100", 640],
        ["10✅", 640],
        ["1독도", 640],
        ["1000", 160],
        ["100✅", 160],
        ["10000", 20],
        ["1000✅", 20],
        ["fêtes", 20],
    ])("value %s to be %s", (value, expected) => {
        (0, globals_1.expect)((0, getDomainPriceFromName_1.getDomainPriceFromName)(value)).toBe(expected);
    });
});
