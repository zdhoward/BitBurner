import { reserveRam, reserveMoney, remoteServers, botServers, factionNames, augNames } from '/os/config.js';

/** @param {import("../../.").NS } ns */
export async function main(ns) {
    await updateScripts(ns);
    await updateServers(ns);
}

/** @param {import("../..").NS } ns */
export async function updateServers(ns) {
    let data = {};

    for (let i = 0; i < remoteServers.length; i++) {
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