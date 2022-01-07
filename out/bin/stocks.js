import { formatMoney, } from '/lib/lib.js';

var refreshRateInSeconds = 4;

/** @param {NS} ns **/
export async function main(ns) {
    var allStocks = ns.stock.getSymbols();

    while (true) {
        var money = ns.getPlayer().money;

        for (var i = 0; i < allStocks.length; i++) {
            var stock = allStocks[i];
            var amount = ns.stock.getMaxShares(stock);
            var price = ns.stock.getPrice(stock);
            var volatility = ns.stock.getVolatility(stock);
            var forecast = ns.stock.getForecast(stock); // probability to increase - .5 is neutral no change
            var position = ns.stock.getPosition(stock);

            var myShares = position[0];
            var avgPaid = position[1];
            var myShorts = position[2];
            var avgPaidShorts = position[3];

            ns.tprint(stock + ': ' + price + ' (' + volatility + ') - ' + forecast + ' - ' + amount);
            ns.tprint("My Position: " + myShares + ' shares at ' + avgPaid + ' each');
            ns.tprint("My Shorts: " + myShorts + ' shares at ' + avgPaidShorts + ' each');

        }

        await ns.sleep(refreshRateInSeconds * 1000);
    }
}