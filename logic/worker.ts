export interface Job {
    doWork: () => Promise<void>;
}

export class Worker {
    jobs: Job[];
    tryStop: boolean;
    stopped: boolean;

    constructor() {
        this.jobs = [];
        this.tryStop = false;
        this.stopped = false;
    }

    public async start() {
        while (!this.tryStop) {
            while (this.jobs.length === 0) {
                await delay(0.1);
            }
            const job = this.jobs.shift() as Job;
            try {
                await job.doWork();
            } catch (err) {
                continue;
            }
        }
        this.stopped = true;
    }

    public async stop() {
        this.tryStop = true;
        while (this.stopped === false) {
            await delay(0.1);
        }
    }

    public async pushJob<T>(job: () => Promise<T>): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            this.jobs.push({
                doWork: async () => {
                    try {
                        const value = await job();
                        resolve(value);
                        return;
                    } catch (err) {
                        reject(err);
                        throw err;
                    }
                }
            });
        });
    }
}

async function delay(seconds: number): Promise<void> {
    return new Promise<void>(resolve => {
        setTimeout(() => {
            resolve();
        }, seconds * 1000);
    });
}
