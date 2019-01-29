import { DockerWatchdogServer, TimeWatchdogStrategy } from "../src/";

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
