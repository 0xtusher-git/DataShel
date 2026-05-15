import { createDefaultErasureCodingProvider, generateCommitments } from '@shelby-protocol/sdk/node';

async function test() {
  try {
    const provider = await createDefaultErasureCodingProvider();
    const data = new Uint8Array([1, 2, 3, 4, 5]);
    const commitments = await generateCommitments(provider, data);
    console.log('Type of blob_merkle_root:', typeof commitments.blob_merkle_root);
    console.log('Is Uint8Array:', commitments.blob_merkle_root instanceof Uint8Array);
    console.log('Value:', commitments.blob_merkle_root);
  } catch (err) {
    console.error('Error:', err);
  }
}

test();
