import { Context } from "context";
import { U256, H256 } from "codechain-sdk/lib/core/classes";
import * as historyModel from "../model/history";
import * as moment from "moment";
import { FaucetError, ErrorCode } from "./error";

export async function giveCCC(context: Context, to: string, amount: string): Promise<H256> {
    try {
        const sdk = context.codechainSDK;

        const lastTime = await historyModel.findLastRequestTime(context, to);
        if (lastTime !== null) {
            const yesterday = moment().subtract(1, "day");
            if (lastTime.isAfter(yesterday)) {
                throw new FaucetError(ErrorCode.ToManyRequest, null);
            }
        }

        let toAddress;
        try {
            toAddress = sdk.key.classes.PlatformAddress.fromString(to);
        } catch (err) {
            throw new FaucetError(ErrorCode.InvalidAddress, err);
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
        if (err.name !== "FaucetError") {
            throw new FaucetError(ErrorCode.Unknown, err);
        } else {
            throw err;
        }
    }
}
