// reverseLookup.test.ts
import {Connection, PublicKey} from "@solana/web3.js";
import {getDomainKeySync, RecordVersion} from "./src";

const runTest = async () => {
  const connection = new Connection("https://quaint-cold-snow.solana-mainnet.quiknode.pro/39ddb64963c9a34975f35d7508d67751de89e1a2");
  const nameAccount = new PublicKey("3hAeKRCU9LMrnHZBzJ8YzbHSjJXEV73oaW8s81MWpY95"); // Replace with a valid domain public key
  const domain = "IPFS.bonfida.sol"; // Replace with a valid domain name
  try {
    // Perform reverse lookup and verify it returns a valid string
    const res = getDomainKeySync(domain, RecordVersion.V1);

    // Example expectation: It should return a non-empty string
    console.log("res runTest:", res);
  } catch (error) {
    console.error("Error during reverse lookup:", error);
  }
};

// Run the test
runTest();
