import ow from "ow";

import { WatchdogStrategy } from "../WatchdogStrategy";

export class TimeWatchdogStrategy implements WatchdogStrategy {
    private static DEFAULT_TTL_MS: number = 60 * 1000;
    private currentMetadata: TimeWatchdogStrategy.Metadata;

    public constructor() {
        this.currentMetadata = this.generateCurrentMetadata(TimeWatchdogStrategy.DEFAULT_TTL_MS);
    }

    public getName(): string {
        return "time-watchdog";
    }

    public beat(ttlMs: number): void {
        this.currentMetadata = this.generateCurrentMetadata(ttlMs);
    }

    public async getMetadata(): Promise<object> {
        return Object.freeze(this.currentMetadata);
    }

    public async isAlive(metadata_: object): Promise<{ alive: boolean; msg: string }> {
        const metadata = metadata_ as TimeWatchdogStrategy.Metadata;
        TimeWatchdogStrategy.Metadata.validate(metadata);

        const beatStillValid = Date.now() <= metadata.beatTimestampValidUntilMs;
        const msg = beatStillValid ? "OK" : "Beat is no longer valid";
        return { alive: beatStillValid, msg: msg };
    }

    private generateCurrentMetadata(ttlMs: number): TimeWatchdogStrategy.Metadata {
        return {
            beatTimestampMs: Date.now(),
            beatTimestampValidUntilMs: Date.now() + ttlMs,
        };
    }
}

export namespace TimeWatchdogStrategy {
    export interface Metadata {
        beatTimestampMs: number;
        beatTimestampValidUntilMs: number;
    }

    export namespace Metadata {
        export function validate(m: Metadata) {
            ow(m.beatTimestampMs, ow.number.integer.finite.label("beatTimestampMs"));
            ow(m.beatTimestampValidUntilMs, ow.number.integer.label("beatTimestampValidUntilMs"));
        }
    }
}
