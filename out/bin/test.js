export function autocomplete(data, args) {
    return [...data.servers];
}

/** @param {import("../../.").NS } ns **/
export async function main(ns) {
    /** @param 0 array to solve for **/
    function subarrayWithLargestSum(array) {
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
                ns.tprint("SUBARRAY: " + subarray + " SUM: " + sum);
                if (sum > bestSubArraySum) {
                    bestSubArray = subarray;
                    bestSubArraySum = sum;
                }
            }
        }
        return bestSubArraySum;
    }

    var data = [-9, -8, -1, -6, -10];
    var result = subarrayWithLargestSum(data);
    ns.tprint(result);
}