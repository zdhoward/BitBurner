/**
 * @param 0 filename
 * @param 1... args to filename
 */

import { isHackable } from "./payload.js";

var files = ['payload.js', 'infect.js'];

var visited = {};

//var targets = {};

/** @param {NS} ns **/
export async function main(ns) {
    ns.clearLog();

    visited = {};

    var fileName = files;
    var fileArgs = ns.args;

    //ns.tprint(`beginning deployment for ${fileName} with args=${JSON.stringify(fileArgs)}`);
    await recursiveInfect(ns, "home", fileArgs);
}

/** @param {NS} ns **/
async function recursiveInfect(ns, hostname, fileArgs) {
    if (visited[hostname] == true) {
        return;
    }

    visited[hostname] = true;

    /*
 
    if ( isHackable(ns, hostname)) {
        targets[hostname] = ns.getServerMaxMoney(hostname);
    }
 
    var bestTarget;
    var bestTargetVal = 0;
    for (var target in targets){
        if (targets[target] > bestTargetVal) {
            bestTarget = target;
            bestTargetVal = targets[target];
        }
    }
 
    ns.tprint(bestTarget);
 
    */

    //ns.tprint(`Deploying ${files} to ${hostname}`);

    if (!hostname.startsWith("home")) {//&& isDeployableHost(ns, filename, hostname)) {
        await undeploy(ns, hostname);
        await deploy(ns, hostname);
    }

    var remoteHosts = ns.scan(hostname);
    for (var i in remoteHosts) {
        var remoteHost = remoteHosts[i];
        await recursiveInfect(ns, remoteHost, fileArgs);
    }
}
/** @param {NS} ns **/
async function undeploy(ns, target) {
    await ns.killall(target);
    //await ns.sleep(3000);
    //var foundFiles = ns.ls(target, ".js");
    //for (var i = 0; i < foundFiles.length; i++) {
    //    await ns.rm(foundFiles[i]);
    //}
}

/** @param {NS} ns **/
async function deploy(ns, host) {//, target) {
    // gainRoot

    if (gainRoot(ns, host)) {

        // deploy files
        await ns.scp(files, ns.getHostname(), host);

        // run payload
        var freeRam = ns.getServerMaxRam(host) - ns.getServerUsedRam(host);
        var payloadAmt = Math.floor(freeRam / ns.getScriptRam('payload.js'));
        if (payloadAmt > 0) {
            await ns.exec("payload.js", host, payloadAmt); //, target);
        } else {
            //ns.tprint("ERROR -- " + host + ": NOT ENOUGH RAM ON " + host + " TO DEPLOY" + "[" + ns.getScriptRam('payload.js') + "/" + freeRam + "]");
        }
    }
}

/** @param {NS} ns **/
function gainRoot(ns, hostname) {
    if (ns.hasRootAccess(hostname)) {
        return true;
    }

    openPorts(ns, hostname);

    // ns.tprint(`attempting to nuke ${hostname}`);
    try {
        ns.nuke(hostname);
    } catch (e) {
        //ns.tprint(`failed to gain root access for host=${hostname}; error=${e}`);
        //ns.tprint("ERROR -- " + hostname + ": ROOT FAILED");
        return false;
    }
    return true;
}

/** @param {NS} ns **/
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