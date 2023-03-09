import { Ed25519VerificationKey2020 } from "@digitalbazaar/ed25519-verification-key-2020";
import { X25519KeyAgreementKey2020 } from "@digitalbazaar/x25519-key-agreement-key-2020";

import { CryptoLD } from "crypto-ld";
import { Resolver } from "did-resolver";
import ethr from "ethr-did-resolver";



const config = {
  networks: [
    { name: 'mumbai', rpcUrl: 'https://rpc-mumbai.maticvigil.com/' }
  ]
}

const did = async () => {
  const cryptoLd = new CryptoLD();

  cryptoLd.use(Ed25519VerificationKey2020);
  cryptoLd.use(X25519KeyAgreementKey2020);

  //const keyPair = await Ed25519KeyPair.generate()
  const keyPair = await cryptoLd.generate({
    type: "Ed25519VerificationKey2020",
  });
  console.log("keyPair generated ", keyPair);
  const keyPairExported = keyPair.export({publicKey: true});
  console.log('keyPairExported', keyPairExported);
  const did = `did:ethr:${keyPairExported.publicKeyMultibase}`;
  console.log('did generated ', did);
  // create a DID using the matic/mumbai blockchain as the resolver
  const ethrResolver = ethr.getResolver(config);
  const resolver = new Resolver({
    ...ethrResolver,
  });

  console.log('resolver created', resolver);

  
};

export default did;
