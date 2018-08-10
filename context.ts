import { SDK } from "codechain-sdk";

export interface Context {
    codechainSDK: SDK;
}

export function createContext(): Context {
    const codechainSDK = new SDK({
        server: "http://localhost:8080"
    });

    return {
        codechainSDK
    }
}
