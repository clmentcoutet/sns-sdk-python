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
exports.createNameRegistry = void 0;
const web3_js_1 = require("@solana/web3.js");
const createInstruction_1 = require("../instructions/createInstruction");
const int_1 = require("../int");
const utils_1 = require("../deprecated/utils");
const constants_1 = require("../constants");
const getHashedNameSync_1 = require("../utils/getHashedNameSync");
const getNameAccountKeySync_1 = require("../utils/getNameAccountKeySync");
/**
 * Creates a name account with the given rent budget, allocated space, owner and class.
 *
 * @param connection The solana connection object to the RPC node
 * @param name The name of the new account
 * @param space The space in bytes allocated to the account
 * @param payerKey The allocation cost payer
 * @param nameOwner The pubkey to be set as owner of the new name account
 * @param lamports The budget to be set for the name account. If not specified, it'll be the minimum for rent exemption
 * @param nameClass The class of this new name
 * @param parentName The parent name of the new name. If specified its owner needs to sign
 * @returns
 */
function createNameRegistry(connection, name, space, payerKey, nameOwner, lamports, nameClass, parentName) {
    return __awaiter(this, void 0, void 0, function* () {
        const hashed_name = (0, getHashedNameSync_1.getHashedNameSync)(name);
        const nameAccountKey = (0, getNameAccountKeySync_1.getNameAccountKeySync)(hashed_name, nameClass, parentName);
        const balance = lamports
            ? lamports
            : yield connection.getMinimumBalanceForRentExemption(space);
        let nameParentOwner;
        if (parentName) {
            const { registry: parentAccount } = yield (0, utils_1.getNameOwner)(connection, parentName);
            nameParentOwner = parentAccount.owner;
        }
        const createNameInstr = (0, createInstruction_1.createInstruction)(constants_1.NAME_PROGRAM_ID, web3_js_1.SystemProgram.programId, nameAccountKey, nameOwner, payerKey, hashed_name, new int_1.Numberu64(balance), new int_1.Numberu32(space), nameClass, parentName, nameParentOwner);
        return createNameInstr;
    });
}
exports.createNameRegistry = createNameRegistry;
