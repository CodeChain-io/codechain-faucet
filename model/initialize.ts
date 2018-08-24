import * as sqlite3 from "sqlite3";
import { asyncRun } from "./util";

export async function initialize(db: sqlite3.Database): Promise<void> {
    // TODO: need index in createdAt and url
    await asyncRun(
        db,
        `CREATE TABLE IF NOT EXISTS faucetHistory (
id INTEGER PRIMARY KEY ASC,
address TEXT NOT NULL,
createdAt TEXT NOT NULL,
postId TEXT NOT NULL
)`,
        {}
    );
}
