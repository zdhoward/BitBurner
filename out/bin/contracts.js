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
    ns.print('==============================');
}

/** @param {NS} ns
 *  @param 0 server
 *  @param 1 contract
 */
function solveContract(ns, contract, server) {
    var solvedTypes = ["Find Largest Prime Factor", "Subarray with Maximum Sum", "Generate IP Addresses"];
    var type = ns.codingcontract.getContractType(contract, server);
    var description = ns.codingcontract.getDescription(contract, server);
    var triesRemaining = ns.codingcontract.getNumTriesRemaining(contract, server);
    var data = ns.codingcontract.getData(contract, server);

    // SOME PROBLEMS HAVE AS LOW AS 1 TRY
    //if (triesRemaining < 4) {
    //    ns.print('ERROR - ' + type + ' - triesRemaining = ' + triesRemaining + ' - SOLUTION NEEDS FIXING');
    //    //displayContractInfo((ns, contract, type, description, triesRemaining, data));
    //}

    if (solvedTypes.includes(type)) { //&& triesRemaining >= 1) {
        //ns.print('\nType: ' + type + '\nNumTriesRemaining: ' + triesRemaining + '\nDescription: ' + description);
        //

        // Solve
        switch (type) {
            case "Find Largest Prime Factor":
                var [solution, result] = tryAttempt(ns, findLargestPrimeFactor, contract, data, server);
                displayContractInfo(ns, contract, type, description, triesRemaining, data, solution, result);
                break;
            case "Unique Paths in a Grid I":
                ns.print('== TODO - ' + type);
                break;
            case "Unique Paths in a Grid II":
                ns.print('== TODO - ' + type);
                break;
            case "Algorithmic Stock Trader I":
                ns.print('== TODO - ' + type);
                break;
            case "Algorithmic Stock Trader II":
                ns.print('== TODO - ' + type);
                break;
            case "Algorithmic Stock Trader III":
                ns.print('== TODO - ' + type);
                break;
            case "Algorithmic Stock Trader IV":
                ns.print('== TODO - ' + type);
                break;
            case "Minimum Path Sum in a Triangle":
                ns.print('== TODO - ' + type);
                break;
            case "Subarray with Maximum Sum":
                var [solution, result] = tryAttempt(ns, subarrayWithLargestSum, contract, data, server);
                displayContractInfo(ns, contract, type, description, triesRemaining, data, solution, result);
                break;
            case "Find All Valid Math Expressions":
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
                ns.print('== TODO - ' + type);
                break;
            case "Generate IP Addresses":
                var [solution, result] = tryAttempt(ns, generateIPs, contract, data, server);
                displayContractInfo(ns, contract, type, description, triesRemaining, data, solution, result);
                break;
            case "Spiralize Matrix":
                ns.print('== TODO - ' + type);
                break;
            default:
                ns.print('== NO SOLUTIONS FOR - ' + type);
                break;
        }
    } else {
        //ns.print('== CONTRACT BURNED - ' + contract + ' - ' + type + ' - ' + description + ' - ' + triesRemaining);
    }

}

////////////////////
// SOLUTIONS
////////////////////

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
    var solution = fn(data);
    var result = ns.codingcontract.attempt(solution, contract, server);

    if (!result) {
        ns.alert('CONTRACT FAILED - ' + contract + ' - ' + type + ' - ' + description + ' - ' + triesRemaining);
    } else {
        ns.alert('CONTRACT SOLVED - ' + contract + ' - ' + type + ' - ' + description + ' - ' + triesRemaining);
    }

    var msg = "CONTRACT: " + String(contract) + String((result) ? " SOLVED" : " NOT SOLVED", 5000);
    ns.toast(msg);
    ns.print(msg);

    return [solution, result];
}