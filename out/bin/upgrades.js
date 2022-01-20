import { getBotnet, getSharenet } from 'lib/lib.js';
import { formatMoney, getValidRamAmount, UPGRADES_PORT } from '/lib/lib.js';

var stopUpgrading = false;

/** @param {import("../../.").NS } ns **/
export async function main(ns) {
    ns.toast('upgrades.js has started', 'info');

    while (true) {
        var msg = ns.readPort(UPGRADES_PORT);
        if (msg == 'STOP') {
            stopUpgrading = true;
        } else if (msg == 'START') {
            stopUpgrading = false;
        }

        if (!stopUpgrading) {
            purchaseFromDarkweb(ns);

            upgradeHome(ns);

            purchaseNewAttackBot(ns);
        }

        await ns.sleep(6000);
    }
}

/** @param {import("../../.").NS } ns **/
function purchaseFromDarkweb(ns) {
    var money = ns.getPlayer().money;

    if (!ns.serverExists("darkweb") && money > 200000) {
        ns.purchaseTor();
    }

    if (ns.serverExists("darkweb")) {
        if (!ns.fileExists('FTPCrack.exe', 'home')) {
            if (money > 1500000 * 1.5) {
                ns.purchaseProgram('FTPCrack.exe');
            }
        }
        if (!ns.fileExists('relaySMTP.exe', 'home')) {
            if (money > 5000000 * 1.5) {
                ns.purchaseProgram('SQLInject.exe');
            }
        }
        if (!ns.fileExists('HTTPWorm.exe', 'home')) {
            if (money > 30000000 * 1.5) {
                ns.purchaseProgram('HTTPWorm.exe');
            }
        }
        if (!ns.fileExists('SQLInject.exe', 'home')) {
            if (money > 250000000 * 1.5) {
                ns.purchaseProgram('SQLInject.exe');
            }
        }
        if (!ns.fileExists('AutoLink.exe', 'home')) {
            if (money > 1000000 * 1.5) {
                ns.purchaseProgram('AutoLink.exe');
            }
        }
        if (!ns.fileExists('DeepscanV1.exe', 'home')) {
            if (money > 500000 * 1.5) {
                ns.purchaseProgram('DeepscanV1.exe');
            }
        }
        if (!ns.fileExists('DeepscanV2.exe', 'home')) {
            if (money > 25000000 * 1.5) {
                ns.purchaseProgram('DeepscanV2.exe');
            }
        }
    }
}

/** @param {import("../../.").NS } ns **/
function upgradeHome(ns) {
    var money = ns.getPlayer().money;

    // RAM
    if (money > ns.getUpgradeHomeRamCost()) {
        ns.upgradeHomeRam();
        money -= ns.getUpgradeHomeRamCost();
    }

    if (money > ns.getUpgradeHomeCoresCost()) {
        ns.upgradeHomeCores();
        money -= ns.getUpgradeHomeCoresCost();
    }

}

/** @param {import("../../.").NS } ns **/
function purchaseNewAttackBot(ns) {
    if (ns.getPurchasedServers().length < ns.getPurchasedServerLimit() && ns.getPlayer().money > 151000000000) {
        var ramSize = getNewServerSize(ns, ns.getPurchasedServerMaxRam(), ns.getPlayer().money);
        var cost = ns.getPurchasedServerCost(ramSize);

        var name = getNewBotName(ns, 'BOT', getBotnet(ns));


        if (ns.purchaseServer(name, ramSize)) {
            ns.print('INFO - ' + 'PURCHASING ' + name + ': ' + ramSize + ' for ' + formatMoney(cost));
        } else { ns.print('ERROR - ' + 'PURCHASING ' + name + ': ' + ramSize + ' for ' + formatMoney(cost)); }
    }
}

/** @param {import("../../.").NS } ns **/
function purchaseNewShareBot(ns) {
    if (ns.getPurchasedServers().length < ns.getPurchasedServerLimit() && ns.getPlayer().money > 151000000000) {
        var ramSize = getNewServerSize(ns, ns.getPurchasedServerMaxRam(), ns.getPlayer().money);
        var cost = ns.getPurchasedServerCost(ramSize);

        var name = getNewBotName(ns, 'SHR', getSharenet(ns));


        if (ns.purchaseServer(name, ramSize)) {
            ns.print('INFO - ' + 'PURCHASING ' + name + ': ' + ramSize + ' for ' + formatMoney(cost));
        } else { ns.print('ERROR - ' + 'PURCHASING ' + name + ': ' + ramSize + ' for ' + formatMoney(cost)); }
    }
}

/** @param {import("../../.").NS } ns 
 *  @param 0 ramSize
 *  @return max purchasable ramSize
 */
function getNewServerSize(ns, ramSize, money) {
    var cost = ns.getPurchasedServerCost(ramSize);
    if (cost > money) {
        ramSize = getNewServerSize(ns, ramSize / 2, money);
    }

    return ramSize
}

/** @param {import("../../.").NS } ns 
 *  @param 0 name
 *  @return name with unique number
 */
function getNewBotName(ns, name, existingNames) {
    //var number = crypto.randomUUID();//ns.getPurchasedServers().length + 1;

    var highestNumber = 1;
    for (var i = 0; i < existingNames.length; i++) {
        var num = existingNames[i].split('-')[1];
        if (num > highestNumber) {
            highestNumber = num;
        }
    }
    highestNumber = parseInt(highestNumber) + 1;
    var name = name + "-" + highestNumber;
    return name;
}