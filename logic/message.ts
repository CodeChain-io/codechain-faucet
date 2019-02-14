import { Context } from "../context";
import { ErrorCode, FaucetError } from "./error";

export function errorMessage(context: Context, error: FaucetError): string {
    const { marketingText } = context.config;
    switch (error.code) {
        case ErrorCode.InvalidAddress:
            return "Cannot find a CodeChain address from your post";
        case ErrorCode.Unknown:
            return "Unknown server error. Please retry after a few minutes";
        case ErrorCode.TooManyRequest:
            return "Your address already received CCC. Retry after 24 hours";
        case ErrorCode.InvalidURL:
            return "The given URL is not valid";
        case ErrorCode.NoMarketingText:
            return `Your post should contain '${marketingText}' `;
        case ErrorCode.InvalidCaptcha:
            return "Unknown server error. Please retry after a few minutes";
        case ErrorCode.DuplicatedPost:
            return "This post is already used. Please create a new post";
        case ErrorCode.NotAuthorizedForTest:
            return "Your test secret was wrong";
        case ErrorCode.NoContentFromFacebookURL:
            return "Maybe your post is not public";
        default:
            console.error("Invalid error code " + error.code);
            return "Unknown server error. Please retry after a few minutes";
    }
}

export function successMessage(context: Context, hash: string): string {
    const { blockExplorerURL } = context.config;
    return `${blockExplorerURL}/transaction/${hash}`;
}
