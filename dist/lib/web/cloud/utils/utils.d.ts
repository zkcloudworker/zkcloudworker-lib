export declare function sleep(ms: number): Promise<unknown>;
export declare function makeString(length: number): string;
export declare function formatTime(ms: number): string;
export declare class Memory {
    static rss: number;
    constructor();
    static info(description?: string, fullInfo?: boolean): void;
}
