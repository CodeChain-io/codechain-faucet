import { U256 } from "codechain-sdk/lib/core/U256";
import { Context } from "../context";

export async function getNonce(context: Context): Promise<U256> {
    const sdk = context.codechainSDK;
    let nonce = (await sdk.rpc.chain.getNonce(
        context.config.faucetCodeChainAddress
    )) as U256;

    const parcels = await sdk.rpc.chain.getPendingParcels();
    for (const parcel of parcels) {
        if (
            context.config.faucetCodeChainAddress ===
            parcel.getSignerAddress().toString()
        ) {
            const pendingNonce = new U256(parcel.toJSON().nonce);
            if (pendingNonce.value.isGreaterThanOrEqualTo(nonce.value)) {
                nonce = pendingNonce.increase();
            }
        }
    }
    return nonce;
}
