import { zkCloudWorkerClient } from "../api/api.js";
export class NftAPI {
    constructor(params) {
        const { jwt, zkcloudworker, chain } = params;
        if (jwt === undefined)
            throw new Error("jwt is undefined");
        this.client = new zkCloudWorkerClient({
            jwt,
            chain,
            zkcloudworker,
        });
    }
    async proveTransaction(params) {
        return this.proveTransactions([params]);
    }
    async proveTransactions(params, name) {
        const transactions = [];
        for (const tx of params) {
            const transaction = JSON.stringify(tx, null, 2);
            transactions.push(transaction);
        }
        const { request, symbol } = params[0];
        const { txType } = request;
        const answer = await this.client.execute({
            developer: "DFST",
            repo: "nft-agent",
            transactions,
            task: "prove",
            args: JSON.stringify({
                collectionAddress: params[0].request.collectionAddress,
            }),
            metadata: `${params.length > 1 ? "mint" : txType.replace(/^nft:/, "")} ${symbol ? ` ${symbol}` : ""} ${params.length > 1
                ? `(${params.length} txs)`
                : txType === "nft:launch"
                    ? "Collection " + request.collectionName
                    : txType === "nft:mint"
                        ? request.nftMintParams.name
                        : name ?? ""}`,
        });
        const jobId = answer.jobId;
        if (jobId === undefined)
            console.error("Job ID is undefined", { answer, txType, symbol });
        return jobId;
    }
    // Warning: this function will block the thread until the job is done and will print logs to the console
    // Do not use it in "use server" functions, use getResults instead
    async waitForJobResults(params) {
        const deployResult = await this.client.waitForJobResult(params);
        console.log("waitForJobResult result:", deployResult?.result?.result?.slice(0, 50));
        return deployResult?.result?.result ?? "error";
    }
    async getResults(jobId) {
        try {
            const callResult = await this.client.jobResult({ jobId });
            // TODO: filter the repo and developer
            const jobStatus = typeof callResult?.result === "string"
                ? undefined
                : callResult?.result?.jobStatus;
            if (!callResult.success) {
                return {
                    success: false,
                    error: callResult?.error,
                    jobStatus,
                };
            }
            const jobResult = callResult.result?.result;
            if (callResult.error)
                return {
                    success: false,
                    error: callResult.error,
                    jobStatus,
                };
            if (!jobResult)
                return { success: true, jobStatus };
            if (jobResult.toLowerCase().startsWith("error"))
                return {
                    success: false,
                    error: jobResult,
                    jobStatus,
                };
            try {
                const { proofs } = JSON.parse(jobResult);
                const results = [];
                for (const proof of proofs) {
                    const { success, tx, hash, error } = JSON.parse(proof);
                    results.push({ success, tx, hash, error });
                }
                return { success: true, results, jobStatus };
            }
            catch (e) {
                return {
                    success: false,
                    error: `Error parsing job result: ${jobResult} ${e?.message ?? ""}`,
                    jobStatus,
                };
            }
        }
        catch (e) {
            return {
                success: false,
                error: `Error getting job result: ${e?.message ?? ""}`,
                jobStatus: undefined,
            };
        }
    }
}
//# sourceMappingURL=nft.js.map