import { formatMoney } from '/bin/mastermind-lib.js'

/** @param {NS} ns **/
export async function main(ns) {
    var money = ns.getPlayer().money;
    var reqFiles = ['/bin/contracts.js', '/bin/mastermind-lib.js']
    var server = 'home-contracts';

    ns.run('/bin/extend-overview.js', 1);

    // BUY CONTRACT SERVER IF IT DOES NOT EXIST
    if (!ns.serverExists(server)) {
        ns.tprint('BUYING HOME-CONTRACTS SERVER');
        var ramReq = Math.ceil(ns.getScriptRam('/bin/contracts.js', 'home'));

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

    if (ns.serverExists(server)) {
        // LOAD FILES
        ns.tprint('LOADING FILES ONTO HOME-CONTRACTS');
        await ns.killall(server);
        await ns.scp(reqFiles, 'home', server);

        // RUN FILES
        ns.tprint('EXECUTING ' + reqFiles[0]);
        await ns.exec(reqFiles[0], server, 1);
    } else { ns.tprint('HOME-CONTRACTS SERVER DOES NOT EXIST'); }
}