import * as sqlite3 from "sqlite3";

export function asyncRun(db: sqlite3.Database, sql: string): Promise<void> {
    return new Promise((resolve, reject) => {
        db.run(sql, (err: any) => {
            if (err) { reject(err); return; }
            resolve();
        })
    });
}
