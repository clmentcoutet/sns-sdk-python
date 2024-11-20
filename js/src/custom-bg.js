"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArtistPubkey = exports.getCustomBgKeys = void 0;
const web3_js_1 = require("@solana/web3.js");
const constants_1 = require("./constants");
const custom_bg_1 = require("./types/custom-bg");
const getHashedNameSync_1 = require("./utils/getHashedNameSync");
const getNameAccountKeySync_1 = require("./utils/getNameAccountKeySync");
const error_1 = require("./error");
const DEGEN_POET_KEY = new web3_js_1.PublicKey("ART5dr4bDic2sQVZoFheEmUxwQq5VGSx9he7JxHcXNQD");
const RBG_0x00_KEY = new web3_js_1.PublicKey("CSWvuDHXExVGEMR9kP8xYAHuNjXogeRck9Cnr312CC9g");
const RETARDIO_KEY = new web3_js_1.PublicKey("J2Q2j6kpSg7tq8JzueCHNTQNcyNnQkvr85RhsFnYZWeG");
const NUMBER_ART_KEY = new web3_js_1.PublicKey("6vwnZJZNQjtY4zR93YUuyeDUBhacLLH2mQaZiJAvVwzu");
const getCustomBgKeys = (domain, customBg) => {
    const hashedBg = (0, getHashedNameSync_1.getHashedNameSync)(customBg);
    const hashedDomain = (0, getHashedNameSync_1.getHashedNameSync)(domain);
    const domainKey = (0, getNameAccountKeySync_1.getNameAccountKeySync)(hashedDomain, undefined, constants_1.CUSTOM_BG_TLD);
    const bgKey = (0, getNameAccountKeySync_1.getNameAccountKeySync)(hashedBg, undefined, domainKey);
    return { domainKey, bgKey };
};
exports.getCustomBgKeys = getCustomBgKeys;
const getArtistPubkey = (bg) => {
    switch (bg) {
        case custom_bg_1.CustomBg.DegenPoet1:
            return DEGEN_POET_KEY;
        case custom_bg_1.CustomBg.Rgb0x001:
            return RBG_0x00_KEY;
        case custom_bg_1.CustomBg.Retardio1:
            return RETARDIO_KEY;
        case custom_bg_1.CustomBg.Retardio2:
            return RETARDIO_KEY;
        case custom_bg_1.CustomBg.Retardio3:
            return RETARDIO_KEY;
        case custom_bg_1.CustomBg.NumberArt0:
        case custom_bg_1.CustomBg.NumberArt1:
        case custom_bg_1.CustomBg.NumberArt2:
        case custom_bg_1.CustomBg.NumberArt3:
        case custom_bg_1.CustomBg.NumberArt4:
        case custom_bg_1.CustomBg.NumberArt5:
        case custom_bg_1.CustomBg.NumberArt6:
        case custom_bg_1.CustomBg.NumberArt7:
        case custom_bg_1.CustomBg.NumberArt8:
        case custom_bg_1.CustomBg.NumberArt9:
            return NUMBER_ART_KEY;
        default:
            throw new error_1.InvalidCustomBgError("The given background is invalid");
    }
};
exports.getArtistPubkey = getArtistPubkey;
