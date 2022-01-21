export var pservPrefixes = ['home', 'BOT'];

// this is a required global var for the scan
var visited = {};

/** @param {import("../../.").NS } ns */
export function getHosts(ns) {
    let hosts = [];
    hosts = hosts.concat(getBots(ns));
    hosts.push('home');
    return hosts;
}

/** @param {import("../../.").NS } ns **/
export function getBots(ns) {
    let purchasedServers = ns.getPurchasedServers();
    let botnet = [];
    for (let i = 0; i < purchasedServers.length; i++) {
        if (purchasedServers[i].startsWith('BOT')) {
            botnet.push(purchasedServers[i]);
        }
    }
    return botnet;
}

/** @param {import("../../.").NS } ns 
 *  @returns {array} sortedServers
 **/
export async function getTargets(ns) {
    let targets = [];

    await serverScanRecursive(ns, ns.getHostname());
    for (let server in visited) {
        if (ns.serverExists(server) && !pservPrefixes.includes(server.split('-')[0]) && ns.getServerRequiredHackingLevel(server) <= ns.getHackingLevel()) {
            targets.push(server);
        }
    }

    let sortedServers = sortServers(ns, targets)
    return sortedServers;
}

/** @param {import("../../.").NS } ns 
 *  @param {string} mode (train|share|hack)
 *  @param {string} payload file
 *  @returns payloadAmts as dict {'server': threadNum }
*/
export function getPayloadAmts(ns, mode, payload) {
    //   hack amount / max amount = hack threads
    //   max hosts threads / targets = training threads
    //   Infinity = share threads
    let payloadAmts = {};
    let targets = getTargets(ns);

    switch (mode) {
        case "train":
            payloadAmts = getTrainPayloadAmts(ns, payload);
            break;
        case "share":
            payloadAmts = getSharePayloadAmts(ns, payload);
            break;
        case "hack":
            payloadAmts = getHackPayloadAmts(ns, payload);
            break;
    }

    return payloadAmts;
}

/** @param {import("../../.").NS } ns 
 *  @param {string} script
 *  @param {string} [server=home] 
 *  @param {number} [threads=1] 
 **/
export async function runScript(ns, script, server = 'home', threads = 1) {
    await ns.scriptKill(script, server);
    if (server != 'home') {
        await ns.scp(script, 'home', server);
    }
    if (ns.getScriptRam(script, 'home') < ns.getServerMaxRam(server) - ns.getServerUsedRam(server)) {
        ns.exec(script, server, threads);
    } else {
        ns.tprint('Not enough RAM to activate ' + script + ' on ' + server);
    }
}

/** @param {import("../../.").NS } ns 
 *  @param {string} payload file
 *  @returns payloadAmts as dict {'server': threadNum }
 **/
export function getTrainPayloadAmts(ns, payload) {
    let payloadAmts = {};
    return payloadAmts;
}

/** @param {import("../../.").NS } ns 
 *  @param {string} payload file
 *  @returns payloadAmts as dict {'server': threadNum }
 **/
export function getSharePayloadAmts(ns, payload) {
    let payloadAmts = {};
    return payloadAmts;
}

/** @param {import("../../.").NS } ns 
 *  @param {string} payload file
 *  @returns payloadAmts as dict {'server': threadNum }
 **/
export function getHackPayloadAmts(ns, payload) {
    let payloadAmts = {};
    /**
    sortedServers.forEach(function (server) {
        if (true) {
            let maxMoney = ns.getServerMaxMoney(server);
            let hackAmt = ns.hackAnalyze(server);
            let maxThreads = Math.floor(maxMoney / (maxMoney * hackAmt));
            if (maxThreads != Infinity && maxThreads > 0) {
                targets[server] = maxThreads;
            }
        }
    });
    **/
    return payloadAmts;
}


/** @param {import("../../.").NS } ns
 *  @param {string} servers
 *  @returns {array} sortedServers
 */
export function sortServers(ns, servers) {
    let sortedTargets = servers.sort(function (a, b) {
        if (ns.getServerMaxMoney(a) > ns.getServerMaxMoney(b)) {
            return 1; // -1 = greatest to least
        }
    });

    return sortedTargets;
}

/** @param {import("../../.").NS } ns
*   @param {string} hostname
*/
export async function serverScanRecursive(ns, hostname) {
    if (visited[hostname] == true) {
        return;
    }

    visited[hostname] = true;

    root(ns, hostname);

    let remoteHosts = ns.scan(hostname);
    for (let i in remoteHosts) {
        let remoteHost = remoteHosts[i];
        if (ns.serverExists(remoteHost)) {
            await serverScanRecursive(ns, remoteHost);
        }
    }
}

/** @param {import("../../.").NS } ns
*  @param {string} server
*/
export function root(ns, server) {
    openPorts(ns, server);
    let isRooted;
    try {
        isRooted = ns.nuke(server);
        if (isRooted) {
            s.tprint("== Server " + server + " is now rooted.");
        }
    } catch (e) {
        isRooted = false;
    }
}

/** @param {import("../../.").NS } ns
 *  @param {string} server
 */
export function openPorts(ns, server) {
    [
        { fn: ns.brutessh, requirement: "BruteSSH.exe" },
        { fn: ns.ftpcrack, requirement: "FTPCrack.exe" },
        { fn: ns.relaysmtp, requirement: "relaySMTP.exe" },
        { fn: ns.httpworm, requirement: "HTTPWorm.exe" },
        { fn: ns.sqlinject, requirement: "SQLInject.exe" },
    ].forEach((portOpener) => {
        if (ns.fileExists(portOpener.requirement)) {
            portOpener.fn(server);
        }
    });
}