import { UInt64 } from "o1js";
import config from "./config";
export async function fee() {
    //TODO: update after mainnet launch
    return UInt64.fromJSON(config.MINAFEE);
}
//# sourceMappingURL=fee.js.map