import { FaucetError, ErrorCode } from "./error";
import { Context } from "../context";

export function errorMessage(context: Context, error: FaucetError): string {
    const { marketingText } = context.config;
    switch (error.code) {
        case ErrorCode.InvalidAddress:
            return "Cannot find a CodeChain address from your tweet";
        case ErrorCode.Unknown:
            return "Unknown server error. Please retry after a few minutes";
        case ErrorCode.TooManyRequest:
            return "Your address already received CCC. Retry after 24 hours";
        case ErrorCode.InvalidTwitterURL:
            return "Twitter URL is not valid";
        case ErrorCode.NoMarketingText:
            return `Your tweet should contain '${marketingText}' `;
        case ErrorCode.InvalidCaptcha:
            return "Unknown server error. Please retry after a few minutes";
        case ErrorCode.DuplicatedTweet:
            return "This tweet is already used. Please create a new tweet";
        case ErrorCode.NotAuthorizedForTest:
            return "Your test secret was wrong";
        default:
            console.error("Invalid error code " + error.code);
            return "Unknown server error. Please retry after a few minutes";
    }
}

export function successMessage(context: Context, hash: string): string {
    const { blockExplorerURL } = context.config;
    return `${blockExplorerURL}/parcel/${hash}`;
}
