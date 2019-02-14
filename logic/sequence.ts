import { Context } from "../context";

export async function getSeq(context: Context): Promise<number> {
    const sdk = context.codechainSDK;
    let seq = await sdk.rpc.chain.getSeq(context.config.faucetCodeChainAddress);

    const pendingTransactions = await sdk.rpc.chain.getPendingTransactions();
    for (const pendingTransaction of pendingTransactions) {
        if (
            context.config.faucetCodeChainAddress ===
            pendingTransaction
                .getSignerAddress({
                    networkId: context.config.networkId
                })
                .toString()
        ) {
            const pendingSeq = pendingTransaction.toJSON().seq;
            if (pendingSeq >= seq) {
                seq = pendingSeq.increase();
            }
        }
    }
    return seq;
}
