import { reserveRam, reserveMoney, remoteServers, factionNames, augNames } from '/os/config.js';

/** @param {import("../../.").NS } ns */
export async function main(ns) {
    ns.tprint("update.js loaded");
    await updateScripts(ns);
    await updateServers(ns);
}

/** @param {import("../..").NS } ns */
export async function updateServers(ns) {
    let data = {};

    let botnet = ns.getPurchasedServers();

    let servers = remoteServers.concat(botnet);

    for (let i = 0; i < servers.length; i++) {
        if (remoteServers[i] == null)
            continue;
        let server = remoteServers[i];
        let serverInfo = {};
        serverInfo['exists'] = ns.serverExists(server);
        serverInfo['hasRootAccess'] = ns.hasRootAccess(server);
        serverInfo['maxMoney'] = ns.getServerMaxMoney(server);
        serverInfo['requiredHackingLevel'] = ns.getServerRequiredHackingLevel(server);
        serverInfo['minSecurityLevel'] = ns.getServerMinSecurityLevel(server);
        serverInfo['hasContracts'] = ns.ls(server, '.cct').length ? true : false;

        data[server] = serverInfo;
    }

    await ns.write('/os/tmp/servers.json', JSON.stringify(data), 'w');
}

/** @param {import("../..").NS } ns */
export async function updateScripts(ns) {
    let data = {};
    let scripts = ['/os/main.js'];
    for (let i = 0; i < scripts.length; i++) {
        data[scripts[i]] = ns.getScriptRam(scripts[i]);
    }

    await ns.write('/os/tmp/scripts.json', JSON.stringify(data), 'w');
}