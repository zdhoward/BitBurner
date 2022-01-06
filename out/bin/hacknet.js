/** @param {NS} ns **/
export async function main(ns) {
    ns.clearLog();
    ns.disableLog("disableLog");
    ns.disableLog("getServerMoneyAvailable");
    ns.disableLog("sleep");

    if (ns.hacknet.numNodes() == 0) {
        ns.hacknet.purchaseNode();
        ns.print("First node purchased");
    }

    while (true) {
        for (var i = 0; i < ns.hacknet.numNodes(); i++) {
            var money = ns.getServerMoneyAvailable("home");
            var nodeCost = ns.hacknet.getPurchaseNodeCost(i);
            var levelCost = ns.hacknet.getLevelUpgradeCost(i);
            var ramCost = ns.hacknet.getRamUpgradeCost(i);
            var coreCost = ns.hacknet.getCoreUpgradeCost(i);

            if (nodeCost < money) {
                await ns.hacknet.purchaseNode();
            }

            if (ramCost < money) {
                await ns.hacknet.upgradeRam(i, 1);
            } else if (coreCost * 2 < money) {
                await ns.hacknet.upgradeCore(i, 1);
            } else if (levelCost * 4 < money) {
                await ns.hacknet.upgradeLevel(i, 1);
            }
            await ns.sleep(100);
        }
    }
}