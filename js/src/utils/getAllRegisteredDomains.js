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
exports.getAllRegisteredDomains = void 0;
const constants_1 = require("../constants");
/**
 * This function can be used to retrieve all the registered `.sol` domains.
 * The account data is sliced to avoid enormous payload and only the owner is returned
 * @param connection The Solana RPC connection object
 * @returns
 */
const getAllRegisteredDomains = (connection) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = [
        {
            memcmp: {
                offset: 0,
                bytes: constants_1.ROOT_DOMAIN_ACCOUNT.toBase58(),
            },
        },
    ];
    const dataSlice = { offset: 32, length: 32 };
    const accounts = yield connection.getProgramAccounts(constants_1.NAME_PROGRAM_ID, {
        dataSlice,
        filters,
    });
    return accounts;
});
exports.getAllRegisteredDomains = getAllRegisteredDomains;
