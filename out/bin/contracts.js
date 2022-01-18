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
    getContracts(ns, hostname);

    var remoteHosts = ns.scan(hostname);
    for (var i in remoteHosts) {
        var remoteHost = remoteHosts[i];
        await serverScanRecursive(ns, remoteHost);
    }
}

/** @param {NS} ns
 *  @param 0 server
 */
function getContracts(ns, server) {
    var files = ns.ls(server, ".cct");
    for (var i = 0; i < files.length; i++) {
        solveContract(ns, files[i], server);
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
function solveContract(ns, contract, server) {
    var solvedTypes = ["Find Largest Prime Factor",
        "Subarray with Maximum Sum",
        "Generate IP Addresses",
        "Unique Paths in a Grid I",
        "Algorithmic Stock Trader I",
        "Algorithmic Stock Trader II",
        //"Algorithmic Stock Trader III",
        "Array Jumping Game",
        "Sanitize Parentheses in Expression",
        "Total Ways to Sum",
        "Merge Overlapping Intervals",
        "Spiralize Matrix"
    ];
    var type = ns.codingcontract.getContractType(contract, server);
    var description = ns.codingcontract.getDescription(contract, server);
    var triesRemaining = ns.codingcontract.getNumTriesRemaining(contract, server);
    var data = ns.codingcontract.getData(contract, server);

    var result = false;

    ns.print('=========== ' + contract + ' ==========');
    ns.print('== TYPE            : ' + type);
    ns.print('== DATA            : ' + data);

    if (solvedTypes.includes(type)) { //&& triesRemaining >= 1) {
        // Solve
        switch (type) {
            case "Find Largest Prime Factor":
                result = tryAttempt(ns, findLargestPrimeFactor, contract, data, server);
                break;
            case "Unique Paths in a Grid I":
                result = tryAttempt(ns, uniquePathsI, contract, data, server);
                break;
            case "Unique Paths in a Grid II":
                ns.print('== TODO - ' + type);
                break;
            case "Algorithmic Stock Trader I":
                result = tryAttempt(ns, algorithmicStockTraderI, contract, data, server);
                break;
            case "Algorithmic Stock Trader II":
                result = tryAttempt(ns, algorithmicStockTraderII, contract, data, server);
                break;
            case "Algorithmic Stock Trader III":
                result = tryAttempt(ns, algorithmicStockTraderIII, contract, data, server);
                break;
            case "Algorithmic Stock Trader IV":
                // var data = 7,55,139,173,185,81,12,59,40,97,154,20,170,17,57,40,148,118,43,39
                ns.print('== TODO - ' + type);
                break;
            case "Minimum Path Sum in a Triangle":
                // var data = 9,5,4,8,9,5,4,5,6,8,8,7,8,7,4
                ns.print('== TODO - ' + type);
                break;
            case "Subarray with Maximum Sum":
                result = tryAttempt(ns, subarrayWithLargestSum, contract, data, server);
                break;
            case "Find All Valid Math Expressions":
                // var data = 8327,82
                // var data = 466303594639,24
                //ns.print('\nType: ' + type + '\nNumTriesRemaining: ' + triesRemaining + '\nDescription: ' + description);
                ns.print('== TODO - ' + type);
                /*
                Description: You are given the following string which contains only digits between 0 and 9:
	
                223309565
	
                You are also given a target number of -27. Return all possible ways you can add the +, -, and * operators to the string such that it evaluates to the target number.
	
                The provided answer should be an array of strings containing the valid expressions. The data provided by this problem is an array with two elements. The first element is the string of digits, while the second element is the target number:
	
                ["223309565", -27]
	
                NOTE: Numbers in the expression cannot have leading 0's. In other words, "1+01" is not a valid expression Examples:
	
                Input: digits = "123", target = 6
                Output: [1+2+3, 1*2*3]
                */
                break;
            case "Sanitize Parentheses in Expression":
                result = tryAttempt(ns, sanitizeParenthesis, contract, data, server);
                break;
            case "Generate IP Addresses":
                result = tryAttempt(ns, generateIPs, contract, data, server);
                break;
            case "Spiralize Matrix":
                result = tryAttempt(ns, spiralizeMatrix, contract, data, server);
                ns.print('== TODO - ' + type);
                break;
            case "Merge Overlapping Intervals":
                // var data = 16,22,15,17,22,26,4,13,4,5,11,19,21,30,21,24,15,18,8,17,20,25,25,35,6,11,24,33
                result = tryAttempt(ns, mergeOverlappingIntervals, contract, data, server);
                break;
            case "Array Jumping Game":
                result = tryAttempt(ns, arrayJumpingGame, contract, data, server);
                ns.print('== TODO - ' + type);
                break;
            case "Total Ways to Sum":
                result = tryAttempt(ns, totalWaysToSum, contract, data, server);
                break;
            default:
                ns.print('== NO SOLUTIONS FOR - ' + type);
                break;
        }
    }
}

////////////////////
// SOLUTIONS
////////////////////
/** @param data number to solve for 
 */
function mergeOverlappingIntervals(data) {
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

/** @param {import("../../.").NS } ns 
 *  @param data number to solve for 
 */
function totalWaysToSum(data) {
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
function spiralizeMatrix(data) {
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
function arrayJumpingGame(data) {
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

/** @param 0 array of prices to solve for **/
function algorithmicStockTraderI(data) {
    var prices = data;
    var bestProfit = 0;
    for (var start = 0; start < prices.length; start++) {
        for (var end = start + 1; end < prices.length; end++) {
            var profit = prices[end] - prices[start];
            if (profit > bestProfit) {
                bestProfit = profit;
            }
        }
    }
    return bestProfit;
}

/** @param 0 array of prices to solve for **/
function algorithmicStockTraderII(data) {
    var totalProfits = 0;
    for (var start = 0; start < data.length; start++) {
        for (var end = start + 1; end < data.length; end++) {
            var profit = data[end] - data[start];
            var lastProfit = data[end - 1] - data[start];

            if (profit < lastProfit) {
                if (lastProfit > 0) {
                }
                start = end - 1;
                totalProfits += lastProfit;
                break;
            }

            if (end == data.length - 1) {
                start = end;
                totalProfits += profit;
                break;
            }
        }
    }
    return totalProfits;
}

/** @param 0 array of prices to solve for **/
function algorithmicStockTraderIII(data) {
    var transactions = algorithmicStockSolver(data);
    var bestProfit = data[transactions[0][1]] - data[transactions[0][0]];
    bestProfit += data[transactions[1][1]] - data[transactions[1][0]];
    return bestProfit
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

/** @param 0 number to solve for **/
function findLargestPrimeFactor(number) {
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
function subarrayWithLargestSum(array) {
    var bestSubArray = [];
    var bestSubArraySum = 0;
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
export function generateIPs(input) {
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

/** @param 0 array to solve for **/
function tryAttempt(ns, fn, contract, data, server) {
    var type = ns.codingcontract.getContractType(contract, server);
    var description = ns.codingcontract.getDescription(contract, server);
    var triesRemaining = ns.codingcontract.getNumTriesRemaining(contract, server);
    var data = ns.codingcontract.getData(contract, server);

    var solution = fn(data);
    var result = ns.codingcontract.attempt(solution, contract, server);

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

function sanitizeParenthesis(data) {
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