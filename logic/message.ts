import { FaucetError, ErrorCode } from "./error";
import { Context } from "../context";

export function errorMessage(context: Context, error: FaucetError): string {
    const { maketingText } = context.config;
    switch (error.code) {
        case ErrorCode.InvalidAddress:
            return "Cannot find CodeChain address from your tweet";
        case ErrorCode.Unknown:
            return "Unknown server error. Please retry after some minuates later";
        case ErrorCode.TooManyRequest:
            return "Your address already received CCC. Try 24 hours later";
        case ErrorCode.InvalidTwitterURL:
            return "Twitter URL is not valid";
        case ErrorCode.NoMaketingText:
            return `Your tweet should contain '${maketingText}' `;
        case ErrorCode.InvalidCaptcha:
            return "Unknown server error. Please retry after some minuates later";
        case ErrorCode.DuplicatedTweet:
            return "This tweet is already used. Please create a new tweet";
        default:
            console.error("Invalid error code " + error.code);
            return "Unknown server error. Please retry some minuates later";
    }
}

export function successMessage(context: Context, hash: string): string {
    const { blockExplorerURL } = context.config;
    return `You received 1 CCC. You can find it at <a href="${blockExplorerURL}/parcel/${hash}">block explorer</a>`;
}
