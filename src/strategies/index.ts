import { WatchdogStrategy } from "../WatchdogStrategy";
import { TimeWatchdogStrategy } from "./TimeWatchdogStrategy";

const strategiesMap: Map<string, () => WatchdogStrategy> = new Map();

strategiesMap.set(new TimeWatchdogStrategy().getName(), () => new TimeWatchdogStrategy());

const STRATEGIES_MAP: Readonly<Map<string, () => WatchdogStrategy>> = Object.freeze(strategiesMap);

export { TimeWatchdogStrategy, STRATEGIES_MAP };
