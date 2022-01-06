/** @param {NS} ns **/
export async function main(ns) {
    var target = chooseTarget(ns);

    if (target == false || !ns.hasRootAccess(target)) {
        return;
    }

    if (ns.args[0]) {
        target = ns.args[0];
    }

    var moneyThresh = ns.getServerMaxMoney(target) * 0.75;
    var securityThresh = ns.getServerMinSecurityLevel(target) + 5;

    ns.tprint("INFO -- " + ns.getHostname() + ": PAYLOAD ACTIVATED " + ns.getHostname() + '->' + target);

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
            var amountStolen = await ns.hack(target);
            ns.toast(target + ' HACKED: ' + amountStolen, 'success');
        }
    }
}


/** @param {NS} ns
 * @param 0 hostname
 */
export function isHackable(ns, hostname) {
    var requiredHackingLevel = ns.getServerRequiredHackingLevel(hostname);
    var myHackingLevel = ns.getHackingLevel();
    if (requiredHackingLevel <= myHackingLevel) {
        return true;
    }
    return false;
}

/** @param {NS} ns **/
function chooseTarget(ns) {
    var target = false;

    var hostname = ns.getHostname();

    var remoteHosts = ns.scan(hostname);

    if (hostname != 'home' && hostname != "8gb-test" && isHackable(ns, hostname)) {
        remoteHosts.push(hostname);
    }

    var bestPick;
    var bestPickVal = 0;

    for (var i = 0; i < remoteHosts.length; i++) {
        if (ns.serverExists(remoteHosts[i])) {
            var maxMoney = ns.getServerMaxMoney(remoteHosts[i]);
            if (maxMoney > bestPickVal && isHackable(ns, remoteHosts[i])) {
                bestPick = i;
                bestPickVal = maxMoney;
            }
        }
    }

    //ns.tprint(remoteHosts[bestPick] + ": " + bestPickVal);
    if (bestPick) {
        target = remoteHosts[bestPick];
    }

    return target;
}