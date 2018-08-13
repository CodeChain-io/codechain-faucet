import { Context } from "../context";
import { U256, H256 } from "codechain-sdk/lib/core/classes";

export enum ErrorCode {
    InvalidAddress = 0,
    Unknown = 1
}

export class HelperError extends Error {
    public code: ErrorCode;
    public internal: Error;
    public internalString: string;

    constructor(code: ErrorCode, internal: Error) {
        super();
        this.code = code;
        this.internal = internal;
        this.internalString = String(internal);
    }
}

export async function giveCCC(context: Context, to: string, amount: string): Promise<H256> {
    const sdk = context.codechainSDK;
    let toAddress;
    try {
        toAddress = sdk.key.classes.PlatformAddress.fromString(to);
    } catch (err) {
        throw new HelperError(ErrorCode.InvalidAddress, err);
    }

    try {
        const parcel = sdk.core.createPaymentParcel({
            recipient: toAddress,
            amount
        });

        const accountId = sdk.util.getAccountIdFromPrivate(context.config.faucetPrivateKey);
        const platformAddress = sdk.key.classes.PlatformAddress.fromAccountId(accountId);
        // TODO: same nonce can be used when requests came simultaneously
        const nonce = await sdk.rpc.chain.getNonce(platformAddress) as U256;

        const signedParcel = parcel.sign({
            secret: context.config.faucetPrivateKey,
            nonce,
            fee: 10, // will be changed
        })

        return await sdk.rpc.chain.sendSignedParcel(signedParcel);
    } catch (err) {
        throw new HelperError(ErrorCode.Unknown, err);
    }
}
