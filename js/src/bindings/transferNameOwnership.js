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
exports.transferNameOwnership = void 0;
const transferInstruction_1 = require("../instructions/transferInstruction");
const state_1 = require("../state");
const constants_1 = require("../constants");
const getHashedNameSync_1 = require("../utils/getHashedNameSync");
const getNameAccountKeySync_1 = require("../utils/getNameAccountKeySync");
/**
 * Change the owner of a given name account.
 *
 * @param connection The solana connection object to the RPC node
 * @param name The name of the name account
 * @param newOwner The new owner to be set
 * @param nameClass The class of this name, if it exsists
 * @param nameParent The parent name of this name, if it exists
 * @param parentOwner Parent name owner
 * @returns
 */
function transferNameOwnership(connection, name, newOwner, nameClass, nameParent, parentOwner) {
    return __awaiter(this, void 0, void 0, function* () {
        const hashed_name = (0, getHashedNameSync_1.getHashedNameSync)(name);
        const nameAccountKey = (0, getNameAccountKeySync_1.getNameAccountKeySync)(hashed_name, nameClass, nameParent);
        let curentNameOwner;
        if (nameClass) {
            curentNameOwner = nameClass;
        }
        else {
            curentNameOwner = (yield state_1.NameRegistryState.retrieve(connection, nameAccountKey)).registry.owner;
        }
        const transferInstr = (0, transferInstruction_1.transferInstruction)(constants_1.NAME_PROGRAM_ID, nameAccountKey, newOwner, curentNameOwner, nameClass, nameParent, parentOwner);
        return transferInstr;
    });
}
exports.transferNameOwnership = transferNameOwnership;
