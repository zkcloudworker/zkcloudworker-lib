/*
 * Abstract class for the cloud service
 * Used to define the cloud methods and properties
 * Should be implemented by for local testing and for the zkCloudWorker in the cloud
 * @param id the id of the user
 * @param jobId the job id
 * @param stepId the step id
 * @param taskId the task id
 * @param cache the cache folder. Use it to get the Cache object: cache = Cache.FileSystem(this.cloud.cache);
 * @param developer the developer id
 * @param repo the repo id
 * @param task the task id
 * @param userId the user id
 * @param args the arguments, should be a string or serialized JSON
 * @param metadata the metadata, should be a string or serialized JSON
 * @param chain the blockchain network
 * @param isLocalCloud a boolean to check if the cloud is local or not
 */
export class Cloud {
    /**
     * Constructor for the Cloud class
     * @param params the parameters for the Cloud class
     * @param params.id the id of the user
     * @param params.jobId the job id
     * @param params.stepId the step id
     * @param params.taskId the task id
     * @param params.cache the cache folder. Use it to get the Cache object: cache = Cache.FileSystem(this.cloud.cache);
     * @param params.developer the developer id
     * @param params.repo the repo id
     * @param params.task the task id
     * @param params.userId the user id
     * @param params.args the arguments, should be a string or serialized JSON
     * @param params.metadata the metadata, should be a string or serialized JSON
     * @param params.chain the blockchain network
     * @param params.isLocalCloud a boolean to check if the cloud is local or not
     */
    constructor(params) {
        const { id, jobId, stepId, taskId, cache, developer, repo, task, userId, args, metadata, isLocalCloud, chain, } = params;
        this.id = id;
        this.jobId = jobId;
        this.stepId = stepId;
        this.taskId = taskId;
        this.cache = cache;
        this.developer = developer;
        this.repo = repo;
        this.task = task;
        this.userId = userId;
        this.args = args;
        this.metadata = metadata;
        this.isLocalCloud = isLocalCloud ?? false;
        this.chain = chain;
    }
}
//# sourceMappingURL=cloud.js.map