export { BackendPlugin };
class BackendPlugin {
    constructor(params) {
        const { name, task, args, jobId } = params;
        this.name = name;
        this.task = task;
        this.args = args;
        this.jobId = jobId;
    }
}
//# sourceMappingURL=backend.js.map