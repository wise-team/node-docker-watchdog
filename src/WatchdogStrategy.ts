export interface WatchdogStrategy {
    getName(): string;
    isAlive(metadata: object): Promise<{ alive: boolean; msg: string }>;
    getMetadata(): Promise<object>;
}

export namespace WatchdogStrategy {
    export function isWatchdogStrategy(o: object): o is WatchdogStrategy {
        const ws = o as WatchdogStrategy;
        return (
            typeof ws.getName !== undefined && typeof ws.getMetadata !== undefined && typeof ws.isAlive !== undefined
        );
    }
}
