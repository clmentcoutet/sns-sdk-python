"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIpfsRecord = void 0;
const record_1 = require("../../types/record");
const getRecord_1 = require("../getRecord");
/**
 * This function can be used to retrieve the IPFS record of a domain name
 * @param connection The Solana RPC connection object
 * @param domain The .sol domain name
 * @returns
 */
const getIpfsRecord = (connection, domain) => {
    return (0, getRecord_1.getRecord)(connection, domain, record_1.Record.IPFS, true);
};
exports.getIpfsRecord = getIpfsRecord;
