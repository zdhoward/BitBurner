import { formatMoney, pad } from '/lib/lib.js';

var refreshRateInSeconds = 4;

/** @param {NS} ns **/
export async function main(ns) {
    await startStockTrader(ns);
}

async function printStockStatus(ns) {
    var allStocks = ns.stock.getSymbols();

    while (true) {
        var money = ns.getPlayer().money;

        ns.clearLog();

        printLine(ns, 'TX', 'Price', 'Volatility', 'Forecast', 'Qty', 'MyShares', 'AvgPaid', 'MyShorts', 'AvgPaid', 'Profits');
        ns.print('─'.repeat(120));
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

            var profits = ns.stock.getSaleGain(stock, myShares, 'long');

            //ns.tprint(pad('[' + stock + ']', 8) + ': ' + formatMoney(ns, price) + ' (' + volatility.toFixed(3) + ') - ' + forecast.toFixed(3) + ' - ' + formatMoney(ns, amount));
            //ns.tprint("My Position: " + myShares + ' shares at ' + avgPaid + ' each');
            //ns.tprint("My Shorts: " + myShorts + ' shares at ' + avgPaidShorts + ' each');
            printLine(ns, stock, "$" + formatMoney(ns, price), volatility.toFixed(3), forecast.toFixed(3), formatMoney(ns, amount), formatMoney(ns, myShares), "$" + formatMoney(ns, avgPaid), formatMoney(ns, myShorts), "$" + formatMoney(ns, avgPaidShorts), "$" + formatMoney(ns, profits));
        }

        await ns.sleep(refreshRateInSeconds * 1000);
    }
}

function printLine(ns, tx, price, volatility, forecast, qty, shares, avgPaid, shorts, avgPaidShorts, profits) {
    ns.print(pad('[ ' + tx + ' ]', 9) + '│ ' + pad(price, 12) + '│ ' + pad(volatility, 12) + '│ ' + pad(forecast, 12) + '│ ' + pad(qty, 7) + '│ │ ' + pad(shares, 9) + '│ ' + pad(avgPaid, 12) + '│ ' + pad(shorts, 9) + '│ ' + pad(avgPaidShorts, 12) + '│ ' + pad(profits, 9));
}

async function startStockTrader(ns) {
    var maxSharePer = 1.00
    var stockBuyPer = 0.60
    var stockVolPer = 0.05
    var moneyKeep = 1000000000
    var minSharePer = 5

    while (true) {
        ns.disableLog('disableLog');
        ns.disableLog('sleep');
        ns.disableLog('getServerMoneyAvailable');
        var stocks = ns.stock.getSymbols().sort(function (a, b) { return ns.stock.getForecast(b) - ns.stock.getForecast(a); })
        for (const stock of stocks) {
            var position = ns.stock.getPosition(stock);
            if (position[0]) {
                //ns.print('Position: ' + stock + ', ')
                sellPositions(stock);
            }
            buyPositions(stock);
        }
        ns.print('Cycle Complete');
        await ns.sleep(6000);
        await printStockStatus(ns);
    }
    function buyPositions(stock) {
        var maxShares = (ns.stock.getMaxShares(stock) * maxSharePer) - position[0];
        var askPrice = ns.stock.getAskPrice(stock);
        var forecast = ns.stock.getForecast(stock);
        var volPer = ns.stock.getVolatility(stock);
        var playerMoney = ns.getServerMoneyAvailable('home');

        if (forecast >= stockBuyPer && volPer <= stockVolPer) {
            if (playerMoney - moneyKeep > ns.stock.getPurchaseCost(stock, minSharePer, "Long")) {
                var shares = Math.min((playerMoney - moneyKeep - 100000) / askPrice, maxShares);
                ns.stock.buy(stock, shares);
                //ns.print('Bought: '+ stock + '')
                ns.toast('Bought: ' + stock + ' x ' + formatMoney(ns, shares) + ' for $' + formatMoney(ns, askPrice * shares), 'info', 5000);
            }
        }
    }
    function sellPositions(stock) {
        var forecast = ns.stock.getForecast(stock);
        if (forecast < 0.5) {
            ns.stock.sell(stock, position[0]);
            //ns.print('Sold: '+ stock + '')
            ns.toast('Sold: ' + stock + '', 'info', 5000);
        }
    }
}