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
const hono_1 = require("hono");
const spl_name_service_1 = require("@bonfida/spl-name-service");
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
const cors_1 = require("hono/cors");
const logger_1 = require("hono/logger");
const zod_1 = require("zod");
const sns_records_1 = require("@bonfida/sns-records");
const USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
const isPubkey = (x) => {
    try {
        new web3_js_1.PublicKey(x);
        return true;
    }
    catch (_a) {
        return false;
    }
};
const booleanSchema = zod_1.z
    .union([zod_1.z.boolean(), zod_1.z.literal("true"), zod_1.z.literal("false")])
    .transform((value) => value === true || value === "true");
const getConnection = (c, clientRpc) => {
    var _a;
    return new web3_js_1.Connection(clientRpc || ((_a = c.env) === null || _a === void 0 ? void 0 : _a.RPC_URL), "processed");
};
function response(success, result) {
    return { s: success ? "ok" : "error", result };
}
const app = new hono_1.Hono();
app.use("*", (0, logger_1.logger)());
app.use("/*", (0, cors_1.cors)({ origin: "*" }));
app.get("/", (c) => __awaiter(void 0, void 0, void 0, function* () { return c.text("Visit https://github.com/Bonfida/sns-sdk"); }));
/**
 * Resolves to the current owner of the domain
 */
app.get("/resolve/:domain", (c) => __awaiter(void 0, void 0, void 0, function* () {
    const { domain } = c.req.param();
    const rpc = c.req.query("rpc");
    try {
        const res = yield (0, spl_name_service_1.resolve)(getConnection(c, rpc), domain);
        return c.json(response(true, res));
    }
    catch (err) {
        console.log(err);
        return c.json(response(false, "Domain not found"));
    }
}));
/**
 * Returns the public key of a domain
 */
app.get("/domain-key/:domain", (c) => {
    try {
        const { domain } = c.req.param();
        const Query = zod_1.z.object({
            record: zod_1.z.nativeEnum(spl_name_service_1.RecordVersion).optional(),
        });
        const { record } = Query.parse(c.req.query());
        const res = (0, spl_name_service_1.getDomainKeySync)(domain, record);
        return c.json(response(true, res.pubkey.toBase58()));
    }
    catch (err) {
        console.log(err);
        if (err instanceof zod_1.z.ZodError) {
            return c.json(response(false, "Invalid input"), 400);
        }
        else {
            return c.json(response(false, "Internal error"), 500);
        }
    }
});
/**
 * Returns all the domains of the specified owner
 */
app.get("/domains/:owner", (c) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { owner } = c.req.param();
        const rpc = c.req.query("rpc");
        const res = yield (0, spl_name_service_1.getAllDomains)(getConnection(c, rpc), new web3_js_1.PublicKey(owner));
        const revs = yield (0, spl_name_service_1.reverseLookupBatch)(getConnection(c, rpc), res);
        const tokenized = yield (0, spl_name_service_1.getTokenizedDomains)(getConnection(c, rpc), new web3_js_1.PublicKey(owner));
        return c.json(response(true, res
            .map((e, idx) => {
            return { key: e.toBase58(), domain: revs[idx] };
        })
            .concat(tokenized.map((e) => {
            return { key: e.key.toBase58(), domain: e.reverse };
        }))));
    }
    catch (err) {
        console.log(err);
        return c.json(response(false, "Invalid domain input"));
    }
}));
/**
 * Returns the public key of the reverse account for the specified domain
 */
app.get("/reverse-key/:domain", (c) => {
    try {
        const { domain } = c.req.param();
        const query = c.req.query("sub");
        const res = (0, spl_name_service_1.getReverseKeySync)(domain, query === "true");
        return c.json(response(true, res.toBase58()));
    }
    catch (err) {
        console.log(err);
        return c.json(response(false, "Invalid domain input"));
    }
});
/**
 * Returns the public key of the record for the specified domain
 */
app.get("/record-key/:domain/:record", (c) => {
    try {
        const Params = zod_1.z.object({
            domain: zod_1.z.string(),
            record: zod_1.z.nativeEnum(spl_name_service_1.Record),
        });
        const { domain, record } = Params.parse(c.req.param());
        const res = (0, spl_name_service_1.getRecordKeySync)(domain, record);
        return c.json(response(true, res.toBase58()));
    }
    catch (err) {
        console.log(err);
        if (err instanceof zod_1.z.ZodError) {
            return c.json(response(false, "Invalid input"), 400);
        }
        else {
            return c.json(response(false, "Internal error"), 500);
        }
    }
});
/**
 * Returns the base64 encoded content of a record for the specified domain
 */
app.get("/record/:domain/:record", (c) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const Query = zod_1.z.object({
            domain: zod_1.z.string(),
            record: zod_1.z.nativeEnum(spl_name_service_1.Record),
            rpc: zod_1.z.string().optional(),
        });
        const { domain, record, rpc } = Query.parse(c.req.param());
        const res = yield (0, spl_name_service_1.getRecord)(getConnection(c, rpc), domain, record);
        return c.json(response(true, (_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.toString("base64")));
    }
    catch (err) {
        console.log(err);
        if (err instanceof zod_1.z.ZodError) {
            return c.json(response(false, "Invalid input"), 400);
        }
        else {
            return c.json(response(false, "Internal error"), 500);
        }
    }
}));
/**
 * Returns the base64 encoded content of a record for the specified domain
 */
app.get("/record-v2/:domain/:record", (c) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Query = zod_1.z.object({
            domain: zod_1.z.string(),
            record: zod_1.z.nativeEnum(spl_name_service_1.Record),
            rpc: zod_1.z.string().optional(),
        });
        const { domain, record, rpc } = Query.parse(c.req.param());
        const connection = getConnection(c, rpc);
        const { registry } = yield spl_name_service_1.NameRegistryState.retrieve(connection, (0, spl_name_service_1.getDomainKeySync)(domain).pubkey);
        const owner = registry.owner;
        const res = yield (0, spl_name_service_1.getRecordV2)(connection, domain, record, {
            deserialize: true,
        });
        const stale = !res.retrievedRecord
            .getStalenessId()
            .equals(owner.toBuffer());
        let roa = undefined;
        if (spl_name_service_1.Record.SOL === record) {
            roa =
                res.retrievedRecord
                    .getRoAId()
                    .equals(res.retrievedRecord.getContent()) &&
                    res.retrievedRecord.header.rightOfAssociationValidation ===
                        sns_records_1.Validation.Solana;
        }
        else if ([spl_name_service_1.Record.ETH, spl_name_service_1.Record.BSC, spl_name_service_1.Record.Injective, spl_name_service_1.Record.BASE].includes(record)) {
            roa =
                res.retrievedRecord
                    .getRoAId()
                    .equals(res.retrievedRecord.getContent()) &&
                    res.retrievedRecord.header.rightOfAssociationValidation ===
                        sns_records_1.Validation.Ethereum;
        }
        else if ([spl_name_service_1.Record.Url]) {
            const guardian = spl_name_service_1.GUARDIANS.get(record);
            if (guardian) {
                roa =
                    res.retrievedRecord.getRoAId().equals(guardian.toBuffer()) &&
                        res.retrievedRecord.header.rightOfAssociationValidation ===
                            sns_records_1.Validation.Solana;
            }
        }
        return c.json(response(true, {
            deserialized: res.deserializedContent,
            stale,
            roa,
            record: {
                header: res.retrievedRecord.header,
                data: res.retrievedRecord.data.toString("base64"),
            },
        }));
    }
    catch (err) {
        console.log(err);
        if (err instanceof zod_1.z.ZodError) {
            return c.json(response(false, "Invalid input"), 400);
        }
        else {
            return c.json(response(false, "Internal error"), 500);
        }
    }
}));
/**
 * Returns the favorite domain for the specified owner and null if it does not exist
 */
app.get("/favorite-domain/:owner", (c) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { owner } = c.req.param();
        const rpc = c.req.query("rpc");
        const res = yield (0, spl_name_service_1.getFavoriteDomain)(getConnection(c, rpc), new web3_js_1.PublicKey(owner));
        return c.json(response(true, { domain: res.domain.toBase58(), reverse: res.reverse }));
    }
    catch (err) {
        console.log(err);
        if (err instanceof Error) {
            if (err.message.includes("Favourite domain not found")) {
                return c.json(response(true, null));
            }
        }
        return c.json(response(false, "Invalid domain input"));
    }
}));
/**
 * Returns the favorite domain for the specified owners (comma separated) and undefined if it does not exist
 */
app.get("/multiple-favorite-domains/:owners", (c) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { owners } = c.req.param();
        const rpc = c.req.query("rpc");
        const parsed = owners.split(",").map((e) => new web3_js_1.PublicKey(e));
        const res = yield (0, spl_name_service_1.getMultipleFavoriteDomains)(getConnection(c, rpc), parsed);
        return c.json(response(true, res));
    }
    catch (err) {
        console.log(err);
        if (err instanceof Error) {
            if (err.message.includes("Favourite domain not found")) {
                return c.json(response(true, null));
            }
        }
        return c.json(response(false, "Invalid domain input"));
    }
}));
/**
 * Returns the list of supported records
 */
app.get("/types/record", (c) => {
    return c.json(response(true, spl_name_service_1.Record));
});
/**
 * Returns the reverse domain for the specified public key
 */
app.get("/reverse-lookup/:pubkey", (c) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pubkey } = c.req.param();
        const rpc = c.req.query("rpc");
        const res = yield (0, spl_name_service_1.reverseLookup)(getConnection(c, rpc), new web3_js_1.PublicKey(pubkey));
        return c.json(response(true, res));
    }
    catch (err) {
        console.log(err);
        return c.json(response(false, "Invalid input"));
    }
}));
/**
 * Returns the subdomains for the specified parent
 */
app.get("/subdomains/:parent", (c) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { parent } = c.req.param();
        const rpc = c.req.query("rpc");
        const subs = yield (0, spl_name_service_1.findSubdomains)(getConnection(c, rpc), (0, spl_name_service_1.getDomainKeySync)(parent).pubkey);
        return c.json(response(true, subs));
    }
    catch (err) {
        console.log(err);
        return c.json(response(false, "Invalid input"));
    }
}));
/**
 * Returns a list of deserialized records. The list of records passed by URL query param must be comma separated.
 * In the case where a record does not exist, the data will be undefined
 */
app.get("/records/:domain", (c) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const { domain } = c.req.param();
        const rpc = c.req.query("rpc");
        const parsedRecords = (_b = c.req.query("records")) === null || _b === void 0 ? void 0 : _b.split(",");
        const recordSchema = zod_1.z.array(zod_1.z.nativeEnum(spl_name_service_1.Record));
        const records = recordSchema.parse(parsedRecords);
        if (!records || records.length === 0) {
            return c.json(response(false, "Missing records in URL query params"));
        }
        const res = yield (0, spl_name_service_1.getRecords)(getConnection(c, rpc), domain, records);
        const result = res.map((e, idx) => {
            var _a;
            return { record: records[idx], data: (_a = e === null || e === void 0 ? void 0 : e.data) === null || _a === void 0 ? void 0 : _a.toString("utf-8") };
        });
        return c.json(response(true, result));
    }
    catch (err) {
        console.log(err);
        if (err instanceof zod_1.z.ZodError) {
            return c.json(response(false, "Invalid input"), 400);
        }
        else {
            return c.json(response(false, "Internal error"), 500);
        }
    }
}));
/**
 * Returns a list of deserialized V2 records. The list of records passed by URL query param must be comma separated.
 * In the case where a record does not exist, the data will not be included in the result.
 */
app.get("/records-v2/:domain", (c) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const { domain } = c.req.param();
        const rpc = c.req.query("rpc");
        const parsedRecords = (_c = c.req.query("records")) === null || _c === void 0 ? void 0 : _c.split(",");
        const recordSchema = zod_1.z.array(zod_1.z.nativeEnum(spl_name_service_1.Record));
        const records = recordSchema.parse(parsedRecords);
        if (!records || records.length === 0) {
            return c.json(response(false, "Missing records in URL query params"));
        }
        const connection = getConnection(c, rpc);
        const { registry } = yield spl_name_service_1.NameRegistryState.retrieve(connection, (0, spl_name_service_1.getDomainKeySync)(domain).pubkey);
        const owner = registry.owner;
        const results = [];
        const recordsV2 = yield (0, spl_name_service_1.getMultipleRecordsV2)(connection, domain, records, {
            deserialize: true,
        });
        for (const res of recordsV2) {
            if (res === undefined)
                break;
            const stale = !res.retrievedRecord
                .getStalenessId()
                .equals(owner.toBuffer());
            const { record } = res;
            let roa = undefined;
            if (spl_name_service_1.Record.SOL === record) {
                roa =
                    res.retrievedRecord
                        .getRoAId()
                        .equals(res.retrievedRecord.getContent()) &&
                        res.retrievedRecord.header.rightOfAssociationValidation ===
                            sns_records_1.Validation.Solana;
            }
            else if ([
                spl_name_service_1.Record.ETH,
                spl_name_service_1.Record.BSC,
                spl_name_service_1.Record.Injective,
                spl_name_service_1.Record.BASE
            ].includes(record)) {
                roa =
                    res.retrievedRecord
                        .getRoAId()
                        .equals(res.retrievedRecord.getContent()) &&
                        res.retrievedRecord.header.rightOfAssociationValidation ===
                            sns_records_1.Validation.Ethereum;
            }
            else if ([spl_name_service_1.Record.Url]) {
                const guardian = spl_name_service_1.GUARDIANS.get(record);
                if (guardian) {
                    roa =
                        res.retrievedRecord.getRoAId().equals(guardian.toBuffer()) &&
                            res.retrievedRecord.header.rightOfAssociationValidation ===
                                sns_records_1.Validation.Solana;
                }
            }
            results.push({
                type: res.record,
                deserialized: res.deserializedContent,
                stale,
                roa,
                record: {
                    header: res.retrievedRecord.header,
                    data: res.retrievedRecord.data.toString("base64"),
                },
            });
        }
        ;
        return c.json(response(true, results));
    }
    catch (err) {
        console.log(err);
        if (err instanceof zod_1.z.ZodError) {
            return c.json(response(false, "Invalid input"), 400);
        }
        else {
            return c.json(response(false, "Internal error"), 500);
        }
    }
}));
/**
 * Returns twitter handle
 */
app.get("/twitter/get-handle-by-key/:key", (c) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { key } = c.req.param();
        const rpc = c.req.query("rpc");
        const connection = getConnection(c, rpc);
        const [handle] = yield (0, spl_name_service_1.getHandleAndRegistryKey)(connection, new web3_js_1.PublicKey(key));
        return c.json(response(true, handle));
    }
    catch (err) {
        console.log(err);
        return c.json(response(false, "Invalid input"));
    }
}));
app.get("/twitter/get-key-by-handle/:handle", (c) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { handle } = c.req.param();
        const rpc = c.req.query("rpc");
        const connection = getConnection(c, rpc);
        const registry = yield (0, spl_name_service_1.getTwitterRegistry)(connection, handle);
        return c.json(response(true, registry.owner.toBase58()));
    }
    catch (err) {
        console.log(err);
        return c.json(response(false, "Invalid input"));
    }
}));
////////////////////////////////////////////////////////////////
// Instruction
////////////////////////////////////////////////////////////////
/**
 * Returns the base64 transaction to register a domain
 */
app.get("/register", (c) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Query = zod_1.z.object({
            buyerStr: zod_1.z.string().refine(isPubkey),
            domain: zod_1.z.string(),
            space: zod_1.z.number().min(0),
            serialize: booleanSchema.optional(),
            refKey: zod_1.z.string().refine(isPubkey).optional(),
            mintStr: zod_1.z.string().refine(isPubkey).optional(),
            rpc: zod_1.z.string().optional(),
        });
        const { buyerStr, domain, space, serialize, refKey, mintStr, rpc } = Query.parse(c.req.query());
        const buyer = new web3_js_1.PublicKey(buyerStr);
        const mint = new web3_js_1.PublicKey(mintStr || USDC_MINT);
        const ata = yield (0, spl_token_1.getAssociatedTokenAddress)(mint, buyer, true);
        const connection = getConnection(c, rpc);
        const ixs = yield (0, spl_name_service_1.registerDomainNameV2)(connection, domain, space, buyer, ata, mint, refKey ? new web3_js_1.PublicKey(refKey) : undefined);
        if (serialize) {
            const tx = new web3_js_1.Transaction().add(...ixs);
            tx.feePayer = buyer;
            tx.recentBlockhash = (yield connection.getLatestBlockhash()).blockhash;
            const ser = tx.serialize({
                requireAllSignatures: false,
                verifySignatures: false,
            });
            return c.json(response(true, ser));
        }
        const result = [];
        for (let i of ixs) {
            result.push({
                programId: i.programId.toBase58(),
                keys: i.keys.map((e) => {
                    return {
                        isSigner: e.isSigner,
                        isWritable: e.isWritable,
                        pubkey: e.pubkey.toBase58(),
                    };
                }),
                data: i.data.toString("base64"),
            });
        }
        return c.json(response(true, result));
    }
    catch (err) {
        console.log(err);
        if (err instanceof zod_1.z.ZodError) {
            return c.json(response(false, "Invalid input"), 400);
        }
        else {
            return c.json(response(false, "Internal error"), 500);
        }
    }
}));
/**
 * Returns the base64 transaction to create a sub domain
 */
app.get("/create-sub", (c) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Query = zod_1.z.object({
            owner: zod_1.z.string().refine(isPubkey),
            subdomain: zod_1.z.string(),
            rpc: zod_1.z.string().optional(),
            serialize: booleanSchema.optional(),
            finalOwner: zod_1.z.string().refine(isPubkey).optional(),
        });
        const { owner, subdomain, rpc, serialize, finalOwner } = Query.parse(c.req.query());
        const connection = getConnection(c, rpc);
        const ixs = [];
        const ix = yield (0, spl_name_service_1.createSubdomain)(connection, subdomain, new web3_js_1.PublicKey(owner), 0);
        ixs.push(...ix);
        if (finalOwner) {
            const ix = (0, spl_name_service_1.transferInstruction)(spl_name_service_1.NAME_PROGRAM_ID, (0, spl_name_service_1.getDomainKeySync)(subdomain).pubkey, new web3_js_1.PublicKey(finalOwner), new web3_js_1.PublicKey(owner));
            ixs.push(ix);
        }
        if (serialize) {
            const tx = new web3_js_1.Transaction().add(...ixs);
            tx.feePayer = new web3_js_1.PublicKey(owner);
            tx.recentBlockhash = (yield connection.getLatestBlockhash()).blockhash;
            const ser = tx.serialize({
                requireAllSignatures: false,
                verifySignatures: false,
            });
            return c.json(response(true, ser));
        }
        const result = [];
        for (let i of ixs) {
            result.push({
                programId: i.programId.toBase58(),
                keys: i.keys.map((e) => {
                    return {
                        isSigner: e.isSigner,
                        isWritable: e.isWritable,
                        pubkey: e.pubkey.toBase58(),
                    };
                }),
                data: i.data.toString("base64"),
            });
        }
        return c.json(response(true, result));
    }
    catch (err) {
        console.log(err);
        if (err instanceof zod_1.z.ZodError) {
            return c.json(response(false, "Invalid input"), 400);
        }
        else {
            return c.json(response(false, "Internal error"), 500);
        }
    }
}));
/**
 * Returns the base64 encoded data of a .sol domain
 */
app.get("/domain-data/:domain", (c) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { domain } = c.req.param();
        const rpc = c.req.query("rpc");
        const connection = getConnection(c, rpc);
        const { pubkey: domainKey } = (0, spl_name_service_1.getDomainKeySync)(domain);
        const info = yield connection.getAccountInfo(domainKey);
        if (!info) {
            return c.json(response(false, "Domain not found"));
        }
        const base64Data = info.data.slice(96).toString("base64");
        return c.json(response(true, base64Data));
    }
    catch (err) {
        console.log(err);
        return c.json(response(false, "Error fetching domain data"));
    }
}));
exports.default = app;
