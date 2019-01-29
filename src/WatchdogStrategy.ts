export interface WatchdogStrategy {
    getName(): string;
    getMetadata(): Promise<object>;
    getListener(): WatchdogStrategy.Listener;
}

export namespace WatchdogStrategy {
    export function isWatchdogStrategy(o: object): o is WatchdogStrategy {
        const ws = o as WatchdogStrategy;
        return (
            typeof ws.getName !== undefined &&
            typeof ws.getMetadata !== undefined &&
            typeof ws.getListener !== undefined
        );
    }

    export interface Listener {
        isAlive(metadata: object): Promise<{ alive: boolean; msg: string }>;
    }
}
