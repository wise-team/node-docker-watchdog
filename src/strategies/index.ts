import { WatchdogStrategy } from "../WatchdogStrategy";

import { HttpResponseWatchdogStrategy } from "./HttpResponseWatchdogStrategy";
import { TimeWatchdogStrategy } from "./TimeWatchdogStrategy";

const strategiesMap: Map<string, () => WatchdogStrategy> = new Map();

strategiesMap.set(new TimeWatchdogStrategy().getName(), () => new TimeWatchdogStrategy());
strategiesMap.set(new HttpResponseWatchdogStrategy().getName(), () => new HttpResponseWatchdogStrategy());

const STRATEGIES_MAP: Readonly<Map<string, () => WatchdogStrategy>> = Object.freeze(strategiesMap);

export { TimeWatchdogStrategy, HttpResponseWatchdogStrategy, STRATEGIES_MAP };
