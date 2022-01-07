import { formatMoney } from '/lib/lib.js';

/** @param {NS} ns **/
export async function main(ns) {
    var target = ns.args[0];

    var moneyThresh = ns.getServerMaxMoney(target) * 0.75;
    var securityThresh = ns.getServerMinSecurityLevel(target) + 5;

    while (true) {
        ns.print("SEC LVL: " + ns.nFormat(ns.getServerSecurityLevel(target), '0,0.00') + " / " + ns.nFormat(securityThresh, '0,0.00'));
        ns.print("$$ AVAIL: " + ns.nFormat(ns.getServerMoneyAvailable(target), '0,0.00') + " / " + ns.nFormat(moneyThresh, '0,0.00'));
        if (ns.getServerSecurityLevel(target) > securityThresh) {
            // If the server's security level is above our threshold, weaken it
            await ns.weaken(target);
        } else if (ns.getServerMoneyAvailable(target) < moneyThresh) {

            // If the server's money is less than our threshold, grow it
            await ns.grow(target);
        } else {
            // Otherwise, hack it
            var loot = await ns.hack(target);

            var msg = "Hacked " + target + "\n$" + formatMoney(ns, loot);
            ns.toast(msg);
            ns.print(msg);
        }
    }
}