import { MASTERMIND_PORT, formatMoney } from '/lib/lib.js';

// Keep this lean, to just digest the data 
// JSON.parse the data

var totalProfits = {};
var saveFile = "/data/mastermind-data.txt";

var nsHandler;

/** @param {NS} ns **/
export async function main(ns) {
    await onLoad(ns);
    while (true) {
        var portHandle = await ns.getPortHandle(MASTERMIND_PORT);

        while (ns.peek(MASTERMIND_PORT) != 'NULL PORT DATA') {
            var data = portHandle.read(MASTERMIND_PORT);
            if (data) {
                //ns.tprint('MASTERMIND_PORT: ' + data);
                var msg = JSON.parse(data);
                var server = msg.name;
                var profit = msg.loot;

                if (!totalProfits[server]) {
                    totalProfits[server] = 0;
                }

                totalProfits[server] += profit;
            }
        }

        //ns.tprint('Total Profits: ' + formatMoney(ns, getTotalProfits()));
        await saveData(ns);
        await ns.sleep(1000);
    }
}

function getTotalProfits() {
    var total = 0;
    for (var key in totalProfits) {
        //ns.tprint(key + ': ' + totalProfits[key]);
        total += totalProfits[key];
    }
    return total
}

async function onLoad(ns) {
    //ns.tprint('onLoad: ' + saveFile);
    //bindOnExit();
    // load total from data file
    var data;
    try {
        data = JSON.parse(ns.read(saveFile));
    } catch (e) {
        data = { totalProfits: {} };
    }
    totalProfits = data.totalProfits;//JSON.parse(data.totalProfits);
}

async function saveData(ns) {
    //ns.tprint('saveData: ' + saveFile);
    var data = JSON.stringify({ totalProfits: totalProfits });
    await ns.write(saveFile, data, 'w');
}