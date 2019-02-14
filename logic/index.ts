import { H256, PlatformAddress } from "codechain-sdk/lib/core/classes";
import { Context } from "context";
import * as moment from "moment";
import * as historyModel from "../model/history";
import { ErrorCode, FaucetError } from "./error";
import { getSeq } from "./sequence";

export async function giveCCCWithLimit(
    context: Context,
    to: string,
    amount: string,
    postId: string
): Promise<H256> {
    try {
        const lastTime = await historyModel.findLastRequestTime(context, to);
        if (lastTime !== null) {
            const yesterday = moment().subtract(1, "day");
            if (lastTime.isAfter(yesterday)) {
                throw new FaucetError(ErrorCode.TooManyRequest, null);
            }
        }

        let toAddress;
        try {
            toAddress = PlatformAddress.fromString(to);
        } catch (err) {
            throw new FaucetError(ErrorCode.InvalidAddress, err);
        }

        const result = await giveCCCWithoutLimit(context, toAddress, amount);

        await historyModel.insert(context, to, postId);

        return result;
    } catch (err) {
        if (err.name !== "FaucetError") {
            throw new FaucetError(ErrorCode.Unknown, err);
        } else {
            throw err;
        }
    }
}

export async function giveCCCWithoutLimit(
    context: Context,
    toAddress: PlatformAddress,
    amount: string
): Promise<H256> {
    try {
        return await context.worker.pushJob<H256>(async () => {
            const seq = await getSeq(context);
            const result = await giveCCCInternal(
                context,
                toAddress,
                amount,
                seq
            );
            return result;
        });
    } catch (err) {
        if (err.name !== "FaucetError") {
            throw new FaucetError(ErrorCode.Unknown, err);
        } else {
            throw err;
        }
    }
}

async function giveCCCInternal(
    context: Context,
    toAddress: PlatformAddress,
    quantity: string,
    seq: number
): Promise<H256> {
    const sdk = context.codechainSDK;
    const pay = sdk.core.createPayTransaction({
        recipient: toAddress,
        quantity
    });

    return sdk.rpc.chain.sendTransaction(pay, {
        account: context.config.faucetCodeChainAddress,
        passphrase: context.config.faucetCodeChainPasspharase,
        seq,
        fee: String(100 * 1000 * 1000)
    });
}

export function findCCCAddressFromText(
    context: Context,
    text: string
): string | null {
    const reg = new RegExp(`${context.config.networkId}c\\w{40}`, "g");
    const matches = text.match(reg);
    if (matches === null) {
        return null;
    }

    for (const match of matches) {
        try {
            PlatformAddress.fromString(match);
        } catch (err) {
            continue;
        }
        return match;
    }

    return null;
}
