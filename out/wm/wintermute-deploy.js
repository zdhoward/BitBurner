import { printBanner, deserializeDict, zfill, pad, waitRandom, getBotnet, getSharenet, runRemoteScript } from '/lib/lib.js';

//var targets;
//var hosts;

var PAYLOAD = '/bin/mastermind-payload.js';
var totalPayloads = 0;

var files = ['/bin/mastermind-payload.js', '/lib/lib.js', '/mini/share.js'];

/** @param {import("../../.").NS } ns **/
export async function main(ns) {
    ns.disableLog('ALL');
    printBanner(ns, 'WINTERMUTE - DEPLOY');

    totalPayloads = 0;

    var targets = deserializeDict(ns.args[0]);
    targets['n00dles'] = 100; /// OVERRIDE TO DEDICATE LESS RESOURCES TO n00dles
    var hosts = ns.args[1].split(',');

    await deployToTargets(ns, hosts, targets);

    await deploySharenet(ns);

    ns.tprint("COMPLETE");
}

/** @param {import("../../.").NS } ns **/
async function deploySharenet(ns) {
    var sharenet = getSharenet(ns);
    for (var i = 0; i < sharenet.length; i++) {
        ns.scriptKill('/mini/share.js', sharenet[i]);
        var payloads = getPayloadAmt(ns, '/mini/share.js', sharenet[i]);
        ns.exec('/mini/share.js', sharenet[i], payloads);
    }
}

/** @param {import("../../.").NS } ns **/
async function deployToTargets(ns, hosts, targets) {
    //ns.tprint('Targets: ' + Object.keys(targets).join(', '));
    //ns.tprint('Hosts: ' + hosts.join(', '));

    var fullyAssignedServers = [];
    var botnet = getBotnet(ns);
    hosts = hosts.concat(botnet);
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
                        //await waitRandom(ns, 1000, 500);
                        fullyAssignedServers.push(hosts[i]);
                        payloadAmt = 0;
                    } else if (payloadAmt > targets[server]) {
                        payloadAmt -= targets[server];
                        await deploy(ns, hosts[i], server, targets[server]);
                        //await waitRandom(ns, 1000, 500);
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
    targets = Object.keys(targets);// deserializeDict(bestTargets).reverse();
    if (targets.includes("")) {
        targets.splice(targets.indexOf(""), 1);
    }
    var hosts = botnet;
    hosts.push('home');

    ns.tprint("Distributing remaining payloads in train mode...");

    for (var i = 0; i < hosts.length; i++) {
        var payloadAmt = getPayloadAmt(ns, PAYLOAD, hosts[i]);
        payloadAmt = Math.floor(payloadAmt / targets.length);
        //while (payloadAmt) > 0) {
        //ns.tprint('WARN - ' + hosts[i] + ': has ram left for ' + payloadAmt + ' payloads for each target (' + targets.length + ' targets)');
        //payloadAmt = Math.floor(payloadAmt / 2);
        if (payloadAmt > 0) {
            //deploy(ns, hosts[i], target, payloadAmt, 'reinforce');
            for (var j = 0; j < targets.length; j++) {
                //await deploy(ns, hosts[i], targets[j], payloadAmt, 'weaken');
                //await deploy(ns, hosts[i], targets[j], payloadAmt, 'grow');
                await deploy(ns, hosts[i], targets[j], payloadAmt, 'train');
                //await waitRandom(ns, 1000, 500);
            }
        }
    }
}



/** @param {import("../../.").NS } ns
 *  @param 0 host
 *  @param 1 target
 *  @param 2 payloadAmt
 */
async function deploy(ns, host, target, payloadAmt, mode = 'normal') {
    if (host != 'home') {
        await ns.scp(files, 'home', host);
    }
    if (payloadAmt > 0) {
        await ns.exec(PAYLOAD, host, payloadAmt, target, mode);
        //if (mode == 'normal') {
        //ns.tprint('INFO - ' + 'PAYLOAD [' + mode + ']: (' + zfill(payloadAmt, 5) + ')\t' + pad(host, 18) + '->\t' + target);
        //}
        totalPayloads += payloadAmt;
    } else {
        ns.tprint('WARN - ' + host + ' has no ram to run scripts from');
    }
    return payloadAmt;
}

/** @param {import("../../.").NS } ns
 *  @param 0 target
 *  @return payloadAmt
 */
function getPayloadAmt(ns, payload, host) {
    var reserveRam = 0;
    if (host == 'home') {
        reserveRam = 16;//ns.getScriptRam('/wm/wintermute-recon.js') + ns.getScriptRam('/wm/wintermute-deploy.js') + ns.getScriptRam('/bin/extend-status-overlay.js'); // TODO: needs to scale better (no augments needs very low amounts)
    }

    var freeRam = ns.getServerMaxRam(host) - ns.getServerUsedRam(host) - reserveRam;
    var payloadAmt = Math.floor(freeRam / ns.getScriptRam(payload));

    return payloadAmt;
}