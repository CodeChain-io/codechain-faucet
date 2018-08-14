export enum ErrorCode {
    InvalidAddress = 0,
    Unknown = 1,
    TooManyRequest = 2,
    InvalidTwitterURL = 3,
    NoMaketingText = 4,
    InvalidCaptcha = 5,
}

export class FaucetError extends Error {
    public code: string;
    public name: string;
    public internal: Error | null;
    public internalString: string;

    constructor(code: ErrorCode, internal: Error | null) {
        super(ErrorCode[code]);
        this.code = ErrorCode[code];
        this.name = "FaucetError";
        this.internal = internal;
        this.internalString = String(internal);
    }
}
