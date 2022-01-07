import { printBanner, serializeDict } from "/lib/lib.js";
import { pservPrefixes } from "/lib/config.js";

////////////////////////
// GLOBALS
////////////////////////
var visited = {};
//var visitedArr = [];

var allServers = ["n00dles", "foodnstuff", "nectar-net", "neo-net", "comptek", "syscore", "aevum-police", "millenium-fitness", "crush-fitness", "avmnite-02h", "zb-institute", "summit-uni", "I.I.I.I", "rho-construction", "galactic-cyber", "global-pharm", "snap-fitness", "unitalife", "phantasy", "CSEC", "sigma-cosmetics", "joesguns", "zer0", "silver-helix", "netlink", "johnson-ortho", "rothman-uni", "lexo-corp", "alpha-ent", "aerocorp", "omnia", "defcomm", "univ-energy", "taiyang-digital", "run4theh111z", "vitalife", "omnitek", "clarkinc", "zb-def", "deltaone", "icarus", "infocomm", "titan-labs", "helios", "kuai-gong", "powerhouse-fitness", "fulcrumassets", "The-Cave", "microdyne", "fulcrumtech", "solaris", "zeus-med", "nova-med", "applied-energetics", "stormtech", "4sigma", "nwo", ".", "b-and-a", "ecorp", "megacorp", "blade", "omega-net", "the-hub", "catalyst", "hong-fang-tea", "max-hardware", "harakiri-sushi", "iron-gym", "home-contracts", "darkweb"];

/** @param {NS} ns 
 */
export async function main(ns) {
    //await serverScanRecursive(ns, ns.getHostname());

    //ns.tprint(visitedArr);
    printBanner(ns, "MASTERMIND - RECON");
    allServers = sortServers(ns, allServers);

    allServers.forEach(function (server) {
        if (!ns.hasRootAccess(server)) {
            root(ns, server);
        }
    });

    var hosts = getHosts(ns);
    var targets = serializeDict(getTargets(ns));

    ns.run('/bin/mastermind-deploy.js', 1, targets, hosts.toString());
}

function getHosts(ns) {
    var hosts = [];
    allServers.forEach(function (server) {
        if (!server.startsWith('home') && ns.hasRootAccess(server)) {
            hosts.push(server);
        }
    });
    return hosts;
}

function getTargets(ns) {
    var targets = {};
    allServers.forEach(function (server) {
        if (!pservPrefixes.includes(server.split('-')[0]) && ns.hasRootAccess(server) && ns.getServerRequiredHackingLevel(server) <= ns.getHackingLevel()) {
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

/** @param {NS} ns
*  @param 0 hostname
*/
async function serverScanRecursive(ns, hostname) {
    if (visited[hostname] == true) {
        return;
    }

    visited[hostname] = true;
    //visitedArr.push(hostname);

    var remoteHosts = ns.scan(hostname);
    for (var i in remoteHosts) {
        var remoteHost = remoteHosts[i];
        await serverScanRecursive(ns, remoteHost);
    }
}

/** @param {NS} ns
*  @param 0 server
*/
function root(ns, server) {
    openPorts(ns, server);
    var isRooted = ns.nuke(server);
    ns.tprint("Server " + server + " is " + (isRooted ? "now " : "not ") + "rooted.");
}

/** @param {NS} ns
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

function sortServers(ns, servers) {
    var sortedTargets = servers.sort(function (a, b) {
        if (ns.getServerMaxMoney(a) > ns.getServerMaxMoney(b)) {
            return 1; // -1 = greatest to least
        }
    });

    return sortedTargets;
}