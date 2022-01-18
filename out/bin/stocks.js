import { formatMoney, pad, STOCKS_PORT } from '/lib/lib.js';

var refreshRateInSeconds = 4;

var stopBuying = false;

/** @param {NS} ns **/
export async function main(ns) {
    ns.toast('stocks.js has started', 'info');
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

            //ns.tprint(pad('[' + stock + ']', 8) + ': ' + formatMoney( price) + ' (' + volatility.toFixed(3) + ') - ' + forecast.toFixed(3) + ' - ' + formatMoney( amount));
            //ns.tprint("My Position: " + myShares + ' shares at ' + avgPaid + ' each');
            //ns.tprint("My Shorts: " + myShorts + ' shares at ' + avgPaidShorts + ' each');
            printLine(ns, stock, "$" + formatMoney(price), volatility.toFixed(3), forecast.toFixed(3), formatMoney(amount), formatMoney(myShares), "$" + formatMoney(avgPaid), formatMoney(myShorts), "$" + formatMoney(avgPaidShorts), "$" + formatMoney(profits));
        }

        await ns.sleep(refreshRateInSeconds * 1000);
    }
}

function printLine(ns, tx, price, volatility, forecast, qty, shares, avgPaid, shorts, avgPaidShorts, profits) {
    ns.print(pad('[ ' + tx + ' ]', 9) + '│ ' + pad(price, 12) + '│ ' + pad(volatility, 12) + '│ ' + pad(forecast, 12) + '│ ' + pad(qty, 7) + '│ │ ' + pad(shares, 9) + '│ ' + pad(avgPaid, 12) + '│ ' + pad(shorts, 9) + '│ ' + pad(avgPaidShorts, 12) + '│ ' + pad(profits, 9));
}

/** @param {import("../../.").NS } ns **/
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
        //await printStockStatus(ns);
    }

    function buyPositions(stock) {
        var msg = ns.readPort(STOCKS_PORT);
        if (msg == 'STOP') {
            stopBuying = true;
        } else if (msg == 'START') {
            stopBuying = false;
        }

        if (!stopBuying) {
            var maxShares = (ns.stock.getMaxShares(stock) * maxSharePer) - position[0];
            var askPrice = ns.stock.getAskPrice(stock);
            var forecast = ns.stock.getForecast(stock);
            var volPer = ns.stock.getVolatility(stock);
            var playerMoney = ns.getServerMoneyAvailable('home');

            if (forecast >= stockBuyPer && volPer <= stockVolPer) {
                if (playerMoney - moneyKeep > Math.max(ns.stock.getPurchaseCost(stock, minSharePer, "Long"), 1e9 + moneyKeep)) {
                    var shares = Math.min((playerMoney - moneyKeep - 100000) / askPrice, maxShares);
                    if (shares > 0) {
                        ns.stock.buy(stock, shares);
                        //ns.print('Bought: '+ stock + '')
                        ns.toast('Bought: ' + stock + ' x ' + formatMoney(shares) + ' for $' + formatMoney(askPrice * shares), 'info', 5000);
                        //ns.alert('Bought: ' + stock + ' x ' + formatMoney( shares) + ' for $' + formatMoney( askPrice * shares), 'info', 5000);
                    }
                }
            }
        }
    }

    function sellPositions(stock) {
        var forecast = ns.stock.getForecast(stock);
        var position = ns.stock.getPosition(stock);
        var profit = ns.stock.getSaleGain(stock, position[0], 'long');
        if (forecast < 0.5 || profit < -10000000) {
            ns.stock.sell(stock, position[0]);
            //ns.print('Sold: '+ stock + '')
            ns.toast('Sold: ' + stock + ' for $' + formatMoney(profit), 'info', 5000);
            //ns.alert('Sold: ' + stock + ' for $' + formatMoney( profit), 'info', 5000);
        }
    }
}

// newStockTrader
//  wallstreet kid

// BUY as much as possible of best forcasted stock
//   repeat until down to $1,000,000
// profit = (price - avgPaid) * shares  - txCost
// SELL if (forecast<0.5 ||  profit < -10000000)