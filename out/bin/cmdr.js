import { STOCKS_PORT, runRemoteScript, UPGRADES_PORT, shareFill } from "/lib/lib.js";
import { purchaseNewAttackBot } from "/nm/lib.js";

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

            } else if (arg.startsWith("!") || arg.startsWith("-")) { /// single dash makes each letter a flag -one == -o -n -e, must find another way that makes more sense
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

    async function stopUpgrading() {
        ns.tprint("STOP UPGRADING");
        await ns.writePort(UPGRADES_PORT, "STOP");
    }

    async function startUpgrading() {
        ns.tprint("START UPGRADING");
        await ns.writePort(UPGRADES_PORT, "START");
    }

    function purchaseHomeExtrasServer() {
        if (!ns.serverExists('home-extras')) {
            // attempt to purchase a server for 128GB
            if (!ns.serverExists('home-extras') && ns.getPlayer().money > ns.getPurchasedServerCost(128)) {
                ns.purchaseServer('home-extras', 128);
            }
        }
    }

    function buyPrograms() {
        ns.tprint("BUYING PROGRAMS IS DISABLED FOR NOW DUE TO 32GB REQ");
        /* DISABLED FOR NOW - 32GB outsite of bitNode4
        ns.tprint("BUYING PROGRAMS");
        if (ns.getPlayer().tor) {
            if (!ns.fileExists('FTPCrack.exe', 'home')) {
                if (money > 1500000 * 1.5) {
                    if (ns.purchaseProgram('FTPCrack.exe')) {
                        ns.tprint("Purchased FTPCrack.exe");
                        money -= 1500000;
                    }
                }
            }
            if (!ns.fileExists('relaySMTP.exe', 'home')) {
                if (money > 5000000 * 1.5) {
                    if (ns.purchaseProgram('SQLInject.exe')) {
                        ns.tprint("Purchased SQLInject.exe");
                        money -= 5000000;
                    }
                }
            }
            if (!ns.fileExists('HTTPWorm.exe', 'home')) {
                if (money > 30000000 * 1.5) {
                    if (ns.purchaseProgram('HTTPWorm.exe')) {
                        ns.tprint("Purchased HTTPWorm.exe");
                        money -= 30000000;
                    }
                }
            }
            if (!ns.fileExists('SQLInject.exe', 'home')) {
                if (money > 250000000 * 1.5) {
                    if (ns.purchaseProgram('SQLInject.exe')) {
                        ns.tprint("Purchased SQLInject.exe");
                        money -= 250000000;
                    }
                }
            }
            if (!ns.fileExists('AutoLink.exe', 'home')) {
                if (money > 1000000 * 1.5) {
                    if (ns.purchaseProgram('AutoLink.exe')) {
                        ns.tprint("Purchased AutoLink.exe");
                        money -= 1000000;
                    }
                }
            }
            if (!ns.fileExists('DeepscanV1.exe', 'home')) {
                if (money > 500000 * 1.5) {
                    if (ns.purchaseProgram('DeepscanV1.exe')) {
                        ns.tprint("Purchased DeepscanV1.exe");
                        money -= 500000;
                    }
                }
            }
            if (!ns.fileExists('DeepscanV2.exe', 'home')) {
                if (money > 25000000 * 1.5) {
                    if (ns.purchaseProgram('DeepscanV2.exe')) {
                        ns.tprint("Purchased DeepscanV2.exe");
                        money -= 25000000;
                    }
                }
            }
        }
        */
    }

    function loadUI() {
        ns.scriptKill("/ui/extend-basic-5.5GB.js", "home");
        ns.scriptKill("/ui/extend-stocks-14GB.js", "home");
        ns.scriptKill("/ui/extend-factions-30GB.js", "home");

        var freeRam = ns.getServerMaxRam('home') - ns.getServerUsedRam('home');

        if (false) { //freeRam > 30) { // currently requires 230GB, unrealistically high
            ns.exec("/ui/extend-factions-30GB.js", "home");
        } else if (freeRam > 14 && ns.getPlayer().hasWseAccount) {
            ns.exec("/ui/extend-stocks-14GB.js", "home");
        } else if (freeRam > 5.5) {
            ns.exec("/ui/extend-basic-5.5GB.js", "home");
        } else {
            ns.tprint("NOT ENOUGH RAM TO LOAD UI");
        }

    }

    var opts = parseArgs();
    //ns.tprint(opts);

    for (var key in opts) {
        switch (key) {
            case "stocks":
            case "s":
                switch (opts[key]) {
                    case "start":
                        await startBuyingStocks();
                        break;
                    case "stop":
                        await stopBuyingStocks();
                        break;
                    case "deploy":
                        await runRemoteScript(ns, '/bin/stocks.js', 'home-extras');
                        break;
                    default:
                        ns.tprint("Unknown stocks option: " + opts[key]);
                        break;
                }
                break;
            case "upgrades":
            case "u":
                switch (opts[key]) {
                    case "start":
                        await startUpgrading();
                        break;
                    case "stop":
                        await stopUpgrading();
                        break;
                    case "deploy":
                        await runRemoteScript(ns, '/bin/upgrades.js', 'home-extras');
                    default:
                        ns.tprint("Unknown upgrades option: " + opts[key]);
                        break;
                }
                break;
            case "help":
                ns.tprint("INFO - HELP\n\tcmdr !command argument --flag\n\t!stocks\t\t[start|stop|deploy]\n\t!upgrades\t[start|stop|deploy]\n\t--work\t\t-> Reload work.js\n\t--ui\t\t-> Reload ui.js\n\t--contracts\t-> Reload contracts.js\n\t--share\t\t-> Dedicate all servers to sharing\n\t!buy\t\t[bot|home-extras]\t\t-> Buy Programs");
                break;
            case "work":
                await runRemoteScript(ns, '/bin/work.js', 'home-extras');
                break;
            case "contracts":
                await runRemoteScript(ns, '/bin/contracts.js', 'home-extras');
                break;
            case "ui":
                loadUI();
                break;
            case "share":
                await shareFill(ns);
                break;
            case "buy":
            case "b":
                switch (opts[key]) {
                    case "bot":
                        await purchaseNewAttackBot(ns);
                        break;
                    case "home-extras":
                        purchaseHomeExtrasServer();
                        break;
                    default:
                        ns.tprint("Unknown buy option: " + opts[key]);
                        break;
                }
                break;
            default:
                ns.tprint("Unknown module: " + key);
                break;
        }
    }
}

