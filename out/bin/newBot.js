import { getBotnet } from '/lib/lib';
import { formatMoney } from '/lib/lib.js';
/** @param {import("../../.").NS } ns **/
export async function main(ns) {
    var money = ns.getPlayer().money;

    var numServers = ns.getPurchasedServers().length;
    var serverLimit = ns.getPurchasedServerLimit();


    if (money > 120000000) {
        if (numServers < serverLimit) {
            purchaseNewAttackBot(ns);
        } else {
            if (removeWeakestAttackBot(ns)) {
                purchaseNewAttackBot(ns);
            }
        }
    } else {
        ns.tprint("ERROR - You should wait until you have more than $120m");
    }
}

/** @param {import("../../.").NS } ns **/
function purchaseNewAttackBot(ns) {
    var ramSize = getNewServerSize(ns, ns.getPurchasedServerMaxRam(), ns.getPlayer().money);
    var cost = ns.getPurchasedServerCost(ramSize);
    var name = getNewBotName(ns, 'BOT');


    if (ns.purchaseServer(name, ramSize)) {
        ns.tprint('INFO - ' + 'PURCHASING ' + name + ': ' + ramSize + ' for ' + formatMoney(ns, cost));
    } else { ns.print('ERROR - ' + 'PURCHASING ' + name + ': ' + ramSize + ' for ' + formatMoney(ns, cost)); }
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

/** @param {import("../../.").NS } ns */
function removeWeakestAttackBot(ns) {
    var bots = getBotnet(ns);
    var weakestBot = bots[0];
    var weakestBotRam = ns.getServerMaxRam(weakestBot);
    for (var i = 0; i < bots.length; i++) {
        var bot = bots[i];
        var ram = ns.getServerMaxRam(bot);
        if (ram < weakestBotRam) {
            weakestBot = bot;
            weakestBotRam = ram;
        }
    }
    if (getNewServerSize(ns, ns.getPurchasedServerMaxRam(), ns.getPlayer().money) > weakestBotRam) {
        return ns.deleteServer(weakestBot);
    } else {
        return false;
    }
}