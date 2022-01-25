import { getHosts, getTargets, printRainbow } from "/nm/lib.js";
// hacking only
// run neuromancer.js [mode(train|share|hack)]
// uses the /mini/ payloads

export function autocomplete(data, args) {
    return [...data.servers];
}

// this is a required global var for the scan
var visited = {};

let reserveRam = 11;

var banner = "===== ᑎEᑌᖇOᗰᗩᑎᑕEᖇ =====";

banner = `    ███▄    █ ▓█████  █    ██  ██▀███   ▒█████   ███▄ ▄███▓ ▄▄▄       ███▄    █  ▄████▄  ▓█████  ██▀███
    ██ ▀█   █ ▓█   ▀  ██  ▓██▒▓██ ▒ ██▒▒██▒  ██▒▓██▒▀█▀ ██▒▒████▄     ██ ▀█   █ ▒██▀ ▀█  ▓█   ▀ ▓██ ▒ ██▒
   ▓██  ▀█ ██▒▒███   ▓██  ▒██░▓██ ░▄█ ▒▒██░  ██▒▓██    ▓██░▒██  ▀█▄  ▓██  ▀█ ██▒▒▓█    ▄ ▒███   ▓██ ░▄█ ▒
   ▓██▒  ▐▌██▒▒▓█  ▄ ▓▓█  ░██░▒██▀▀█▄  ▒██   ██░▒██    ▒██ ░██▄▄▄▄██ ▓██▒  ▐▌██▒▒▓▓▄ ▄██▒▒▓█  ▄ ▒██▀▀█▄  
   ▒██░   ▓██░░▒████▒▒▒█████▓ ░██▓ ▒██▒░ ████▓▒░▒██▒   ░██▒ ▓█   ▓██▒▒██░   ▓██░▒ ▓███▀ ░░▒████▒░██▓ ▒██▒
   ░ ▒░   ▒ ▒ ░░ ▒░ ░░▒▓▒ ▒ ▒ ░ ▒▓ ░▒▓░░ ▒░▒░▒░ ░ ▒░   ░  ░ ▒▒   ▓▒█░░ ▒░   ▒ ▒ ░ ░▒ ▒  ░░░ ▒░ ░░ ▒▓ ░▒▓░
   ░ ░░   ░ ▒░ ░ ░  ░░░▒░ ░ ░   ░▒ ░ ▒░  ░ ▒ ▒░ ░  ░      ░  ▒   ▒▒ ░░ ░░   ░ ▒░  ░  ▒    ░ ░  ░  ░▒ ░ ▒░
      ░   ░ ░    ░    ░░░ ░ ░   ░░   ░ ░ ░ ░ ▒  ░      ░     ░   ▒      ░   ░ ░ ░           ░     ░░   ░ 
            ░    ░  ░   ░        ░         ░ ░         ░         ░  ░         ░ ░ ░         ░  ░   ░     
                                                                                ░                        `;

/** @param {import("../../.").NS } ns */
export async function main(ns) {
    //ns.tprint("NEUROMANCER STARTING");
    //ns.tprint('\n' + banner);
    printRainbow(banner);
    ns.disableLog("ALL");
    visited = {};
    let targets = await getTargets(ns);

    let threadRatios = { 'weaken': 3, 'grow': 10, 'hack': 1 };
    let ramPerBatch = (ns.getScriptRam('/mini/weaken.js') * threadRatios['weaken']) + (ns.getScriptRam('/mini/grow.js') * threadRatios['grow']) + (ns.getScriptRam('/mini/hack.js') * threadRatios['hack']);

    while (true) {
        ns.print("= MAIN CYCLE =");
        let hosts = getHosts(ns);
        let target = findBestTarget(hosts);

        //ns.tprint('NEUROMANCER - CYCLING');
        //ns.tprint("BEST TARGET: " + target);

        if (target) {
            for (let h = 0; h < hosts.length; h++) {
                let host = hosts[h];

                //ns.tprint("CHECKING " + host);
                if (host == 'home') {

                    let ram = ns.getServerMaxRam(host) - ns.getServerUsedRam(host);
                    if (host == 'home')
                        ram -= reserveRam;

                    while (ram > ramPerBatch) {
                        // too many batches at a certain point, need to thread them up to max server drain from one hack cycle
                        if (ram > ramPerBatch * 50) {
                            ram -= ramPerBatch * 50;
                            deployBatch(host, target, 50);
                        } else if (ram > ramPerBatch * 25) {
                            ram -= ramPerBatch * 25;
                            deployBatch(host, target, 25);
                        } else if (ram > ramPerBatch * 10) {
                            ram -= ramPerBatch * 10;
                            deployBatch(host, target, 10);
                        } else if (ram > ramPerBatch * 5) {
                            ram -= ramPerBatch * 5;
                            deployBatch(host, target, 5);
                        } else if (ram > ramPerBatch * 3) {
                            ram -= ramPerBatch * 3;
                            deployBatch(host, target, 3);
                        } else {
                            ram -= ramPerBatch;
                            deployBatch(host, target);
                        }
                        await ns.sleep(300);
                    }
                }
            }
        }
        await ns.sleep(1000);
    }

    function deployBatch(host, target, threads = 1) {
        ns.print('DEPLOYING BATCH... ' + host + ' => ' + target + ' threads: ' + threads);
        let cycleOffset = 100; // in ms
        let weakenTime = Math.ceil(ns.getWeakenTime(target));
        let growTime = Math.ceil(ns.getGrowTime(target));
        let hackTime = Math.ceil(ns.getHackTime(target));

        let batchTime = weakenTime;

        let growWait = Math.ceil(batchTime - growTime - cycleOffset);
        let weakenWait = 0;
        let hackWait = Math.ceil(batchTime - hackTime + cycleOffset);

        // LEAVE THIS FOR FUTURE TUNING
        //ns.tprint("==================================================")
        //ns.tprint("BATCH TIME:  \t" + batchTime + "ms");
        //ns.tprint("WEAKEN TIME: \t" + weakenTime + " WEAKEN WAIT: \t" + weakenWait + "ms" + " WEAKEN TOTAL: \t" + (weakenTime + weakenWait) + "ms");
        //ns.tprint("GROW TIME:   \t" + growTime + " GROW WAIT:   \t" + growWait + "ms" + " GROW TOTAL:   \t" + (growTime + growWait) + "ms");
        //ns.tprint("HACK TIME:   \t" + hackTime + " HACK WAIT:   \t" + hackWait + "ms" + " HACK TOTAL:   \t" + (hackTime + hackWait) + "ms");

        for (var i = 0; i < threadRatios['weaken']; i++) {
            deployWeaken(host, target, weakenWait, threads);
        }
        for (var i = 0; i < threadRatios['grow']; i++) {
            deployGrow(host, target, growWait, threads);
        }
        for (var i = 0; i < threadRatios['hack']; i++) {
            deployHack(host, target, hackWait, threads);
        }
    }

    function deployWeaken(host, target, offset = 0, threads = 1) {
        //ns.run('/mini/weaken.js', threads, target, offset, crypto.randomUUID());
        if (threads > 0)
            ns.exec('/mini/weaken.js', host, threads, target, offset, crypto.randomUUID());
    }

    async function deployGrow(host, target, offset = 0, threads = 1) {
        //ns.run('/mini/grow.js', threads, target, offset, crypto.randomUUID());
        if (threads > 0)
            ns.exec('/mini/grow.js', host, threads, target, offset, crypto.randomUUID());
    }

    async function deployHack(host, target, offset = 0, threads = 1) {
        //ns.run('/mini/hack.js', threads, target, offset, crypto.randomUUID());
        if (threads > 0)
            ns.exec('/mini/hack.js', host, threads, target, offset, crypto.randomUUID());
    }

    function findBestTarget(hosts) {
        //ns.tprint("HOSTS: " + hosts);
        ns.print("Finding Best Target...");
        let bestTarget = "joesguns";
        let bestValue = 0;
        for (var t = 0; t < targets.length; t++) {
            let target = targets[t];
            if (ns.getHackingLevel() > ns.getServerRequiredHackingLevel(target) && ns.hasRootAccess(target) && ns.getServerMaxMoney(target) > 0) {
                bestTarget = target;
                bestValue = ns.getServerMaxMoney(target) / ns.getServerMinSecurityLevel(target); //ns.hackAnalyze(target);
                // THIS SHOULD BE TESTED MORE TO FIND A BETTER WAY TO PICK THE BEST TARGET
            }
        }
        ns.print("BEST TARGET: " + bestTarget);
        //ns.tprint("FINDING..." + bestTarget + " WITH VALUE " + bestValue);

        for (var h = 0; h < hosts.length; h++) {
            let host = hosts[h];
            // IF SERVER SEC IS TOO HIGH, BLAST IT
            if (ns.getServerSecurityLevel(bestTarget) > ns.getServerMinSecurityLevel(bestTarget) * 1.25) {
                var ram = ns.getServerMaxRam(host) - ns.getServerUsedRam(host) - reserveRam;
                var scriptRam = ns.getScriptRam('/mini/weaken.js') + ns.getScriptRam('/mini/grow.js');
                var threads = Math.floor(ram / scriptRam);
                if (threads > 0) {
                    deployWeaken(host, bestTarget, 0, Math.floor(threads));
                    deployGrow(host, bestTarget, 0, Math.floor(threads));
                    ns.print("SEC TOO HIGH - BLASTING " + bestTarget + " FROM " + host);
                    return false;
                }
            }

            // IF SERVER MONEY IS TOO LOW, BLAST IT
            if (ns.getServerMoneyAvailable(bestTarget) < ns.getServerMaxMoney(bestTarget) * 0.75) {
                var ram = ns.getServerMaxRam(host) - ns.getServerUsedRam(host) - reserveRam;
                var scriptRam = ns.getScriptRam('/mini/weaken.js') + ns.getScriptRam('/mini/grow.js');
                var threads = Math.floor(ram / scriptRam);
                if (threads > 0) {
                    deployWeaken(host, bestTarget, 0, Math.floor(threads));
                    deployGrow(host, bestTarget, 0, Math.floor(threads));
                    ns.print("MONEY TOO LOW - BLASTING " + bestTarget + " FROM " + host);
                    return false;
                }
            }
        }

        return bestTarget;
    }
}
