import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';

const APTOS_FULLNODE = 'https://api.shelbynet.shelby.xyz/v1';
const SHELBY_DEPLOYER = '0x85fdb9a176ab8ef1d9d9c1b00d60b3924f0800ac1de1cc2085fb0b8bb4988e6a';

async function main() {
  const config = new AptosConfig({ network: Network.CUSTOM, fullnode: APTOS_FULLNODE });
  const aptos = new Aptos(config);
  
  // Custom fetch-based client for Aptos SDK
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

  try {
    const module = await aptos.getAccountModule({
      accountAddress: SHELBY_DEPLOYER,
      moduleName: 'blob_metadata'
    });
    const fn = module.abi.exposed_functions.find(f => f.name === 'register_blob');
    console.log('Function ABI:', JSON.stringify(fn, null, 2));
  } catch (err) {
    console.error('Error:', err);
  }
}

main();
