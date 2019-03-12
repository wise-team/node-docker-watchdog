import ow from "ow";

export interface DockerWatchdogConfig {
    port: number;
    ip: string;
}

export namespace DockerWatchdogConfig {
    export function validate(o: DockerWatchdogConfig) {
        ow(o.port, ow.number.integer.label("port"));
        ow(o.ip, ow.string.nonEmpty.label("ip"));
    }

    export const DEFAULT_CONFIG: DockerWatchdogConfig = {
        port: 25352,
        ip: "127.0.0.1",
    };
}
