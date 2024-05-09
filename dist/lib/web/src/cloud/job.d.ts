import { blockchain } from "../networks";
export type JobStatus = "created" | "started" | "finished" | "failed" | "used";
export interface LogStream {
    logGroupName: string;
    logStreamName: string;
    awsRequestId: string;
}
export interface JobData {
    id: string;
    jobId: string;
    taskId?: string;
    developer: string;
    repo: string;
    task?: string;
    userId?: string;
    args?: string;
    metadata?: string;
    chain: blockchain;
    webhook?: string;
    cloudhook?: string;
    cloudIteration?: number;
    previousJob?: JobData;
    filename?: string;
    txNumber: number;
    timeCreated: number;
    timeCreatedString: string;
    timeStarted?: number;
    timeFinished?: number;
    timeFailed?: number;
    timeUsed?: number;
    billedDuration?: number;
    feeMINA?: number;
    feeUSD?: number;
    jobStatus: JobStatus;
    maxAttempts: number;
    result?: string;
    logStreams?: LogStream[];
    logs?: string[];
}
