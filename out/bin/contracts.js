/// ALLVALIDMATHEXPRESSIONS FAILS WITH : [927046008995,-10]

////////////////////////
// GLOBALS
////////////////////////
var visited = {};

/** @param {NS} ns **/
export async function main(ns) {
    ns.disableLog("disableLog");
    ns.disableLog('scan');
    ns.disableLog('sleep');

    ns.print('Starting contracts.js...');
    ns.toast('contracts.js has started', 'info');

    while (true) {
        // Recursively spread through all computers
        // find .cct files and solve
        ns.print('Scanning for solvable contracts... (10 min)');
        visited = {};
        await serverScanRecursive(ns, ns.getHostname());
        await ns.sleep(1000 * 60 * 10);
    }
}

/** @param {NS} ns
 *  @param 0 hostname
 */
async function serverScanRecursive(ns, hostname) {
    if (visited[hostname] == true) {
        return;
    }
    visited[hostname] = true;

    //do logic
    await getContracts(ns, hostname);

    var remoteHosts = ns.scan(hostname);
    for (var i in remoteHosts) {
        var remoteHost = remoteHosts[i];
        await serverScanRecursive(ns, remoteHost);
    }
}

/** @param {NS} ns
 *  @param 0 server
 */
async function getContracts(ns, server) {
    var files = ns.ls(server, ".cct");
    for (var i = 0; i < files.length; i++) {
        await solveContract(ns, files[i], server);
    }
}

function displayContractInfo(ns, contract, type, description, triesRemaining, data, solution = "NONE", result = false) {
    ns.print('=========== ' + contract + ' ==========');
    ns.print('== TYPE            :' + type);
    ns.print('== DESCRIPTION     :' + description);
    ns.print('== TRIES REMAINING :' + triesRemaining);
    ns.print('== DATA            :' + data);
    ns.print('== SOLUTION: ' + solution);
    ns.print('== ATTEMPTED CONTRACT: [' + contract + ']: ' + result);
    ns.print("== REWARD: " + result);
    ns.print('==============================');
}

/** @param {NS} ns
 *  @param 0 server
 *  @param 1 contract
 */
async function solveContract(ns, contract, server) {
    let contracts = eval('ns.codingcontract');
    var type = eval('contracts.getContractType(contract, server)');
    var data = eval('contracts.getData(contract, server)');

    var result = false;

    ns.print('=========== ' + contract + ' ==========');
    ns.print('== TYPE            : ' + type);
    ns.print('== DATA            : ' + data);
    //ns.alert(data);

    //return;

    // Solve
    switch (type) {
        case "Find Largest Prime Factor":
            result = await tryAttempt(ns, findLargestPrimeFactor, contract, data, server);
            break;
        case "Unique Paths in a Grid I":
            result = await tryAttempt(ns, uniquePathsI, contract, data, server);
            break;
        case "Unique Paths in a Grid II":
            result = await tryAttempt(ns, uniquePathsII, contract, data, server);
            break;
        case "Algorithmic Stock Trader I":
            result = await tryAttempt(ns, algorithmicStockTraderI, contract, data, server);
            break;
        case "Algorithmic Stock Trader II":
            result = await tryAttempt(ns, algorithmicStockTraderII, contract, data, server);
            break;
        case "Algorithmic Stock Trader III":
            result = await tryAttempt(ns, algorithmicStockTraderIII, contract, data, server);
            break;
        case "Algorithmic Stock Trader IV":
            result = await tryAttempt(ns, algorithmicStockTraderIV, contract, data, server);
            break;
        case "Minimum Path Sum in a Triangle":
            result = await tryAttempt(ns, minimumPathSumForTriangle, contract, data, server);
            break;
        case "Subarray with Maximum Sum":
            result = await tryAttempt(ns, subarrayWithLargestSum, contract, data, server);
            break;
        case "Find All Valid Math Expressions":
            //result = await tryAttempt(ns, findAllValidMathExpressions, contract, data, server);
            break;
        case "Sanitize Parentheses in Expression":
            result = await tryAttempt(ns, sanitizeParenthesis, contract, data, server);
            break;
        case "Generate IP Addresses":
            result = await tryAttempt(ns, generateIPs, contract, data, server);
            break;
        case "Spiralize Matrix":
            result = await tryAttempt(ns, spiralizeMatrix, contract, data, server);
            break;
        case "Merge Overlapping Intervals":
            result = await tryAttempt(ns, mergeOverlappingIntervals, contract, data, server);
            break;
        case "Array Jumping Game":
            result = await tryAttempt(ns, arrayJumpingGame, contract, data, server);
            break;
        case "Total Ways to Sum":
            result = await tryAttempt(ns, totalWaysToSum, contract, data, server);
            break;
        default:
            ns.print('== NO SOLUTIONS FOR - ' + type);
            break;
    }
}

////////////////////
// SOLUTIONS
////////////////////
/** @param data number to solve for 
 */
async function mergeOverlappingIntervals(data) {
    function isValid(items) {
        var success = true;
        for (var i = 0; i < items.length; i++) {
            for (var j = 0; j < items.length; j++) {
                if (i != j) {
                    var iStart = items[i][0];
                    var iEnd = items[i][1];
                    var jStart = items[j][0];
                    var jEnd = items[j][1];

                    if (iStart <= jStart && iEnd >= jStart) {
                        success = false;
                    }
                }
            }
        }
        return success;
    }

    function merge(items, index = 0) {
        var mergedRun = items[index];
        var toRemove = [];
        for (var i = index + 1; i < items.length; i++) {
            var mStart = mergedRun[0];
            var mEnd = mergedRun[1];
            var dStart = items[i][0];
            var dEnd = items[i][1];

            if (mStart <= dStart && mEnd >= dStart) {
                items.splice(i, 1);
                i--;
                mergedRun[1] = Math.max(mEnd, dEnd);
            }

        }
        items[index] = mergedRun;

        if (!isValid(items)) {
            items = merge(items, index + 1);
        }

        return items;
    }

    data = data.sort(function (a, b) {
        if (a[0] > b[0])
            return 1;
        else if (a[0] < b[0])
            return -1;
        else
            return 0;
    });

    data = merge(data);

    return data;
}

async function findAllValidMathExpressions(data) {
    let target = data[1];
    let values = data[0];
    let operations = ['+', '-', '*', '/', ''];
    let allExpressions = [];

    buildExpressions(target);

    return allExpressions;

    function buildExpressions(target, curExpression = '', index = 0) {
        if (index < values.length - 1) {
            curExpression += values[index];
            for (var o = 0; o < operations.length; o++) {
                if (!(operations[o] == '' && values[index] == 0))
                    buildExpressions(target, curExpression + operations[o], index + 1);
            }
        } else {
            curExpression += values[values.length - 1];
            let result = eval(curExpression);
            if (result == target) {
                allExpressions.push(curExpression);
            }
        }
    }
}

/** @param {import("../../.").NS } ns 
 *  @param data number to solve for 
 */
async function totalWaysToSum(data) {
    function breakdown(number, range) {
        var steps = Array.from({ length: number + 1 }, (_, i) => 0);
        steps[0] = 1;

        for (var row = 1; row < range + 1; row++) {
            for (var col = 1; col < number + 1; col++) {
                if (col >= row) {
                    steps[col] = steps[col] + steps[col - row];
                }
            }
        }

        return steps[number];
    }

    var totalWays = breakdown(data, data - 1);

    return totalWays
}

/** @param 0 array of numbers to solve for **/
async function minimumPathSumForTriangle(data) {
    let allSums = [];
    function findOptions(sum, row, col) {
        if (row < data.length - 1) {
            let sumB = null;
            let sumA = sum + data[row + 1][col];
            findOptions(sumA, row + 1, col);
            if (col + 1 < data[row + 1].length) {
                sumB = sum + data[row + 1][col + 1];
                findOptions(sumB, row + 1, col + 1);
            }
        } else {
            allSums.push(sum);
        }
    }

    let curSum = data[0][0];

    curSum = findOptions(curSum, 0, 0);

    return Math.min(...allSums);
}


/** @param 0 array of numbers to solve for **/
async function spiralizeMatrix(data) {
    var spiralized = [];
    var direction = [[1, 0], [0, 1], [-1, 0], [0, -1]];
    var curDir = 0;

    var curX = 0;
    var curY = 0;

    var offset = 0;

    for (var y = 0; y < data.length; y++) {
        for (var x = 0; x < data[y].length; x++) {
            spiralized.push(data[curY][curX]);

            if (curDir == 0 && curX == data[y].length - 1 - offset) {
                curDir++;
            } else if (curDir == 1 && curY == data.length - 1 - offset) {
                curDir++;
            } else if (curDir == 2 && curX == 0 + offset) {
                curDir++;
                offset++;
            } else if (curDir == 3 && curY == 0 + offset) {
                curDir = 0;
            }

            curX += direction[curDir][0];
            curY += direction[curDir][1];
        }
    }

    return spiralized;
}

/** @param 0 array of prices to solve for **/
async function arrayJumpingGame(data) {
    function jump(idx, maxJump) {
        if (idx == data.length) {
            return true;
        }
        for (var i = idx + maxJump + 1; i > idx + 1; i--) {
            if (data[i] != 0) {
                var result = jump(i, data[i]);
                if (result) {
                    //ns.tprint("Current Idx: (" + idx + ') Max Jump: ' + maxJump + ' -> Jump Length: ' + (i - idx));
                    return result;
                }
            }
        }
    }
    var result = jump(0, data[0]) ? 1 : 0;
    return result
}

async function stockSolver(prices, tx) {
    if (tx == Infinity)
        tx = prices.length;

    function maxProfit(price, n, k) {
        let profit = Array(k + 1).fill(0).map(x => Array(n + 1).fill(0));
        for (let i = 0; i <= k; i++)
            profit[i][0] = 0;

        for (let j = 0; j <= n; j++)
            profit[0][j] = 0;

        for (let i = 1; i <= k; i++) {
            for (let j = 1; j < n; j++) {
                let max = 0;
                for (let m = 0; m < j; m++)
                    max = Math.max(max, price[j] - price[m] + profit[i - 1][m]);

                profit[i][j] = Math.max(profit[i][j - 1], max);
            }
        }
        return profit[k][n - 1];
    }

    return maxProfit(prices, prices.length, tx);
}

/** @param 0 array of prices to solve for **/
async function algorithmicStockTraderI(data) {
    return stockSolver(data, 1);
}

/** @param 0 array of prices to solve for **/
async function algorithmicStockTraderII(data) {
    return stockSolver(data, Infinity);
}

/** @param 0 array of prices to solve for **/
async function algorithmicStockTraderIII(data) {
    return stockSolver(data, 2);
}

/** @param 0 array of num of transactions and prices to solve for **/
async function algorithmicStockTraderIV(data) {
    var tx = data[0];
    var prices = data[1];
    return stockSolver(prices, tx);
}

/** @param 0 array of [x,y] to solve for **/
async function uniquePathsI(input) {
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

async function uniquePathsII(grid) {
    let dirs = [[0, 1], [1, 0]]; // only down or right
    let totalPaths = 0;
    function pathfind(x, y) {
        if (x < grid[0].length && y < grid.length) { // if within bounds
            if (grid[y][x] != 1) { // if not a wall
                if (x == grid[0].length - 1 && y == grid.length - 1) { // if at ending point
                    totalPaths++;
                } else { // else continue pathfinding
                    for (var i = 0; i < dirs.length; i++) {
                        pathfind(x + dirs[i][0], y + dirs[i][1]);
                    }
                }
            }
        }
    }
    pathfind(0, 0);
    return totalPaths;
}

/** @param 0 number to solve for **/
async function findLargestPrimeFactor(number) {
    var primeFactors = [];
    var lowestPrime = 2;

    while (lowestPrime <= number) {
        if (number % lowestPrime == 0) {
            primeFactors.push(lowestPrime);
            number /= lowestPrime;
        } else {
            lowestPrime++;
        }
    }

    return primeFactors[primeFactors.length - 1];
}

/** @param 0 array to solve for **/
async function subarrayWithLargestSum(array) {
    var bestSubArray = [];
    var bestSubArraySum = -Infinity;
    var subarray = [];
    for (var index = 0; index < array.length; index++) {
        for (var length = 1; length <= array.length - index; length++) {
            subarray = array.slice(index, index + length);
            var sum = 0;
            for (var i = 0; i < subarray.length; i++) {
                sum += subarray[i];
            }
            if (sum > bestSubArraySum) {
                bestSubArray = subarray;
                bestSubArraySum = sum;
            }
        }
    }
    return bestSubArraySum;
}

/** @param 0 string to solve for **/
async function generateIPs(input) {
    function isValidIP(ip) {
        var passed = true;

        if (ip.length - 3 != input.length) {
            passed = false;
        }

        var quads = ip.split('.');
        quads.forEach(function (quad) {
            quad = quad.toString();
            if (Number(quad) < 0 || Number(quad) > 255) {
                passed = false;
            }

            if (quad.startsWith("0") && quad.length > 1) {
                passed = false;
            }
        });

        return passed;
    }

    var results = [];

    var quads = "";

    // GENERATE ALL COMBINATIONS
    for (var one = 1; one < 4; one++) {
        for (var two = one + 1; two < one + 4; two++) {
            for (var three = two + 1; three < two + 4; three++) {
                for (var four = three + 1; four < three + 4; four++) {
                    quads = input.substring(0, one) + "." + input.substring(one, two) + "." + input.substring(two, three) + "." + input.substring(three, four);
                    if (isValidIP(quads) && !results.includes(quads)) {
                        results.push(quads);
                    }
                }
            }
        }
    }

    return results;
}

async function sanitizeParenthesis(data) {
    function isParenthesis(char) {
        return char == '(' || char == ')';
    }

    function isValid(str) {
        var cnt = 0;

        for (var i = 0; i < str.length; i++) {
            if (str[i] == '(')
                cnt++;
            else if (str[i] == ')')
                cnt--;
            if (cnt < 0)
                return false;
        }

        return (cnt == 0);
    }

    function removeInvalidParenthesis(str) {
        var results = [];
        if (str.length == 0)
            return;

        var visited = new Set();

        var queue = [];
        var temp;
        var level = false;

        queue.push(str);
        visited.add(str);

        while (queue.length != 0) {
            str = queue.shift();
            if (isValid(str)) {
                results.push(str);

                level = true;
            }
            if (level)
                continue;
            for (var i = 0; i < str.length; i++) {
                if (!isParenthesis(str[i]))
                    continue;

                temp = str.substring(0, i) + str.substring(i + 1);

                if (!visited.has(temp)) {
                    queue.push(temp);
                    visited.add(temp);
                }
            }
        }
        return results;
    }

    return removeInvalidParenthesis(data);
}

/** @param 0 array to solve for **/
async function tryAttempt(ns, fn, contract, data, server) {
    let contracts = eval('ns.codingcontract');
    var type = eval('contracts.getContractType(contract, server)');
    var description = eval('contracts.getDescription(contract, server)');
    var triesRemaining = eval('contracts.getNumTriesRemaining(contract, server)');
    var data = eval('contracts.getData(contract, server)');

    var solution = await fn(data);
    var result = contracts.attempt(solution, contract, server);

    if (!result) {
        ns.alert('='.repeat(30) + '\nCONTRACT FAILED\n' + "=".repeat(30) + '\nContract: ' + contract + '\nType: ' + type + '\nTries Remaining: ' + triesRemaining + '\nDescription' + description + '\n\nDATA: ' + data + '\nSOLUTION: ' + solution + '\n' + '='.repeat(30));
    } else {
        ns.alert('='.repeat(30) + '\nCONTRACT SOLVED\n' + "=".repeat(30) + '\nContract: ' + contract + '\nType: ' + type + '\nTries Remaining: ' + triesRemaining + '\nDescription' + description + '\n\nDATA: ' + data + '\nSOLUTION: ' + solution + '\n' + '='.repeat(30));
    }

    var msg = "CONTRACT: " + String(contract) + String((result) ? " SOLVED" : " NOT SOLVED", 5000);
    ns.toast(msg);
    ns.print(msg);

    displayContractInfo(ns, contract, type, description, triesRemaining, data, solution, result);

    return result;
}