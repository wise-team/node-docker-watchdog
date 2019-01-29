const watchdog = require("../dist/index");

watchdog.CliWatchdogHealthcheck({
    project: "wise-hub",
    environment: "production"
});