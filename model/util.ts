import * as sqlite3 from "sqlite3";

export function asyncRun(
    db: sqlite3.Database,
    sql: string,
    params: any
): Promise<void> {
    return new Promise((resolve, reject) => {
        db.run(sql, params, (err: any) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

export function asyncGet<T>(
    db: sqlite3.Database,
    sql: string,
    params: any
): Promise<T | null> {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err: any, row: any) => {
            if (err) {
                reject(err);
                return;
            }
            if (typeof row === "undefined") {
                resolve(null);
            } else {
                resolve(row);
            }
        });
    });
}
