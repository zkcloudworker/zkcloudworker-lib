import { UInt64 } from "o1js";
import config from "../../cloud/config";
/**
 * Calculate the fee for a transaction
 * @returns the fee for a transaction
 */
export async function fee() {
    //TODO: update after mainnet launch and resolution of the issue https://github.com/o1-labs/o1js/issues/1626
    return UInt64.fromJSON(config.MINAFEE);
}
//# sourceMappingURL=fee.js.map