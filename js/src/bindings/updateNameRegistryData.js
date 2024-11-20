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
exports.updateNameRegistryData = void 0;
const updateInstruction_1 = require("../instructions/updateInstruction");
const state_1 = require("../state");
const int_1 = require("../int");
const constants_1 = require("../constants");
const getHashedNameSync_1 = require("../utils/getHashedNameSync");
const getNameAccountKeySync_1 = require("../utils/getNameAccountKeySync");
/**
 * Overwrite the data of the given name registry.
 *
 * @param connection The solana connection object to the RPC node
 * @param name The name of the name registry to update
 * @param offset The offset to which the data should be written into the registry
 * @param input_data The data to be written
 * @param nameClass The class of this name, if it exsists
 * @param nameParent The parent name of this name, if it exists
 */
function updateNameRegistryData(connection, name, offset, input_data, nameClass, nameParent) {
    return __awaiter(this, void 0, void 0, function* () {
        const hashed_name = (0, getHashedNameSync_1.getHashedNameSync)(name);
        const nameAccountKey = (0, getNameAccountKeySync_1.getNameAccountKeySync)(hashed_name, nameClass, nameParent);
        let signer;
        if (nameClass) {
            signer = nameClass;
        }
        else {
            signer = (yield state_1.NameRegistryState.retrieve(connection, nameAccountKey))
                .registry.owner;
        }
        const updateInstr = (0, updateInstruction_1.updateInstruction)(constants_1.NAME_PROGRAM_ID, nameAccountKey, new int_1.Numberu32(offset), input_data, signer);
        return updateInstr;
    });
}
exports.updateNameRegistryData = updateNameRegistryData;
