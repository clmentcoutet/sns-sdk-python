require("dotenv").config();
import { test, jest } from "@jest/globals";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { burnDomain } from "../src/bindings/burnDomain";

jest.setTimeout(20_000);

const connection = new Connection("https://magical-powerful-river.solana-mainnet.quiknode.pro/05acdc3d91f32f7df8072adb49ee7e4e893e8139");

const OWNER = new PublicKey("3Wnd5Df69KitZfUoPYZU438eFRNwGHkhLnSAWL65PxJX");

test("Burn", async () => {
  const tx = new Transaction();
  const ix = burnDomain("1automotive", OWNER, OWNER);
  tx.add(ix);
  const { blockhash } = await connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  tx.feePayer = OWNER;
  const res = await connection.simulateTransaction(tx);
  expect(res.value.err).toBe(null);
});
