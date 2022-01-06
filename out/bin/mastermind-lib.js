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