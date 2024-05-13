"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorage = exports.LocalCloud = void 0;
const cloud_1 = require("../../cloud");
const cloud_2 = require("../../cloud");
const cloud_3 = require("../../cloud");
/**
 * LocalCloud is a cloud that runs on the local machine for testing and development
 * It uses LocalStorage to store jobs, tasks, transactions, and data
 * It uses a localWorker to execute the tasks
 * It can be used to test the cloud functionality without deploying to the cloud
 * @param localWorker the worker to execute the tasks
 */
class LocalCloud extends cloud_1.Cloud {
    /**
     * Constructor for LocalCloud
     * @param params the parameters to create the LocalCloud
     * @param params.job the job data
     * @param params.chain the blockchain to execute the job on, can be any blockchain, not only local
     * @param params.cache the cache folder
     * @param params.stepId the step id
     * @param params.localWorker the worker to execute the tasks
     */
    constructor(params) {
        const { job, chain, cache, stepId, localWorker } = params;
        const { id, jobId, developer, repo, task, userId, args, metadata, taskId } = job;
        super({
            id: id,
            jobId: jobId,
            stepId: stepId ?? "stepId",
            taskId: taskId ?? "taskId",
            cache: cache ?? "./cache",
            developer: developer,
            repo: repo,
            task: task,
            userId: userId,
            args: args,
            metadata: metadata,
            isLocalCloud: true,
            chain,
        });
        this.localWorker = localWorker;
    }
    /**
     * Provides the deployer key pair for testing and development
     * @returns the deployer key pair
     */
    async getDeployer() {
        const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
        const publicKey = process.env.DEPLOYER_PUBLIC_KEY;
        try {
            return privateKey === undefined || publicKey === undefined
                ? undefined
                : {
                    privateKey,
                    publicKey,
                };
        }
        catch (error) {
            console.error(`getDeployer: error getting deployer key pair: ${error}`, error);
            return undefined;
        }
    }
    /**
     * Releases the deployer key pair
     */
    async releaseDeployer(params) {
        console.log("LocalCloud: releaseDeployer", params);
    }
    /**
     * Gets the data by key
     * @param key the key to get the data
     * @returns the data
     */
    async getDataByKey(key) {
        const value = LocalStorage.data[key];
        return value;
    }
    /**
     * Saves the data by key
     * @param key the key to save the data
     * @param value the value to save
     */
    async saveDataByKey(key, value) {
        if (value !== undefined)
            LocalStorage.data[key] = value;
        else
            delete LocalStorage.data[key];
    }
    /**
     * Saves the file
     * @param filename the filename to save
     * @param value the value to save
     */
    async saveFile(filename, value) {
        await (0, cloud_3.saveBinaryFile)({ data: value, filename });
    }
    /**
     * Loads the file
     * @param filename
     * @returns the file data
     */
    async loadFile(filename) {
        const data = await (0, cloud_3.loadBinaryFile)(filename);
        return data;
    }
    /**
     * Loads the environment
     * @param password
     */
    async loadEnvironment(password) {
        throw new Error("Method not implemented.");
    }
    /**
     * Generates an id for local cloud
     * @returns generated unique id
     */
    static generateId() {
        return "local." + Date.now().toString() + "." + (0, cloud_2.makeString)(32);
    }
    /**
     * Adds transactions to the local cloud
     * @param transactions the transactions to add
     * @returns the transaction ids
     */
    static async addTransactions(transactions) {
        const timeReceived = Date.now();
        const txId = [];
        transactions.forEach((tx) => {
            const id = LocalCloud.generateId();
            LocalStorage.transactions[id] = { transaction: tx, timeReceived };
            txId.push(id);
        });
        return txId;
    }
    /**
     * Deletes a transaction from the local cloud
     * @param txId the transaction id to delete
     */
    async deleteTransaction(txId) {
        if (LocalStorage.transactions[txId] === undefined)
            throw new Error(`deleteTransaction: Transaction ${txId} not found`);
        delete LocalStorage.transactions[txId];
    }
    async getTransactions() {
        const txs = Object.keys(LocalStorage.transactions).map((txId) => {
            const { transaction, timeReceived } = LocalStorage.transactions[txId];
            return {
                txId,
                transaction,
                timeReceived,
            };
        });
        return txs;
    }
    /**
     * Runs the worker in the local cloud
     * @param params the parameters to run the worker
     * @param params.command the command to run
     * @param params.data the data to use
     * @param params.data.developer the developer of the repo
     * @param params.data.repo the repo
     * @param params.data.transactions the transactions to process
     * @param params.data.task the task to execute
     * @param params.data.userId the user id
     * @param params.data.args the arguments for the job
     * @param params.data.metadata the metadata for the job
     * @param params.chain the blockchain to execute the job on
     * @param params.localWorker the worker to execute the tasks
     * @returns the job id
     */
    static async run(params) {
        const { command, data, chain, localWorker } = params;
        const { developer, repo, transactions, task, userId, args, metadata } = data;
        const timeCreated = Date.now();
        const jobId = LocalCloud.generateId();
        const job = {
            id: "local",
            jobId,
            developer,
            repo,
            task,
            userId,
            args,
            metadata,
            txNumber: command === "recursiveProof" ? transactions.length : 1,
            timeCreated,
            timeCreatedString: new Date(timeCreated).toISOString(),
            timeStarted: timeCreated,
            jobStatus: "started",
            maxAttempts: 0,
        };
        const cloud = new LocalCloud({
            job,
            chain,
            localWorker,
        });
        const worker = await localWorker(cloud);
        if (worker === undefined)
            throw new Error("worker is undefined");
        const result = command === "recursiveProof"
            ? await LocalCloud.sequencer({
                worker,
                data,
            })
            : command === "execute"
                ? await worker.execute(transactions)
                : undefined;
        const timeFinished = Date.now();
        if (result !== undefined) {
            job.jobStatus = "finished";
            job.timeFinished = timeFinished;
            job.result = result;
        }
        else {
            job.jobStatus = "failed";
            job.timeFailed = timeFinished;
        }
        job.maxAttempts = 1;
        job.billedDuration = timeFinished - timeCreated;
        LocalStorage.jobs[jobId] = job;
        return jobId;
    }
    /**
     * Runs the recursive proof in the local cloud
     * @param data the data to use
     * @param data.transactions the transactions to process
     * @param data.task the task to execute
     * @param data.userId the user id
     * @param data.args the arguments for the job
     * @param data.metadata the metadata for the job
     * @returns the job id
     */
    async recursiveProof(data) {
        return await LocalCloud.run({
            command: "recursiveProof",
            data: {
                developer: this.developer,
                repo: this.repo,
                transactions: data.transactions,
                task: data.task ?? "recursiveProof",
                userId: data.userId,
                args: data.args,
                metadata: data.metadata,
            },
            chain: this.chain,
            localWorker: this.localWorker,
        });
    }
    /**
     * Executes the task in the local cloud
     * @param data the data to use
     * @param data.transactions the transactions to process
     * @param data.task the task to execute
     * @param data.userId the user id
     * @param data.args the arguments for the job
     * @param data.metadata the metadata for the job
     * @returns the job id
     */
    async execute(data) {
        return await LocalCloud.run({
            command: "execute",
            data: {
                developer: this.developer,
                repo: this.repo,
                transactions: data.transactions,
                task: data.task,
                userId: data.userId,
                args: data.args,
                metadata: data.metadata,
            },
            chain: this.chain,
            localWorker: this.localWorker,
        });
    }
    /**
     * Gets the job result
     * @param jobId the job id
     * @returns the job data
     */
    async jobResult(jobId) {
        return LocalStorage.jobs[jobId];
    }
    /**
     * Adds a task to the local cloud
     * @param data the data to use
     * @param data.task the task to execute
     * @param data.startTime the start time for the task
     * @param data.userId the user id
     * @param data.args the arguments for the job
     * @param data.metadata the metadata for the job
     * @returns the task id
     */
    async addTask(data) {
        const taskId = LocalCloud.generateId();
        LocalStorage.tasks[taskId] = {
            ...data,
            id: "local",
            taskId,
            timeCreated: Date.now(),
            developer: this.developer,
            repo: this.repo,
            chain: this.chain,
        };
        return taskId;
    }
    /**
     * Deletes a task from the local cloud
     * @param taskId the task id to delete
     */
    async deleteTask(taskId) {
        if (LocalStorage.tasks[taskId] === undefined)
            throw new Error(`deleteTask: Task ${taskId} not found`);
        delete LocalStorage.tasks[taskId];
    }
    /**
     * Processes the tasks in the local cloud
     */
    async processTasks() {
        await LocalCloud.processLocalTasks({
            developer: this.developer,
            repo: this.repo,
            localWorker: this.localWorker,
            chain: this.chain,
        });
    }
    /**
     * Processes the local tasks
     * @param params the parameters to process the local tasks
     * @param params.developer the developer of the repo
     * @param params.repo the repo
     * @param params.localWorker the worker to execute the tasks
     * @param params.chain the blockchain to execute the job on
     */
    static async processLocalTasks(params) {
        const { developer, repo, localWorker, chain } = params;
        for (const taskId in LocalStorage.tasks) {
            const data = LocalStorage.tasks[taskId];
            const jobId = LocalCloud.generateId();
            const timeCreated = Date.now();
            if (data.startTime !== undefined && data.startTime < timeCreated)
                continue;
            const job = {
                id: "local",
                jobId: jobId,
                taskId: taskId,
                developer,
                repo,
                task: data.task,
                userId: data.userId,
                args: data.args,
                metadata: data.metadata,
                txNumber: 1,
                timeCreated: timeCreated,
                timeCreatedString: new Date(timeCreated).toISOString(),
                timeStarted: Date.now(),
                jobStatus: "started",
                maxAttempts: 0,
            };
            const cloud = new LocalCloud({
                job,
                chain,
                localWorker,
            });
            const worker = await localWorker(cloud);
            const result = await worker.task();
            job.timeFinished = Date.now();
            job.maxAttempts = 1;
            job.billedDuration = job.timeFinished - timeCreated;
            if (result !== undefined) {
                job.jobStatus = "finished";
                job.result = result;
            }
            else {
                job.jobStatus = "failed";
            }
            LocalStorage.jobs[jobId] = job;
        }
        let count = 0;
        for (const task in LocalStorage.tasks)
            count++;
        return count;
    }
    /**
     * Runs the sequencer in the local cloud
     * @param params the parameters to run the sequencer
     * @param params.worker the worker to execute the tasks
     * @param params.data the data to use
     * @param params.data.developer the developer of the repo
     * @param params.data.repo the repo
     * @param params.data.transactions the transactions to process
     * @param params.data.task the task to execute
     * @param params.data.userId the user id
     * @param params.data.args the arguments for the job
     * @param params.data.metadata the metadata for the job
     * @returns the proof
     */
    static async sequencer(params) {
        const { worker, data } = params;
        const { transactions } = data;
        if (transactions.length === 0)
            throw new Error("No transactions to process");
        const proofs = [];
        for (const transaction of transactions) {
            const result = await worker.create(transaction);
            if (result === undefined)
                throw new Error("Failed to create proof");
            proofs.push(result);
        }
        let proof = proofs[0];
        for (let i = 1; i < proofs.length; i++) {
            const result = await worker.merge(proof, proofs[i]);
            if (result === undefined)
                throw new Error("Failed to merge proofs");
            proof = result;
        }
        return proof;
    }
}
exports.LocalCloud = LocalCloud;
/**
 * LocalStorage is a local storage for the local cloud
 * It stores jobs, tasks, transactions, and data
 * It can be used to test the cloud functionality without deploying to the cloud
 * @param jobs the jobs
 * @param data the data
 * @param transactions the transactions
 * @param tasks the tasks
 */
class LocalStorage {
    /**
     * Saves the data
     * @param name the name to save the data
     */
    static async saveData(name) {
        const data = {
            jobs: LocalStorage.jobs,
            data: LocalStorage.data,
            transactions: LocalStorage.transactions,
            tasks: LocalStorage.tasks,
        };
        const filename = name + ".cloud";
        await (0, cloud_3.saveFile)({ data, filename });
    }
    /**
     * Loads the data
     * @param name the name to load the data
     */
    static async loadData(name) {
        const filename = name + ".cloud";
        const data = await (0, cloud_3.loadFile)(filename);
        if (data === undefined)
            return;
        LocalStorage.jobs = data.jobs;
        LocalStorage.data = data.data;
        LocalStorage.transactions = data.transactions;
        LocalStorage.tasks = data.tasks;
    }
}
exports.LocalStorage = LocalStorage;
LocalStorage.jobs = {};
LocalStorage.data = {};
LocalStorage.transactions = {};
LocalStorage.tasks = {};
