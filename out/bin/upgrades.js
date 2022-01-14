import { formatMoney, getValidRamAmount } from '/lib/lib.js';

/** @param {import("../../.").NS } ns **/
export async function main(ns) {
    ns.toast("upgrades.js is starting", 'success', 5000);

    while (true) {
        // Buy TOR
        purchaseFromDarkweb(ns);

        // Upgrade PC
        upgradeHome(ns);

        ////// SETUP NEW ATTACK BOTS
        purchaseNewAttackBot(ns);

        // Upgrade Home PC
        //ns.getUpgradeHomeCoresCost();
        //ns.getUpgradeHomeRamCost();
        //ns.upgradeHomeCores();
        //ns.upgradeHomeRam();
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
        if (!ns.fileExists('BruteSSH.exe', 'home')) {
            if (money > 1000000 * 3) {
                ns.purchaseDarkweb('SQLInject.exe');
            }
        }
        if (!ns.fileExists('relaySMTP.exe', 'home')) {
            if (money > 5000000 * 3) {
                ns.purchaseDarkweb('SQLInject.exe');
            }
        }
        if (!ns.fileExists('HTTPWorm.exe', 'home')) {
            if (money > 30000000 * 3) {
                ns.purchaseDarkweb('HTTPWorm.exe');
            }
        }
        if (!ns.fileExists('SQLInject.exe', 'home')) {
            if (money > 250000000 * 3) {
                ns.purchaseDarkweb('SQLInject.exe');
            }
        }
        if (!ns.fileExists('AutoLink.exe', 'home')) {
            if (money > 1000000 * 3) {
                ns.purchaseDarkweb('AutoLink.exe');
            }
        }
        if (!ns.fileExists('DeepscanV1.exe', 'home')) {
            if (money > 500000 * 3) {
                ns.purchaseDarkweb('DeepscanV1.exe');
            }
        }
        if (!ns.fileExists('DeepscanV2.exe', 'home')) {
            if (money > 25000000 * 3) {
                ns.purchaseDarkweb('DeepscanV1.exe');
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
    if (ns.getPurchasedServers().length < ns.getPurchasedServerLimit() && ns.getPlayer().money > 75000000000) {
        var ramSize = getNewServerSize(ns, ns.getPurchasedServerMaxRam(), ns.getPlayer().money);
        var cost = ns.getPurchasedServerCost(ramSize);

        var name = getNewBotName(ns, 'BOT');


        if (ns.purchaseServer(name, ramSize)) {
            ns.print('INFO - ' + 'PURCHASING ' + name + ': ' + ramSize + ' for ' + formatMoney(ns, cost));
        } else { ns.print('ERROR - ' + 'PURCHASING ' + name + ': ' + ramSize + ' for ' + formatMoney(ns, cost)); }
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
function getNewBotName(ns, name) {
    var number = ns.getPurchasedServers().length + 1;
    var name = name + "-" + number;

    return name;
}