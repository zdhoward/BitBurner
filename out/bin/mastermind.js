/** @param {NS} ns 
 *	@param 1 target
 */
export async function main(ns) {
    var target = "";
    if (ns.args[0]) {
        target = ns.args[0];
    }

    if (ns.run('/bin/mastermind-recon.js', 1, target)) {
        ns.toast('MASTERMIND ACTIVATED', 'success', 5000);
    }

    // OVERVIEW STATS

    // TOTAL MONEY SINCE LAST AUGMENT

    // # of Servers currently infected

    // Is stocks active? 

    // Is contracts active?

}