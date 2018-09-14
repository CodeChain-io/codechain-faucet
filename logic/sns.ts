import { Context } from "context";
import * as rp from "request-promise";
import * as Twit from "twit";
import { ServerConfig } from "./config";
import { ErrorCode, FaucetError } from "./error";
const cheerio = require("cheerio");

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
    id: string
): Promise<string> {
    try {
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

export async function getFacebookContent(id: string): Promise<string> {
    try {
        const options = {
            uri: `https://www.facebook.com/${id}`,
            headers: {
                "User-Agent": "I LOVE CODECHAIN"
            }
        };
        const result = await rp(options);
        const reg = /<div[^>]*userContent[^\w][^>]*>(.*?)<\/div>/gm;
        const postContent = reg.exec(result);

        if (postContent === null) {
            throw new FaucetError(ErrorCode.NoContentFromFacebookURL, null);
        }

        const $ = cheerio.load(postContent[1]);
        return $.text();
    } catch (err) {
        if (err.name !== "FaucetError") {
            throw new FaucetError(ErrorCode.InvalidURL, err);
        } else {
            throw err;
        }
    }
}

export enum URLType {
    Twitter = 0,
    Facebook = 1
}

export function parseURL(url: string): [URLType, string] {
    const twitReg = /.*twitter\.com\/[^\/]+\/status\/(\d+)/g;
    const twitResult = twitReg.exec(url);
    if (twitResult) {
        return [URLType.Twitter, twitResult[1]];
    }

    const fbReg = /.*facebook\.com\/[^\/]+\/posts\/(\d+)/g;
    const fbResult = fbReg.exec(url);
    if (fbResult) {
        return [URLType.Facebook, fbResult[1]];
    }
    throw new FaucetError(ErrorCode.InvalidURL, null);
}
