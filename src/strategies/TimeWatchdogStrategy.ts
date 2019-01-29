import ow from "ow";

import { WatchdogStrategy } from "../WatchdogStrategy";

export class TimeWatchdogStrategy implements WatchdogStrategy {
    private static DEFAULT_TTL_MS: number = 60 * 1000;
    private identifier = "global-time-watchdog";
    private currentMetadata: TimeWatchdogStrategy.Metadata;

    public constructor() {
        this.currentMetadata = this.generateCurrentMetadata(TimeWatchdogStrategy.DEFAULT_TTL_MS);
    }
    public setIdentitier(identifier: string): TimeWatchdogStrategy {
        ow(identifier, ow.string.nonEmpty.label("identifier"));
        this.identifier = identifier;
        return this;
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

    public getListener(): WatchdogStrategy.Listener {
        return new Listener();
    }

    private generateCurrentMetadata(ttlMs: number): TimeWatchdogStrategy.Metadata {
        return {
            identifier: this.identifier,
            beatTimestampMs: Date.now(),
            beatTimestampValidUntilMs: Date.now() + ttlMs,
        };
    }
}

class Listener implements WatchdogStrategy.Listener {
    public async isAlive(metadata_: object): Promise<{ alive: boolean; msg: string }> {
        const metadata = metadata_ as TimeWatchdogStrategy.Metadata;
        TimeWatchdogStrategy.Metadata.validate(metadata);

        const beatStillValid = Date.now() <= metadata.beatTimestampValidUntilMs;
        const msg = beatStillValid ? "OK" : `Watchdog ${metadata.identifier}: beat is no longer valid`;
        return { alive: beatStillValid, msg: msg };
    }
}

export namespace TimeWatchdogStrategy {
    export interface Metadata {
        identifier: string;
        beatTimestampMs: number;
        beatTimestampValidUntilMs: number;
    }

    export namespace Metadata {
        export function validate(m: Metadata) {
            ow(m.identifier, ow.string.nonEmpty.label("identifier"));
            ow(m.beatTimestampMs, ow.number.integer.finite.label("beatTimestampMs"));
            ow(m.beatTimestampValidUntilMs, ow.number.integer.label("beatTimestampValidUntilMs"));
        }
    }
}
