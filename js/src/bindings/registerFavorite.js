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
exports.setPrimaryDomain = exports.registerFavorite = void 0;
const web3_js_1 = require("@solana/web3.js");
const registerFavoriteInstruction_1 = require("../instructions/registerFavoriteInstruction");
const favorite_domain_1 = require("../favorite-domain");
const state_1 = require("../state");
const constants_1 = require("../constants");
/**
 * This function can be used to register a domain name as favorite
 * @param nameAccount The name account being registered as favorite
 * @param owner The owner of the name account
 * @param programId The name offer program ID
 * @returns
 */
const registerFavorite = (connection, nameAccount, owner) => __awaiter(void 0, void 0, void 0, function* () {
    let parent = undefined;
    const { registry } = yield state_1.NameRegistryState.retrieve(connection, nameAccount);
    if (!registry.parentName.equals(constants_1.ROOT_DOMAIN_ACCOUNT)) {
        parent = registry.parentName;
    }
    const [favKey] = yield favorite_domain_1.FavouriteDomain.getKey(favorite_domain_1.NAME_OFFERS_ID, owner);
    const ix = new registerFavoriteInstruction_1.registerFavoriteInstruction().getInstruction(favorite_domain_1.NAME_OFFERS_ID, nameAccount, favKey, owner, web3_js_1.SystemProgram.programId, parent);
    return ix;
});
exports.registerFavorite = registerFavorite;
exports.setPrimaryDomain = exports.registerFavorite;
