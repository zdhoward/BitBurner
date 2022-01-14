import { generateIPs } from '/bin/contracts.js';
// FIX ARRAY JUMPING
// 2,7,0,0,7,9,2,0,1,1 <-- fails


/** @param {NS} ns **/
export async function main(ns) {
    //contract_main(ns);
    var data = 88;
    ns.tprint('DATA     : ' + data);
    var result = totalWaysToSum(ns, data);
    ns.tprint('RESULT   : ' + result);

}

function totalWaysToSum(ns, data) {
    var totalWays = 0;

    // find all permutation of numbers that add up to data
    for (var i = 1; i < data; i++) {

    }

    return totalWays
}

function uniquePathsII(ns, data) {

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

function algorithmicStockSolver(data) {
    // return an array of transactions sorted most profitable to least
    var transactions = [];

    for (var start = 0; start < data.length; start++) {
        for (var end = start + 1; end < data.length; end++) {
            var profit = data[end] - data[start];
            var lastProfit = data[end - 1] - data[start];

            if (profit < lastProfit) {
                if (lastProfit > 0) {
                }

                if (start != end - 1)
                    transactions.push([start, end - 1]);
                start = end - 1;
                break;
            }

            if (end == data.length - 1) {
                if (start != end)
                    transactions.push([start, end]);
                start = end;
                break;
            }
        }
    }

    transactions.sort(function (a, b) {
        var profitA = data[a[1]] - data[a[0]];
        var profitB = data[b[1]] - data[b[0]];
        if (profitA > profitB)
            return -1;
        else if (profitA < profitB)
            return 1;
        else
            return 0;
    });

    return transactions;
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