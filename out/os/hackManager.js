import { reserveRam, reserveMoney, remoteServers, botServers, factionNames, augNames } from '/os/config.js';
import { helloWorld, getServerInfo, getScriptInfo } from '/os/lib.js';

export function autocomplete(data, args) {
    return [...data.servers];
}

/** @param {import("../../.").NS } ns */
export async function main(ns) {
    await hackServers(ns);
}

/** @param {import("../..").NS } ns */
export async function hackServers(ns) {
    let data = await getServerInfo(ns);
    for (let server in data) {
        if (data[server].exists && data[server].maxMoney > 0 && data[server].requiredHackingLevel <= ns.getPlayer().hacking) {
            ns.tprint("Target: " + server + ' is hackable');
        }
    }
}