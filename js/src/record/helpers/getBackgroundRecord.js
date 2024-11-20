"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBackgroundRecord = void 0;
const record_1 = require("../../types/record");
const getRecord_1 = require("../getRecord");
/**
 * This function can be used to deserialize the content of a record. If the content is invalid it will throw an error
 * This function can be used to retrieve the Background record (V1) of a domain name
 * @param connection The Solana RPC connection object
 * @param domain The .sol domain name
 * @returns
 */
const getBackgroundRecord = (connection, domain) => {
    return (0, getRecord_1.getRecord)(connection, domain, record_1.Record.Background, true);
};
exports.getBackgroundRecord = getBackgroundRecord;
