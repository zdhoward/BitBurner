import { waitRandom } from '/lib/lib';
import { formatMoney, allServers, MASTERMIND_PORT } from '/lib/lib.js';
//import { allServers } from '/lib/config.js';

/** @param {NS} ns **/
export async function main(ns) {
    ns.disableLog('disableLog');
    ns.disableLog('weaken');
    ns.disableLog('grow');
    ns.disableLog('hack');
    ns.disableLog('getServerMaxMoney');
    ns.disableLog('getServerMinSecurityLevel');
    ns.disableLog('getServerMoneyAvailable');

    await waitRandom(ns, 30, 0);

    var target = ns.args[0];
    var mode = ns.args[1];

    while (true) {
        if (ns.serverExists(target)) {
            await runPayload(ns, target, mode);
        }
    }
}

/** @param {NS} ns **/
async function runPayload(ns, target, mode) {
    var moneyThresh = ns.getServerMaxMoney(target) * 0.75;
    var securityThresh = ns.getServerMinSecurityLevel(target) + 5;

    switch (mode) {
        case 'train':
            ns.print('TRAINING');
            target = findTrainingTarget(ns);
        case 'weaken':
            ns.print('Weakening ' + target + ' in ' + ns.tFormat(ns.getWeakenTime(target)) + ' seconds');
            var weakened = await ns.weaken(target);
            ns.print("Weakened " + target + " for " + weakened.toFixed(2));
            ns.print("SEC LVL: " + ns.getServerSecurityLevel(target).toFixed(2) + " / " + securityThresh.toFixed(2));
            break;
        case 'grow':
            ns.print('Growing ' + target + ' in ' + ns.tFormat(ns.getGrowTime(target)) + ' seconds');
            var growth = await ns.grow(target);
            ns.print("Grew " + target + " for " + growth.toFixed(2));
            ns.print("MONEY: " + formatMoney(ns.getServerMoneyAvailable(target).toFixed(2)) + " / " + formatMoney(ns.getServerMaxMoney(target).toFixed(2)));
            break;
        default:
            if (ns.getServerSecurityLevel(target) > securityThresh) {
                ns.print('Weakening ' + target + ' in ' + ns.tFormat(ns.getWeakenTime(target)) + ' seconds');
                var weakened = await ns.weaken(target);
                ns.print("Weakened " + target + " for " + weakened.toFixed(2));
                ns.print("SEC LVL: " + ns.getServerSecurityLevel(target).toFixed(2) + " / " + securityThresh.toFixed(2));
            } else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
                ns.print('Growing ' + target + ' in ' + ns.tFormat(ns.getGrowTime(target)) + ' seconds');
                var growth = await ns.grow(target);
                ns.print("Grew " + target + " for " + growth.toFixed(2));
                ns.print("MONEY: " + formatMoney(ns.getServerMoneyAvailable(target).toFixed(2)) + " / " + formatMoney(ns.getServerMaxMoney(target).toFixed(2)));
            } else {
                ns.print('Hacking ' + target + ' in ' + ns.tFormat(ns.getHackTime(target)) + ' seconds');
                var loot = await ns.hack(target);
                ns.print("Hacked " + target + " for $" + formatMoney(loot));
                var monitorMsg = JSON.stringify({ name: ns.getHostname(), loot: loot });
                ns.tryWritePort(MASTERMIND_PORT, monitorMsg);
            }
            break;
    }
}

/** @param {NS} ns **/
function findTrainingTarget(ns) {
    var target = '';
    var targetValue = 0;

    allServers.forEach(function (server) {
        if (ns.serverExists(server)) {
            var analysis = ns.getHackingLevel() - ns.getServerRequiredHackingLevel(server);//) / ns.getHackingLevel();
            //ns.tprint("Analysis of " + server + ": " + analysis.toFixed(2) + " " + targetValue.toFixed(2));
            if (analysis > targetValue) {
                targetValue = analysis;
                target = server;
            }
        }
    });

    //ns.tprint('Training target: ' + target);
    target = 'joesguns';

    return target;
}