import { Connection, PublicKey } from "@solana/web3.js";
import { NameRegistryState } from "../state";

import { deserializeReverse } from "./deserializeReverse";
import {getReverseKeyFromDomainKey} from "./getReverseKeyFromDomainKey";

/**
 * This function can be used to perform a reverse look up
 * @param connection The Solana RPC connection
 * @param nameAccounts The public keys of the domains to look up
 * @returns The human readable domain names
 */
export async function reverseLookupBatch(
  connection: Connection,
  nameAccounts: PublicKey[],
): Promise<(string | undefined)[]> {
  let reverseLookupAccounts: PublicKey[] = [];
  for (let nameAccount of nameAccounts) {
    reverseLookupAccounts.push(getReverseKeyFromDomainKey(nameAccount));
  }

  let names = await NameRegistryState.retrieveBatch(
    connection,
    reverseLookupAccounts,
  );

  return names.map((name) => {
    if (name === undefined || name.data === undefined) {
      return undefined;
    }
    return deserializeReverse(name.data);
  });
}
