# node-docker-watchdog

[![Greenkeeper badge](https://badges.greenkeeper.io/wise-team/node-docker-watchdog.svg)](https://greenkeeper.io/)

Simple watchdog. For node&amp;docker friendship forever. No more stalled loop.

### Healthcheck script

```javascript
const watchdog = require("node-docker-watchdog");

watchdog.CliWatchdogHealthcheck({
    project: "wise-hub",
    environment: "production",
});
```

### Watchdog in looping server:

```typescript
import { DockerWatchdogServer, TimeWatchdogStrategy } from "node-docker-watchdog";

const timeWatchdogA = new TimeWatchdogStrategy().setIdentitier("timeWatchdogA");
const timeWatchdogB = new TimeWatchdogStrategy().setIdentitier("timeWatchdogB");
const watchdogServer = new DockerWatchdogServer([timeWatchdogA, timeWatchdogB]);

(async () => {
    await watchdogServer.listen();

    recurrentLoopFn();
})();

function recurrentLoopFn() {
    console.log("beat 20000ms");
    timeWatchdogA.beat(14000);
    timeWatchdogB.beat(8000);
    setTimeout(() => recurrentLoopFn(), 20000);
}
```
