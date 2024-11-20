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
exports.getTwitterRegistry = void 0;
const constants_1 = require("../constants");
const state_1 = require("../state");
const getHashedNameSync_1 = require("../utils/getHashedNameSync");
const getNameAccountKeySync_1 = require("../utils/getNameAccountKeySync");
function getTwitterRegistry(connection, twitter_handle) {
    return __awaiter(this, void 0, void 0, function* () {
        const hashedTwitterHandle = (0, getHashedNameSync_1.getHashedNameSync)(twitter_handle);
        const twitterHandleRegistryKey = (0, getNameAccountKeySync_1.getNameAccountKeySync)(hashedTwitterHandle, undefined, constants_1.TWITTER_ROOT_PARENT_REGISTRY_KEY);
        const { registry } = yield state_1.NameRegistryState.retrieve(connection, twitterHandleRegistryKey);
        return registry;
    });
}
exports.getTwitterRegistry = getTwitterRegistry;
