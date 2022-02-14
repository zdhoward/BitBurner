import { reserveRam, reserveMoney, remoteServers, botServers, factionNames, augNames } from '/os/config.js';
import { helloWorld, getServerInfo, getScriptInfo } from '/os/lib.js';

export function autocomplete(data, args) {
    return [...data.servers];
}

/** @param {import("../../.").NS } ns */
export async function main(ns) {
    ns.tprint("hackManager.js loaded");
    // need to crack servers first
    await crackServers(ns);
    await hackServers(ns);
}

async function crackServers(ns) {
    ns.tprint("Cracking servers...");
    let data = await getServerInfo(ns);
}

/** @param {import("../..").NS } ns */
export async function hackServers(ns) {
    ns.tprint("Hacking servers...");
    let data = await getServerInfo(ns);
    //ns.tprint(Object.keys(data));
    let targets = [];
    for (let server in data) {
        if (data[server].exists && data[server].maxMoney > 0 && data[server].requiredHackingLevel <= ns.getPlayer().hacking) {
            //ns.tprint("Target: " + server + ' is hackable');
            targets.push(server);
        }
    }
    ns.tprint("Targets: ");
    ns.tprint(targets);
    //deployToTargets(ns, Object.keys(data), data);
}

function getAvailableThreads(ns) {
    // get the amount of threads able to run per server
    // return threads;
}

function getTargetThreads(ns, server) {
    // get the amount of threads to fully grow a server
    // return threads;
}

function getThreadDistribution(ns, targets, remotes) {
    // let serverThreads = {'server': threadCount}
    // get amount of payloads that can be launched from each server
    //   populate serverThreads
}

function distributeThreads(ns, targets, remotes) {
    // let distribution = getThreadDistribution(ns, targets, remotes);
    // For each remote server
    // kill processes
    // getAvaialbleThreads
    // While availableThreads > 0
    //   find lowest server in distribution
    //   getTargetThreads of lowest server
    //   Assign Math.min(availableThreads, targetThreads)
    //
    // If any remain after all is assigned, assign the rest to perpetually weaken all servers evenly

}

//////////////////////////////////////////////////////////////////////////////////////////////////////

/** @param {import("../../.").NS } ns **/
async function deployToTargets(ns, hosts, targets) {
    var fullyAssignedServers = [];
    hosts.push('home');

    for (var i = 0; i < hosts.length; i++) {
        if (ns.serverExists(hosts[i])) {
            await ns.scriptKill(PAYLOAD, hosts[i]);
            await ns.scriptKill('/mini/share.js', hosts[i]);
        }
    }

    ns.tprint("Deploying " + PAYLOAD + " to " + hosts.length + " hosts...");
    for (var server in targets) {
        if (ns.serverExists(server) && ns.hasRootAccess(server)) {
            for (var i = 0; i < hosts.length; i++) {
                var payloadAmt = getPayloadAmt(ns, PAYLOAD, hosts[i]);
                if (!fullyAssignedServers.includes(hosts[i]) && payloadAmt > 0) {
                    if (payloadAmt <= targets[server]) {
                        targets[server] -= payloadAmt;
                        await deploy(ns, hosts[i], server, payloadAmt);
                        fullyAssignedServers.push(hosts[i]);
                        payloadAmt = 0;
                    } else if (payloadAmt > targets[server]) {
                        payloadAmt -= targets[server];
                        await deploy(ns, hosts[i], server, targets[server]);
                        targets[server] = 0;
                    }

                    if (targets[server] == 0) {
                        break;
                    }
                }
            }
        }
    }

    // distribute all remaining available payloads from hosts to targets as evenly as possible starting from biggest servers to smallest
    // HACKING IS FULLY SETUP, NOW TIME TO WEAKEN AND GROW ON BEST SERVERS WITH REMAINING THREADS
    targets = Object.keys(targets);
    if (targets.includes("")) {
        targets.splice(targets.indexOf(""), 1);
    }
    var hosts = botnet;
    hosts.push('home');

    ns.tprint("Distributing remaining payloads in train mode...");

    for (var i = 0; i < hosts.length; i++) {
        var payloadAmt = getPayloadAmt(ns, PAYLOAD, hosts[i]);
        payloadAmt = Math.floor(payloadAmt / targets.length);
        if (payloadAmt > 0) {
            for (var j = 0; j < targets.length; j++) {
                await deploy(ns, hosts[i], targets[j], payloadAmt, 'train');
            }
        }
    }
}