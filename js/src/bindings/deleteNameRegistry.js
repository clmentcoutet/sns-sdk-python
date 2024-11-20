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
exports.deleteNameRegistry = void 0;
const deleteInstruction_1 = require("../instructions/deleteInstruction");
const state_1 = require("../state");
const constants_1 = require("../constants");
const getHashedNameSync_1 = require("../utils/getHashedNameSync");
const getNameAccountKeySync_1 = require("../utils/getNameAccountKeySync");
/**
 * Delete the name account and transfer the rent to the target.
 *
 * @param connection The solana connection object to the RPC node
 * @param name The name of the name account
 * @param refundTargetKey The refund destination address
 * @param nameClass The class of this name, if it exsists
 * @param nameParent The parent name of this name, if it exists
 * @returns
 */
function deleteNameRegistry(connection, name, refundTargetKey, nameClass, nameParent) {
    return __awaiter(this, void 0, void 0, function* () {
        const hashed_name = (0, getHashedNameSync_1.getHashedNameSync)(name);
        const nameAccountKey = (0, getNameAccountKeySync_1.getNameAccountKeySync)(hashed_name, nameClass, nameParent);
        let nameOwner;
        if (nameClass) {
            nameOwner = nameClass;
        }
        else {
            nameOwner = (yield state_1.NameRegistryState.retrieve(connection, nameAccountKey))
                .registry.owner;
        }
        const changeAuthoritiesInstr = (0, deleteInstruction_1.deleteInstruction)(constants_1.NAME_PROGRAM_ID, nameAccountKey, refundTargetKey, nameOwner);
        return changeAuthoritiesInstr;
    });
}
exports.deleteNameRegistry = deleteNameRegistry;
