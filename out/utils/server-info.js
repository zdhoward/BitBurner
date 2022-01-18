import { formatMoney, pad } from '/lib/lib.js';

export function autocomplete(data, args) {
    return [...data.servers];
}

/** @param {NS} ns 
 *  @param 0 server
 */
export async function main(ns) {
    var serverName = ns.args[0];

    var rowLength = 58;

    if (ns.serverExists(serverName)) {
        var server = ns.getServer(serverName);
        serverName.length;
        String(server.ip).length;
        var titleLength = rowLength - serverName.length - String(server.ip).length - 3;
        var trailing = "";
        if (titleLength % 2 == 1) {
            trailing = "=";
        }

        ns.tprint("INFO - " + "=".repeat(titleLength / 2) + " " + serverName + " " + server.ip + " " + "=".repeat(titleLength / 2) + trailing);
        ns.tprint("INFO - " + "||                     Cores: " + pad(server.cpuCores, 26) + "||");
        ns.tprint("INFO - " + "||                    Rooted: " + pad(server.hasAdminRights, 26) + "||");
        ns.tprint("INFO - " + "||                  Backdoor: " + pad(server.backdoorInstalled, 26) + "||");
        ns.tprint("INFO - " + "||                     Money: " + pad(formatMoney(server.moneyAvailable) + '/' + formatMoney(server.moneyMax), 26) + "||");
        ns.tprint("INFO - " + "||                  Security: " + pad(ns.getServerSecurityLevel(serverName) + '/' + ns.getServerMinSecurityLevel(serverName), 26) + "||");
        ns.tprint("INFO - " + "||                 Purchased: " + pad(server.purchasedByPlayer, 26) + "||");
        ns.tprint("INFO - " + "||                   Max RAM: " + pad(server.maxRam, 26) + "||");
        ns.tprint("INFO - " + "||                  RAM Used: " + pad(server.ramUsed, 26) + "||");
        ns.tprint("INFO - " + "||                     Ports: " + pad(server.openPortCount + '/' + server.numOpenPortsRequired, 26) + "||");
        ns.tprint("INFO - " + "||    Required Hacking Skill: " + pad(server.requiredHackingSkill, 26) + "||");
        ns.tprint("INFO - " + "||                    Growth: " + pad(server.serverGrowth, 26) + "||");
        ns.tprint("INFO - " + "||           Base Difficulty: " + pad(server.baseDifficulty, 26) + "||");
        ns.tprint("INFO - " + "||            Min Difficulty: " + pad(server.minDifficulty, 26) + "||");
        ns.tprint("INFO - " + "||           Hack Difficulty: " + pad(server.hackDifficulty, 26) + "||");
        ns.tprint("INFO - " + "=".repeat(rowLength));
    } else { ns.tprint("ERROR - " + serverName + " Server does not exist"); }
}