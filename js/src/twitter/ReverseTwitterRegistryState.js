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
exports.ReverseTwitterRegistryState = void 0;
const borsh_1 = require("borsh");
const state_1 = require("../state");
const error_1 = require("../error");
class ReverseTwitterRegistryState {
    constructor(obj) {
        this.twitterRegistryKey = obj.twitterRegistryKey;
        this.twitterHandle = obj.twitterHandle;
    }
    static retrieve(connection, reverseTwitterAccountKey) {
        return __awaiter(this, void 0, void 0, function* () {
            let reverseTwitterAccount = yield connection.getAccountInfo(reverseTwitterAccountKey, "processed");
            if (!reverseTwitterAccount) {
                throw new error_1.InvalidReverseTwitterError("The reverse twitter account was not found");
            }
            const res = new ReverseTwitterRegistryState((0, borsh_1.deserialize)(ReverseTwitterRegistryState.schema, reverseTwitterAccount.data.slice(state_1.NameRegistryState.HEADER_LEN)));
            return res;
        });
    }
}
exports.ReverseTwitterRegistryState = ReverseTwitterRegistryState;
ReverseTwitterRegistryState.schema = {
    struct: {
        twitterRegistryKey: { array: { type: "u8", len: 32 } },
        twitterHandle: "string",
    },
};
