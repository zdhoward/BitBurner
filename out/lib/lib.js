/** @param {NS} ns 
 *  @param 0 ram
 *  @return validRamAmount
 */
export function getValidRamAmount(ns, ram) {
    ns.tprint('RAM: ' + ram);
    var initialRam = 2;
    while (initialRam < ram) {
        initialRam *= 2;
    }
    ns.tprint('getValidRamAmount: ' + initialRam);
    return ram;
}

/** @param {NS} ns 
 *  @param 0 msg
 *  @return formattedMsg
 */
export async function printBanner(ns, msg) {
    ns.tprint('\n============================================================' + '\n==\t\t' + msg + '\n============================================================');
}

/** @param {NS} ns
 *  @param 0 money
 *  @return formattedMoney
 */
export function formatMoney(ns, money) {
    var suffix = '';
    if (money >= 1000000000000) {
        suffix = 'T';
    } else if (money >= 1000000000) {
        suffix = 'B';
    } else if (money >= 1000000) {
        suffix = 'M';
    } else if (money >= 1000) {
        suffix = 'k';
    }

    while (money >= 1000) {
        money /= 1000;
    }

    return ns.nFormat(money, "0,0.00") + suffix;
}

/* @param0 dict to serialize
 * @return serialized string
 */
export function serializeDict(dict) {
    var serialized = '';
    for (var key in dict) {
        serialized += key + '=' + dict[key] + ',';
    }
    return serialized;
}

/* @param0 string to deserialize
 * @return dict
 */
export function deserializeDict(serialized) {
    var dict = {};
    var items = serialized.split(',');
    for (var i = 0; i < items.length; i++) {
        var details = items[i].split('=');
        dict[details[0]] = details[1];
    }
    return dict
}