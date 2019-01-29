import ow from "ow";
import { DockerWatchdogConfig } from "./DockerWatchdogConfig";
import { DockerWatchdogListener } from "./DockerWatchdogListener";

export function CliWatchdogHealthcheck(options: CliWatchdogHealthcheck.Options, config?: DockerWatchdogConfig) {
    CliWatchdogHealthcheck.Options.validate(options);
    const listener = new DockerWatchdogListener(config);

    (async () => {
        try {
            const response = await listener.checkIsAlive();
            if (response.alive) {
                exitAlive();
            } else {
                exitNonAlive(options, response);
            }
        } catch (error) {
            exitError(options, error);
            console.error(error);
            process.exit(3);
        }
    })();
}

function exitAlive() {
    process.exit(0);
}

function exitNonAlive(options: CliWatchdogHealthcheck.Options, response: { alive: boolean; msg: string }) {
    console.error({
        service: "watchdog",
        module: options.project,
        environment: options.environment,
        message: `Watchdog is down: ${response.msg}`,
    });
    process.exit(2);
}

function exitError(options: CliWatchdogHealthcheck.Options, error: Error) {
    console.error({
        service: "watchdog",
        module: options.project,
        environment: options.environment,
        message: `Watchdog error: ${error}`,
        error: error + "",
        stack: error.stack,
    });
    process.exit(3);
}
export namespace CliWatchdogHealthcheck {
    export interface Options {
        project: string;
        environment: string;
    }

    export namespace Options {
        export function validate(o: Options) {
            ow(o.project, ow.string.nonEmpty.label("Options.project"));
            ow(o.environment, ow.string.nonEmpty.label("Options.environment"));
        }
    }
}
