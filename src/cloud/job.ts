import { blockchain } from "../networks";
export type JobStatus = "created" | "started" | "finished" | "failed" | "used";

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
}
