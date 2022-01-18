import { generateIPs } from '/bin/contracts.js';
import { getRepGoal } from '/bin/work.js';
import { formatMoney } from '/lib/lib.js';
// FIX ARRAY JUMPING
// 2,7,0,0,7,9,2,0,1,1 <-- fails

export function autocomplete(data, args) {
    return [...data.servers];
}

/** @param {import("../../.").NS } ns **/
export async function main(ns) {
    //contract_main(ns);
    //var data = [130, 85, 165, 128, 38, 173, 79, 194, 187, 93, 136, 16, 9, 165, 72, 104, 25, 137, 152, 139, 107, 105, 10, 41, 37, 163, 11];
    //ns.tprint('DATA     : ' + data);
    //var result = algorithmicStockSolver(ns, data, Infinity);
    //ns.tprint('RESULT   : ' + result);

    // Acquire a reference to the terminal list of lines.
    //const list = ;

    if (ns.getPlayer().isWorking) {
        var line = getWorkingFactionInfo(ns);
        ns.tprint(line);
    } else {
        ns.tprint('NOT FOCUSED');
    }
    //ns.setFocus()
    //ns.tprint(html);
}

function getWorkingFactionInfo(ns) {
    var factionName = ns.getPlayer().currentWorkFactionName;
    var factionRep = ns.getFactionRep(factionName);
    var repGoal = getRepGoal(ns, factionName);
    return formatMoney(factionRep) + "/" + formatMoney(repGoal);
}

////////////////////////////////////////////////////////////////////////////////

/** @param {import("../../.").NS } ns **/
function uniquePathsII(ns, data) {

}

function injectHTML() {
    var doc = eval("document");
    var liClass = "jss1414 MuiListItem-root MuiListItem-gutters MuiListItem-padding css-1sslzpn";
    var pClass = "jss1419 MuiTypography-root MuiTypography-body1 css-12bw0zz";

    var html = '<li class="' + liClass + '"><p class="' + pClass + '"><b>HELLO</b> <i>HELLO</i> <u>HELLO</u>, HELLO</p></li>';

    liClass = "jss1414 MuiListItem-root MuiListItem-gutters MuiListItem-padding css-1sslzpn";
    var aClass = "MuiTypography-root MuiTypography-inherit jss1415 MuiLink-root MuiLink-underlineAlways css-qu79bi";
    pClass = "MuiTypography-root MuiTypography-body1 css-12bw0zz";

    var linkedHTML = '<li class="' + liClass + '"><a class="' + aClass + '"<p class="' + pClass + '">n00dles</p></li>';

    // Inject some HTML.
    doc.getElementById("terminal").insertAdjacentHTML('beforeend', linkedHTML);
}

/** @param 0 array of [x,y] to solve for **/
function uniquePathsI(input) {
    function findUniquePermutations(path) {
        if (path.length < 2) return path;

        var permutations = [];
        for (var i = 0; i < path.length; i++) {
            var char = path[i];
            if (path.indexOf(char) != i)
                continue;

            var remainingString = path.slice(0, i) + path.slice(i + 1, path.length);
            for (var subPermutation of findUniquePermutations(remainingString)) {
                permutations.push(char + subPermutation);
            }
        }
        return permutations;
    }

    var rootPath = "R".repeat(input[0] - 1) + "D".repeat(input[1] - 1);
    var result = findUniquePermutations(rootPath).length;
    return result;
}

function contract_stocks(ns) {
    var data = [102, 105, 32, 192, 193, 199, 56, 127, 70, 62, 50, 12, 67, 119, 40, 96, 129, 141, 106, 62, 200, 198, 105, 7, 78, 65, 27, 126, 21, 95, 171, 17, 131, 24, 77, 47, 81, 76, 14, 102, 182, 172, 107, 62, 12, 185, 96, 89];
    var validate = '';
    ns.tprint('DATA     : ' + data);
    var result = oldAlgorithmicStockTraderI(ns, data);
    ns.tprint('OLD RESULT   : ' + result);

    var result = algorithmicStockTraderI(ns, data);
    ns.tprint('RESULT   : ' + result);

    //ns.tprint("VALIDATE : " + validate);
}

function algorithmicStockSolver(ns, data, numOfTx) {
    // return an array of transactions sorted most profitable to least
    // Needs to prep to solve 4 different questions
    // 1. Find the profit from single best transaction in the series of prices
    // 2. Get maximum profit from as many transactions as possible
    // 3. Get the best profit from 2 transactions
    // 4. Get best profit from a variable amount of transactions
    //
    // algorithmicStockSolver(data, numOfTx)
    //   return bestProfit;

    if (numOfTx == Infinity)
        numOfTx = Math.ceil(data.length / 2);

    function solve(_start = 0, depth = 0) {
        ns.tprint('PARAMS: ' + _start + ' ' + depth);
        var bestProfit = 0;
        var bestProfitEnd = 0;
        for (var start = _start; start < data.length - 1; start++) {
            //ns.tprint('START: ' + start);
            for (var end = start + 1; end < data.length; end++) {
                //ns.tprint('END: ' + end);
                var profit = data[end] - data[start];
                if (profit > bestProfit) {
                    bestProfit = profit;
                    bestProfitEnd = end;
                    ns.tprint('START: ' + start + ' END: ' + end);
                }
            }
        }

        ns.tprint("depth: " + depth + " numOfTx: " + numOfTx + " bestProfit: " + bestProfit + " bestProfitEnd: " + bestProfitEnd);
        if (depth < numOfTx - 1) {
            return bestProfit + solve(bestProfitEnd + 1, depth + 1);
        } else {
            return bestProfit;
        }
    }

    return solve();

}

/** @param 0 array of prices to solve for **/
function algorithmicStockTraderI(ns, data) {
    var transactions = algorithmicStockSolver(data);
    var bestProfit = data[transactions[0][1]] - data[transactions[0][0]];
    ns.tprint('START: ' + data[transactions[0][0]] + ' END: ' + data[transactions[0][1]]);
    return bestProfit
}

/** @param 0 array of prices to solve for **/
function algorithmicStockTraderII(data) {
    var transactions = algorithmicStockSolver(data);
    var totalProfits = 0;
    for (var i = 0; i < transactions.length; i++) {
        totalProfits += data[transactions[i][1]] - data[transactions[i][0]];
    }
    return totalProfits;
}

/** @param 0 array of prices to solve for **/
function oldAlgorithmicStockTraderI(ns, data) {
    var prices = data;
    var bestProfit = 0;
    for (var start = 0; start < prices.length; start++) {
        for (var end = start + 1; end < prices.length; end++) {
            var profit = prices[end] - prices[start];
            if (profit > bestProfit) {
                bestProfit = profit;
                ns.tprint('START: ' + start + ' END: ' + end);
            }
        }
    }
    return bestProfit;
}