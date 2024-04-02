export class Cloud {
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
        this.isLocalCloud = isLocalCloud !== null && isLocalCloud !== void 0 ? isLocalCloud : false;
    }
}
export class zkCloudWorker {
    constructor(cloud) {
        this.cloud = cloud;
    }
}
//# sourceMappingURL=cloud.js.map