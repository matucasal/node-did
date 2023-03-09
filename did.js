import { Ed25519VerificationKey2020 } from "@digitalbazaar/ed25519-verification-key-2020";
import { X25519KeyAgreementKey2020 } from "@digitalbazaar/x25519-key-agreement-key-2020";

import { CryptoLD } from "crypto-ld";
import { Resolver } from "did-resolver";
import ethr from "ethr-did-resolver";
import * as Issuer from "did-jwt";


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

  console.log("keyPair", keyPair);
  // create a DID using the matic/mumbai blockchain as the resolver
  const ethrResolver = ethr.getResolver(config);
  const resolver = new Resolver({
    ...ethrResolver,
  });

  console.log('resolver created', resolver);

  const did = `did:ethr:${keyPair.publicNode().ethereumAddress}`;

  console.log('did generated', did);

  // create a JWT using the DID as the issuer
  const issuer = new Issuer({
    issuer: did,
    signer: keyPair.signer(),
    alg: "EdDSA",
  });
  const jwt = await issuer.sign({ foo: "bar" });

  // verify the JWT using the DID resolver
  const verified = await issuer.verify(jwt, { resolver });
  console.log(verified.payload); // { foo: 'bar' }
};

export default did;
