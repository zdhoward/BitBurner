import { reserveRam, reserveMoney, remoteServers, botServers, factionNames, augNames } from '/os/config.js';
import { helloWorld, getServerInfo, getScriptInfo } from '/os/lib.js';

/** @param {import("../../.").NS } ns */
export async function main(ns) {
    await runContracts(ns);
}

export async function runContracts(ns) {
    let data = await getServerInfo(ns);
    for (let server in data) {
        if (data[server].hasContracts) {
            ns.tprint("Target: " + server + ' has contracts');
        }
    }
}