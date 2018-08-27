import { SDK } from "codechain-sdk";
import { ServerConfig } from "./logic/config";
import * as sqlite3 from "sqlite3";
import { initialize as dbInitialize } from "./model/initialize";
import * as Twit from "twit";
import { createTwit } from "./logic/sns";
import { Worker } from "./logic/worker";
import { initializeNonce } from "./logic/nonce";

let database = sqlite3.Database;
if (process.env.NODE_ENV !== "production") {
    database = sqlite3.verbose().Database;
}

export interface Context {
    codechainSDK: SDK;
    config: ServerConfig;
    db: sqlite3.Database;
    twit: Twit;
    worker: Worker;
}

export async function createContext(): Promise<Context> {
    const config = require("config") as ServerConfig;

    const codechainSDK = new SDK({
        server: config.codechainURL
    });

    await initializeNonce(codechainSDK, config);

    const db = await new Promise<sqlite3.Database>((resolve, reject) => {
        const dbFileName =
            process.env.NODE_ENV === "production" ? "faucet.db" : ":memory:";
        const newDB = new database(dbFileName, (err: Error) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(newDB);
        });
    });

    await dbInitialize(db);

    const twit = createTwit(config);

    const worker = new Worker();
    worker.start().catch(console.error);

    return {
        codechainSDK,
        config,
        db,
        twit,
        worker
    };
}

export async function closeContext(context: Context): Promise<void> {
    await new Promise<void>((resolve, reject) => {
        context.db.close(err => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
    await context.worker.stop();
}
