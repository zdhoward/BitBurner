import { reserveRam, reserveMoney, remoteServers, botServers, factionNames, augNames } from '/os/config.js';
import { helloWorld, getServerInfo, getScriptInfo, printBanner, log, justifyLeft, justifyCentre, justifyRight } from '/os/lib.js';

let verbose = true;

/** @param {import("../../.").NS } ns */
export async function main(ns) {
    printBanner(ns, "contractManager.js loaded");
    await runContracts(ns);
}

export async function runContracts(ns) {
    let data = await getServerInfo(ns);
    for (let server in data) {
        if (data[server].hasContracts) {
            log(ns, `${server} has contracts`, verbose);
        }
    }
}