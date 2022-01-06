import { printBanner, formatMoney, serializeDict } from "/lib/lib.js";

////////////////////////
// GLOBALS
////////////////////////
var visited = {};
var visitedCount = 0;
var hackableServersCount = 0;

/** @param {NS} ns 
 */
export async function main(ns) {
    var target = '';
    if (ns.args[0] != '') {
        target = ns.args[0];
    }

    ////////////////////
    //	1. RECON
    ////////////////////
    // - Scan all servers
    // - ROOT them if not rooted
    // - Choose best hackable target

    printBanner(ns, 'MASTERMIND - RECON & ROOT');

    await serverScanRecursive(ns, ns.getHostname());

    var [bestTarget, hackableServers] = chooseBestTarget(ns);

    var bestTargets = serializeDict(await findBestTargets(ns));

    //ns.tprint(bestTargets);

    if (target == '') {
        target = bestTarget;
    }

    displayServerInfo(ns, target);

    ns.toast('MASTERMIND: ' + 'Target = ' + target, 'success', 5000);

    //run deploy with results
    //ns.run('/bin/mastermind-deploy.js', 1, target, bestTargets, hackableServers.toString());
    ns.run('/bin/mastermind-deploy2.js', 1, bestTargets, hackableServers.toString());
}

/** @param {NS} ns
 *  @param 0 server
 */
function displayServerInfo(ns, server) {
    ns.tprint("INFO " + "===============================");
    ns.tprint("INFO " + "Hackable Servers: " + hackableServersCount + "/" + visitedCount);
    ns.tprint("INFO " + "===============================");

    var info = ns.getServer(server);
    ns.tprint("INFO " + "===== " + info.hostname + " " + info.ip + " =====");
    ns.tprint("INFO " + "==     ROOTED: " + (ns.hasRootAccess(server) ? "YES" : "NO"))
    ns.tprint("INFO " + "==      ADMIN: " + (info.hasAdminRights ? "YES" : "NO"));
    ns.tprint("INFO " + "==      OWNED: " + (info.purchasedByPlayer ? "YES" : "NO"));
    ns.tprint("INFO " + "==   BACKDOOR: " + (info.backdoorInstalled ? "YES" : "NO"));
    ns.tprint("INFO " + "==        RAM: " + info.ramUsed + "/" + info.maxRam + "gb");
    ns.tprint("INFO " + "==   ORG NAME: " + info.organizationName);
    ns.tprint("INFO " + "==  HACK DIFF: " + info.hackDifficulty);
    ns.tprint("INFO " + "==   HACK REQ: " + info.requiredHackingSkill);
    ns.tprint("INFO " + "==      MONEY: " + formatMoney(ns, info.moneyAvailable) + "/" + formatMoney(ns, info.moneyMax));
    ns.tprint("INFO " + "==      PORTS: " + info.openPortCount + "/" + info.numOpenPortsRequired);
    ns.tprint("INFO " + "==        HTTP - " + (info.httpPortOpen ? "YES" : "NO"));
    ns.tprint("INFO " + "==        SMTP - " + (info.smtpPortOpen ? "YES" : "NO"));
    ns.tprint("INFO " + "==        SQL  - " + (info.sqlPortOpen ? "YES" : "NO"));
    ns.tprint("INFO " + "==        SSH  - " + (info.sshPortOpen ? "YES" : "NO"));
    ns.tprint("INFO " + "==============================");
}

/** @param {NS} ns **/
function chooseBestTarget(ns) {
    var bestTarget;
    var bestTargetVal = 0;

    var hackableServers = getHackableServerNames(ns);

    for (var i = 0; i < hackableServers.length; i++) {
        var maxMoney = ns.getServerMaxMoney(hackableServers[i]);
        var reqThreads = ns.hackAnalyzeThreads(hackableServers[i], maxMoney);

        if (maxMoney > bestTargetVal) {
            bestTarget = hackableServers[i];
            bestTargetVal = maxMoney;
        }
    }

    return [bestTarget, hackableServers];
}

/** @param {NS} ns **/
async function findBestTargets(ns) {
    ns.tprint('FINDING BEST TARGETS');
    var hackableServers = getHackableServerNames(ns);

    var sortedTargets = hackableServers.sort(function (a, b) {
        if (ns.getServerMaxMoney(a) > ns.getServerMaxMoney(b)) {
            return -1;
        }
    });

    var bestTargets = {};
    //ns.tprint('SORTED TARGETS: ' + sortedTargets);
    for (var i = 0; i < sortedTargets.length; i++) {
        var maxMoney = ns.getServerMaxMoney(sortedTargets[i]);
        var hackAmt = ns.hackAnalyze(sortedTargets[i]);
        var maxThreads = Math.floor(maxMoney / (maxMoney * hackAmt));
        if (maxThreads != Infinity && maxThreads > 0) {
            //ns.tprint('MAX THREADS - ' + sortedTargets[i] + ': ' + maxThreads);
            bestTargets[sortedTargets[i]] = maxThreads;
        }
    }
    // ASSIGN THREADS MAX THREADS TO EVERY TARGET IN LIST
    return bestTargets;
}

/** @param {NS} ns
 *  @param 0 hostname
 *  @return success
 */
export function isHackable(ns, hostname) {
    var requiredHackingLevel = ns.getServerRequiredHackingLevel(hostname);
    var myHackingLevel = ns.getHackingLevel();
    if (!hostname.startsWith('home') && !hostname.startsWith('BOT') && requiredHackingLevel <= myHackingLevel) {
        if (!hostname.startsWith('ATTACKER')) {
            return true;
        }
    }
    return false;
}

/** @param {NS} ns 
 *  @return servers
 */
function getHackableServerNames(ns) {
    var servers = [];
    for (var server in visited) {
        if (isHackable(ns, server)) {
            if (!ns.hasRootAccess(server)) {
                gainRoot(ns, server);
            }
            servers.push(server);
        }
    }
    hackableServersCount = servers.length;
    return servers;
}

/** @param {NS} ns
 *  @param 0 hostname
 */
async function serverScanRecursive(ns, hostname) {
    if (visited[hostname] == true) {
        return;
    }
    visited[hostname] = true;
    visitedCount++;

    var remoteHosts = ns.scan(hostname);
    for (var i in remoteHosts) {
        var remoteHost = remoteHosts[i];
        await serverScanRecursive(ns, remoteHost);
    }
}

/** @param {NS} ns
 *  @param 0 hostname
 *  @return success
 */
function gainRoot(ns, hostname) {
    if (ns.hasRootAccess(hostname)) {
        return true;
    }

    openPorts(ns, hostname);

    try {
        ns.nuke(hostname);
    } catch (e) {
        return false;
    }
    return true;
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