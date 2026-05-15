// ============================================================
// DataShel — One-Time Registry Setup Script
// ============================================================
// Creates an empty datashel-registry.json blob under your wallet
// address on the Shelby Protocol network.
//
// This version uses a custom fetch-based client for the Aptos SDK
// to bypass the 'got' library bug in Node v25.
// ============================================================

import { generateCommitments, createDefaultErasureCodingProvider, SHELBY_DEPLOYER } from '@shelby-protocol/sdk/node';
import { Account, Ed25519PrivateKey, Network, Aptos, AptosConfig } from '@aptos-labs/ts-sdk';

const WALLET_ADDRESS = '0x29ddb3b55bd73dbb2d3081c091163e1b16c0684f6e3d6e6749c2bc17afd18aa1';
const SHELBY_API_BASE = 'https://api.shelbynet.shelby.xyz/shelby';
const APTOS_FULLNODE = 'https://api.shelbynet.shelby.xyz/v1';
const API_KEY = 'AG-GN9KUTTTXA933QVEVG1LJAOT3KXTARHJH';
const BLOB_NAME = 'datashel-registry.json';
const ONE_YEAR_MICROS = (BigInt(Date.now()) * 1000n) + (BigInt(365 * 24 * 60 * 60) * 1_000_000n);

async function main() {
  console.log('🚀 DataShel Registry Setup (Fetch-Aptos mode)');
  console.log('=============================================');

  const privateKey = new Ed25519PrivateKey('0x5fbe417211466515f9757924aa9ec839fc60c28a2159e869f97fc8b4a2ea53fe');
  const account = Account.fromPrivateKey({ privateKey });

  // Custom fetch-based client for Aptos SDK
  const aptosConfig = new AptosConfig({
    network: Network.CUSTOM,
    fullnode: APTOS_FULLNODE,
  });
  const aptos = new Aptos(aptosConfig);

  // Monkey-patch the internal Aptos client to use fetch instead of got
  // The SDK uses got in Node, but we can override the request function
  aptos.config.client = {
    async request(options) {
      const url = options.url.startsWith('/') ? `${APTOS_FULLNODE}${options.url}` : options.url;
      const res = await fetch(url, {
        method: options.method,
        headers: options.headers,
        body: options.body,
      });
      const data = await res.json();
      return { status: res.status, data, headers: res.headers, config: options };
    }
  };

  const registryContent = JSON.stringify([]);
  const blobData = new TextEncoder().encode(registryContent);

  const provider = await createDefaultErasureCodingProvider();
  const commitments = await generateCommitments(provider, blobData);

  console.log('📝 Submitting on-chain transaction...');
  try {
    const transaction = await aptos.transaction.build.simple({
      sender: account.accountAddress,
      data: {
        function: `${SHELBY_DEPLOYER}::blob_metadata::register_blob`,
        typeArguments: [],
        functionArguments: [
          BLOB_NAME,
          Array.from(commitments.blob_merkle_root),
          blobData.length,
          ONE_YEAR_MICROS.toString(),
          false,
        ],
      },
    });

    const committedTxn = await aptos.signAndSubmitTransaction({ signer: account, transaction });
    console.log(`✓ Submitted: ${committedTxn.hash}`);
    await aptos.waitForTransaction({ transactionHash: committedTxn.hash });
    console.log('✓ Confirmed!');
  } catch (err) {
    console.warn('⚠ On-chain registration issue:', err.message);
  }

  console.log('\n📤 Uploading to Shelby RPC...');
  const putRes = await fetch(`${SHELBY_API_BASE}/v1/blobs/${WALLET_ADDRESS}/${BLOB_NAME}`, {
    method: 'PUT',
    headers: { 'x-api-key': API_KEY, 'Content-Type': 'application/json' },
    body: registryContent,
  });

  if (putRes.ok) {
    console.log('✅ Registry created successfully!');
  } else {
    console.error(`❌ PUT failed (${putRes.status}): ${await putRes.text()}`);
    process.exit(1);
  }
}

main().catch(console.error);
