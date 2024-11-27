import { zkCloudWorkerClient } from "../api/api.js";
export class TokenAPI {
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
    async sendDeployTransaction(params) {
        const { symbol } = params;
        const transaction = JSON.stringify(params, null, 2);
        const answer = await this.client.execute({
            developer: "DFST",
            repo: "token-launchpad",
            transactions: [transaction],
            task: "deploy",
            args: JSON.stringify({ tokenAddress: params.tokenAddress }),
            metadata: `deploy token ${symbol}`,
        });
        const jobId = answer.jobId;
        if (jobId === undefined)
            console.error("Deploy Job ID is undefined", { answer, symbol });
        return jobId;
    }
    async sendTransaction(params) {
        const { txType, symbol } = params;
        const transaction = JSON.stringify(params, null, 2);
        const answer = await this.client.execute({
            developer: "DFST",
            repo: "token-launchpad",
            transactions: [transaction],
            task: txType,
            args: JSON.stringify({ tokenAddress: params.tokenAddress }),
            metadata: `${txType} token${symbol ? ` ${symbol}` : ""}`,
        });
        const jobId = answer.jobId;
        if (jobId === undefined)
            console.error("Job ID is undefined", { answer, txType, symbol });
        return jobId;
    }
    // Warning: this function will block the thread until the job is done and will print logs to the console
    // Do not use it in "use server" functions, use getResult instead
    async waitForJobResult(params) {
        const deployResult = await this.client.waitForJobResult(params);
        console.log("waitForJobResult result:", deployResult?.result?.result?.slice(0, 50));
        return deployResult?.result?.result ?? "error";
    }
    // async getResult(jobId: string): Promise<FungibleTokenJobResult> {
    //   try {
    //     const callResult = await this.client.jobResult({ jobId });
    //     let jobStatus: JobStatus | "unknown" = "unknown";
    //     if (callResult?.result && typeof callResult?.result !== "string")
    //       jobStatus = callResult.result.jobStatus ?? "unknown";
    //     if (!callResult.success) {
    //       //console.error("Job result error", jobId, JSON.stringify(callResult));
    //       return {
    //         success: false,
    //         error: callResult?.error,
    //         jobStatus,
    //       };
    //     }
    //     if (callResult.error)
    //       return {
    //         success: false,
    //         error: callResult.error,
    //         jobStatus,
    //       };
    //     const jobResult = callResult.result?.result;
    //     if (!jobResult) return { success: true, jobStatus };
    //     if (typeof jobResult !== "string")
    //       return {
    //         success: false,
    //         error: `Job result is not a string: ${String(jobResult)}`,
    //         jobStatus,
    //       };
    //     if (jobResult.toLowerCase().startsWith("error"))
    //       return {
    //         success: false,
    //         error: jobResult,
    //         jobStatus,
    //       };
    //     try {
    //       const { success, tx, hash, error } = JSON.parse(jobResult);
    //       if (success === undefined)
    //         return {
    //           success: false,
    //           tx,
    //           hash,
    //           error,
    //           jobStatus,
    //         };
    //       return { success, tx, hash, error, jobStatus };
    //     } catch (e: any) {
    //       return {
    //         success: false,
    //         error: `Error parsing job result: ${jobResult} ${e?.message ?? ""}`,
    //         jobStatus,
    //       };
    //     }
    //   } catch (e: any) {
    //     return {
    //       success: false,
    //       error: `Error getting job result: ${e?.message ?? ""}`,
    //       jobStatus: "unknown",
    //     };
    //   }
    // }
    async getResult(jobId) {
        try {
            const callResult = await this.client.jobResult({ jobId });
            // const jobStatus: JobStatus | undefined =
            //   callResult?.success === true
            //     ? callResult?.result?.jobStatus
            //     : undefined;
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
                const { success, tx, hash, error } = JSON.parse(jobResult);
                if (success === undefined)
                    return {
                        success: false,
                        tx,
                        hash,
                        error,
                        jobStatus,
                    };
                return { success, tx, hash, error, jobStatus };
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
//# sourceMappingURL=api.js.map