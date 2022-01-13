import { printBanner, deserializeDict, zfill, pad } from '/lib/lib.js';

//var targets;
//var hosts;

var PAYLOAD = '/bin/mastermind-payload.js';
var totalPayloads = 0;

/** @param {import("../../.").NS } ns **/
export async function main(ns) {
    ns.disableLog('ALL');
    printBanner(ns, 'WINTERMUTE - DEPLOY');

    var targets = deserializeDict(ns.args[0]);
    var hosts = ns.args[1].split(',');

    await deployToTargets(ns, hosts, targets);
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
        }
    }

    for (var server in targets) {
        if (ns.serverExists(server)) {
            for (var i = 0; i < hosts.length; i++) {
                var payloadAmt = getPayloadAmt(ns, hosts[i]);
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
}

/** @param {import("../../.").NS } ns **/
function getBotnet(ns) {
    var purchasedServers = ns.getPurchasedServers();
    var botnet = [];
    for (var i = 0; i < purchasedServers.length; i++) {
        if (purchasedServers[i].startsWith('BOT')) {
            botnet.push(purchasedServers[i]);
        }
    }
    return botnet;
}

/** @param {import("../../.").NS } ns
 *  @param 0 host
 *  @param 1 target
 *  @param 2 payloadAmt
 */
async function deploy(ns, host, target, payloadAmt, mode = 'normal') {
    //await ns.scp(files, 'home', host);
    if (payloadAmt > 0) {
        await ns.exec(PAYLOAD, host, payloadAmt, target, mode);
        if (mode == 'normal') {
            ns.tprint('INFO - ' + 'PAYLOAD [' + mode + ']: (' + zfill(payloadAmt, 5) + ')\t' + pad(host, 18) + '->\t' + target);
        }
        totalPayloads += payloadAmt;
    } else {
        ns.tprint('WARN - ' + host + ' has no ram to run scripts from');
    }
}

/** @param {import("../../.").NS } ns
 *  @param 0 target
 *  @return payloadAmt
 */
function getPayloadAmt(ns, host) {
    var reserveRam = 0;
    if (host == 'home') {
        reserveRam = ns.getScriptRam('/wm/wintermute-recon.js') + ns.getScriptRam('/wm/wintermute-deploy.js') + ns.getScriptRam('/bin/extend-status-overlay.js'); // TODO: needs to scale better (no augments needs very low amounts)
    }

    var freeRam = ns.getServerMaxRam(host) - ns.getServerUsedRam(host) - reserveRam;
    var payloadAmt = Math.floor(freeRam / ns.getScriptRam(PAYLOAD));

    return payloadAmt;
}