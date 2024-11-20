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
exports.changeTwitterRegistryData = void 0;
const constants_1 = require("../constants");
const updateInstruction_1 = require("../instructions/updateInstruction");
const getHashedNameSync_1 = require("../utils/getHashedNameSync");
const getNameAccountKeySync_1 = require("../utils/getNameAccountKeySync");
const int_1 = require("../int");
// Overwrite the data that is written in the user facing registry
// Signed by the verified pubkey
function changeTwitterRegistryData(twitterHandle, verifiedPubkey, offset, // The offset at which to write the input data into the NameRegistryData
input_data) {
    return __awaiter(this, void 0, void 0, function* () {
        const hashedTwitterHandle = (0, getHashedNameSync_1.getHashedNameSync)(twitterHandle);
        const twitterHandleRegistryKey = (0, getNameAccountKeySync_1.getNameAccountKeySync)(hashedTwitterHandle, undefined, constants_1.TWITTER_ROOT_PARENT_REGISTRY_KEY);
        const instructions = [
            (0, updateInstruction_1.updateInstruction)(constants_1.NAME_PROGRAM_ID, twitterHandleRegistryKey, new int_1.Numberu32(offset), input_data, verifiedPubkey),
        ];
        return instructions;
    });
}
exports.changeTwitterRegistryData = changeTwitterRegistryData;
