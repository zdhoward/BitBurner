import { formatMoney, getValidRamAmount } from '/lib/lib.js';

/** @param {NS} ns **/
export async function main(ns) {
    ns.toast("upgrades.js is starting");


    ////// SETUP NEW ATTACK BOTS
    purchaseNewAttackBot(ns);

    // Upgrade Home PC
    //ns.getUpgradeHomeCoresCost();
    //ns.getUpgradeHomeRamCost();
    //ns.upgradeHomeCores();
    //ns.upgradeHomeRam();
}

/** @param {NS} ns **/
function purchaseNewAttackBot(ns) {
    if (ns.getPurchasedServers().length < ns.getPurchasedServerLimit()) {
        var ramSize = getNewServerSize(ns, ns.getPurchasedServerMaxRam(), ns.getPlayer().money);
        var cost = ns.getPurchasedServerCost(ramSize);

        var name = getNewBotName(ns, 'BOT');


        if (ns.purchaseServer(name, ramSize)) {
            ns.tprint('INFO - ' + 'PURCHASING ' + name + ': ' + ramSize + ' for ' + formatMoney(ns, cost));
        } else { ns.tprint('ERROR - ' + 'PURCHASING ' + name + ': ' + ramSize + ' for ' + formatMoney(ns, cost)); }
    }
}

/** @param {NS} ns 
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

/** @param {NS} ns 
 *  @param 0 name
 *  @return name with unique number
 */
function getNewBotName(ns, name) {
    var number = ns.getPurchasedServers().length + 1;
    var name = name + "-" + number;

    return name;
}