import { printBanner, serializeDict, pservPrefixes } from '/lib/lib.js';

////////////////////////
// GLOBALS
////////////////////////
var visited = {};
var sortedServers = [];


/** @param {import("../../.").NS } ns **/
export async function main(ns) {
    ns.disableLog('ALL');

    printBanner(ns, 'WINTERMUTE - RECON');

    ns.tprint('Scanning for servers...');
    await serverScanRecursive(ns, ns.getHostname());
    var allServers = Object.keys(visited);

    ns.tprint('Sorting servers...');
    sortedServers = sortServers(ns, allServers);

    ns.tprint('Rooting Servers...');
    sortedServers.forEach(function (server) {
        if (ns.serverExists(server) && !ns.hasRootAccess(server)) {
            root(ns, server);
        }
    });

    ns.tprint('Finding Hosts...');
    var hosts = getHosts(ns);

    ns.tprint('Finding Targets...');
    var targets = serializeDict(getTargets(ns));
    if (ns.args[0]) {
        var specificTarget = ns.args[0];
        targets = serializeDict({ [specificTarget]: Infinity });
        ns.tprint('Specific Target: ' + specificTarget);
    }

    ns.tprint('Starting Deployment...');
    if (ns.getScriptRam('/wm/wintermute-deploy.js') < ns.getServerMaxRam('home') - ns.getServerUsedRam('home')) {
        ns.run('/wm/wintermute-deploy.js', 1, targets, hosts.toString());
    } else {
        ns.tprint('Not enough RAM to activate /wm/wintermute-deploy.js');
    }
}

/** @param {import("../../.").NS } ns **/
function getHosts(ns) {
    var hosts = [];
    sortedServers.forEach(function (server) {
        if (ns.serverExists(server) && !server.startsWith('home') && ns.hasRootAccess(server)) {
            hosts.push(server);
        }
    });
    return hosts;
}

/** @param {import("../../.").NS } ns **/
function getTargets(ns) {
    var targets = {};
    sortedServers.forEach(function (server) {
        if (ns.serverExists(server) && !pservPrefixes.includes(server.split('-')[0]) && ns.getServerRequiredHackingLevel(server) <= ns.getHackingLevel()) {
            var maxMoney = ns.getServerMaxMoney(server);
            var hackAmt = ns.hackAnalyze(server);
            var maxThreads = Math.floor(maxMoney / (maxMoney * hackAmt));
            if (maxThreads != Infinity && maxThreads > 0) {
                targets[server] = maxThreads;
            }
        }
    });
    return targets;
}

/** @param {import("../../.").NS } ns
*  @param 0 server
*/
function root(ns, server) {
    openPorts(ns, server);
    var isRooted;
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
 *  @param 0 hostname
 */
export function openPorts(ns, hostname) {
    [
        { fn: ns.brutessh, requirement: "BruteSSH.exe" },
        { fn: ns.ftpcrack, requirement: "FTPCrack.exe" },
        { fn: ns.relaysmtp, requirement: "relaySMTP.exe" },
        { fn: ns.httpworm, requirement: "HTTPWorm.exe" },
        { fn: ns.sqlinject, requirement: "SQLInject.exe" },
    ].forEach((portOpener) => {
        if (ns.fileExists(portOpener.requirement)) {
            portOpener.fn(hostname);
        }
    });
}

/** @param {import("../../.").NS } ns
 *  @param 0 servers
 */
function sortServers(ns, servers) {
    var sortedTargets = servers.sort(function (a, b) {
        if (ns.getServerMaxMoney(a) > ns.getServerMaxMoney(b)) {
            return 1; // -1 = greatest to least
        }
    });

    return sortedTargets;
}

/** @param {import("../../.").NS } ns
*   @param 0 hostname
*/
async function serverScanRecursive(ns, hostname) {
    if (visited[hostname] == true) {
        return;
    }

    visited[hostname] = true;

    var remoteHosts = ns.scan(hostname);
    for (var i in remoteHosts) {
        var remoteHost = remoteHosts[i];
        if (ns.serverExists(remoteHost)) {
            await serverScanRecursive(ns, remoteHost);
        }
    }
}