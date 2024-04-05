export interface TaskData {
    id: string;
    taskId: string;
    developer: string;
    repo: string;
    task: string;
    userId?: string;
    args?: string;
    metadata?: string;
}
