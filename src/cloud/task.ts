import { blockchain } from "../networks";

export interface TaskData {
  id: string;
  taskId: string;

  startTime?: number;
  timeCreated: number;

  developer: string;
  repo: string;
  task: string;
  userId?: string;
  args?: string;
  metadata?: string;
  chain: blockchain;
}
