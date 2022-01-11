import { formatMoney } from '/lib/lib.js'

/** @param {NS} ns **/
export async function main(ns) {

    ns.tprint('RUNNING: /bin/extend-overview.js on home');
    ns.scriptKill('/bin/extend-overview.js', 'home');
    ns.run('/bin/extend-overview.js', 1);

    ns.tprint('RUNNING: /bin/upgrades.js on home');
    ns.scriptKill('/bin/upgrades.js', 'home');
    ns.run('/bin/upgrades.js', 1);
    //// HOME-CONTRACTS
    // BUY CONTRACT SERVER IF IT DOES NOT EXIST
    await deployServer(ns, 'home-contracts', ['/bin/contracts.js', '/lib/lib.js']);

    if (ns.getPlayer().money > 10000000000) {
        await deployServer(ns, 'home-stocks', ['/bin/stocks.js', '/lib/lib.js']);
    }

}

async function deployServer(ns, serverName, files) {
    var money = ns.getPlayer().money;
    if (!ns.serverExists(serverName)) {
        ns.tprint('BUYING ' + serverName + ' SERVER');
        var ramReq = Math.ceil(ns.getScriptRam(files[0], 'home'));

        // snap to nearest exponent of 2	
        ramReq = (ramReq >= 64) ? 128 : ramReq;
        ramReq = (ramReq >= 32) ? 64 : ramReq;
        ramReq = (ramReq >= 16) ? 32 : ramReq;

        var serverCost = ns.getPurchasedServerCost(ramReq);
        ns.tprint('CONTRACT SERVER REQ: ' + 'RAM - ' + ramReq + ', COST - ' + formatMoney(ns, serverCost) + ', CAN PURCHASE: ' + (money > serverCost) ? 'YES' : 'NO');
        if (money > serverCost) {
            ns.purchaseServer(server, ramReq);
        } else { ns.tprint('NOT ENOUGH $$$ ' + formatMoney(ns, money) + '/' + formatMoney(ns, serverCost)); }
    }

    if (ns.serverExists(serverName)) {
        // LOAD FILES
        ns.tprint('LOADING FILES ONTO ' + serverName);
        await ns.killall(serverName);
        await ns.scp(files, 'home', serverName);

        // RUN FILES
        ns.tprint('EXECUTING ' + files[0]);
        await ns.exec(files[0], serverName, 1);
    } else { ns.tprint(serverName + ' SERVER DOES NOT EXIST'); }
}