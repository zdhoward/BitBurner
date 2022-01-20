import { getBotnet, getSharenet } from 'lib/lib';
import { generateIPs } from '/bin/contracts.js';
import { getRepGoal } from '/bin/work.js';
import { formatMoney, allServers } from '/lib/lib.js';
// FIX ARRAY JUMPING
// 2,7,0,0,7,9,2,0,1,1 <-- fails

export function autocomplete(data, args) {
    return [...data.servers];
}

/** @param {import("../../.").NS } ns **/
export async function main(ns) {
    //ns.tprint("STARTING SHARE");
    //await shareFill(ns);
    //await ns.killall('SHR-1');
    //var removed = ns.deleteServer('BOT-2');
    ///var added = ns.purchaseServer('SHR-1', ns.getPurchasedServerMaxRam());
    //ns.tprint("Removed: " + removed + " added: " + added);
}

