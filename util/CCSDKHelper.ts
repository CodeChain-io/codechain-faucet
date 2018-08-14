import { Context } from "../context";
import { U256, H256 } from "codechain-sdk/lib/core/classes";
import * as historyModel from "../model/history";
import * as moment from "moment";

export enum ErrorCode {
    InvalidAddress = 0,
    Unknown = 1,
    ToManyRequest = 2,
}

export class HelperError extends Error {
    public code: ErrorCode;
    public internal: Error | null;
    public internalString: string;

    constructor(code: ErrorCode, internal: Error | null) {
        super(ErrorCode[code]);
        this.code = code;
        this.message = ErrorCode[code];
        this.name = "HelperError";
        this.internal = internal;
        this.internalString = String(internal);
    }
}

export async function giveCCC(context: Context, to: string, amount: string): Promise<H256> {
    try {
        const sdk = context.codechainSDK;

        const lastTime = await historyModel.findLastRequestTime(context, to);
        if (lastTime !== null) {
            const yesterday = moment().subtract(1, "day");
            if (lastTime.isAfter(yesterday)) {
                throw new HelperError(ErrorCode.ToManyRequest, null);
            }
        }

        let toAddress;
        try {
            toAddress = sdk.key.classes.PlatformAddress.fromString(to);
        } catch (err) {
            throw new HelperError(ErrorCode.InvalidAddress, err);
        }
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

        const result = await sdk.rpc.chain.sendSignedParcel(signedParcel);
        await historyModel.insert(context, to);
        return result;
    } catch (err) {
        if (err.name !== "HelperError") {
            throw new HelperError(ErrorCode.Unknown, err);
        } else {
            throw err;
        }
    }
}
