"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zkCloudWorker = exports.Cloud = void 0;
class Cloud {
    constructor(params) {
        const { jobId, stepId, cache, developer, repo, task, userId, args, metadata, isLocalCloud, } = params;
        this.jobId = jobId;
        this.stepId = stepId;
        this.cache = cache;
        this.developer = developer;
        this.repo = repo;
        this.task = task;
        this.userId = userId;
        this.args = args;
        this.metadata = metadata;
        this.isLocalCloud = isLocalCloud ?? false;
    }
}
exports.Cloud = Cloud;
class zkCloudWorker {
    constructor(cloud) {
        this.cloud = cloud;
    }
}
exports.zkCloudWorker = zkCloudWorker;
