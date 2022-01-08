/** @param {NS} ns **/
export async function main(ns) {
    var input = "25525511135";
    var result = generateIPs(ns, input);
    result.forEach(function (r) {
        ns.tprint(r);
    });
}

export function generateIPs(ns, input) {
    function isValidIP(ip) {
        var passed = true;

        ns.tprint("COMPARING: " + input.length + " AND " + (ip.length - 3));
        if (ip.length - 3 != input.length) {
            passed = false;
        }


        var quads = ip.split('.');
        quads.forEach(function (quad) {
            quad = quad.toString();
            if (quad.startsWith("0") && quad.length > 1) {
                ns.tprint('RETURNING FALSE');
                passed = false;
            }
        });

        ns.tprint("Valid IP: " + ip);
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