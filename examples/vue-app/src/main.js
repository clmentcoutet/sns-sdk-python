"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
require("./style.css");
const app_vue_1 = __importDefault(require("./app.vue"));
const solana_1 = require("./utils/solana");
(0, solana_1.initSolanaConnection)();
(0, vue_1.createApp)(app_vue_1.default).mount('#app');
