import { blockchain } from "../networks";
export type JobStatus = "created" | "started" | "finished" | "failed" | "used";

/*
  for https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/cloudwatch-logs/command/GetLogEventsCommand/
  logGroupName: '/aws/lambda/zkcloudworker-dev-test',
  logStreamName: '2024/05/09/[$LATEST]52d048f64e894d2e8ba2800df93629c5'
  awsRequestId: '581d0d45-9165-47e8-84d9-678599938811',
*/
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
  webhook?: string; // the sequencer call webhook after the job finished
  cloudhook?: string; // the cloudhook call execute with task in cloudhook after job finished
  cloudIteration?: number; // recursive call number, must be less than 5
  previousJob?: JobData; // provided in case of the cloudhook

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
