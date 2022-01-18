import { STOCKS_PORT } from "/lib/lib.js";

/** @param {import("../../.").NS } ns */
export async function main(ns) {
    function parseArgs() {
        var args = ns.args;

        var opts = {};

        for (var i = 0; i < args.length; i++) {
            var arg = args[i];
            if (arg.startsWith("--")) {
                // this is a flag
                opts[arg.slice(2)] = true;

            } else if (arg.startsWith("!")) { /// single dash makes each letter a flag -one == -o -n -e, must find another way that makes more sense
                // this is a cmd with an option
                if (args[i + 1]) {
                    opts[arg.slice(1)] = args[++i];
                }
            } else {
                // ???
                continue;
            }
        }

        return opts;
    }
    async function stopBuyingStocks() {
        ns.tprint("STOP BUYING STOCKS");
        await ns.writePort(STOCKS_PORT, "STOP");
    }

    async function startBuyingStocks() {
        ns.tprint("START BUYING STOCKS");
        await ns.writePort(STOCKS_PORT, "START");
    }

    var opts = parseArgs();
    //ns.tprint(opts);

    for (var key in opts) {
        switch (key) {
            case "stocks":
                switch (opts[key]) {
                    case "start":
                        await startBuyingStocks();
                        break;
                    case "stop":
                        await stopBuyingStocks();
                        break;
                    default:
                        ns.tprint("Unknown stocks option: " + opts[key]);
                        break;
                }
                break;
            case "help":
                ns.tprint("INFO - HELP - cmdr !command argument --flag\n!stocks [start|stop]");
                break;
            default:
                ns.tprint("Unknown module: " + key);
                break;
        }
    }
}

