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
exports.NameRegistryState = void 0;
const web3_js_1 = require("@solana/web3.js");
const retrieveNftOwnerV2_1 = require("./nft/retrieveNftOwnerV2");
const borsh_1 = require("borsh");
const error_1 = require("./error");
class NameRegistryState {
    constructor(obj) {
        this.parentName = new web3_js_1.PublicKey(obj.parentName);
        this.owner = new web3_js_1.PublicKey(obj.owner);
        this.class = new web3_js_1.PublicKey(obj.class);
    }
    static deserialize(data) {
        const res = new NameRegistryState((0, borsh_1.deserialize)(this.schema, data));
        res.data = data === null || data === void 0 ? void 0 : data.slice(this.HEADER_LEN);
        return res;
    }
    static retrieve(connection, nameAccountKey) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const nameAccount = yield connection.getAccountInfo(nameAccountKey);
            if (!nameAccount) {
                throw new error_1.AccountDoesNotExistError(`The name account does not exist`);
            }
            const res = new NameRegistryState((0, borsh_1.deserialize)(this.schema, nameAccount.data));
            res.data = (_a = nameAccount.data) === null || _a === void 0 ? void 0 : _a.slice(this.HEADER_LEN);
            const nftOwner = yield (0, retrieveNftOwnerV2_1.retrieveNftOwnerV2)(connection, nameAccountKey);
            return { registry: res, nftOwner };
        });
    }
    static _retrieveBatch(connection, nameAccountKeys) {
        return __awaiter(this, void 0, void 0, function* () {
            const nameAccounts = yield connection.getMultipleAccountsInfo(nameAccountKeys);
            const fn = (data) => {
                if (!data)
                    return undefined;
                const res = new NameRegistryState((0, borsh_1.deserialize)(this.schema, data));
                res.data = data === null || data === void 0 ? void 0 : data.slice(this.HEADER_LEN);
                return res;
            };
            return nameAccounts.map((e) => fn(e === null || e === void 0 ? void 0 : e.data));
        });
    }
    static retrieveBatch(connection, nameAccountKeys) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = [];
            const keys = [...nameAccountKeys];
            while (keys.length > 0) {
                result.push(...(yield this._retrieveBatch(connection, keys.splice(0, 100))));
            }
            return result;
        });
    }
}
exports.NameRegistryState = NameRegistryState;
NameRegistryState.HEADER_LEN = 96;
NameRegistryState.schema = {
    struct: {
        parentName: { array: { type: "u8", len: 32 } },
        owner: { array: { type: "u8", len: 32 } },
        class: { array: { type: "u8", len: 32 } },
    },
};
