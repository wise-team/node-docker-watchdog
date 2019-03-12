import * as express from "express";
import ow from "ow";

import { DockerWatchdogConfig } from "./DockerWatchdogConfig";
import { Response, ResponseEntity } from "./Response";
import { WatchdogStrategy } from "./WatchdogStrategy";

export class DockerWatchdogServer {
    private config: DockerWatchdogConfig;
    private strategies: WatchdogStrategy[];
    private expressServer: express.Application;

    public constructor(strategies: WatchdogStrategy[], config?: DockerWatchdogConfig) {
        ow(
            strategies,
            ow.array
                .minLength(1)
                .ofType(ow.object.is(o => WatchdogStrategy.isWatchdogStrategy(o)))
                .label("strategies"),
        );
        this.strategies = strategies;

        this.config = config ? config : DockerWatchdogConfig.DEFAULT_CONFIG;
        DockerWatchdogConfig.validate(this.config);

        this.expressServer = express();
        this.configureServer(this.expressServer);
    }

    public async listen() {
        return new Promise((resolve, reject) => {
            this.expressServer.listen(this.config.port, this.config.ip, () => {
                resolve();
            });
        });
    }

    private configureServer(app: express.Application) {
        app.get("/", async (req, res) => {
            try {
                const strategiesResponse = await this.getStrategiesResponse();
                res.send(JSON.stringify(strategiesResponse));
            } catch (error) {
                res.send(error);
            }
        });
    }

    private async getStrategiesResponse(): Promise<Response> {
        const response: Response = [];
        for (const strategy of this.strategies) {
            const metadata = await strategy.getMetadata();
            const entity: ResponseEntity = {
                strategy: strategy.getName(),
                metadata,
            };
            response.push(entity);
        }
        return response;
    }
}
