import { SDK } from "codechain-sdk";
import { ServerConfig } from "./util/config";

export interface Context {
    codechainSDK: SDK;
    config: ServerConfig;
}

export function createContext(): Context {
    const codechainSDK = new SDK({
        server: "http://localhost:8080"
    });

    const config = require("config");

    return {
        codechainSDK,
        config
    }
}
