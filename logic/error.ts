export enum ErrorCode {
    InvalidAddress = 0,
    Unknown = 1,
    TooManyRequest = 2,
    InvalidURL = 3,
    NoMarketingText = 4,
    InvalidCaptcha = 5,
    DuplicatedPost = 6,
    NotAuthorizedForTest = 7,
    NoContentFromFacebookURL = 8
}

export class FaucetError extends Error {
    public code: ErrorCode;
    public codeName: string;
    public name: string;
    public internal: Error | null;
    public internalString: string;

    constructor(code: ErrorCode, internal: Error | null) {
        super(ErrorCode[code]);
        this.code = code;
        this.codeName = ErrorCode[code];
        this.name = "FaucetError";
        this.internal = internal;
        this.internalString = String(internal);
        if (internal) {
            console.error(internal);
        }
    }
}
