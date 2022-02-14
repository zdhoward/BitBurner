import { reserveRam, reserveMoney, remoteServers, botServers, factionNames, augNames } from '/os/config.js';
import { helloWorld, getServerInfo, getScriptInfo } from '/os/lib.js';


export function autocomplete(data, args) {
    return [...data.servers];
}

/** @param {import("../..").NS } ns */
export async function main(ns) {
    ns.tprint("main.js loaded");
    await ns.run('/os/update.js');
    await ns.run('/os/hackManager.js');
    await ns.run('/os/contractManager.js');
    //await ns.run('/os/upgradeManager.js');
    //await ns.run('/os/stockManager.js');
    //await ns.run('/os/factionManager.js);
    //await ns.run('/os/hacknetManager.js');
    //await ns.run('/os/corpManager.js');
}