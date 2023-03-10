import { Ed25519VerificationKey2020 } from "@digitalbazaar/ed25519-verification-key-2020";
import { X25519KeyAgreementKey2020 } from "@digitalbazaar/x25519-key-agreement-key-2020";

import { CryptoLD } from "crypto-ld";
import { Resolver } from "did-resolver";
import ethr from "ethr-did-resolver";

import { Credentials } from "uport-credentials";

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
  const keyPairExported = keyPair.export({ publicKey: true });
  console.log("keyPairExported", keyPairExported);
  const { verify } = await keyPair.verifier();
  console.log("verify", verify);

  const did = `did:ethr:${keyPairExported.publicKeyMultibase}`;
  console.log("did generated ", did);
  // create a DID using the matic/mumbai blockchain as the resolver
  const ethrResolver = ethr.getResolver(config);
  const resolver = new Resolver({
    ...ethrResolver,
  });

  console.log("resolver created", resolver);

  console.log("start the resolving process");
  resolver.resolve(did).then((doc) => {
    console.log("doc", doc);
  });
};


export function addPrefix(prefixToAdd, did) {
  const prefixedDid = did.slice(0, 9) + prefixToAdd + did.slice(9, did.length);
  return prefixedDid;
}

const resolveDid = (did) => {
  const ethrResolver = ethr.getResolver(config);
  const resolver = new Resolver({
    ...ethrResolver,
  });

  console.log("resolver created", resolver);

  console.log('did to resolve', did);

  console.log("start the resolving process");
  resolver.resolve(did.did).then((doc) => {
    console.log("doc", doc);
  });
};

const createIdentity = (prefixToAdd = "mumbai") => {
  let prefixChecked = false;
  let prefixedDid = null;

  /*
  if (prefixToAdd) {
    prefixChecked = checkPrefix(
      prefixToAdd,
      this.config.providerConfig.networks
    );
    if (!prefixChecked) {
      throw new Error(
        "Invalid Prefix - Check Provider Network Configuration"
      );
    }
  }*/
  const credential = Credentials.createIdentity();

  if (prefixToAdd) {
    prefixedDid = addPrefix(`${prefixToAdd}:`, credential.did);
    credential.did = prefixedDid;
  }
  console.log("credential", credential);
  return credential;
};

//export default did;
export { did, createIdentity, resolveDid };
