import { PlatformAddress } from "codechain-primitives/lib";
import { SDK } from "codechain-sdk";

import { ServerConfig } from "./logic/config";

async function main() {
    const config = require("config") as ServerConfig;
    const sdk = new SDK({
        server: config.codechainURL,
        networkId: config.networkId
    });

    const keyStore = await sdk.key.createLocalKeyStore(config.keyStorePath);

    const keys = await keyStore.platform.getKeyList();
    if (keys.length === 0) {
        const created = await keyStore.platform.createKey({
            passphrase: config.faucetCodeChainPasspharase
        });
        console.log(
            `created: ${PlatformAddress.fromAccountId(created, {
                networkId: config.networkId
            })}`
        );
        keys.push(created);
    }

    for (const key of keys) {
        const address = PlatformAddress.fromAccountId(key, {
            networkId: config.networkId
        });
        console.log(
            `${address}: ${(await sdk.rpc.chain.getBalance(
                address
            )).toString()}`
        );
    }
}

main();
