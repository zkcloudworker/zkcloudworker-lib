import { blockchain } from "../networks";

export interface TaskData {
  id: string;
  taskId: string;

  startTime?: number;
  timeCreated: number;
  maxAttempts?: number; // default is 5
  attempts: number;

  developer: string;
  repo: string;
  task: string;
  userId?: string;
  args?: string;
  metadata?: string;
  chain: blockchain;
}
