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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
const spl_name_service_1 = require("@bonfida/spl-name-service");
const utils_1 = require("@bonfida/utils");
const fs_1 = __importDefault(require("fs"));
const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("mainnet-beta"));
/**
 * Path to your private key
 */
const WALLET_PATH = "my-wallet.json";
const keypair = web3_js_1.Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs_1.default.readFileSync(WALLET_PATH).toString())));
/**
 * We want a 1kB sized domain (max 10kB)
 */
const space = 1 * 1000;
/**
 * Associated token account used for registration i.e your USDC address
 */
const ata = new web3_js_1.PublicKey("");
/**
 * The list of domains you want to register
 */
const DOMAIN_LIST_PATH = "domain-list.json";
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    const domains = JSON.parse(fs_1.default.readFileSync(DOMAIN_LIST_PATH).toString());
    console.log(`Registering ${domains.length} domains`);
    while (domains.length > 0) {
        // Register by batch of 5
        const slice = domains.splice(0, 5);
        const ixs = [];
        for (let x of slice) {
            // First check if domain already registered
            const reverseKey = yield (0, spl_name_service_1.getReverseKey)(x);
            const acc = yield connection.getAccountInfo(reverseKey);
            if (!!acc) {
                console.log(`Alredy registered: ${x}`);
                continue;
            }
            const ix = yield (0, spl_name_service_1.registerDomainName)(x, space, keypair.publicKey, ata);
            ixs.push(...ix.flat());
        }
        if (ixs.length === 0)
            continue;
        const tx = yield (0, utils_1.signAndSendInstructions)(connection, [], keypair, ixs);
        console.log(tx);
    }
});
run();
