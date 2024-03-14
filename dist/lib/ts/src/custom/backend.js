"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackendPlugin = void 0;
class BackendPlugin {
    constructor(params) {
        const { name, task, args, jobId } = params;
        this.name = name;
        this.task = task;
        this.args = args;
        this.jobId = jobId;
    }
}
exports.BackendPlugin = BackendPlugin;
