import * as Twit from "twit";
import { ServerConfig } from "./config";
import { Context } from "context";
import { FaucetError, ErrorCode } from "./error";

export function createTwit(config: ServerConfig): Twit {
    return new Twit({
        consumer_key: config.twitterConsumerKey,
        consumer_secret: config.twitterConsumerSecret,
        app_only_auth: true,
        timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
        strictSSL: true // optional - requires SSL certificates to be valid.
    } as any);
}

export async function getTwitContent(
    context: Context,
    fullUrl: string
): Promise<string> {
    try {
        const id = parseTwitterURL(fullUrl);
        if (id === null) {
            throw new FaucetError(ErrorCode.InvalidTwitterURL, null);
        }
        const twitterResponse = await context.twit.get(`statuses/show/${id}`);
        return (twitterResponse.data as any).text;
    } catch (err) {
        if (err.name !== "FaucetError") {
            throw new FaucetError(ErrorCode.Unknown, err);
        } else {
            throw err;
        }
    }
}

export function parseTwitterURL(url: string): string | null {
    const reg = /.*twitter.com\/[^\/]+\/status\/(\d+)/g;
    const result = reg.exec(url);
    if (result) {
        return result[1];
    }
    return null;
}
