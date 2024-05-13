/// <reference types="node" />
export declare function saveFile(params: {
    data: any;
    filename: string;
}): Promise<string | undefined>;
export declare function loadFile(filename: string): Promise<any>;
export declare function saveBinaryFile(params: {
    data: any;
    filename: string;
}): Promise<string | undefined>;
export declare function loadBinaryFile(filename: string): Promise<Buffer | undefined>;
