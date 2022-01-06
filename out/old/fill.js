/** @param {NS} ns **/
export async function main(ns) {
    var reserveRam = 10;
    var freeRam = ns.getServerMaxRam("home") - ns.getServerUsedRam("home") - reserveRam;
    var payloadAmt = Math.floor(freeRam / ns.getScriptRam('payload.js'));
    ns.tprint("Payload Threads:" + payloadAmt);
    var target = "";
    if (ns.args[0]) {
        target = ns.args[0];
    }
    await ns.exec("payload.js", "home", payloadAmt, target);
}