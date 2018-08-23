import { Context } from "../context";
import { Moment } from "moment";
import * as moment from "moment";
import { asyncGet, asyncRun } from "./util";

export async function findLastRequestTime(
    context: Context,
    address: string
): Promise<Moment | null> {
    const row: any = await asyncGet(
        context.db,
        "SELECT * FROM faucetHistory WHERE address=$address ORDER BY datetime(createdAt) DESC LIMIT 1",
        {
            $address: address
        }
    );
    if (row === null) {
        return null;
    }
    const createdAt = moment(row.createdAt);
    return createdAt;
}

export async function existsByTweetId(
    context: Context,
    tweetId: string
): Promise<boolean> {
    const row: any = await asyncGet(
        context.db,
        "SELECT * FROM faucetHistory WHERE tweetId=$tweetId LIMIT 1",
        {
            $tweetId: tweetId
        }
    );
    if (row === null) {
        return false;
    }
    return true;
}

export async function insert(context: Context, address: string): Promise<void> {
    await asyncRun(
        context.db,
        "INSERT INTO faucetHistory (address, createdAt) VALUES ($address, $now)",
        {
            $address: address,
            $now: moment()
                .utcOffset(9)
                .toISOString()
        }
    );
}
