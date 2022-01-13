import { printBanner, deserializeDict, zfill, pad } from '/lib/lib.js';

////////////////////////
// GLOBALS
////////////////////////
var files = ['/bin/mastermind-payload.js', '/lib/lib.js', '/utils/travel.js', '/utils/server-info.js'];
var totalPayloads = 0;

/** @param {NS} ns *
 *  @param 0 bestTargets
 *  @param 1 hackableServers
 */
export async function main(ns) {
    printBanner(ns, 'MASTERMIND - DEPLOY');

    var bestTargets = deserializeDict(ns.args[0]);
    var hackableServers = ns.args[1].split(',');

    await deployToBestTargets(ns, bestTargets, hackableServers);
}

/** @param {NS} ns *
 *  @param 0 bestTargets
 *  @param 1 hackableServers
 */
async function deployToBestTargets(ns, bestTargets, hackableServers) {
    var fullyAssignedServers = [];
    var botnet = getBotnet(ns);
    hackableServers = hackableServers.concat(botnet);
    hackableServers.push('home');

    bestTargets = { 'joesguns': Infinity };

    // KILL ALL SCRPITS BEFORE CALCULATIONS BELOW
    for (var i = 0; i < hackableServers.length; i++) {
        await ns.scriptKill('/bin/mastermind-payload.js', hackableServers[i]);
    }

    // ITERATE THROUGH TARGETS
    for (var server in bestTargets) {
        if (ns.serverExists(server)) {
            // FIND HOW MANY THREADS NEEDED TO ATTACK BEST TARGET AND SUBTRACT FROM POOL
            // ITERATE THROUGH HOSTS
            for (var i = 0; i < hackableServers.length; i++) {
                var payloadAmt = getPayloadAmt(ns, hackableServers[i]);
                if (!fullyAssignedServers.includes(hackableServers[i]) && payloadAmt > 0) {
                    if (payloadAmt <= bestTargets[server]) {
                        bestTargets[server] -= payloadAmt;
                        //ns.tprint('DEPLOY: ' + hackableServers[i] + ', TARGET: ' + server + ', PAYLOADS: ' + payloadAmt + ', THREADS LEFT ON TARGET: ' + bestTargets[server]);
                        await deploy(ns, hackableServers[i], server, payloadAmt);
                        fullyAssignedServers.push(hackableServers[i]);
                        payloadAmt = 0;
                    } else if (payloadAmt > bestTargets[server]) { // PAYLOAD > bestTargets[server]
                        payloadAmt -= bestTargets[server];
                        //ns.tprint('DEPLOY: ' + hackableServers[i] + ', TARGET: ' + server + ', PAYLOADS: ' + bestTargets[server] + ', THREADS LEFT ON TARGET: 0');
                        await deploy(ns, hackableServers[i], server, bestTargets[server]);
                        bestTargets[server] = 0;
                    }

                    if (bestTargets[server] == 0) {
                        break;
                    }
                }
            }
        }
    }

    // HACKING IS FULLY SETUP, NOW TIME TO WEAKEN AND GROW ON BEST SERVERS WITH REMAINING THREADS
    var targets = Object.keys(bestTargets);// deserializeDict(bestTargets).reverse();
    if (targets.includes("")) {
        targets.splice(targets.indexOf(""), 1);
    }
    var hosts = botnet;
    hosts.push('home');

    for (var i = 0; i < hosts.length; i++) {
        var payloadAmt = getPayloadAmt(ns, hosts[i]);
        payloadAmt = Math.floor(payloadAmt / targets.length);
        //while (payloadAmt) > 0) {
        ns.tprint('WARN - ' + hosts[i] + ': has ram left for ' + payloadAmt + ' payloads for each target (' + targets.length + ' targets)');
        //payloadAmt = Math.floor(payloadAmt / 2);
        if (payloadAmt > 0) {
            //deploy(ns, hosts[i], target, payloadAmt, 'reinforce');
            for (var j = 0; j < targets.length; j++) {
                //await deploy(ns, hosts[i], targets[j], payloadAmt, 'weaken');
                //await deploy(ns, hosts[i], targets[j], payloadAmt, 'grow');
                await deploy(ns, hosts[i], targets[j], payloadAmt, 'train');
            }
        }
    }
}

/** @param {NS} ns
 *  @param 0 target
 *  @return payloadAmt
 */
function getPayloadAmt(ns, host) {
    var reserveRam = 0;
    if (host == 'home') {
        reserveRam = 10; // TODO: needs to scale better (no augments needs very low amounts)
    }

    var freeRam = ns.getServerMaxRam(host) - ns.getServerUsedRam(host) - reserveRam;
    var payloadAmt = Math.floor(freeRam / ns.getScriptRam('/bin/mastermind-payload.js'));

    return payloadAmt;
}

/** @param {NS} ns **/
function getBotnet(ns) {
    var purchasedServers = ns.getPurchasedServers();
    var botnet = [];
    for (var i = 0; i < purchasedServers.length; i++) {
        if (purchasedServers[i].startsWith('BOT') || purchasedServers[i].startsWith('ATTACKER')) {
            botnet.push(purchasedServers[i]);
        }
    }
    return botnet;
}

/** @param {NS} ns
 *  @param 0 host
 *  @param 1 target
 *  @param 2 payloadAmt
 */
async function deploy(ns, host, target, payloadAmt, mode = 'normal') {
    await ns.scp(files, 'home', host);
    if (payloadAmt > 0) {
        await ns.exec('/bin/mastermind-payload.js', host, payloadAmt, target, mode);
        if (mode == 'normal') {
            ns.tprint('INFO - ' + 'PAYLOAD [' + mode + ']: (' + zfill(payloadAmt, 5) + ')\t' + pad(host, 18) + '->\t' + target);
        }
        totalPayloads += payloadAmt;
    } else {
        ns.tprint('WARN - ' + host + ' has no ram to run scripts from');
    }
}