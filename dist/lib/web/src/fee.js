import { __awaiter } from "tslib";
import { UInt64 } from "o1js";
import config from "./config";
export function fee() {
    return __awaiter(this, void 0, void 0, function* () {
        //TODO: update after mainnet launch
        return UInt64.fromJSON(config.MINAFEE);
    });
}
//# sourceMappingURL=fee.js.map