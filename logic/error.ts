export enum ErrorCode {
    InvalidAddress = 0,
    Unknown = 1,
    ToManyRequest = 2,
}

export class FaucetError extends Error {
    public code: ErrorCode;
    public internal: Error | null;
    public internalString: string;

    constructor(code: ErrorCode, internal: Error | null) {
        super(ErrorCode[code]);
        this.code = code;
        this.message = ErrorCode[code];
        this.name = "FaucetError";
        this.internal = internal;
        this.internalString = String(internal);
    }
}
