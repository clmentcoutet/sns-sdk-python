require("dotenv").config();
import { test, expect, jest } from "@jest/globals";
import {
  getFavoriteDomain,
  getMultipleFavoriteDomains,
} from "../src/favorite-domain";
import { PublicKey, Connection, Keypair, Transaction } from "@solana/web3.js";
import { registerFavorite } from "../src/bindings/registerFavorite";
import { getDomainKeySync } from "../src/utils/getDomainKeySync";

jest.setTimeout(10_000);

const connection = new Connection("https://magical-powerful-river.solana-mainnet.quiknode.pro/05acdc3d91f32f7df8072adb49ee7e4e893e8139");

test("Favorite domain", async () => {
  const items = [
    {
      user: new PublicKey("FidaeBkZkvDqi1GXNEwB8uWmj9Ngx2HXSS5nyGRuVFcZ"),
      favorite: {
        domain: new PublicKey("Crf8hzfthWGbGbLTVCiqRqV5MVnbpHB1L9KQMd6gsinb"),
        reverse: "bonfida",
        stale: true,
      },
    },
    {
      user: new PublicKey("HKKp49qGWXd639QsuH7JiLijfVW5UtCVY4s1n2HANwEA"),
      favorite: {
        domain: new PublicKey("Crf8hzfthWGbGbLTVCiqRqV5MVnbpHB1L9KQMd6gsinb"),
        reverse: "bonfida",
        stale: false,
      },
    },
    {
      user: new PublicKey("A41TAGFpQkFpJidLwH37ydunE7Q3jpBaS228RkoXiRQk"),
      favorite: {
        domain: new PublicKey("BaQq8Uib3Aw5SPBedC8MdYCvpfEC9iLkUMHc5M74sAjv"),
        reverse: "1.00728",
        stale: false,
      },
    },
  ];
  for (let item of items) {
    const fav = await getFavoriteDomain(connection, item.user);

    expect(fav.domain.toBase58()).toBe(item.favorite.domain.toBase58());
    expect(fav.reverse).toBe(item.favorite.reverse);
    expect(fav.stale).toBe(item.favorite.stale);
  }
});

test("Multiple favorite domains", async () => {
  const items = [
    // Non tokenized
    {
      wallet: new PublicKey("HKKp49qGWXd639QsuH7JiLijfVW5UtCVY4s1n2HANwEA"),
      domain: "bonfida",
    },
    // Stale non tokenized
    {
      wallet: new PublicKey("FidaeBkZkvDqi1GXNEwB8uWmj9Ngx2HXSS5nyGRuVFcZ"),
      domain: undefined,
    },
    // Random pubkey
    { wallet: Keypair.generate().publicKey, domain: undefined },
    // Tokenized
    {
      wallet: new PublicKey("36Dn3RWhB8x4c83W6ebQ2C2eH9sh5bQX2nMdkP2cWaA4"),
      domain: "fav-tokenized",
    },
    {
      wallet: new PublicKey("A41TAGFpQkFpJidLwH37ydunE7Q3jpBaS228RkoXiRQk"),
      domain: "1.00728",
    },
  ];
  const result = await getMultipleFavoriteDomains(
    connection,
    items.map((e) => e.wallet),
  );
  result.forEach((x, idx) => expect(x).toBe(items[idx].domain));
});

test("Register fav", async () => {
  const owner = new PublicKey("Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8");
  const tx = new Transaction();
  const ix = await registerFavorite(
    connection,
    getDomainKeySync("wallet-guide-3").pubkey,
    owner,
  );
  tx.add(ix);
  const { blockhash } = await connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  tx.feePayer = owner;
  const res = await connection.simulateTransaction(tx);
  expect(res.value.err).toBe(null);
});
