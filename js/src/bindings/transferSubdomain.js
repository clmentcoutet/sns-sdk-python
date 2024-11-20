"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transferSubdomain = void 0;
const transferInstruction_1 = require("../instructions/transferInstruction");
const state_1 = require("../state");
const constants_1 = require("../constants");
const getDomainKeySync_1 = require("../utils/getDomainKeySync");
const error_1 = require("../error");
/**
 * This function is used to transfer the ownership of a subdomain in the Solana Name Service.
 *
 * @param {Connection} connection - The Solana RPC connection object.
 * @param {string} subdomain - The subdomain to transfer. It can be with or without .sol suffix (e.g., 'something.bonfida.sol' or 'something.bonfida').
 * @param {PublicKey} newOwner - The public key of the new owner of the subdomain.
 * @param {boolean} [isParentOwnerSigner=false] - A flag indicating whether the parent name owner is signing this transfer.
 * @param {PublicKey} [owner] - The public key of the current owner of the subdomain. This is an optional parameter. If not provided, the owner will be resolved automatically. This can be helpful to build transactions when the subdomain does not exist yet.
 *
 * @returns {Promise<TransactionInstruction>} - A promise that resolves to a Solana instruction for the transfer operation.
 */
const transferSubdomain = (connection, subdomain, newOwner, isParentOwnerSigner, owner) => __awaiter(void 0, void 0, void 0, function* () {
    const { pubkey, isSub, parent } = (0, getDomainKeySync_1.getDomainKeySync)(subdomain);
    if (!parent || !isSub) {
        throw new error_1.InvalidSubdomainError("The subdomain is not valid");
    }
    if (!owner) {
        const { registry } = yield state_1.NameRegistryState.retrieve(connection, pubkey);
        owner = registry.owner;
    }
    let nameParent = undefined;
    let nameParentOwner = undefined;
    if (isParentOwnerSigner) {
        nameParent = parent;
        nameParentOwner = (yield state_1.NameRegistryState.retrieve(connection, parent))
            .registry.owner;
    }
    const ix = (0, transferInstruction_1.transferInstruction)(constants_1.NAME_PROGRAM_ID, pubkey, newOwner, owner, undefined, nameParent, nameParentOwner);
    return ix;
});
exports.transferSubdomain = transferSubdomain;
