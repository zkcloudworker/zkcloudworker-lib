export interface INATSClient {
    address: string;
    secret: string;
    callme: {
        onOptions: (params: any) => void;
        onReady: (params: any) => void;
        onDone: (params: any) => void;
    };
}
export declare function NATSClient(callme: {
    onOptions: (params: any) => void;
    onReady: (params: any) => void;
    onDone: (params: any) => void;
}): Promise<INATSClient>;
export declare function listen(subject: string, callme: {
    onOptions: (params: any) => void;
    onReady: (params: any) => void;
    onDone: (params: any) => void;
}): Promise<void>;
