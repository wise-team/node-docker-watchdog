import ow from "ow";

import { DockerWatchdogConfig } from "./DockerWatchdogConfig";
import { WatchdogStrategy } from "./WatchdogStrategy";
import { Response } from "./Response";
import Axios from "axios";
import { STRATEGIES_MAP } from "./strategies";

export class DockerWatchdogListener {
    private config: DockerWatchdogConfig;

    public constructor(config?: DockerWatchdogConfig) {
        this.config = config ? config : DockerWatchdogConfig.DEFAULT_CONFIG;
        DockerWatchdogConfig.validate(this.config);
    }

    public async checkIsAlive(): Promise<{ alive: boolean; msg: string }> {
        try {
            const response = await this.getResponseFromWatchdogServer();
            this.validateResponse(response);
            const result = await this.checkAliveness(response);
            return result;
        } catch (error) {
            return { alive: false, msg: "Error in DockerWatchdogListener: " + error };
        }
    }

    private async getResponseFromWatchdogServer(): Promise<Response> {
        try {
            const resp = await Axios.get(`http://${this.config.ip}:${this.config.port}/`);
            return resp.data as Response;
        } catch (error) {
            if (error.response) {
                throw new Error(
                    `WatchdogListener got error from remote server: ${error.response.status} - ${error.response.data}`
                );
            } else throw error;
        }
    }

    private validateResponse(response: Response) {
        try {
            Response.validate(response);
        } catch (error) {
            throw new Error("Invalid response from watchdog server: " + response + ", error: " + error);
        }
    }

    private async checkAliveness(response: Response): Promise<{ alive: boolean; msg: string }> {
        for (const entity of response) {
            const strategyFactory = STRATEGIES_MAP.get(entity.strategy);
            if (!strategyFactory) return { alive: false, msg: "Strategy not found: " + entity.strategy };
            const strategy = strategyFactory();
            const alivenessCheckResult = await strategy.isAlive(entity.metadata);
            if (!alivenessCheckResult.alive) return alivenessCheckResult;
        }
        return { alive: true, msg: `${response.length} strategies OK` };
    }
}
