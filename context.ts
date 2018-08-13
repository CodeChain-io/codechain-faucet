import { SDK } from "codechain-sdk";
import { ServerConfig } from "./util/config";

export interface Context {
    codechainSDK: SDK;
    config: ServerConfig;
}

export function createContext(): Context {
    const config = require("config");

    const codechainSDK = new SDK({
        server: config.codechainURL
    });

    return {
        codechainSDK,
        config
    }
}
