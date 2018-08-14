import { SDK } from "codechain-sdk";
import { ServerConfig } from "./logic/config";
import * as sqlite3 from "sqlite3";
import { initialize as dbInitialize } from "./model/initialize";
import * as Twit from "twit";
import { createTwit } from "./logic/twitter";

let database = sqlite3.Database;
if (process.env.NODE_ENV !== "production") {
    database = sqlite3.verbose().Database;
}

export interface Context {
    codechainSDK: SDK;
    config: ServerConfig;
    db: sqlite3.Database;
    twit: Twit;
}

export async function createContext(): Promise<Context> {
    const config = require("config");

    const codechainSDK = new SDK({
        server: config.codechainURL
    });

    // TODO: use file system database
    const db = await new Promise<sqlite3.Database>((resolve, reject) => {
        const newDB = new database(":memory:", (err: Error) => {
            if (err) { reject(err); return; }
            resolve(newDB);
        });
    });

    await dbInitialize(db);

    const twit = createTwit(config);

    return {
        codechainSDK,
        config,
        db,
        twit
    }
}

export async function closeContext(context: Context): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        context.db.close((err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}
