import ow from "ow";

import { WatchdogStrategy } from "../WatchdogStrategy";
import Axios from "axios";

export class HttpResponseWatchdogStrategy implements WatchdogStrategy {
    private url: string = "http://localhost/";
    private contains: string | undefined = undefined;

    public constructor() {}

    public withUrl(url: string): HttpResponseWatchdogStrategy {
        ow(url, ow.string.nonEmpty.label("url"));
        this.url = url;
        return this;
    }

    public thatContains(contains: string): HttpResponseWatchdogStrategy {
        ow(contains, ow.string.nonEmpty.label("url"));
        this.url = contains;
        return this;
    }

    public getName(): string {
        return "http-response-watchdog";
    }

    public async getMetadata(): Promise<object> {
        const metadata = this.generateCurrentMetadata();
        return metadata;
    }

    public getListener(): WatchdogStrategy.Listener {
        return new Listener();
    }

    private generateCurrentMetadata(): HttpResponseWatchdogStrategy.Metadata {
        return {
            url: this.url,
            contains: this.contains,
        };
    }
}

class Listener implements WatchdogStrategy.Listener {
    public async isAlive(metadata_: object): Promise<{ alive: boolean; msg: string }> {
        const metadata = metadata_ as HttpResponseWatchdogStrategy.Metadata;
        HttpResponseWatchdogStrategy.Metadata.validate(metadata);

        try {
            const response = await this.getResponse(metadata.url);

            const containsResult = this.checkContains(response, metadata.contains);
            if (!containsResult)
                return { alive: false, msg: `Response from ${metadata.url} does not contain ${metadata.contains}` };

            return { alive: true, msg: "ok" };
        } catch (error) {
            return { alive: false, msg: error.message };
        }
    }

    private async getResponse(url: string): Promise<string> {
        try {
            const resp = await Axios.get(url);
            return resp.data;
        } catch (error) {
            if (error.response) {
                throw new Error(
                    `Error while fetching ${url}: ${error}. Response: ${error.response.status} ${error.response.data}`
                );
            } else throw error;
        }
    }

    private checkContains(response: string, contains: string | undefined): boolean {
        if (contains) {
            const responseContainsString = response.indexOf(contains) >= 0;
            return responseContainsString;
        }
        return true;
    }
}

export namespace HttpResponseWatchdogStrategy {
    export interface Metadata {
        url: string;
        contains?: string;
    }

    export namespace Metadata {
        export function validate(m: Metadata) {
            ow(m.url, ow.string.nonEmpty.label("url"));
            ow(m.contains, ow.any(ow.undefined, ow.string.label("contains")));
        }
    }
}
