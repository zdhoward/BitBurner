import { printBanner, formatMoney, deserializeDict } from '/lib/lib.js';

////////////////////////
// GLOBALS
////////////////////////
var files = ['/bin/mastermind-payload.js'];
var totalPayloads = 0;

/** @param {NS} ns *
 *  @param 0 target
 *  @param 1 bestTargets
 *  @param 2 hackableServers
 */
export async function main(ns) {
    ////////////////////
    //	2. DEPLOY
    ////////////////////
    // - Copy required files to all servers
    // - Activate payloads

    totalPayloads = 0;

    printBanner(ns, 'MASTERMIND - DEPLOY');

    var target = ns.args[0];
    var bestTargets = deserializeDict(ns.args[1]);
    var hackableServers = ns.args[2].split(',');

    //ns.tprint(bestTargets);
    await deployToBestTargets(ns, bestTargets, hackableServers);

    for (var i = 0; i < hackableServers.length; i++) {
        await deploy(ns, hackableServers[i], target);
    }

    await activateBotNet(ns, target);

    totalPayloads += await deployToHome(ns, target);

    ns.tprint('INFO - ' + '========================================');
    ns.tprint('INFO - ' + '==\tTotal payloads: ' + totalPayloads);
    ns.tprint('INFO - ' + '========================================');
    ns.toast('MASTERMIND: ' + 'Total payloads = ' + totalPayloads, 'success', 5000);
}

/** @param {NS} ns *
 *  @param 0 bestTargets
 *  @param 1 hackableServers
 */
async function deployToBestTargets(ns, bestTargets, hackableServers) {
    ns.tprint('DEPLOYING TO BEST TARGETS');
    var fullyAssignedServers = [];

    for (var server in bestTargets) {
        //while (bestTargets[server] > 0) {
        ns.tprint(server + ' MAX THREADS : ' + bestTargets[server]);
        // FIND HOW MANY THREADS NEEDED TO ATTACK BEST TARGET AND SUBTRACT FROM POOL
        for (var i = 0; i < hackableServers.length; i++) {
            var maxThreads = Math.floor(ns.getServerMaxRam(hackableServers[i]) / ns.getScriptRam('/bin/mastermind-payload.js'));
            ns.tprint('MAX THREADS: ' + maxThreads);
        }
        //}
    }
}

/** @param {NS} ns *
 *  @param 0 target
 *  @return payloadAmt
 */
function getPayloadAmt(ns, host) {
    var reserveRam = 0;
    if (host == 'home') {
        reserveRam = 10;
    }

    var freeRam = ns.getServerMaxRam(host) - ns.getServerUsedRam(host) - reserveRam;
    var payloadAmt = Math.floor(freeRam / ns.getScriptRam('/bin/mastermind-payload.js'));

    return payloadAmt;
}

/** @param {NS} ns *
 *  @param 0 host
 *  @param 1 target
 */
async function deploy(ns, host, target) {
    await ns.killall(host);
    await ns.scp(files, 'home', host);
    var payloadAmt = getPayloadAmt(ns, host);
    if (payloadAmt > 0) {
        await ns.exec('/bin/mastermind-payload.js', host, payloadAmt, target);
        ns.tprint('INFO - ' + 'PAYLOAD: ' + '(' + payloadAmt + ')\t' + host + '->' + target);
        totalPayloads += payloadAmt;
    } else {
        ns.tprint('WARN - ' + host + ' has no ram to run scripts from');
    }
}

/** @param {NS} ns *
 *  @param 0 target
 */
async function deployToHome(ns, target) {
    // find previous payload processes and kill
    await ns.scriptKill('/bin/mastermind-payload.js', 'home');

    // fill server space with payloads
    var payloadAmt = getPayloadAmt(ns, 'home');
    await ns.exec('/bin/mastermind-payload.js', 'home', payloadAmt, target);
    ns.tprint('INFO - ' + 'PAYLOAD: ' + '(' + payloadAmt + ')\t' + 'home' + '->' + target);

    return payloadAmt;
}

/** @param {NS} ns *
 *  @param 0 target
 */
async function activateBotNet(ns, target) {
    // find all bots -> BOT-#
    var remoteHosts = ns.scan('home');

    for (var i = 0; i < remoteHosts.length; i++) {
        if (remoteHosts[i].startsWith("BOT" | "ATTACKER")) {
            await deploy(ns, remoteHosts[i], target);
        }
    }
}