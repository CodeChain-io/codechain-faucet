import { SDK } from "codechain-sdk";
import { U256 } from "codechain-sdk/lib/core/U256";
import { ServerConfig } from "./config";
import * as fs from "fs";

export async function initializeNonce(sdk: SDK, config: ServerConfig) {
    const nonceFromFile = await getNonceOrZero();

    const nonceFromServer = (await sdk.rpc.chain.getNonce(
        config.faucetCodeChainAddress
    )) as U256;

    if (nonceFromFile.value.isLessThan(nonceFromServer.value)) {
        await saveNonce(nonceFromServer);
    } else {
        await saveNonce(nonceFromFile);
    }
}

async function getNonceOrZero(): Promise<U256> {
    try {
        return await getNonce();
    } catch (err) {
        return new U256("0");
    }
}

export async function getNonce(): Promise<U256> {
    const buffer = await new Promise<Buffer>((resolve, reject) => {
        fs.readFile("nonce.json", (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
    const serialized = buffer.toString("utf8");
    return new U256(JSON.parse(serialized).nonce);
}

export function saveNonce(nonce: U256): Promise<void> {
    const serialized = JSON.stringify({
        nonce: nonce.value.toString()
    });

    return new Promise((resolve, reject) => {
        fs.writeFile("nonce.json", serialized, err => {
            if (err) reject(err);
            else resolve();
        });
    });
}
